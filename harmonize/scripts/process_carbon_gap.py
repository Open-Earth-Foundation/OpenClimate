import concurrent.futures
import csv
from dateutil.parser import parse
from fuzzywuzzy import fuzz
import json
import investpy
import numpy as np
import os
from pathlib import Path
import pandas as pd
import pycountry
import re
import requests
from typing import List
from typing import Dict
from utils import make_dir
from utils import write_to_csv
from utils import lei_from_name2
from utils import country_to_iso2


def get_isin(company_name):
    data = []
    try:
        results = investpy.search_stocks(by='name', value=company_name)
        results_unique = results[['name', 'isin']].drop_duplicates()
        for name, isin in zip(results_unique['name'], results_unique['isin']):
            data.append((fuzz.ratio(company_name, name),
                        company_name, name, isin))
        return data
    except RuntimeError:
        data.append((0, company_name, np.nan, np.nan))
        return data


def get_url(statement):
    # match a URL and name it url
    url_regex = r"(?P<url>(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)))"
    matches = re.finditer(url_regex, statement)
    url_list = [match.group("url") for match in matches]

    # native approach of returning the first URL
    try:
        return url_list[0]
    except IndexError:
        return None


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
    outputDir = '../data/processed/carbon_gap/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/carbon_gap/profit_and_emmissions_database.csv'
    fl = os.path.abspath(fl)

    fl_missing_lei = '../resources/carbon_gap_missing_lei.csv'
    fl_missing_lei = os.path.abspath(fl_missing_lei)

    fl_isin_to_lei = '../resources/ISIN_LEI_20221222.csv'
    fl_isin_to_lei = os.path.abspath(fl_isin_to_lei)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'Carbon Gap',
        'name': 'Carbon Gap',
        'URL': 'https://carbongap.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'profit_and_emissions_database:2021',
        'name': 'Profit and Emissions Database',
        'publisher': f"{publisherDict['id']}",
        'published': '2021-01-01',
        'URL': 'https://docs.google.com/spreadsheets/d/19MQbZbrCu4HpAWe6NU92CioYQ7KE8FvD9vl-r9qSjJg/edit#gid=1542516770'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # -----------------------------------------------------------------
    # preprocess
    # -----------------------------------------------------------------
    columns = [
        'Company Name',
        'Industry',
        'Country/Territory',
        'Scope 1+2',
        'Datasource emission data (name, link + page nr)',
    ]

    df = (
        pd.read_csv(fl, header=1)
        .loc[:, columns]
        .assign(name=lambda x: x['Company Name'].str.lstrip().str.rstrip(),
                year='2020',
                datasource_id=datasourceDict['datasource_id'])
        .rename(columns={
            'Industry': 'industry',
            'Country/Territory': 'country',
            'Scope 1+2': 'total_emissions',
            'Datasource emission data (name, link + page nr)': 'statement'})
        .drop(columns=['Company Name'])
    )

    # South Korea not in database
    # United States could be mistaken for US minor islands
    df.loc[df['country'] == 'South Korea',
           'country'] = 'Korea, the Republic of'
    df.loc[df['country'] == 'United States',
           'country'] = 'United States of America'

    # country name to iso2
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(country_to_iso2, name, return_input=True)
                   for name in list(set(df['country']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # put iso code in dataframe
    df_iso = pd.DataFrame(data, columns=['country', 'iso2'])

    # merge iso codes
    df = pd.merge(df, df_iso, on='country')

    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = [executor.submit(lei_from_name2, name, iso2)
                   for name, iso2 in zip(df['name'], df['iso2'])]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    lei_columns = ['name', 'legal_name', 'country', 'region',
                   'city', 'lei', 'lei_status', 'lei_datasource_id']
    df_lei = pd.DataFrame(data, columns=lei_columns)

    # merge datasets (wide, each year is a column)
    df_out = pd.merge(df, df_lei, left_on=['name', 'iso2'], right_on=[
                      'name', 'country'], how="left")

    df_out['region'] = df_out['region'].fillna(df_out['iso2'])

    df_out['url'] = [get_url(statement) for statement in df_out['statement']]

    df_out = df_out.rename(columns={'lei': 'actor_id', 'region': 'is_part_of'})

    df_out['datasource_id'] = datasourceDict['datasource_id']
    df_out['emissions_id'] = df_out.apply(
        lambda row: f"carbon_gap:{row['actor_id']}:{row['year']}", axis=1)

    # resets LEI for Volvo Group, not getting correct LEI
    filt = (
        (df_out['legal_name'] == 'Volvo Group Insurance Försäkringsaktiebolag')
        &
        (df_out['name'] == 'Volvo Group')
    )
    df_out.loc[filt, 'actor_id'] = None

    df_out_null = df_out[df_out['actor_id'].isnull()]

    df_clean = df_out[df_out['actor_id'].notnull()]

    # =================================================================
    # EmissionsAgg
    # =================================================================
    df_emissionsAgg = df_clean[[
        'emissions_id', 'actor_id', 'year', 'total_emissions', 'datasource_id']]

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
    #tagDictList = [{'tag_id': '--','tag_name': '--'},]
    #simple_write_csv(outputDir, 'Tag', tagDictList)
    #dataSourceTagDictList = [{'datasource_id': datasourceDict['datasource_id'],'tag_id': tag['tag_id']} for tag in tagDictList]
    #simple_write_csv(outputDir, 'DataSourceTag', dataSourceTagDictList)

    # =================================================================
    # Actor, ActorName, ActorIdentifier
    # =================================================================
    df_actor_tmp = (
        df_clean.copy()
        .rename(columns={'name': 'name_in_database'})
        .drop(columns=['datasource_id'])
    )

    df_actor_tmp = df_actor_tmp.rename(columns={'legal_name': 'name'})

    df_actor_tmp = df_actor_tmp.assign(
        datasource_id='GLEIF_golden_copy',
        language='en',
        preferred=1,
        type='organization',
        namespace='LEI',
        identifier=df_actor_tmp['actor_id']
    )

    actor_columns = ['actor_id', 'type', 'name', 'is_part_of', 'datasource_id']
    df_actor = df_actor_tmp[actor_columns]
    df_actor.to_csv(f'{outputDir}/Actor.csv', index=False)

    actorIdentifier_columns = ['actor_id',
                               'identifier', 'namespace', 'datasource_id']
    df_actorIdentifier = df_actor_tmp[actorIdentifier_columns]
    df_actorIdentifier.to_csv(f'{outputDir}/ActorIdentifier.csv', index=False)

    actorName_columns = ['actor_id', 'name',
                         'language', 'preferred', 'datasource_id']
    df_actorName = df_actor_tmp[actorName_columns]
    df_actorName.to_csv(f'{outputDir}/ActorName.csv', index=False)
