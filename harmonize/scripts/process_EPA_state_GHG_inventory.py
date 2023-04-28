import csv
import openclimate as oc
import os
import pandas as pd
from pathlib import Path
import re
from typing import List
from typing import Dict
from utils import df_wide_to_long
from utils import make_dir


def simple_write_csv(
    output_dir: str = None,
    name: str = None,
    data: List[Dict] | Dict = None,
    mode: str = "w",
    extension: str = "csv",
) -> None:

    if isinstance(data, dict):
        data = [data]

    with open(f"{output_dir}/{name}.{extension}", mode=mode) as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)


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


def no_null_values(df, column, search_terms=[], ignore_terms=[]):
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
    return not has_null_values(df, column, search_terms=[], ignore_terms=[])


def all_actors_exist(df, part, part_type):
    client = oc.Client()
    parts = client.parts(part, part_type=part_type)
    part_set = set(parts["actor_id"])
    actor_set = set(df["actor_id"])
    diff_in_sets = actor_set.difference(part_set)
    return not diff_in_sets


def check_for_zero_emissions(df):
    filt = df['total_emissions'] == 0
    if any(filt):
        print(df.loc[filt, 'emissions_id'].to_list())


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/EPA_GHG_inventory"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # data directory
    fl = "../data/raw/EPA_GHG_inventory/AllStateGHGData_042623.xlsx"
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        "id": "EPA",
        "name": "United States Environmental Protection Agency",
        "URL": "https://www.epa.gov/",
    }

    simple_write_csv(
        output_dir=outputDir, name="Publisher", data=publisherDict, mode="w"
    )

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        "datasource_id": "EPA:state_GHG_inventory:2023-04-26",
        "name": "Inventory of U.S. Greenhouse Gas Emissions and Sinks by State",
        "publisher": f"{publisherDict['id']}",
        "published": "2023-04-26",
        "URL": "https://www.epa.gov/ghgemissions/methodology-report-inventory-us-greenhouse-gas-emissions-and-sinks-state-1990-2020",
        "citation": "EPA. (2022). Methodology Report: Inventory of U.S. Greenhouse Gas Emissions and Sinks by State: 1990–2020. U.S. Environmental Protection Agency, EPA 430-R-22-005. https://www.epa.gov/ghgemissions/state-ghg-emissions-and-removals",
    }

    simple_write_csv(
        output_dir=outputDir, name="DataSource", data=datasourceDict, mode="w"
    )

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    df = pd.read_excel(fl, sheet_name="Data by UNFCCC-IPCC Sectors")

    drop_states = [
        "Territories",  # aggregated emissions from US territories
        "FO",  # emissions occurring offshore within US water
        "National",  # emissions and sinks not disaggregated
        "Withheld",  # proprietary emissions not disaggregated
        "FM",  # Micronesia (not US territory)
        "PW",  # Palau (not US territory)
        "MH",  # Marshall Islands (not US territory)
    ]

    filt = ~df["STATE"].isin(drop_states)

    # drop Energy-Excluded and Land-Use Change and Forestry
    sectors = [
        "Agriculture",
        "Energy",
        "Industrial Processes",
        "Waste",
    ]

    drop_cols = ["ROWNUMBER"]

    astype_dict = {
        "emissions_id": str,
        "actor_id": str,
        "year": int,
        "total_emissions": int,
        "datasource_id": str,
    }

    emissionsAggColumns = astype_dict.keys()

    df_emissionsAgg = (
        df.loc[filt]
        .groupby(["STATE", "SECTOR"])
        .sum(numeric_only=True)
        .reset_index()
        .loc[lambda x: x["SECTOR"].isin(sectors)]
        .drop(drop_cols, axis=1)
        .groupby("STATE")
        .sum(numeric_only=True)
        .reset_index()
        .rename(columns=lambda x: re.sub("^Y(\d{4})", r"\1", x))
        .pipe(df_wide_to_long, value_name="emissions", var_name="year")
        .sort_values(by=["STATE", "year"])
        .assign(total_emissions=lambda x: x["emissions"] * 1_000_000)
        .assign(STATE=lambda x: x.apply(lambda row: f"US-{row['STATE']}", axis=1))
        .rename(columns={"STATE": "actor_id"})
        .assign(datasource_id=datasourceDict["datasource_id"])
        .assign(
            emissions_id=lambda x: x.apply(
                lambda row: f"EPA_state_GHG_inventory:{row['actor_id']}:{row['year']}",
                axis=1,
            )
        )
        .loc[:, emissionsAggColumns]
        .astype(astype_dict)
        .sort_values(by=["actor_id", "year"])
    )

    # sanity check
    sanity_check = all(
        [
            no_duplicates(df_emissionsAgg, "emissions_id"),
            no_null_values(df_emissionsAgg, "actor_id"),
            no_null_values(df_emissionsAgg, "year"),
            no_null_values(df_emissionsAgg, "total_emissions"),
            all_actors_exist(df_emissionsAgg, "US", "adm1"),
        ]
    )

    # check if any records contain 0 total_emissions
    check_for_zero_emissions(df_emissionsAgg)

    # save to csv
    if sanity_check:
        df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)
    else:
        print("Check emissionsAgg for duplicates and null values")

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "GHGs_included_CO2_CH4_N2O_F_gases": "GHGs included: CO2, CH4, N2O, and F-gases",
        "sectors_ag_energy_IPPU_waste": "Sectors: agriculture, energy, industrial processes, and waste",
        "excludes_LULUCF": "Excludes LULUCF",
        "GWP_100_AR4": "Uses GWP100 from IPCC AR4",
        "country_reported_data": "Country-reported data",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)

    # ------------------------------------------
    # DataSourceQuality table
    # ------------------------------------------
    DataSourceQualityDict = {
        "datasource_id": datasourceDict["datasource_id"],
        "score_type": "GHG target",
        "score": 0.8,
        "notes": "country reported. not necessarily state-reported data",
    }

    simple_write_csv(outputDir, "DataSourceQuality", DataSourceQualityDict)
