import csv
import itertools
from openclimate import Client
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

def get_city_and_province(fl, city):
    df = pd.read_excel(fl, sheet_name=city)
    return (
        df[['city', 'Province']]
        .drop_duplicates()
        .to_dict(orient='records')
    )

if __name__ == "__main__":
    # output directory
    outputDir = "../data/processed/huo_etal_2022"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # input data files
    fl = '../data/raw/huo_etal_2022/CMCC_48_cities_v0629.xlsx'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        "id": "Huo et al., (2022)",
        "name": "Near-real-time daily estimates of fossil fuel CO2 emissions from major high-emission cities in China",
        "URL": "https://www.nature.com/articles/s41597-022-01796-3#Sec14",
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        "datasource_id": "huo_etal_2022:CMCC:v2",
        "name": "Carbon Monitor Cities-China (CMCC)",
        "publisher": publisherDict["id"],
        "published": "2022-09-20",
        "URL": "https://doi.org/10.6084/m9.figshare.20264277.v2",
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    # make sure openclimate.Client is imported
    client = Client()

    cities = pd.ExcelFile(fl).sheet_names
    out = []
    for city in cities:
        out.append(get_city_and_province(fl, city))

    output = list(itertools.chain(*out))
    df_city = pd.DataFrame(output)

    df_city['Province'] = df_city['Province'].replace('Inner Mongolia', 'Nei Mongol Zizhiqu')

    out = []
    for province in set(df_city['Province']):
        df_tmp = client.search(query=province)
        actor_id = list(df_tmp.loc[df_tmp['type'] == 'adm1', 'actor_id'])[0]
        name = list(df_tmp.loc[df_tmp['type'] == 'adm1', 'name'])
        out.append({'Province':province, 'is_part_of':actor_id})

    df_iso = pd.DataFrame(out)

    df_city = pd.merge(df_city, df_iso, on='Province')

    # Still missing: "Tangshan", "Luliang", "Yulin"
    replace_dict = {
        'city':
        {
            "Xi'an": "Xian"
        }
    }

    df_city = df_city.replace(replace_dict)

    provinces = set(df_city['is_part_of'])
    out=[]
    for is_part_of in provinces:
        cities_to_find = list(df_city.loc[df_city['is_part_of']==is_part_of, 'city'])
        for city in cities_to_find:
            try:
                parts = client.parts(is_part_of, part_type='city')
                actor_id = list(parts.loc[parts['name'] == city, 'actor_id'])[0]
                out.append({'city': city, 'actor_id': actor_id})
            except:
                continue

    df_locode = pd.DataFrame(out)
    df_out = pd.merge(df_city, df_locode, on='city')

    # now get emissions
    cities = pd.ExcelFile(fl).sheet_names
    df_tmp = (
        pd.concat([pd.read_excel(fl, sheet_name=city) for city in cities])
        .assign(date=lambda x: pd.to_datetime(x['date'], dayfirst=True))
        .assign(year=lambda x: x['date'].dt.year)
        .groupby(by=['year', 'city', 'Province'])
        ['value (KtCO2 per day)'].sum()
        .reset_index()
    )

    df_out = pd.merge(df_tmp, df_out, on=['city','Province'])
    df_out['total_emissions'] = df_out['value (KtCO2 per day)'] * 10**3
    df_out['datasource_id'] = datasourceDict['datasource_id']

    publisher_id = to_camelcase(publisherDict['id'])
    df_out = df_out.assign(emissions_id = lambda x: x.apply(lambda row: f"{publisher_id}:{row['actor_id']}:{row['year']}", axis=1))

    astype_dict = {
        'emissions_id':str,
        'actor_id':str,
        'year':int,
        'total_emissions':int,
        'datasource_id': str
    }

    df_emissionsAgg = df_out.astype(astype_dict).loc[:, tuple(astype_dict.keys())]

    # convert to csv
    df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "co2_only": "CO2 only",
        "power_residential_industry_ground_transport_aviation": "Sectors: power, residential, industry,  ground transport, and aviation",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)
