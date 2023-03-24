import csv
import concurrent.futures
import os
from pathlib import Path
import pandas as pd
import pycountry
from typing import List
from typing import Dict
from utils import make_dir
from utils import write_to_csv
from utils import country_to_iso2
from utils import df_wide_to_long


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
    outputDir = '../data/processed/BP_statistical_review_june2022/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/BP_review/bp-stats-review-2022-all-data.xlsx'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'BP',
        'name': 'British Petroleum',
        'URL': 'https://www.bp.com/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'BP:statistical_review_june2022',
        'name': 'Statistical Review of World Energy all data, 1965-2021',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-06-01',
        'URL': 'https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy/co2-emissions.html'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # =================================================================
    # EmissionsAgg
    # =================================================================
    xl = pd.ExcelFile(fl)
    sheets = xl.sheet_names

    df = pd.read_excel(fl, sheet_name='CO2e Emissions', header=2).drop(
        columns=['2021.1', '2011-21', '2021.2'])
    df = df.rename(
        columns={'Million tonnes of carbon dioxide equivalent': 'country'})

    filt = df['country'].notnull()
    df = df.loc[filt]

    filt = ~(df['country'].str.contains('total', case=False))
    df = df.loc[filt]

    filt = ~df['country'].isin(
        ['Central America', 'Eastern Africa', 'Middle Africa', 'Western Africa'])
    df = df.loc[filt]

    df = df_wide_to_long(df, value_name='emissions', var_name='year')
    df['total_emissions'] = df['emissions'].apply(lambda x: x * 10**6)

    replace_dict = {
        'Trinidad & Tobago': 'Trinidad and Tobago',
        'China Hong Kong SAR': 'China',
        'Iran': 'Iran, Islamic Republic of'
    }

    df['country'] = df.country.replace(replace_dict)

    searchfor = ["Source:", "Notes:", "Growth", "Data ",
                 "European Union", "OECD", "0.05%", "Other "]
    filt = ~(df['country'].str.contains('|'.join(searchfor)))
    df = df.loc[filt]

    data = [(name, country_lookup(name)) for name in set(list(df.country))]
    df_iso = pd.DataFrame(data, columns=['country', 'actor_id'])

    list(df_iso.loc[df_iso['actor_id'].isnull(), 'country'])

    # merge in the actor_ids (iso2 codes)
    df_out = pd.merge(df, df_iso, on=['country'])

    # sum across actors, needed because we are including Hong Kong as part of China
    df_out = df_out.groupby(by=['actor_id', 'year']).sum(numeric_only=True).reset_index()

    # create datasource_id
    df_out['datasource_id'] = datasourceDict['datasource_id']

    # create emissions ID
    df_out['emissions_id'] = df_out.apply(
        lambda row: f"BP_review_june2022:{row['actor_id']}:{row['year']}", axis=1)

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
        {'tag_id': 'CO2_and_CH4',
         'tag_name': 'CO2 and CH4'},
        {'tag_id': 'primary_source',
         'tag_name': 'Primary source: emissions derived from activity data'}
    ]

    simple_write_csv(outputDir, 'Tag', tagDictList)

    dataSourceTagDictList = [
        {'datasource_id': datasourceDict['datasource_id'],
         'tag_id': tag['tag_id']} for tag in tagDictList
    ]

    simple_write_csv(outputDir, 'DataSourceTag', dataSourceTagDictList)
