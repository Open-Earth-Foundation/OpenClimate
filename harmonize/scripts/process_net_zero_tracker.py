# TODO: this script needs major refactoring

import csv
import concurrent.futures
from dask import delayed
import dask
import numpy as np
import os
import pandas as pd
from pathlib import Path
import pycountry
import pyshorteners
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


def iso3_to_iso2(iso3: str = None) -> str:
    """convert ISO-3166-1 alpha-2 to ISO-3166-1 alpha-2

    Args:
        iso3 (str): ISO3 code (default: None)
    Returns:
        str: ISO2 code

    Example:
    >> iso3_to_iso2('IRL') # returns 'IE'
    """
    namespace='ISO-3166-1%20alpha-3'
    url = f"https://openclimate.openearth.dev/api/v1/search/actor?identifier={iso3}&namespace={namespace}"
    headers = {'Accept': 'application/vnd.api+json'}
    response = requests.request("GET", url, headers=headers).json()
    for data in response.get('data', []):
        return (iso3, data.get('actor_id', None))
    return (iso3, None)

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

def shorten_url(url):
    s = pyshorteners.Shortener()
    return s.tinyurl.short(url)


def select_columns(df, end_or_interim):
    columns = [
        "name",
        "country",
        "iso2",
        "iso3",
        f"{end_or_interim}_target",
        f"{end_or_interim}_target_percentage_reduction",
        f"{end_or_interim}_target_baseline_year",
        f"{end_or_interim}_target_baseline_emissions",
        f"{end_or_interim}_target_intensity_unit",
        f"{end_or_interim}_target_target_emissions",
        f"{end_or_interim}_target_bau_emissions",
        f"{end_or_interim}_target_other",
        f"{end_or_interim}_target_year",
        f"{end_or_interim}_target_text",
        "source_url",
        "LEI",
        "locode_x",
        "ISO-3166-2",
    ]

    return df.loc[:, df.columns.isin(columns)]

def concurrent_executor(func):
    """decorator to make concurrent futures"""
    def wrapper(*args, **kwargs):
        if isinstance(args[0], str):
            args = ([args[0]],)
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = list(executor.map(func, *args, **kwargs))
        return results
    return wrapper

#@concurrent_executor
@delayed
def get_iso2_from_iso3(iso3=None):
    version = '/api/v1'
    base_url = "https://openclimate.openearth.dev"
    server = f"{base_url}{version}"
    endpoint = f"/search/actor?identifier={iso3}&namespace=ISO-3166-1%20alpha-3"
    url = f"{server}{endpoint}"
    headers = {'Accept': 'application/json'}
    response = requests.get(url, headers=headers)
    records = response.json()['data']
    try:
        iso2 = records[0]['actor_id']
        return {iso3 : iso2}
    except IndexError:
        return {iso3: None}

def get_country_net_zero(fl):
    end_target_list = [
        'Carbon neutral(ity)',
        'Climate neutral',
        'Net zero',
        'GHG neutral(ity)',
        'Zero carbon'
    ]

    columns = [
        'last_updated',
        'id_code',
        'name',
        'country',
        'actor_type',
        'end_target',
        'end_target_year',
        'end_target_status',
        'status_date',
        'end_target_text',
        'target_notes',
        'source_url',
        'gasses_coverage',
    ]

    df = (
        pd.read_excel(fl)
        .loc[lambda x: x['country'] != 'XXX']
        .loc[lambda x: x['actor_type'] == 'Country']
        .loc[lambda x: x['end_target'].isin(end_target_list)]
        .loc[:, columns]
        .rename(columns={
            'country':'iso3',
            'end_target':'target_type',
            'end_target_year': 'target_year',
            'source_url':'URL'
        })
    )

    delayed_outputs = [get_iso2_from_iso3(iso3) for iso3 in set(df['iso3'])]
    output_list = dask.compute(*delayed_outputs)
    combined_dict = {k: v for d in output_list for k, v in d.items()}
    df_iso = (
        pd.DataFrame
        .from_dict(combined_dict, orient='index')
        .reset_index()
        .rename(columns={'index':'iso3', 0:'iso2'})
    )

    astype_dict = {
        "actor_id": str,
        "target_year": int,
        "target_type": str,
        "URL":str
    }

    replace_dict = {
        'target_type': {
            'Net Zero': 'Net zero',
            'Net zero': 'Net zero',
            'Zero carbon': 'Net zero',
            'Climate neutral': 'Climate neutral',
            'Carbon neutral(ity)': 'Climate neutral',
            'GHG neutral(ity)': 'GHG neural'
        }
    }

    out_columns = ['target_id', 'actor_id', 'target_type', 'target_year', 'URL', 'datasource_id']

    df_out = (
        df
        .loc[lambda x: ~x['target_year'].isna()]
        .merge(df_iso, on='iso3').rename(columns={'iso2':'actor_id'})
        .astype(astype_dict)
        .replace(replace_dict)
        .assign(target_id=lambda x:
                x.apply(lambda row: f"net_zero_tracker:{row['actor_id']}:{row['target_year']}", axis=1))
        .assign(datasource_id=datasourceDict['datasource_id'])
        .loc[:, out_columns]
    )

    df_out.loc[df_out['URL'] == 'nan', 'URL'] = None

    return df_out.sort_values(by='actor_id')


def get_region_net_zero(fl, fl_missing_iso2):
    end_target_list = [
        'Carbon neutral(ity)',
        'Climate neutral',
        'Net zero',
        'GHG neutral(ity)',
        'Zero carbon'
    ]

    columns = [
        'last_updated',
        'id_code',
        'name',
        'country',
        'actor_type',
        'end_target',
        'end_target_year',
        'end_target_status',
        'status_date',
        'end_target_text',
        'target_notes',
        'source_url',
        'gasses_coverage',
    ]

    rename_columns_dict = {
        'country':'iso3',
        'end_target':'target_type',
        'end_target_year': 'target_year',
        'source_url':'URL'
    }

    replace_dict = {
        'target_type': {
            'Net Zero': 'Net zero',
            'Net zero': 'Net zero',
            'Zero carbon': 'Net zero',
            'Climate neutral': 'Climate neutral',
            'Carbon neutral(ity)': 'Climate neutral',
            'GHG neutral(ity)': 'GHG neural'
        }
    }

    df = (
        pd.read_excel(fl)
        .loc[lambda x: ~x['end_target_year'].isna()]
        .loc[lambda x: x['country'] != 'XXX']
        .loc[lambda x: x['actor_type'] == 'Region']
        .loc[lambda x: x['end_target'].isin(end_target_list)]
        .loc[:, columns]
        .rename(columns=rename_columns_dict)
        .replace(replace_dict)
    )


    delayed_outputs = [get_iso2_from_iso3(iso3) for iso3 in set(df['iso3'])]
    output_list = dask.compute(*delayed_outputs)
    combined_dict = {k: v for d in output_list for k, v in d.items()}

    df_iso = (
        pd.DataFrame
        .from_dict(combined_dict, orient='index')
        .reset_index()
        .rename(columns={'index':'iso3', 0:'iso2'})
    )

    df_out = df.merge(df_iso, on='iso3')#.rename(columns={'iso2':'actor_id'})

    df_out['name'] = (
        df_out['name']
        .str.replace(r'\s+Prefecture$', '', regex=True)
        .str.replace(r'\s+State$', '', regex=True)
        .str.replace(r'\s+\(city\)$', '', regex=True)
        .str.replace('Ōita','Oita')
        .str.replace('Kōchi','Kochi')
        .str.strip()
    )

    data = []
    data_nan=[]
    for country_code in sorted(set(df_out['iso2'])):
        filt = df_out['iso2'] == country_code
        df_filt = df_out.loc[filt]

        for region in df_filt['name'].drop_duplicates():
            try:
                tmp = pycountry.subdivisions.lookup(region)
                if tmp.country_code == country_code:
                    data.append((country_code, region, tmp.code))
                else:
                    data.append((country_code, region, np.NaN))
            except LookupError as e:
                data.append((country_code, region, np.NaN))
                data_nan.append((country_code, region, np.NaN))


    df_iso2_tmp = pd.DataFrame(
        data, columns=['iso2', 'name', 'ISO-3166-2'])

    # get not null values
    filt = df_iso2_tmp['ISO-3166-2'].notnull()
    df_iso2_tmp = df_iso2_tmp.loc[filt]

    # corrected ~70 using chatGPT and manually checking
    df_iso2_corrected = pd.read_csv(fl_missing_iso2).rename(
        columns={'ISO-3166-1': 'iso2'})

    # create final iso2 dataset
    df_iso2 = pd.concat([df_iso2_tmp, df_iso2_corrected])

    # merge with dataset (adds ISO-3166-2)
    df_out = pd.merge(df_out, df_iso2, on=['iso2', 'name'])

    astype_dict = {
        "actor_id": str,
        "target_year": int,
        "target_type": str,
        "URL":str
    }

    replace_dict = {
        'target_type': {
            'Net Zero': 'Net zero',
            'Net zero': 'Net zero',
            'Zero carbon': 'Net zero',
            'Climate neutral': 'Climate neutral',
            'Carbon neutral(ity)': 'Climate neutral',
            'GHG neutral(ity)': 'GHG neural'
        }
    }
    out_columns = ['target_id', 'actor_id', 'target_type', 'target_year', 'URL', 'datasource_id']

    df_tmp = (
        df_out
        .rename(columns={'ISO-3166-2':'actor_id'})
        .loc[lambda x: ~x['target_year'].isna()]
        .astype(astype_dict)
        .replace(replace_dict)
        .assign(target_id=lambda x:
                x.apply(lambda row: f"net_zero_tracker:{row['actor_id']}:{row['target_year']}", axis=1))
        .assign(datasource_id=datasourceDict['datasource_id'])
        .loc[:, out_columns]
    )

    df_tmp.loc[df_tmp['URL'] == 'nan', 'URL'] = None

    return df_tmp.sort_values(by='actor_id')


def get_city_net_zero(fl, fl_locode, fl_missing_locode):
    end_target_list = [
        'Carbon neutral(ity)',
        'Climate neutral',
        'Net zero',
        'GHG neutral(ity)',
        'Zero carbon'
    ]

    columns = [
        'last_updated',
        'id_code',
        'name',
        'country',
        'actor_type',
        'end_target',
        'end_target_year',
        'end_target_status',
        'status_date',
        'end_target_text',
        'target_notes',
        'source_url',
        'gasses_coverage',
    ]

    rename_columns_dict = {
        'country':'iso3',
        'end_target':'target_type',
        'end_target_year': 'target_year',
        'source_url':'URL'
    }

    replace_dict = {
        'target_type': {
            'Net Zero': 'Net zero',
            'Net zero': 'Net zero',
            'Zero carbon': 'Net zero',
            'Climate neutral': 'Climate neutral',
            'Carbon neutral(ity)': 'Climate neutral',
            'GHG neutral(ity)': 'GHG neural'
        }
    }

    df = (
        pd.read_excel(fl)
        .loc[lambda x: ~x['end_target_year'].isna()]
        .loc[lambda x: x['country'] != 'XXX']
        .loc[lambda x: x['actor_type'] == 'City']
        .loc[lambda x: x['end_target'].isin(end_target_list)]
        .loc[:, columns]
        .rename(columns=rename_columns_dict)
        .replace(replace_dict)
    )


    delayed_outputs = [get_iso2_from_iso3(iso3) for iso3 in set(df['iso3'])]
    output_list = dask.compute(*delayed_outputs)
    combined_dict = {k: v for d in output_list for k, v in d.items()}

    df_iso = (
        pd.DataFrame
        .from_dict(combined_dict, orient='index')
        .reset_index()
        .rename(columns={'index':'iso3', 0:'iso2'})
    )

    df_out = df.merge(df_iso, on='iso3')#.rename(columns={'iso2':'actor_id'})

    df_locode = pd.read_csv(fl_locode)

    df_raw_tmp = pd.merge(
        df_out,
        df_locode[['wrong', 'right', 'coerced_wrong', 'iso3', 'locode']],
        left_on=['name', 'iso3'],
        right_on=['wrong', 'iso3'],
        how='left'
    )

    df_locode_missing = pd.read_csv(fl_missing_locode, header=0)

    df_raw_tmp = pd.merge(df_raw_tmp, df_locode_missing,
                          left_on=['name', 'iso2'],
                          right_on=['name', 'ISO-3166-1'],
                          how='left')

    df_raw_tmp['locode_x'] = df_raw_tmp['locode_x'].fillna(
        df_raw_tmp['locode_y'])

    df_out = df_raw_tmp.loc[df_raw_tmp['locode_x'].notnull()]


    astype_dict = {
        "actor_id": str,
        "target_year": int,
        "target_type": str,
        "URL":str
    }

    replace_dict = {
        'target_type': {
            'Net Zero': 'Net zero',
            'Net zero': 'Net zero',
            'Zero carbon': 'Net zero',
            'Climate neutral': 'Climate neutral',
            'Carbon neutral(ity)': 'Climate neutral',
            'GHG neutral(ity)': 'GHG neural'
        }
    }

    out_columns = ['target_id', 'actor_id', 'target_type', 'target_year', 'URL', 'datasource_id']

    df_tmp = (
        df_out
        .rename(columns={'locode_x':'actor_id'})
        .loc[lambda x: ~x['target_year'].isna()]
        .astype(astype_dict)
        .replace(replace_dict)
        .assign(target_id=lambda x:
                x.apply(lambda row: f"net_zero_tracker:{row['actor_id']}:{row['target_year']}", axis=1))
        .assign(datasource_id=datasourceDict['datasource_id'])
        .loc[:, out_columns]
    )

    df_tmp.loc[df_tmp['URL'] == 'nan', 'URL'] = None

    return df_tmp.sort_values(by='actor_id')


def get_company_net_zero(fl, fl_isin_to_lei):
    end_target_list = [
        'Carbon neutral(ity)',
        'Climate neutral',
        'Net zero',
        'GHG neutral(ity)',
        'Zero carbon'
    ]

    columns = [
        'last_updated',
        'id_code',
        'isin_id',
        'name',
        'country',
        'actor_type',
        'end_target',
        'end_target_year',
        'end_target_status',
        'status_date',
        'end_target_text',
        'target_notes',
        'source_url',
        'gasses_coverage',
    ]

    rename_columns_dict = {
        'country':'iso3',
        'end_target':'target_type',
        'end_target_year': 'target_year',
        'source_url':'URL'
    }

    replace_dict = {
        'target_type': {
            'Net Zero': 'Net zero',
            'Net zero': 'Net zero',
            'Zero carbon': 'Net zero',
            'Climate neutral': 'Climate neutral',
            'Carbon neutral(ity)': 'Climate neutral',
            'GHG neutral(ity)': 'GHG neural'
        }
    }

    df = (
        pd.read_excel(fl)
        .loc[lambda x: ~x['end_target_year'].isna()]
        .loc[lambda x: x['country'] != 'XXX']
        .loc[lambda x: x['actor_type'] == 'Company']
        .loc[lambda x: x['end_target'].isin(end_target_list)]
        .loc[:, columns]
        .rename(columns=rename_columns_dict)
        .replace(replace_dict)
    )


    delayed_outputs = [get_iso2_from_iso3(iso3) for iso3 in set(df['iso3'])]
    output_list = dask.compute(*delayed_outputs)
    combined_dict = {k: v for d in output_list for k, v in d.items()}

    df_iso = (
        pd.DataFrame
        .from_dict(combined_dict, orient='index')
        .reset_index()
        .rename(columns={'index':'iso3', 0:'iso2'})
    )

    df_out = df.merge(df_iso, on='iso3')#.rename(columns={'iso2':'actor_id'})


    df_isin = pd.read_csv(fl_isin_to_lei)
    df_out = pd.merge(df_out, df_isin, left_on=['isin_id'], right_on=['ISIN'])

    astype_dict = {
        "actor_id": str,
        "target_year": int,
        "target_type": str,
        "URL":str
    }

    replace_dict = {
        'target_type': {
            'Net Zero': 'Net zero',
            'Net zero': 'Net zero',
            'Zero carbon': 'Net zero',
            'Climate neutral': 'Climate neutral',
            'Carbon neutral(ity)': 'Climate neutral',
            'GHG neutral(ity)': 'GHG neural'
        }
    }

    out_columns = ['target_id', 'actor_id', 'target_type', 'target_year', 'URL', 'datasource_id']

    df_tmp = (
        df_out
        .rename(columns={'LEI':'actor_id'})
        .loc[lambda x: ~x['target_year'].isna()]
        .astype(astype_dict)
        .replace(replace_dict)
        .assign(target_id=lambda x:
                x.apply(lambda row: f"net_zero_tracker:{row['actor_id']}:{row['target_year']}", axis=1))
        .assign(datasource_id=datasourceDict['datasource_id'])
        .loc[:, out_columns]
    )

    df_tmp.loc[df_tmp['URL'] == 'nan', 'URL'] = None

    return df_tmp.sort_values(by='actor_id')



def get_company_actors(df=None, fl_isin_to_lei=None):
    df_companies = df.loc[df['actor_type']=='Company']
    df_isin = pd.read_csv(fl_isin_to_lei)
    df_raw_tmp = pd.merge(df_companies, df_isin, left_on=['isin_id'], right_on=['ISIN'])

    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(iso3_to_iso2, name)
                   for name in list(set(df_raw_tmp['country']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    df_iso = pd.DataFrame(data, columns=['iso3', 'iso2'])
    df_out = pd.merge(df_raw_tmp, df_iso, left_on=['country'], right_on=['iso3'])

    output_columns = [
        'name',
        'actor_type',
        'LEI',
        'iso2'
    ]

    df_company_names = (
        df_out.loc[:, output_columns]
        .rename(columns={'iso2': 'is_part_of'})
        .assign(
            type='organizaton',
            namespace='LEI',
            datasource_id='GLEIF_golden_copy',
            language='en',
            preferred='1'
        )
    )
    return df_company_names


if __name__ == "__main__":
    # Create directory to store output
    outputDir = "../data/processed/net_zero_tracker"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to dataset
    fl = '../data/raw/net_zero_tracker/snapshot_2022-12-20_13-07-14.xlsx'
    fl = os.path.abspath(fl)

    # resource files
    fl_locode = '../resources/key_dict_LOCODE_to_climactor.csv'
    fl_locode = os.path.abspath(fl_locode)
    fl_missing_iso2 = '../resources/net-zero-tracker_missing_ISO-3166-2.csv'
    fl_missing_iso2 = os.path.abspath(fl_missing_iso2)
    fl_missing_locode = '../resources/net-zero-tracker_missing_locodes.csv'
    fl_missing_locode = os.path.abspath(fl_missing_locode)
    fl_isin_to_lei = '../resources/ISIN_LEI_20221222.csv'
    fl_isin_to_lei = os.path.abspath(fl_isin_to_lei)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'net_zero_tracker',
        'name': 'Net Zero Tracker',
        'URL': 'https://zerotracker.net/'
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
    datasourceDict = {
        'datasource_id': 'net_zero_tracker',
        'name': 'Net Zero Tracker',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-01-01',
        'URL': 'https://zerotracker.net/'
    }

    simple_write_csv(
        output_dir=outputDir,
        name='DataSource',
        data=datasourceDict,
        mode='w'
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
    # Target table
    # ------------------------------------------
    df = pd.read_excel(fl)

    # get all the companies
    df_company_actors = get_company_actors(df, fl_isin_to_lei)

    # drops eurpoean union
    filt = df['country'] != 'XXX'
    df = df.loc[filt]

    # get ISO2 from ISO3
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(iso3_to_iso2, name)
                   for name in list(set(df['country']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # return ISO as dataframe
    df_iso = pd.DataFrame(data, columns=['iso3', 'iso2'])

    # merge iso codes
    df_out = pd.merge(df, df_iso, left_on=['country'], right_on=['iso3'])

    # filter out actors with no targets
    filt = (df_out['end_target'] == 'No target') & (
        df_out['interim_target'] == 'No target')
    df_nt = df_out.loc[filt]

    # filter out actors with no targets
    filt = (df_out['end_target'] != 'No target') & (
        df_out['interim_target'] != 'No target')
    df_out = df_out.loc[filt]

    # filter for actor_type
    filt_end_target = (df_out['end_target'].notnull())
    filt_country = (df_out['actor_type'] == 'Country') & filt_end_target
    filt_region = (df_out['actor_type'] == 'Region') & filt_end_target
    filt_city = (df_out['actor_type'] == 'City') & filt_end_target
    filt_company = (df_out['actor_type'] == 'Company') & filt_end_target

    # 1. apply to actor_t{'Region', 'Company', 'Country', 'City'}
    filter_dict = {
        'country': filt_country,
        'region': filt_region,
        'city': filt_city,
        'company': filt_company
    }

    target_list = [
        'Emissions intensity target',
        'Emissions reduction target',
        'Reduction v. BAU'
    ]

    # select relevant columns
    column_type_dict = {
        "target_id": str,
        "actor_id": str,
        "target_type": str,
        "baseline_year": int,
        "target_year": int,
        "target_value": int,
        'target_unit': str,
        "URL": str,
        "datasource_id": str
    }

    # select actor type
    #actor_type = 'country'

    # list to append dataframe to
    dataframe_list = []

    for actor_type in filter_dict:

        filt = filter_dict[actor_type]
        df_raw_tmp = df_out.loc[filt]

        # ------------------------
        # process region
        # ------------------------
        if actor_type == 'region':
            data = []
            for country_code in sorted(set(df_raw_tmp['iso2'])):
                filt = df_raw_tmp['iso2'] == country_code
                df_filt = df_raw_tmp.loc[filt]

                for region in df_filt['name'].drop_duplicates():
                    try:
                        tmp = pycountry.subdivisions.lookup(region)
                        if tmp.country_code == country_code:
                            data.append((country_code, region, tmp.code))
                        else:
                            data.append((country_code, region, np.NaN))
                    except LookupError as e:
                        data.append((country_code, region, np.NaN))

            df_iso2_tmp = pd.DataFrame(
                data, columns=['iso2', 'name', 'ISO-3166-2'])

            # get not null values
            filt = df_iso2_tmp['ISO-3166-2'].notnull()
            df_iso2_tmp = df_iso2_tmp.loc[filt]

            # corrected ~70 using chatGPT and manually checking
            df_iso2_corrected = pd.read_csv(fl_missing_iso2).rename(
                columns={'ISO-3166-1': 'iso2'})

            # create final iso2 dataset
            df_iso2 = pd.concat([df_iso2_tmp, df_iso2_corrected])

            # merge with dataset (adds ISO-3166-2)
            df_raw_tmp = pd.merge(df_raw_tmp, df_iso2, on=['iso2', 'name'])

        # ------------------------
        # process cities
        # ------------------------
        if actor_type == 'city':
            df_locode = pd.read_csv(fl_locode)

            df_raw_tmp = pd.merge(
                df_raw_tmp,
                df_locode[['wrong', 'right', 'coerced_wrong', 'iso3', 'locode']],
                left_on=['name', 'country'],
                right_on=['wrong', 'iso3'],
                how='left'
            )

            df_locode_missing = pd.read_csv(fl_missing_locode, header=0)

            df_raw_tmp = pd.merge(df_raw_tmp, df_locode_missing,
                                  left_on=['name', 'iso2'],
                                  right_on=['name', 'ISO-3166-1'],
                                  how='left')

            df_raw_tmp['locode_x'] = df_raw_tmp['locode_x'].fillna(
                df_raw_tmp['locode_y'])

            df_raw_tmp = df_raw_tmp.loc[df_raw_tmp['locode_x'].notnull()]

        # ------------------------
        # process companies
        # ------------------------
        if actor_type == 'company':
            df_isin = pd.read_csv(fl_isin_to_lei)
            df_raw_tmp = pd.merge(df_raw_tmp, df_isin, left_on=[
                                  'isin_id'], right_on=['ISIN'])

        # ------------------------
        # loop over end and interim
        # ------------------------
        for end_or_interim in ['end', 'interim']:
            df_tmp = (
                select_columns(df_raw_tmp, end_or_interim)
                .query(f"{end_or_interim}_target in {target_list}")
                .rename(columns={
                    f"{end_or_interim}_target_baseline_year": "baseline_year",
                    f"{end_or_interim}_target_year": "target_year",
                    f"{end_or_interim}_target_percentage_reduction": "target_value",
                    f"{end_or_interim}_target": "target_type",
                    "source_url": "URL",
                })
                .query(f"target_year.notnull()")
                .assign(baseline_year=lambda x: x.baseline_year.fillna(x.target_year))
                .astype({'target_year': int, 'baseline_year': int})
                .assign(target_unit='percent', datasource_id=datasourceDict["datasource_id"])
            )

            if actor_type == 'country':
                df_tmp = df_tmp.rename(columns={"iso2": "actor_id"})
            if actor_type == 'region':
                df_tmp = df_tmp.rename(columns={"ISO-3166-2": "actor_id"})
            if actor_type == 'city':
                df_tmp = df_tmp.rename(columns={"locode_x": "actor_id"})
            if actor_type == 'company':
                df_tmp = df_tmp.rename(columns={"LEI": "actor_id"})

            # change target_type
            df_tmp.loc[df_tmp['target_type'] == 'Emissions reduction target',
                       'target_type'] = 'Absolute emission reduction'
            df_tmp.loc[df_tmp['target_type'] == 'Emissions intensity target',
                       'target_type'] = 'Relative emission reduction'
            df_tmp.loc[df_tmp['target_type'] == 'Reduction v. BAU',
                       'target_type'] = 'Relative emission reduction'
            df_tmp.loc[df_tmp['target_type'] ==
                       'Absolute emissions target'] = 'Absolute emission reduction'

            df_tmp['target_id'] = df_tmp.apply(lambda row:
                                               f"{datasourceDict['publisher']}:{row['actor_id']}:{row['target_year']}",
                                               axis=1)

            # set baseline year to target_year if NaN (this is for BAU scenarios)
            df_tmp["baseline_year"] = df_tmp["baseline_year"].fillna(
                df_tmp["target_year"])

            df_tmp = (
                df_tmp
                .loc[:, column_type_dict.keys()]
                .astype(column_type_dict)
                .sort_values(by=['actor_id', 'target_year'])
            )

            dataframe_list.append(df_tmp)

    # get Net zero targets
    df_country_nz = get_country_net_zero(fl)
    df_region_nz = get_region_net_zero(fl, fl_missing_iso2)
    df_city_nz = get_city_net_zero(fl, fl_locode, fl_missing_locode)
    df_company_nz = get_company_net_zero(fl, fl_isin_to_lei)
    net_zero_list = [df_country_nz, df_region_nz, df_city_nz, df_company_nz]

    # merge dataframes
    df_target = pd.concat(dataframe_list+net_zero_list)

    # convert from float to int, while preserving null values
    df_target = float_to_int(df_target, col='baseline_year')
    df_target = float_to_int(df_target, col='target_value')

    # fill nan URL with blank string
    df_target['URL'] = df_target['URL'].fillna('')
    df_target.loc[df_target['URL'] == 'nan', 'URL'] = ''

    # shorten long URLs (could be streamliend by not scanning entire file)
    filt = df_target['URL'].fillna('').str.len() > 250
    df_target.loc[filt, 'URL'] = df_target.loc[filt, 'URL'].apply(shorten_url)

    # save as csv
    df_target.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)

    # ------------------------------------------
    # Actor, ActorIdentifier, ActorName
    # ------------------------------------------
    # merge companies dataframes
    df_tmp_company = (df_company_actors.rename(columns={'LEI': 'actor_id'}))

    df_tmp_company['identifier'] = df_tmp_company['actor_id']

    # columns for each table type
    actor_columns = ['actor_id', 'type', 'name', 'is_part_of', 'datasource_id']
    actorIdentifier_columns = ['actor_id',
                               'identifier', 'namespace', 'datasource_id']
    actorName_columns = ['actor_id', 'name',
                         'language', 'preferred', 'datasource_id']

    # selected columns from df_tmp_company to create tables
    df_actor = df_tmp_company[actor_columns].drop_duplicates()
    df_actorIdentifier = df_tmp_company[actorIdentifier_columns].drop_duplicates(
    )
    df_actorName = df_tmp_company[actorName_columns].drop_duplicates()

    df_actor.drop_duplicates().to_csv(f'{outputDir}/Actor.csv', index=False)
    df_actorIdentifier.drop_duplicates().to_csv(
        f'{outputDir}/ActorIdentifier.csv', index=False)
    df_actorName.drop_duplicates().to_csv(
        f'{outputDir}/ActorName.csv', index=False)
