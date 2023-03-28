import csv
import os
import pandas as pd
from pathlib import Path
import re
from typing import List
from typing import Dict
from utils import make_dir

def simple_write_csv(
    output_dir: str = None, name: str = None, rows: List[Dict] | Dict = None
) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f"{output_dir}/{name}.csv", mode="w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

def to_camelcase(value):
    # Replace non-alphanumeric characters with underscores
    # Replace consecutive underscores with a single underscore
    new_value = re.sub(r'[^a-zA-Z0-9]+', '_', value)
    new_value = re.sub(r'_+', '_', new_value)
    new_value = new_value.lower()
    new_value = new_value.rstrip('_')
    return new_value

if __name__ == "__main__":
    # output directory
    outputDir = "../data/processed/cui_etal_v1"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # input data files
    fl = '../data/raw/cui_etal_v1/Dataset_Daily_CO2_31Provincial_MonPow_MonInd_YearVeh_2019_2020_week_holiday.xlsx'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        "id": "Cui et al., (2021)",
        "name": "Daily CO2 emission for China's provinces in 2019 and 2020",
        "URL": "https://essd.copernicus.org/preprints/essd-2021-153/essd-2021-153.pdf",
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        "datasource_id": "cui_etal_2021:CO2_china_provinces:v1",
        "name": "Daily CO2 emission for China's provinces in 2019 and 2020",
        "publisher": publisherDict["id"],
        "published": "2021-04-30",
        "URL": "https://zenodo.org/record/4730175",
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    df = pd.read_excel(fl, sheet_name='Total2019-2020', header=0, parse_dates=['Date'])
    filt = ~((df['Date'].isnull()) | (df['Date']=='total'))
    df = df.loc[filt]

    df['Date'] = pd.to_datetime(df['Date'])

    kwargs_melt = dict(
        value_vars = [col for col in df.columns if col not in ["Date"]],
        id_vars = ["Date"],
        var_name = "Provinces",
        value_name = f"emissions"
    )

    # The country names are listed in the manuscript
    replace_dict = {'Provinces':
        {
            'HUN': 'HN',
            'SAX': 'SN',
            'IM': 'NM',
            'HAN': 'HI',
            'Tibet': 'XZ',
            'HLJ': 'HL',
            'HUB': 'HB',
            'HEB': 'HE',
            'HEN': 'HA',
        }
    }

    df_tmp = (
        df.melt(**kwargs_melt)
        .replace(replace_dict)
    )

    df_tmp['year'] = df_tmp['Date'].dt.year
    df_tmp['month'] = df_tmp['Date'].dt.month
    df_tmp['day'] = df_tmp['Date'].dt.day

    publisher_id = to_camelcase(publisherDict['id'])

    astype_dict = {
        'emissions_id':str,
        'actor_id':str,
        'year':int,
        'total_emissions':int,
        'datasource_id': str
    }

    df_emissionsAgg = (
        df_tmp
        .groupby(['Provinces', 'year'])
        .sum(numeric_only=True)
        .reset_index()
        .assign(actor_id = lambda x: x.apply(lambda row: f"CN-{row['Provinces']}", axis=1))
        .assign(emissions_id = lambda x: x.apply(lambda row: f"{publisher_id}:{row['actor_id']}:{row['year']}", axis=1))
        .assign(datasource_id=datasourceDict['datasource_id'])
        .assign(total_emissions = lambda x: x.apply(lambda row: row['emissions'] * 10**6, axis=1))
        .astype(astype_dict)
        .loc[:, tuple(astype_dict.keys())]
                )

    # convert to csv
    df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "co2_only": "CO2 only",
        "power_industry_and_ground_transport": "Sectors: power, industry and ground transport",
        "province_fraction_of_national":"Province emissions estimated as a fraction of national emissions"
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)
