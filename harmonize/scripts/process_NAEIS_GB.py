import csv
import os
from pathlib import Path
import pandas as pd
from typing import List
from typing import Dict
from utils import make_dir
from utils import df_wide_to_long


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


def process_sheet(actor_name, actor_id, GWP, SECTORS, DATASOURCE_DICT, ASTYPE_DICT):
    return (
        pd.read_excel(fl, sheet_name=f'{actor_name} By Source_{GWP}', header=16)
        .loc[lambda x: x['NCFormat'].isin(SECTORS)]
        .drop(columns=['Unnamed: 0', 'IPCC_name', 'BaseYear'])
        .pipe(df_wide_to_long, value_name='emissions', var_name='year')
        .groupby('year').sum(numeric_only=True)
        .reset_index()
        .assign(actor_id = actor_id)
        .assign(
            total_emissions = lambda x: x['emissions'] * 1_000,
            datasource_id = DATASOURCE_DICT['datasource_id'],
            emissions_id = lambda x: x.apply(lambda row: f"NAEI_GHGI_{GWP}:{row['actor_id']}:{row['year']}", axis=1)
        )
        .loc[:, ASTYPE_DICT.keys()]
        .astype(ASTYPE_DICT)
        .sort_values(by=['actor_id', 'year'])
    )


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/NAEI_GB_subnational"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # NAEI dataset
    fl = '../data/raw/NAEI_GB_subnational/2209201114_DA_GHGI_1990-2020_Final_v4.1_AR4_AR5.xlsm'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    PUBLISHER_DICT = {
        'id': 'NAEI',
        'name': 'National Atmospheric Emissions Inventory',
        'URL': 'https://naei.beis.gov.uk/'
    }

    simple_write_csv(
        output_dir=outputDir, name="Publisher", data=PUBLISHER_DICT, mode="w"
    )

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    DATASOURCE_DICT = {
        'datasource_id': 'NAEI:DA_GHGI_1990_2020:v4.1',
        'name': 'Devolved Administration GHG Inventory 1990-2020',
        'publisher': f"{PUBLISHER_DICT['id']}",
        'published': '2022-09-15',
        'URL': 'https://naei.beis.gov.uk/reports/reports?section_id=4',
        'citation': "NAEI. (2022). Greenhouse Gas Inventories for England, Scotland, Wales & Northern Ireland: 1990-2020. National Atmospheric Emissions Inventory, ED11787/2020/CD10375/BR. https://naei.beis.gov.uk/reports/reports?section_id=4"
    }

    simple_write_csv(
        output_dir=outputDir, name="DataSource", data=DATASOURCE_DICT, mode="w"
    )

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    SECTORS = [
    'Agriculture Total',
    'Business Total',
    'Energy Supply Total',
    'Industrial processes Total',
    #'Land use, land use change and forestry Total',
    'Public Total',
    'Residential Total',
    'Transport Total',
    'Waste Management Total',
    ]

    ASTYPE_DICT = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }

    GWP100 = 'AR5'

    ACTOR_DICT = {
        'England': 'GB-ENG',
        'Northern Ireland': 'GB-NIR',
        'Scotland': 'GB-SCT',
        'Wales': 'GB-WLS'
    }

    dfs = [process_sheet(actor_name, actor_id, GWP100, SECTORS, DATASOURCE_DICT, ASTYPE_DICT) for actor_name, actor_id in ACTOR_DICT.items()]

    df_emissionsAgg = pd.concat(dfs).sort_values(by=['actor_id', 'year'])

    # sanity check
    sanity_check = all([
        no_duplicates(df_emissionsAgg, 'emissions_id'),
        no_null_values(df_emissionsAgg, 'actor_id'),
        no_null_values(df_emissionsAgg, 'year'),
        no_null_values(df_emissionsAgg, 'total_emissions'),
        all_actors_exist(df_emissionsAgg, 'GB', 'adm1')
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
        "GHGs_included_CO2_CH4_N2O_F_gases": "GHGs included: CO2, CH4, N2O, and F-gases",
        "excludes_international_shipping_aviation": "Excludes emissions from international shipping and aviation",
        "excludes_LULUCF": "Excludes LULUCF",
        "GWP_100_AR5": "Uses GWP100 from IPCC AR5",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": DATASOURCE_DICT["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)

