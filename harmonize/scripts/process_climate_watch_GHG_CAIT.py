import asyncio
import csv
from functools import wraps
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


if __name__ == '__main__':
    # output directory
    outputDir = '../data/processed/climate_watch_historical_GHG'
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

    simple_write_csv(
        output_dir=outputDir,
        name='Publisher',
        data=publisherDict,
        mode='w'
    )

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'WRI:climate_watch_historical_ghg:2022',
        'name': 'Climate Watch Historical GHG Emissions',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-01-01',
        'URL': 'https://www.climatewatchdata.org/ghg-emissions',
        'citation': 'World Resources Institute. (2022). Climate Watch Historical GHG Emissions [Data set]. World Resources Institute. https://www.climatewatchdata.org/ghg-emissions'
    }


    simple_write_csv(
        output_dir=outputDir,
        name='DataSource',
        data=datasourceDict,
        mode='w'
    )

    # =================================================================
    # EmissionsAgg
    # =================================================================
    replace_dict = {
        'country': {
            'Trinidad & Tobago': 'Trinidad and Tobago',
            'China Hong Kong SAR': 'China',
            'Macedonia': "North Macedonia",
            'Republic of Congo': "Republic of the Congo",
            'United States': "United States of America",
        }
    }

    output_columns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    astype_dict = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }

    drop_terms = ["Source:", "Notes:", "Growth", "Data ","European Union", "OECD", "0.05%", "Other "]

    df = (
        pd.read_csv(fl)
        .rename(columns={'Country/Region': 'country'})
        .replace(replace_dict)
        .loc[lambda x: ~(x['country'].str.contains('|'.join(drop_terms)))]
    )

    # get iso2 code from name
    code_list = set(list(df.country))
    data = asyncio.run(get_iso2_async(code_list))
    df_iso = pd.DataFrame(data, columns=['country', 'actor_id'])

    # merge actor_ids into dataframe
    df_out = pd.merge(df, df_iso, on=['country'])

    # process the dataframe
    # original units are MTCO2e
    df_emissionsAgg = (
        df_wide_to_long(df_out, value_name='emissions', var_name='year')
        .loc[lambda x: x['emissions'] != 'false']  # emissions are "false" for Namibia in 1990
        .astype({'emissions': float})
        .assign(total_emissions = lambda x: x['emissions'].apply(lambda x: x * 10**6))
        .assign(datasource_id = datasourceDict['datasource_id'])
        .assign(emissions_id = lambda x: x.apply(lambda row: f"climate_watch_GHG:{row['actor_id']}:{row['year']}", axis=1))
        .loc[:, output_columns]
        .astype(astype_dict)
        .sort_values(by=['actor_id', 'year'])
    )

    # convert to csv
    df_emissionsAgg.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "collated": "Collated emissions estimates",
        "GHGs_included_CO2_CH4_N2O_F_gases": "GHGs included: CO2, CH4, N2O, and F-gases",
        "GWP_100_AR4": "Uses GWP100 from IPCC AR4",
        "Sectors_energy_ag_industrial_processes_waste": "Sectors: energy, agriculture, industrial processes, and waste",
        "includes_bunker_fuels": "Includes emissions from bunker fuels",
        "excludes_LUCF":"Excludes LUCF",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)


    # ------------------------------------------
    # DataSourceQuality table
    # ------------------------------------------
    DataSourceQualityDict = {
        "datasource_id": datasourceDict['datasource_id'],
        "score_type": "GHG target",
        "score": 0.7,
        "notes": "less recent than country-reported UNFCCC data"
    }

    simple_write_csv(outputDir, "DataSourceQuality", DataSourceQualityDict)