import csv
from fold_to_ascii import fold
import os
import pandas as pd
from pathlib import Path
from openclimate import Client  # pip install from openclimate-pyclient repo
from typing import List
from typing import Dict
from utils import make_dir


def simple_write_csv(
    output_dir: str = None, name: str = None, rows: List[Dict] | Dict = None
) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f"{output_dir}/{name}.csv", mode="w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def df_wide_to_long(df=None, value_name=None, var_name=None):

    # set default values (new column names)
    # new column name with {value_vars}
    var_name = "year" if var_name is None else var_name
    # new column name with values
    value_name = "values" if value_name is None else value_name

    # ensure correct type
    assert isinstance(df, pd.core.frame.DataFrame), f"df must be a DataFrame"
    assert isinstance(var_name, str), f"var_name must a be string"
    assert isinstance(value_name, str), f"value_name must be a string"

    # ensure column names are strings
    df.columns = df.columns.astype(str)

    # columns to use as identifiers (columns that are not number)
    id_vars = [val for val in list(df.columns) if not val.isdigit()]

    # columns to unpivot (columns that are numbers)
    value_vars = [val for val in list(df.columns) if val.isdigit()]

    # Unpivot (melt) a DataFrame from wide to long format
    df_long = df.melt(
        id_vars=id_vars, value_vars=value_vars, var_name=var_name, value_name=value_name
    )

    # convert var_name column to int
    df_long[var_name] = df_long[var_name].astype(int)

    return df_long


def df_columns_as_str(df=None):
    df.columns = df.columns.astype(str)
    return df


def df_drop_nan_columns(df=None):
    return df.loc[:, df.columns.notna()]


def df_drop_unnamed_columns(df=None):
    return df.loc[:, ~df.columns.str.contains("^Unnamed")]


if __name__ == "__main__":
    # output directory
    outputDir = "../data/processed/GHGPI"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # input data files
    inputFile = (
        "../data/raw/GHGPI/GHGPI-Economy-wide-Estimates-2005-to-2018.xlsx"
    )
    inputFile = os.path.abspath(inputFile)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        "id": "GHGPI",
        "name": "Greenhouse Gas Project India",
        "URL": "https://www.ghgplatform-india.org/",
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        "datasource_id": "GHGPI:economy_wide:2019-01-01",
        "name": "Economy-wide emissions 2005-2018",
        "publisher": publisherDict["id"],
        "published": "2019-01-01",
        "URL": "https://www.ghgplatform-india.org/economy-wide/",
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    df = pd.read_excel(inputFile, sheet_name="Economywide estimation")
    filt = df["Gas"] == "CO2e (t) GWP-AR6"
    df = df.loc[filt]
    filt = df["Level 1"].isin(
        ["Energy", "Industrial Processes and Product Use", "Waste"]
    )
    df_out = df.loc[filt]
    df_out = df_wide_to_long(df_out, var_name="year", value_name="emissions")
    df_out = df_drop_unnamed_columns(df_out)
    df_out = (
        df_out[["Level 1", "Gas", "State", "year", "emissions"]]
        .groupby(["Level 1", "Gas", "State", "year"])
        .sum()
        .reset_index()
    )

    # Get list of Indian states
    client = Client()
    df_states = client.parts(actor_id="IN", part_type="adm1")
    df_states["name_noaccent"] = [fold(val) for val in list(df_states["name"])]

    # Create a dictionary to map the old state names to new combined name
    state_mapping = {
        "Dadra and Nagar Haveli": "Dadra and Nagar Haveli and Daman and Diu",
        "Daman and Diu": "Dadra and Nagar Haveli and Daman and Diu",
    }

    df_out["State"] = df_out["State"].replace(state_mapping)

    # replace GHGPI names that differ from ISO names and get actor_ids
    replace_dict = {
        "State": {
            "odisha": "Odisha",
            "Andaman and Nicobar Island": "Andaman and Nicobar Islands",
        }
    }

    df_merge = pd.merge(
        df_out.replace(replace_dict),
        df_states[["name_noaccent", "actor_id"]],
        left_on="State",
        right_on="name_noaccent",
        how="left",
    )

    astype_dict = {
        "emissions_id": str,
        "actor_id": str,
        "year": int,
        "total_emissions": int,
        "datasource_id": str,
    }

    df_emissionsAgg = (
        df_merge.groupby(["actor_id", "year"])
        .sum(numeric_only=True)
        .reset_index()
        .assign(datasource_id=datasourceDict["datasource_id"])
        .assign(
            emissions_id=lambda x: x.apply(
                lambda row: f"{publisherDict['id']}:{row['actor_id']}:{row['year']}",
                axis=1,
            )
        )
        .rename(columns={"emissions": "total_emissions"})
        .astype(astype_dict)
        .loc[:, tuple(astype_dict.keys())]
    )

    # convert to csv
    df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "exclude_AFOLU": "Excludes Agriculture, Forestry and Other Land Use",
        "include_energy": "Inclues Energy",
        "include_IPPU": "Includes Industrial Processes and Product Use",
        "include_waste": "Includes Waste",
        "GWP_AR6": "global warming potential: AR6",
        "GHGs_included_CO2_CH4_N2O": "GHGs included: CO2, CH4, and N2O",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)
