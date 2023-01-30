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
from utils import country_to_iso2


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
    outputDir = '../data/processed/climate_watch_historical_GHG/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/climate_watch_historical_GHG/ghg-emissions.csv'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'WRI',
        'name': 'World Resources Institute',
        'URL': 'https://www.wri.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'WRI:climate_watch_historical_ghg:2022',
        'name': 'Climate Watch Historical GHG Emissions',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-01-01',
        'URL': 'https://www.climatewatchdata.org/ghg-emissions'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # =================================================================
    # EmissionsAgg
    # =================================================================
    df = pd.read_csv(fl)

    df = df.rename(columns={'Country/Region': 'country'})

    replace_dict = {
        'Trinidad & Tobago': 'Trinidad and Tobago',
        'China Hong Kong SAR': 'China',
        'Iran': 'Iran, Islamic Republic of',
        'Syria': "Syrian Arab Republic",
        'Brunei': "Brunei Darussalam",
        'Laos': "Lao People's Democratic Republic",
        'Russia': 'Russian Federation',
        'Micronesia': "Federated States of Micronesia",
        'Macedonia': "North Macedonia",
        'Democratic Republic of the Congo': "Congo, the Democratic Republic of the",
        'Cape Verde': "Cabo Verde",
        'Republic of Congo': "Congo"
    }

    df['country'] = df.country.replace(replace_dict)

    searchfor = ["Source:", "Notes:", "Growth", "Data ",
                 "European Union", "OECD", "0.05%", "Other "]
    filt = ~(df['country'].str.contains('|'.join(searchfor)))
    df = df.loc[filt]

    data = [(name, country_lookup(name)) for name in set(list(df.country))]
    df_iso = pd.DataFrame(data, columns=['country', 'actor_id'])

    #list(df_iso.loc[df_iso['actor_id'].isnull(), 'country'])

    # merge in the actor_ids (iso2 codes)
    df_out = pd.merge(df, df_iso, on=['country'])

    #pd.set_option('display.max_rows', None)

    df_out = df_wide_to_long(df_out, value_name='emissions', var_name='year')

    # emissions are "false" for Namibia in 1990
    filt = df_out['emissions'] != 'false'
    df_out = df_out.loc[filt]

    df_out['emissions'] = df_out['emissions'].astype(float)

    df_out['total_emissions'] = df_out['emissions'].apply(lambda x: x * 10**6)

    # create datasource_id
    df_out['datasource_id'] = datasourceDict['datasource_id']

    # create emissions ID
    df_out['emissions_id'] = df_out.apply(
        lambda row: f"climate_watch_GHG:{row['actor_id']}:{row['year']}", axis=1)

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
    tagDictList = [
        {'tag_id': 'collated',
         'tag_name': 'Collated emissions estimates'}
    ]

    simple_write_csv(outputDir, 'Tag', tagDictList)

    dataSourceTagDictList = [
        {'datasource_id': datasourceDict['datasource_id'],
         'tag_id': tag['tag_id']} for tag in tagDictList
    ]

    simple_write_csv(outputDir, 'DataSourceTag', dataSourceTagDictList)
