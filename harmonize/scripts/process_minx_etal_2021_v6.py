import concurrent.futures
import csv
import openclimate as oc
import os
from pathlib import Path
import pandas as pd
import re
from typing import List
from typing import Dict
from typing import Union
from utils import make_dir

# initalize openclimate
client = oc.Client()


def iso3_to_iso2(iso3):
    try:
        iso2 = (
            oc.Client()
            .search(identifier=iso3, namespace="ISO-3166-1 alpha-3")["actor_id"]
            .to_list()[0]
        )
        return (iso3, iso2)
    except:
        return (iso3, None)


def simple_write_csv(
    output_dir: str = None, name: str = None, rows: List[Dict] | Dict = None
) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f"{output_dir}/{name}.csv", mode="w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def to_snake_case(data: Union[str, List[str]]) -> str:
    """
    Converts a string or list of strings to snake case.

    Rules:
        1. leading and trailing spaces are removed
        2. non-word characters replaced with underscore (_)
        3. consecutive underscores replaced with single underscore
        4. conerted to lowercase

    Parameters:
    data (Union[str, list])): The string to be converted.

    Returns:
    str: The converted string in snake case.

    Notes:
    regex docs: https://docs.python.org/3/library/re.html
    """
    if isinstance(data, str):
        string = data.strip()
        string = re.sub(r"\W+", "_", string)
        string = string.lower()
        string = re.sub(r"_+", "_", string)
        string = string.strip("_")
        return string
    elif isinstance(data, list):
        return [to_snake_case(string) for string in data]


def no_duplicates(df, col):
    """True if no duplicates"""
    return ~df.duplicated(subset=[col]).any()


def has_duplicates(df, col):
    """True if no duplicates"""
    return df.duplicated(subset=[col]).any()


def has_null_values(df, column, search_terms=[], ignore_terms=[]):
    """Check if a DataFrame column contains null values
    or any of the specified string values.

    Parameters:
        df: The DataFrame to check.
        column: The name of the column to check.
        search_terms: A list of strings to search for in the column.
        ignore_terms: A list of strings to ignore when searching for values in the column.

    Returns:
        True if any null or search term values are found in the column, False otherwise.
    """
    ignore_set = set(ignore_terms + [""])

    return any(
        pd.isnull(val)
        or (
            str(val).strip() != ""
            and str(val).strip() in search_terms
            and str(val).strip() not in ignore_set
        )
        for val in df[column]
    )


if __name__ == "__main__":
    # output directory
    outputDir = "../data/processed/minx_etal_2021_v6/"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = "../data/raw/minx_etal_2021_v6/essd_ghg_data_gwp100.xlsx"
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        "id": "Minx et al. (2021)",
        "name": "Minx et al. (2021)",
        "URL": "https://essd.copernicus.org/articles/13/5213/2021/",
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        "datasource_id": "minx_etal_2021:v6",
        "name": "A comprehensive and synthetic dataset for global, regional and national greenhouse gas emissions by sector 1970-2018 with an extension to 2019",
        "publisher": f"{publisherDict['id']}",
        "published": "2022-04-25",
        "URL": "https://doi.org/10.5281/zenodo.6483002",
        "citation": "Minx, J., et al. (2022). A comprehensive and synthetic dataset for global, regional and national greenhouse gas emissions by sector 1970-2018 with an extension to 2019 [Data set]. Zenodo. doi:10.5281/zenodo.6483002"
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # read data from file
    df = pd.read_excel(fl, header=4)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    # ANT (netherland antilles) and SCG (serbia and montenegro) (split in 2006)
    # are not in our database
    df = pd.read_excel(fl, sheet_name="data")
    df = df.loc[~df["ISO"].isin(["AIR", "SEA", "ANT", "SCG"])]

    # get actor ids
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [
            executor.submit(iso3_to_iso2, iso) for iso in list(df["ISO"].unique())
        ]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    df_actor = pd.DataFrame(data, columns=["ISO", "actor_id"])

    df_out = pd.merge(df, df_actor, on="ISO")

    astype_dict = {
        "emissions_id": str,
        "actor_id": str,
        "year": int,
        "total_emissions": int,
        "datasource_id": str,
    }

    outColumns = astype_dict.keys()

    df_emissionsAgg = (
        df_out.groupby(["actor_id", "year"])
        .sum(numeric_only=True)
        .reset_index()
        .rename(columns={"GHG": "total_emissions"})
        .assign(datasource_id=datasourceDict["datasource_id"])
        .assign(
            emissions_id=lambda x: x.apply(
                lambda row: f"{to_snake_case(datasourceDict['datasource_id'])}:{row['actor_id']}:{row['year']}",
                axis=1,
            )
        )
        .loc[:, outColumns]
        .astype(astype_dict)
        .sort_values(by=["actor_id", "year"])
    )

    # ------------------------------------------------------------------
    # Sanity checks --> check uniquesness of ids and null values
    # ------------------------------------------------------------------
    # test uniqueness of id columns
    for col in ["emissions_id"]:
        (
            print(f"WARNING: {col} has duplicates")
            if has_duplicates(df_emissionsAgg, col)
            else None
        )

    # test uniqueness of primary keys
    for col in ["emissions_id", "actor_id", "year", "total_emissions", "datasource_id"]:
        (
            print(f"WARNING: {col} has null values")
            if has_null_values(df_emissionsAgg, col)
            else None
        )

    # create CSV
    df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "GHGs_included_fossil_CO2_CH4_N2O_F_gases": "GHGs included: Fossil CO2, CH4, N2O, and F-gases",
        "GWP_100_AR4": "Uses GWP100 from IPCC AR6",
        "Sectors_buildings_energy_industry_transport_AFOLU": "Sectors: buildings, energy systems, industry, transport, and AFOLU",
        "built_using_EDGARv6": "Built using EDGARv6",
        "excludes_LULUCF": "Excludes LULUCF",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)
