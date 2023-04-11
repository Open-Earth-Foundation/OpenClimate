import csv
from dateutil.parser import parse
import os
from pathlib import Path
import pandas as pd
import pycountry
from typing import List
from typing import Dict
from utils import make_dir
from utils import write_to_csv


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
    outputDir = '../data/processed/carbon_monitor/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/carbon_monitor/carbonmonitor-global_datas_2023-01-09.csv'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'Carbon Monitor',
        'name': 'Carbon Monitor',
        'URL': 'https://carbonmonitor.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'carbon_monitor:2022_12_14',
        'name': 'Carbon Monitor country CO2 emissions by sector',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-12-14',
        'URL': 'https://carbonmonitor.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # -----------------------------------------------------------------
    # preprocess
    # -----------------------------------------------------------------
    df = pd.read_csv(fl, parse_dates=['date'], date_parser=parse)
    df['year'] = df['date'].dt.year
    df['name'] = df['sector'].str.lower()
    df['namespace'] = 'carbon_monitor:sector'

    # rename to emissions_value (since sector emissions) convert from Mtonnes to tonnes)
    df['emissions_value'] = df['value'].apply(lambda x: x * 10**6)

    # remove country groups
    filt = ~(df['country'].isin(['EU27 & UK', 'ROW', 'WORLD']))
    df = df.loc[filt]

    # so country_lookup() can identify russia and uk
    replace_dict = {'Russia': 'Russian Federation', 'UK': 'United Kingdom'}
    df['country'] = df.country.replace(replace_dict)

    # merge county codes (actor_id)
    data = [(name, country_lookup(name)) for name in set(df.country)]
    df_iso = pd.DataFrame(data, columns=['country', 'actor_id'])
    df = pd.merge(df, df_iso, on=['country'])

    # define ids
    df['datasource_id'] = datasourceDict['datasource_id']
    df['sector_id'] = df.apply(
        lambda row: f"carbon_monitor:sector:{row['sector']}", axis=1)
    df['emissions_id'] = df.apply(
        lambda row: f"carbon_monitor:{row['actor_id']}:{row['year']}", axis=1)

    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    sectorColumns = [
        "sector_id",
        "name",
        "namespace",
        "datasource_id"
    ]

    sectorEmissionsColumns = [
        "emissions_id",
        "sector_id",
        "emissions_value"
    ]

    columns = set(emissionsAggColumns + sectorColumns + sectorEmissionsColumns)

    # =================================================================
    # EmissionsBySector
    # =================================================================
    df_sector_emissions_tmp = (
        df[['emissions_id', 'sector_id', 'emissions_value', 'actor_id', 'year']]
        .groupby(by=['emissions_id', 'sector_id', 'actor_id', 'year'])
        .sum()
        .reset_index()
        .sort_values(by=['actor_id', 'year', 'sector_id'])
    )

    df_emissionsBySector = (
        df_sector_emissions_tmp[sectorEmissionsColumns]
        .astype({
            'emissions_id': str,
            'sector_id': str,
            'emissions_value': int
        })
    )
    # convert to csv
    df_emissionsBySector.to_csv(
        f'{outputDir}/EmissionsBySector.csv', index=False)

    # =================================================================
    # sectors
    # =================================================================
    df_sector = df[sectorColumns]

    # ensure columns have correct types
    df_sector = df_sector.astype({
        'sector_id': str,
        'name': str,
        'namespace': str,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_sector = df_sector.sort_values(by=['sector_id']).drop_duplicates()

    # convert to csv
    df_sector.to_csv(f'{outputDir}/Sector.csv', index=False)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    df_emissionsAgg = (
        df_sector_emissions_tmp[['emissions_id',
                                 'actor_id', 'year', 'emissions_value']]
        .groupby(by=['emissions_id', 'actor_id', 'year'])
        .sum()
        .reset_index()
        .sort_values(by=['actor_id', 'year'])
        .rename(columns={'emissions_value': 'total_emissions'})
    )

    df_emissionsAgg['datasource_id'] = datasourceDict['datasource_id']

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
        "ghgs_included_fossil_CO2": "GHGs included: Fossil CO2",
        "activity_data_and_other_sources": "Emissions derived from activity data and other datasets",
        "co2_emissions_fossil_fuel_combustion_and_cement": "CO2 emissions from fossil fuel combustion and cement production",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)