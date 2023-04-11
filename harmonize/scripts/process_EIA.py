import csv
import concurrent.futures
import os
from pathlib import Path
import pandas as pd
import pycountry
from typing import List
from typing import Dict
from utils import df_wide_to_long
from utils import make_dir
from utils import write_to_csv
from utils import state_to_iso2


def country_lookup(name):
    try:
        return pycountry.countries.lookup(name).alpha_2
    except LookupError:
        return float('NaN')


def simple_write_csv(output_dir: str = None,
                     name: str = None,
                     rows: List[Dict] | Dict = None) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f'{output_dir}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    # output directory
    outputDir = '../data/processed/EIA/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/EIA/table1.xlsx'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'EIA',
        'name': 'United State Energy Information Administration',
        'URL': 'https://www.eia.gov/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'EIA:state_energy_co2_emissions:2022',
        'name': 'State energy-related carbon dioxide emissions by year',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-10-11',
        'URL': 'https://www.eia.gov/environment/emissions/state/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # =================================================================
    # EmissionsAgg
    # =================================================================
    df = pd.read_excel(fl, header=4)
    df = df.drop(columns=['Absolute', 'Percent', 'Percent.1', 'Absolute.1'])
    df = df.loc[df['State'].notnull()]
    searchfor = ["Total of states", "Data sources"]
    filt = ~(df['State'].str.contains('|'.join(searchfor)))
    df = df.loc[filt]

    df_tmp = df_wide_to_long(df, value_name='emissions', var_name='year')

    # state name to iso2
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(state_to_iso2, name, return_input=True, is_part_of='US')
                   for name in list(set(df_tmp['State']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # put iso code in dataframe
    df_iso = pd.DataFrame(data, columns=['State', 'actor_id'])

    # merge iso codes
    df_out = pd.merge(df_tmp, df_iso, on=['State'])

    df_out['total_emissions'] = df_out['emissions'].apply(lambda x: x * 10**6)

    # create datasource_id
    df_out['datasource_id'] = datasourceDict['datasource_id']

    # create emissions ID
    df_out['emissions_id'] = df_out.apply(
        lambda row: f"EIA:{row['actor_id']}:{row['year']}", axis=1)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df_out[emissionsAggColumns]

    # ensure columns have correct types
    df_emissionsAgg = df_emissionsAgg.astype({'emissions_id': str,
                                              'actor_id': str,
                                              'year': int,
                                              'total_emissions': int,
                                              'datasource_id': str})

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_emissionsAgg.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================

    # dictionary of tag_id : tag_name
    tagDict = {
        'energy_related_co2': 'Energy-related CO2',
        'primary_source': 'Primary source: emissions derived from activity data',
        "based_on_SEDS": 'Based on data in the State Energy Data System (SEDS)',
        "fuel_types_coal_nat_gas_petro_producs": "Fuel types: coal, natural gas, and petroleum products",
        "uses_epa_co2_emissions_factors":"Uses U.S. Environmental Protection Agency's CO2 emissions factors",
        "sectors_included_in_eia":"Includes emissions from direct fuel use across all sectors, including residential, commercial, industrial, and transportation, as well as primary fuels consumed for electricity generation.",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)