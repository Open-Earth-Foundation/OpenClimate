import asyncio
import csv
from functools import wraps
import os
import pandas as pd
from pathlib import Path
import re
import requests
from typing import List
from typing import Dict
from utils import df_wide_to_long
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
        writer.writeheader()
        writer.writerows(data)

def async_func(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, func, *args, **kwargs)
    return wrapper

@async_func
def state_to_iso2(name=None, is_part_of=None):
    """get the region code from name
    name and is_part_of are case sensitive

    Args:
        name (str): actor name to search for (default: None)
        is_part_of (str): ISO2 code where name is part of (default: None)

    Returns:
        str: region code corresponding to name

    Example:
    >> state_to_iso2('Minnesot', 'US) # returns 'US-MN'
    """
    url = f"https://openclimate.openearth.dev/api/v1/search/actor?name={name}"
    headers = {'Accept': 'application/vnd.api+json'}
    response = requests.request("GET", url, headers=headers).json()
    for data in response.get('data', []):
        if data.get('is_part_of') == is_part_of:
            return (name, data.get('actor_id', None))
    return (name, None)

async def state_to_iso2_async(code_list):
    tasks = [asyncio.create_task(state_to_iso2(name, 'US')) for name in code_list]
    data = await asyncio.gather(*tasks)
    return data

def read_each_file(fl):
    """reads EPA state GHG inventory file
    depends on df_wide_to_long in utils
    """
    df = pd.read_csv(fl)
    firstColumnName = df.columns[0]
    filt = df[f"{firstColumnName}"] == 'Total'
    df = df.loc[filt]
    result = re.search(r"(.*)\sEmissions.*", firstColumnName)
    state = ''.join(result.groups())
    df = df.rename(columns={f"{firstColumnName}": "state"})
    df["state"] = f"{state}"
    df_long = df_wide_to_long(df=df,
                              value_name='total_emissions',
                              var_name="year")
    return df_long


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/EPA_GHG_inventory"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # data directory
    dataDir = '../data/raw/EPA_GHG_inventory'
    dataDir = os.path.abspath(dataDir)
    files = sorted((Path(dataDir).glob('*.csv')))

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'EPA',
        'name': 'United States Environmental Protection Agency',
        'URL': 'https://www.epa.gov/'
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
        'datasource_id': 'EPA:state_GHG_inventory:2022-08-31',
        'name': 'Inventory of U.S. Greenhouse Gas Emissions and Sinks by State',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-08-31',
        'URL': 'https://cfpub.epa.gov/ghgdata/inventoryexplorer/'
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
    # concatenate all the files
    df_concat = pd.concat([read_each_file(fl=fl) for fl in files], ignore_index=True)

    # make "of" lowercase in "District Of Columbia"
    filt = df_concat['state'] == 'District Of Columbia'
    df_concat.loc[filt, 'state'] = 'District of Columbia'

    # get actor_id from state name
    code_list = list(set(df_concat['state']))
    data = asyncio.run(state_to_iso2_async(code_list))
    df_iso = pd.DataFrame(data, columns=['state', 'actor_id'])

    astype_dict = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }

    output_columns = tuple(astype_dict.keys())
    emissions_id_function = lambda row:f"EPA_state_GHG_inventory:{row['actor_id']}:{row['year']}"
    total_emissions_function = lambda row: row['total_emissions'] * 10**6

    df_emissionsAgg = (
        pd.merge(df_concat, df_iso, on='state', how='left')
        .assign(total_emissions=lambda x: x.apply(total_emissions_function, axis=1))
        .assign(datasource_id = datasourceDict['datasource_id'])
        .assign(emissions_id = lambda x: x.apply(emissions_id_function, axis=1))
        .loc[:, output_columns]
        .astype(astype_dict)
        .sort_values(by=['actor_id', 'year'])
    )

    # save to csv
    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDir}/EmissionsAgg.csv', index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================

    # dictionary of tag_id : tag_name
    tagDict = {
        "GHGs_included_CO2_CH4_N2O_F_gases": "GHGs included: CO2, CH4, N2O, and F-gases",
        "sectors_energy_IPPU_ag_waste_LULUCF": "Sectors: energy, industrial processes, agriculture, waste, and LULUCF",
        "Includes_LULUCF":"Includes LULUCF",
        "GWP_100_AR5": "Uses GWP100 from IPCC AR5",
        'country_reported_data': 'Country-reported data',
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
        "score": 0.8,
        "notes": "country reported. not necessarily state-reported data"
    }

    simple_write_csv(outputDir, "DataSourceQuality", DataSourceQualityDict)