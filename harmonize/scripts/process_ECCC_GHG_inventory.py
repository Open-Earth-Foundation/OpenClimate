import csv
import os
import pathlib
from pathlib import Path
import pandas as pd
import re
from typing import List
from typing import Dict
from utils import df_wide_to_long
from utils import make_dir
from utils import df_columns_as_str
from utils import df_drop_unnamed_columns

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

def read_eccc_ghg_inventory_fl(fl=None, province=None):

    assert isinstance(fl, pathlib.PurePath), (
        f"{fl} is not a string or pathlib.PosixPath"
    )

    # get province name from filename if not provided
    if province is None:
        # get province from stem of file
        result = re.search(r"EN_GHG_IPCC_(.*)", fl.stem)
        province = ''.join(result.groups())

        # change NT&NU combined to just NT
        if province == 'NT&NU':
            province = 'NT'

    else:
        assert isinstance(province, str), (
            f"{province} is not type string"
        )

    # read raw dataset
    df = pd.read_excel(fl, sheet_name='Summary', header=4)
    df = df_columns_as_str(df)
    df = df_drop_unnamed_columns(df)

    # extract units
    units = df.iloc[0, 1]

    # filter, only get total of all GHG cats
    filt = df['Greenhouse Gas Categories'] == 'TOTAL'
    df = df.loc[filt]

    # convert from wide to long
    df_long = df_wide_to_long(df=df, value_name='emissions', var_name='year')

    # add province column
    df_long['actor_id'] = f"CA-{province}"
    df_long['units'] = units

    return df_long


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/ECCC_GHG_inventory"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # data directory
    dataDir = '../data/raw/ECCC_GHG_inventory'
    dataDir = os.path.abspath(dataDir)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'ECCC',
        'name': 'Environment and Climate Change Canada',
        'URL': 'https://www.canada.ca/en/environment-climate-change.html'
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
        'datasource_id': 'ECCC:GHG_inventory:2022-04-13',
        'name': 'ECCC Greenhouse Gas Inventory',
        'publisher': 'ECCC',
        'published': '2022-04-13',
        'URL': 'https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en'
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
    astype_dict = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }

    output_columns = tuple(astype_dict.keys())
    emissions_id_function = lambda row:f"ECCC_GHG_inventory:{row['actor_id']}:{row['year']}"
    total_emissions_function = lambda row: row['emissions'] * 10**3

    # merge all province data into one common dataset
    path = Path(dataDir)
    files = sorted((path.glob('EN_GHG_IPCC_*.xlsx')))
    df_emissionsAgg = (
        pd.concat([read_eccc_ghg_inventory_fl(fl=fl) for fl in files], ignore_index=True)
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

    # ------------------------------------------
    # Tag table
    # ------------------------------------------
    tagDictList = [
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
    tags = ['country_reported_data']
    dataSourceTagDict = [{'datasource_id': datasource_id, 'tag_id': tag} for tag in tags]

    simple_write_csv(
        output_dir=outputDir,
        name='DataSourceTag',
        data=dataSourceTagDict,
        mode='w'
    )