import csv
import concurrent.futures
import numpy as np
import os
import pandas as pd
from pathlib import Path
import pyshorteners
import re
import requests
from typing import List
from typing import Dict
from utils import make_dir

def simple_write_csv(
        output_dir: str = None,
        name: str = None,
        data: List[Dict] | Dict = None,
        mode: str = "w",
        extension: str = "csv") -> None:

    if isinstance(data, dict):
        data = [data]

    with open(f"{output_dir}/{name}.{extension}", mode=mode) as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=data[0].keys())

        # https://9to5answer.com/python-csv-writing-headers-only-once
        if  csvfile.tell() == 0:
            writer.writeheader()

        writer.writerows(data)

def get_net_zero_targets(fl_comp):
    columns_out = ['target_id', 'actor_id', 'target_type', 'target_year', 'datasource_id', 'initiative_id']
    df_out = (
        pd.read_excel(fl_comp)
        .loc[lambda x: x['Net-Zero Committed']=='Yes']
        .loc[lambda x: (x['Net-Zero Year'].notnull())]
        .loc[lambda x: (x['LEI'].notnull())]
        .assign(target_year= lambda x: x['Net-Zero Year'].replace('^FY', '', regex=True))
        .assign(target_type='Net zero')
        .rename(columns={'LEI':'actor_id'})
        .assign(target_id= lambda x: x.apply(lambda row: f"SBTi:{row['actor_id']}:{row['target_year']}",axis=1))
        .assign(datasource_id=datasourceDict["datasource_id"])
        .assign(initiative_id='SBTi')
        .loc[:, columns_out]
    )

    return df_out

def get_targets(fl_comp, fl_prog, datasourceDict):
    df_comp = get_company_lei(fl_comp)

    replace_dict = {
        'Target type': {
            'Absolute': 'Absolute emission reduction',
            'INtensity': 'Carbon intensity reduction',
            'Intensity': 'Carbon intensity reduction',
            'Renewable electriciy': 'Renewable electricy increase',
        }
    }

    rename_dict = {
        'Target type': 'target_type',
        'Target year': 'target_year',
        'Base year': 'baseline_year',
        'LEI': 'actor_id',
        'Activity unit': 'activity_unit',
        'Target scope': 'target_scope',
        'Company Status Text':'summary',
    }

    astype_dict = {
        "actor_id": str,
        "target_year": int,
        "target_value": int,
        "baseline_year": int,
        "target_type": str,
    }


    out_columns = [
        "target_id",
        "actor_id",
        "target_type",
        "baseline_year",
        "target_year",
        "target_value",
        "target_unit",
        "summary",
        "datasource_id",
        "initiative_id",
    ]

    df_out = (
        pd.read_excel(fl_prog, sheet_name='Appendix - Download')
        .loc[lambda x: (
            (x['Target value'].notnull())
            & (x['Company name'].notnull())
            & (x['Base year'].notnull())
            & (x['Target year'].notnull())
            & (x['Target type']!='Supplier engagement')
        )]
        .merge(df_comp, on='Company name', how='left')
    #    .assign(LEI=lambda x: x.apply(lambda x: x['LEI_y'].fillna(x['LEI_x'])))
    #    .loc[lambda x: ~x['LEI'].isnull()] # drops null LEI values
        .replace(replace_dict)
        .assign(target_scope= lambda x: x['Target scope'].str.replace(r'\s*\([^)]*\)\s*', '', regex=True))
        .assign(target_value=lambda x: x['Target value'] * 100)
        .rename(columns=rename_dict)
        .astype(astype_dict)
        .assign(target_id=lambda x:x.apply(lambda row: f"SBTi:{row['actor_id']}:{row['target_year']}", axis=1))
        .assign(datasource_id=datasourceDict['datasource_id'])
        .assign(target_unit='percent')
        .assign(initiative_id='SBTi')
        .loc[:, out_columns]
    )
    return df_out

def get_company_lei(fl_comp):
    return (pd.read_excel(fl_comp)
            .loc[:, ['Company Name', 'ISIN', 'LEI']]
            .rename(columns={'Company Name':'Company name'})
           )

def get_isin_to_lei(fl_isin_to_lei):
    return pd.read_csv(fl_isin_to_lei)


def get_lei_from_isin(df, fl_isin_to_lei):
    df_isin = pd.read_csv(fl_isin_to_lei)

    if 'LEI' in df.columns:
        df_unknown = df.loc[(df['ISIN'].isnull()) & (df['LEI'].isnull())]
        df_have = df.loc[df['LEI'].notnull()]
        df_need = df.loc[(df['ISIN'].notnull()) & (df['LEI'].isnull())]
        df_need = df_need.drop(columns='LEI')
        df_found = pd.merge(df_need, df_isin, on='ISIN')
        return pd.concat([df_have, df_found, df_unknown])
    else:
        df_unknown = df.loc[df['ISIN'].isnull()]
        df_need = df.loc[df['ISIN'].notnull()]
        df_found = pd.merge(df_need, df_isin, on='ISIN')
        return pd.concat([df_found, df_unknown])


def is_lei(s):
    lei_pattern = re.compile(r'^\w{20}$')
    return bool(lei_pattern.match(s))


def concurrent_executor(func):
    """decorator to make concurrent futures"""
    def wrapper(*args, **kwargs):
        if isinstance(args[0], str):
            args = ([args[0]],)
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(func, *args, **kwargs))
        return results
    return wrapper

@concurrent_executor
def get_iso2_from_name(name: str = None, type_code: str='country') -> str:
    """get the region code from name

    - get ISO-3166-1 alpha-2 code from country
    - get ISO-3166-2 alpha-2 code from adm1 or adm2 (i.e. subnationals)
    - get UN-LOCODE from city

    Args:
        name (str): actor name to search for (default: None)
        type_code (str): actor type (default: "country")
                         ['country', 'adm1', 'adm2', 'city']
    Returns:
        str: region code corresponding to name

    Example:
    >> get_iso2_from_type('Ireland') # returns 'IE'
    """
    # https://github.com/Open-Earth-Foundation/OpenClimate/blob/develop/api/API.md
    url = f"https://openclimate.openearth.dev/api/v1/search/actor?name={name}"
    headers = {'Accept': 'application/vnd.api+json'}
    response = requests.request("GET", url, headers=headers).json()
    for data in response.get('data', []):
        if data.get('type') == type_code:
            return (name, data.get('actor_id', None))
    return (name, None)

def shorten_url(url):
    s = pyshorteners.Shortener()
    return s.tinyurl.short(url)


def float_to_int(df=None, col=None, fill_val=-9999):
    """convert column from float to int if has NaN values
    useful for munging data prior to ingesting into a DB
    """
    df[col] = (
        df[col]
        .fillna(fill_val)
        .astype(int)
        .astype(str)
        .replace(f'{fill_val}', np.nan)
    )
    return df

if __name__ == "__main__":
    # Create directory to store output
    outputDir = "../data/processed/SBTi/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to dataset
    fl_prog = '../data/raw/science_based_targets/SBTiProgressReport2021AppendixData.xlsx'
    fl_prog = os.path.abspath(fl_prog)
    fl_comp = '../data/raw/science_based_targets/companies-taking-action.xlsx'
    fl_comp = os.path.abspath(fl_comp)

    # resource files
    fl_isin_to_lei = '../resources/ISIN_LEI_20221222.csv'
    fl_isin_to_lei = os.path.abspath(fl_isin_to_lei)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        "id": "SBTi",
        "name": "The Science Based Targets initiative",
        "URL": "https://sciencebasedtargets.org/",
    }

    simple_write_csv(
        output_dir=outputDir,
        name='Publisher',
        data=publisherDict,
        mode='w'
    )

    gleifPublisherDict = {
        'id': 'GLEIF',
        'name': 'Global Legal Entity Identifier Foundation',
        'URL': 'https://www.gleif.org/en'
    }

    simple_write_csv(
        output_dir=outputDir,
        name='Publisher',
        data=gleifPublisherDict,
        mode='a'
    )

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    CompaniesDatasourceDict = {
        "datasource_id": "SBTi:companies_taking_action:2021-07-31",
        "name": "SBTi: Companies Taking Action",
        "publisher": publisherDict["id"],
        "published": "2023-01-01",
        "URL": "https://sciencebasedtargets.org/companies-taking-action",
    }
    simple_write_csv(
        output_dir=outputDir,
        name='DataSource',
        data=CompaniesDatasourceDict,
        mode='w'
    )

    datasourceDict = {
        "datasource_id": "SBTi:target_progress:2021-07-31",
        "name": "SBTi: Target Progress Data",
        "publisher": publisherDict["id"],
        "published": "2021-07-31",
        "URL": "https://sciencebasedtargets.org/reports/sbti-progress-report-2021/progress-data-dashboard#datadashboard",
    }

    simple_write_csv(
        output_dir=outputDir,
        name='DataSource',
        data=datasourceDict,
        mode='a'
    )

    gleifDataSourceDict = {
        'datasource_id': 'GLEIF_golden_copy',
        'name': 'information on Legal Entity Identifiers (LEIs) and related reference data in a ready-to-use format',
        'publisher': 'GLEIF',
        'published': '2022-12-16',
        'URL': 'https://www.gleif.org/en/lei-data/gleif-golden-copy/download-the-golden-copy#/'
    }

    simple_write_csv(
        output_dir=outputDir,
        name='DataSource',
        data=gleifDataSourceDict,
        mode='a'
    )

    # ------------------------------------------
    # Initiative
    # ------------------------------------------
    SBTi_description =  """
    Science-based targets provide a clearly-defined pathway
    for companies to reduce greenhouse gas (GHG) emissions,
    helping prevent the worst impacts of climate change and future-proof business growth. Targets are considered
    ‘science-based’ if they are in line with what the latest
    climate science deems necessary to meet the goals of the
    Paris Agreement – limiting global warming to well-below 2°C above pre-industrial levels
    and pursuing efforts to limit warming to 1.5°C.
    """

    initiativeDict =  {
        "initiative_id" : "SBTi",
        "name" : "Science Based Targets initiative",
        "description" : re.sub(r'\n', '', SBTi_description),
        "URL" : "https://sciencebasedtargets.org/",
        "datasource_id" : datasourceDict['datasource_id']
    }

    simple_write_csv(
        output_dir=outputDir,
        name='Initiative',
        data=initiativeDict,
        mode='w'
    )

    # ------------------------------------------
    # Actors
    # ------------------------------------------
    replace_dict = {
        'Location':
        {
            'Trinidad And Tobago': 'Trinidad and Tobago',
            'Myanmar (Burma)': 'Myanmar',
            'Taiwan, Province of China': 'Taiwan',
            'Hong Kong, China': 'Hong Kong',
            'United Arab Emirates (UAE)': 'United Arab Emirates',
            'United States of America (USA)': 'United States of America',
            'Macau, Province of China': 'Macau',
            'United Kingdom (UK)': 'United Kingdom'
        }
    }

    df_comp = pd.read_excel(fl_comp).replace(replace_dict)
    df_lei = get_lei_from_isin(df_comp, fl_isin_to_lei)

    # get is_part_of
    data = get_iso2_from_name(set(df_comp['Location']))
    df_part = pd.DataFrame(data, columns=['Location', 'is_part_of'])

    # make sure have IDs for all names
    assert not bool(list(df_part.loc[df_part['is_part_of'].isnull(), 'Location']))

    # columns for each table type
    actor_columns = ['actor_id', 'type', 'name', 'is_part_of', 'datasource_id']
    actorIdentifier_columns = ['actor_id','identifier', 'namespace', 'datasource_id']
    actorName_columns = ['actor_id', 'name','language', 'preferred', 'datasource_id']

    df_actor_tmp = (
        pd.merge(df_comp, df_part, on='Location')
        .assign(
            type='organizaton',
            namespace='LEI',
            datasource_id='GLEIF_golden_copy',
            language='en',
            preferred='1'
        )
        .loc[lambda x: x['LEI'].notnull()] # here is where you can select columns
        .rename(columns={'LEI': 'actor_id', 'Company Name':'name'})
        .assign(actor_id = lambda x: x['actor_id'].str.replace(r'^LEI\s+', '', regex=True))
        .assign(identifier = lambda x: x['actor_id'])
        .loc[lambda x: x['actor_id'].apply(lambda x: isinstance(x, str) and is_lei(x))]
    )

    # list of actors with known LEI
    actors_with_known_lei = list(df_actor_tmp['actor_id'])

    df_actor = (
        df_actor_tmp
        .sort_values(by=['name'])
        .loc[:, actor_columns]
        .drop_duplicates()
        .to_csv(f'{outputDir}/Actor.csv', index=False, mode='w')
        )
    df_actorIdentifier = (
        df_actor_tmp
        .sort_values(by=['name'])
        .loc[:, actorIdentifier_columns]
        .drop_duplicates()
        .to_csv(f'{outputDir}/ActorIdentifier.csv', index=False, mode='w')
        )

    df_actorName = (
        df_actor_tmp
        .sort_values(by=['name'])
        .loc[:, actorName_columns]
        .drop_duplicates()
        .to_csv(f'{outputDir}/ActorName.csv', index=False, mode='w')
        )

    # ------------------------------------------
    # Target table
    # ------------------------------------------
    # select relevant columns
    column_type_dict = {
        "target_id": str,
        "actor_id": str,
        "target_type": str,
        "target_unit": str,
        "summary": str,
        "datasource_id": str,
        "initiative_id": str
    }

    columns_out = [
        'target_id',
        'actor_id',
        'target_type',
        'baseline_year',
        'target_year',
        'target_value',
        'target_unit',
        'summary',
        'datasource_id',
        'initiative_id'
    ]

    # interim targets
    # exclude: 'Carbon intensity reduction'
    target_types = ['Absolute emission reduction','Renewable electricity']
    df_targ = (
        get_targets(fl_comp, fl_prog, datasourceDict)
        .loc[lambda x: x['target_type'].isin(target_types)]
    )

    # net zero targets
    df_nz = get_net_zero_targets(fl_comp)

    # combine targets
    df_targets = (
        pd.concat([df_targ, df_nz], axis=0, ignore_index=True)
        .loc[lambda x: x['actor_id'].isin(actors_with_known_lei)]
        .pipe(float_to_int, col='baseline_year', fill_val=-9999)
        .pipe(float_to_int, col='target_year', fill_val=-9999)
        .pipe(float_to_int, col='target_value', fill_val=-9999)
        .loc[:, columns_out]
        .astype(column_type_dict)
        .sort_values(by=['actor_id', 'target_year'])
    )

    # save as csv
    df_targets.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
