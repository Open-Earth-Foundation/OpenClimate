import asyncio
import csv
from functools import wraps
import numpy as np
import os
from pathlib import Path
import pandas as pd
import requests
from typing import List
from typing import Dict
from utils import df_wide_to_long
from utils import make_dir

def async_func(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, func, *args, **kwargs)
    return wrapper


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
        writer.writeheader()
        writer.writerows(data)


@async_func
def get_iso2_from_name(name: str = None, type_code: str='country') -> str:
    """get the region code from name

    Args:
        name (str): actor name to search for (default: None)
        type_code (str): actor type (default: "country")
                         ['country', 'adm1', 'adm2', 'city']
    Returns:
        str: region code corresponding to name

    Example:
    >> get_iso2_from_type('Ireland') # returns 'IE'
    """
    url = f"https://openclimate.openearth.dev/api/v1/search/actor?name={name}"
    headers = {'Accept': 'application/vnd.api+json'}
    response = requests.request("GET", url, headers=headers).json()
    for data in response.get('data', []):
        if data.get('type') == type_code:
            return (name, data.get('actor_id', None))
    return (name, None)

async def get_iso2_async(code_list):
    tasks = [asyncio.create_task(get_iso2_from_name(name)) for name in code_list]
    data = await asyncio.gather(*tasks)
    return data

if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/UNFCCC_Annex1"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # PRIMPAP dataset
    fl = ('../data/raw/UNFCCC_Annex1/'
          'Time Series - GHG total without LULUCF, in kt CO₂ equivalent.xlsx')
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'UNFCCC',
        'name': 'The United Nations Framework Convention on Climate Change',
        'URL': 'https://unfccc.int'
    }

    simple_write_csv(
        output_dir=outputDir,
        name='Publisher',
        data=publisherDict,
        mode='w'
    )

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        'datasource_id': 'UNFCCC:GHG_ANNEX1:2019-11-08',
        'name': 'UNFCCC GHG total without LULUCF, ANNEX I countries',
        'publisher': 'UNFCCC',
        'published': '2019-11-08',
        'URL': 'https://di.unfccc.int/time_series'
    }

    simple_write_csv(
        output_dir=outputDir,
        name='DataSource',
        data=datasourceDict,
        mode='w'
    )

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    # create unfccc
    df = pd.read_excel(fl, skiprows=2, na_values=True)
    df_tmp = df.copy()
    first_row_with_all_NaN = df[df.isnull().all(
        axis=1) == True].index.tolist()[0]
    df = df.loc[0:first_row_with_all_NaN-1]

    # this is necessary for df_wide_to_long to work
    df = df.rename(columns={'Last Inventory Year (2020)': '2020'})

    # filter out European Union
    filt = ~(df['Party'].str.contains('European Union'))
    df = df.loc[filt]

    # TODO: this is a temporary fix while the ActorName table is being updated
    filt = df['Party'] == 'United Kingdom of Great Britain and Northern Ireland'
    df.loc[filt, 'Party'] = 'The United Kingdom of Great Britain and Northern Ireland'

    # get iso2 code from name
    code_list = list(set(df['Party']))
    data = asyncio.run(get_iso2_async(code_list))
    df_iso = pd.DataFrame(data, columns=['name', 'iso2'])

    # merge datasets (wide, each year is a column)
    df_wide = pd.merge(df, df_iso,
                       left_on=["Party"],
                       right_on=['name'],
                       how="left")

    # convert from wide to long dataframe (was def_merged_long)
    df_long = df_wide_to_long(df=df_wide,
                              value_name="emissions",
                              var_name="year")

    # rename columns
    df = df_long.rename(columns={'iso2': 'actor_id'})

    # convert year to int
    df['year'] = df['year'].astype('int16')

    # create datasource_id
    df['datasource_id'] = datasourceDict['datasource_id']

    # create emissions_id
    df['emissions_id'] = df.apply(lambda row:
                                  f"UNFCCC-annex1-GHG:{row['actor_id']}:{row['year']}",
                                  axis=1)

    # CO₂ total without LULUCF, in kt
    def kilotonne_to_metric_ton(val):
        ''' 1 Kilotonne = 1000 tonnes  '''
        return val * 1000

    df['total_emissions'] = df['emissions'].apply(kilotonne_to_metric_ton)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df[emissionsAggColumns]

    # ensure data has correct types
    df_emissionsAgg = df_emissionsAgg.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # save to csv
    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDir}/EmissionsAgg.csv', index=False)

    # ------------------------------------------
    # Tag table
    # ------------------------------------------
    tagDictList = [
            {
                'tag_id': '3d_party_validated',
                'tag_name': 'Third party validated'
            },
            {
                'tag_id': 'country_reported_data',
                'tag_name': 'Country-reported data'
            }
        ]

    simple_write_csv(
        output_dir=outputDir,
        name='Tag',
        data=tagDictList,
        mode='w'
    )

    # ------------------------------------------
    # DataSourceTag table
    # ------------------------------------------
    datasource_id = f"{datasourceDict['datasource_id']}"
    tags = ['country_reported_data', '3d_party_validated']
    dataSourceTagDict = [{'datasource_id': datasource_id, 'tag_id': tag} for tag in tags]

    simple_write_csv(
        output_dir=outputDir,
        name='DataSourceTag',
        data=dataSourceTagDict,
        mode='w'
    )