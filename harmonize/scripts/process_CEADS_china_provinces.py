import csv
import openclimate as oc
import os
from pathlib import Path
import pandas as pd
import re
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

def get_id(prov):
    try:
        if (prov == 'Inner mongolia') | (prov == 'InnerMongolia'):
            # inner mongolia also called Nei Mongol
            return {'province_name': prov, 'actor_id': 'CN-NM'}
        df = client.search(query=prov)
        filt = df['type'] == 'adm1'
        return {'province_name': prov, 'actor_id':df.loc[filt].get('actor_id').to_list()[0]}
    except:
        return {'province_name': prov, 'actor_id':None}

def process_file(fl):
    sheet_tmp = pd.ExcelFile(fl).sheet_names
    pattern = r'([A-Za-z]+)(\d{4})$'

    province_and_year = []
    for sheet in sheet_tmp:
        match = re.search(pattern, sheet)
        if match:
            province = match.group(1)
            year = int(match.group(2))
            province_and_year.append({'sheet': sheet, 'province': province, 'year': year})

    data = []
    for dic in province_and_year:

        sheet = dic.get('sheet')
        province = dic.get('province')
        year = dic.get('year')

        df = pd.read_excel(fl, sheet_name=sheet)

        if any(df.columns.isin(['Emission_Inventory'])):
            try:
                scope_1_total = df.loc[df['Emission_Inventory'] == 'TotalEmissions', 'Scope_1_Total'].item() * 10 ** 6
            except:
                scope_1_total = df.loc[df['Emission_Inventory'] == 'Total Emissions', 'Scope_1_Total'].item() * 10 ** 6

        if any(df.columns.isin(['Unnamed: 0'])):
            scope_1_total = df.loc[df['Unnamed: 0'] == 'Total Consumption', 'Scope 1 Total'].item() * 10 ** 6

        data.append({'province_name': province, 'year': year, 'total_emissions': scope_1_total})

    return pd.DataFrame(data)


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/CEADS_china_provinces"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # CEADS china
    base_path = '../data/raw/CEADS_china_provinces/'
    base_path = os.path.abspath(base_path)
    path = Path(base_path)
    files = list(path.glob("Emission_Inventories_for_30_Provinces*.xlsx"))

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
        'datasource_id': 'CEADS:guan_etal_2021:china_provinces',
        'name': 'Emission Inventories for 30 Provinces',
        'publisher': f"{PUBLISHER_DICT['id']}",
        'published': '2021-10-21',
        'URL': 'https://ceads.net/data/province/by_sectoral_accounting/Provincial/',
        'citation': "Guan, D., et al. (2021). Assessment to China's Recent Emission Pattern Shifts, Earth's Future, 9(11), e2021EF002241. doi:10.1029/2021EF002241"
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

    dfs = [process_file(fl) for fl in files]
    df_tmp = pd.concat(dfs)

    # get ISO names (actor_id)
    provinces = set(df_tmp['province_name'])
    client = oc.Client()
    data = [get_id(prov) for prov in provinces]
    df_iso = pd.DataFrame(data)

    # merge in actor_id
    df_merged = df_tmp.merge(df_iso, on='province_name')

    # create emissionsAgg
    df_emissionsAgg = (
        df_merged
        .assign(
            datasource_id = DATASOURCE_DICT['datasource_id'],
            emissions_id = lambda x: x.apply(lambda row: f"CEADS:{row['actor_id']}:{row['year']}", axis=1)
        )
        .loc[:, ASTYPE_DICT.keys()]
        .astype(ASTYPE_DICT)
        .sort_values(by=['actor_id', 'year'])
        .reset_index(drop=True)
    )

    # sanity check
    sanity_check = all([
        no_duplicates(df_emissionsAgg, 'emissions_id'),
        no_null_values(df_emissionsAgg, 'actor_id'),
        no_null_values(df_emissionsAgg, 'year'),
        no_null_values(df_emissionsAgg, 'total_emissions'),
        all_actors_exist(df_emissionsAgg, 'CN', 'adm1')
        ])

    # save to csv
    if sanity_check:
        df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)
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
        "Combined_scope_1_and_scope_2":"Combined accounting approach of scope 1 (IPCC territorial emissions from 17 types of fossil fuel combustion and cement production) and scope 2 (emissions from purchased electricity and heat consumption)",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": DATASOURCE_DICT["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)

