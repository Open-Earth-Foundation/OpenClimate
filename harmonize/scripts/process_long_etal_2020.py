# use following to install oc_pyclient (this will be on PyPI soon)
# pip install git+https://github.com/Open-Earth-Foundation/OpenClimate-pyclient.git#egg=oc_pyclient

import csv
from dateutil.parser import parse
import oc_pyclient as oc
import os
from pathlib import Path
import pandas as pd
from typing import List
from typing import Dict
from utils import make_dir


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
    outputDir = '../data/processed/long_etal_2020_JP_prefectural/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/long_etal_2020_JP_prefectural/2020 Emission data 2007-2015.xlsx'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'Long et al. (2020)',
        'name': 'Long et al. (2020)',
        'URL': 'https://www.nature.com/articles/s41597-020-0571-y'
    }

    simple_write_csv(outputDir, 'Publisher', publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'long_etal_2020:JP_prefectural:v1',
        'name': 'Japan prefectural CO2 accounting and social-economic inventory from 2007 to 2015',
        'publisher': f"{publisherDict['id']}",
        'published': '2020-02-06',
        'URL': 'https://figshare.com/collections/Japan_prefectural_CO2_accounting_and_social-economic_inventory_from_2007_to_2015/4847226/1'
    }

    simple_write_csv(outputDir, 'DataSource', datasourceDict)

    # -----------------------------------------------------------------
    # preprocess
    # -----------------------------------------------------------------
    # connect to
    client = oc.Client()

    # get sheet names
    xl = pd.ExcelFile(fl)
    sheets = xl.sheet_names

    # =================================================================
    # EmissionsAgg
    # =================================================================
    # list to hold
    output_list = []

    for sheet in sheets:
        year = sheet
        df = pd.read_excel(fl, header=1, sheet_name=sheet)

        # filter out ag and forestry since don't want to include LUC
        filt = df['Ind_Name'] != 'Agriculture, Forestry and Fishery'
        df = df.loc[filt]

        df = df.copy()
        replace_dict = {'Gumma': 'Gunma', 'Kyoto-fu': 'Kyoto',
                        'Tokyo-to': 'Tokyo', 'Osaka-fu': 'Osaka'}
        df['Pre_Name'] = df['Pre_Name'].replace(replace_dict)

        # only create ids dataframe once
        if sheet == sheets[0]:
            def get_actor_id(name):
                for record in client.search(name=name):
                    if record['type'] == 'adm1':
                        return record['actor_id']
                return None

            actor_id_dict = {name: get_actor_id(
                name) for name in set(df['Pre_Name'])}

            df_ids = (
                pd.DataFrame
                .from_dict(actor_id_dict, orient='index', columns=['actor_id'])
                .reset_index()
                .rename(columns={'index': 'Pre_Name'})
            )

        emissions_columns = [
            'Coal Combustion',
            'Crude Oil Combustion',
            'Natural Gas Combustion',
            'Electricity Generation',
        ]

        # kilo-tonne to tonne
        conversion = 10**3

        df_out = (
            pd.merge(df, df_ids, on='Pre_Name')
            .loc[:, emissions_columns + ['actor_id']]
            .groupby('actor_id')
            .sum()
            .reset_index()
            .assign(total_emissions=lambda x: x[emissions_columns].sum(axis=1) * conversion,
                    year=year,
                    datasource_id=datasourceDict['datasource_id'])
        )

        # create emissions ID
        df_out['emissions_id'] = df_out.apply(
            lambda row: f"{publisherDict['id'].replace(' ', '_').replace('.', '')}:{row['actor_id']}:{row['year']}", axis=1)

        df_tmp = df_out.loc[:, ['emissions_id', 'actor_id',
                                'year', 'total_emissions', 'datasource_id']]

        output_list.append(df_tmp)

    # concat together
    df_emissionsAgg = pd.concat(
        output_list).sort_values(by=['actor_id', 'year'])

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
        {'tag_id': 'CO2_only',
         'tag_name': 'CO2 only'}
    ]

    simple_write_csv(outputDir, 'Tag', tagDictList)

    dataSourceTagDictList = [
        {'datasource_id': datasourceDict['datasource_id'],
         'tag_id': tag['tag_id']} for tag in tagDictList
    ]

    simple_write_csv(outputDir, 'DataSourceTag', dataSourceTagDictList)
