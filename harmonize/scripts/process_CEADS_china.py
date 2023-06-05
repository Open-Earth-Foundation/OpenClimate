import csv
import os
from pathlib import Path
import pandas as pd
from typing import List
from typing import Dict
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
    import openclimate as oc
    client = oc.Client()
    parts = client.parts(part, part_type=part_type)
    part_set = set(parts['actor_id'])
    actor_set = set(df['actor_id'])
    diff_in_sets = actor_set.difference(part_set)
    return not diff_in_sets

def check_for_zero_emissions(df):
    filt = df['total_emissions'] == 0
    if any(filt):
        print('WARNING!! Check the following emission_ids, total_emission is zero:')
        print(df.loc[filt, 'emissions_id'].to_list())
    else:
        print('Look good!')


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/CEADS_china"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # CEADS china
    fl = '../data/raw/CEADS_china/China_CO2_Inventory_1997-2019_(IPCC_Sectoral_Emissions).xlsx'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    PUBLISHER_DICT = {
        'id': 'CEADs',
        'name': 'Carbon Emissions Accounts and Datasets for emerging economies',
        'URL': 'https://www.ceads.net/'
    }

    simple_write_csv(
        output_dir=outputDir, name="Publisher", data=PUBLISHER_DICT, mode="w"
    )

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    DATASOURCE_DICT = {
        'datasource_id': 'CEADS:guan_etal_2021:china',
        'name': 'China national CO2 emission inventory (by IPCC Sectoral Emissions)',
        'publisher': f"{PUBLISHER_DICT['id']}",
        'published': '2021-10-21',
        'URL': 'https://ceads.net/data/nation/',
        'citation': "Guan. (2021). Assessment to China's Recent Emission Pattern Shifts, Earth's Future, 9(11), e2021EF002241. doi:10.1029/2021EF002241"
    }
    simple_write_csv(
        output_dir=outputDir, name="DataSource", data=DATASOURCE_DICT, mode="w"
    )

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    ASTYPE_DICT = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }

    df_emissionsAgg = (
        pd.read_excel(fl, sheet_name='sum', index_col=0)
        .reset_index()
        .rename(columns={'index':'year', 'Scope 1 Total':'total_emissions'})
        .loc[:, ['year', 'total_emissions']]
        .assign(actor_id = 'CN')
        .assign(
            total_emissions = lambda x: x['total_emissions'] * 1_000_000,
            datasource_id = DATASOURCE_DICT['datasource_id'],
            emissions_id = lambda x: x.apply(lambda row: f"CEADS:{row['actor_id']}:{row['year']}", axis=1)
        )
        .loc[:, ASTYPE_DICT.keys()]
        .astype(ASTYPE_DICT)
        .sort_values(by=['actor_id', 'year'])
    )

    # sanity check
    sanity_check = all([
        no_duplicates(df_emissionsAgg, 'emissions_id'),
        no_null_values(df_emissionsAgg, 'actor_id'),
        no_null_values(df_emissionsAgg, 'year'),
        no_null_values(df_emissionsAgg, 'total_emissions'),
        ])

    # save to csv
    if sanity_check:
        df_emissionsAgg.drop_duplicates().to_csv(
            f"{outputDir}/EmissionsAgg.csv", index=False
        )
    else:
        print('check emissionsAgg for duplicates and null values')

    check_for_zero_emissions(df_emissionsAgg)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "CO2_only": "CO2 only",
        "following_ipcc_2006": "Following IPCC (2006) Guidelines for National Greenhouse Gas Inventories",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": DATASOURCE_DICT["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)

