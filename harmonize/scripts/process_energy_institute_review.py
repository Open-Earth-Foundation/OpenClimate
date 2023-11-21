import csv
import os
from pathlib import Path
import pandas as pd
import pycountry
from typing import List
from typing import Dict
from utils import make_dir
from utils import df_wide_to_long


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
    outputDir = '../data/processed/energy_institute_review/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/energy_institute_review/Statistical Review of World Energy Data.xlsx'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'energy_institute',
        'name': 'Energy Institute',
        'URL': 'https://www.energyinst.org/'
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'energy_institute_statistical_review_2023',
        'name': '2023 Statistical Review of World Energy',
        'publisher': f"{publisherDict['id']}",
        'published': '2023-01-01',
        'URL': 'https://www.energyinst.org/statistical-review',
        'citation': 'Energy Institute. (2023). Statistical Review of World Energy [Data set]. EI. https://www.energyinst.org/statistical-review'
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    xl = pd.ExcelFile(fl)
    sheets = xl.sheet_names

    replace_dict = {
        'Trinidad & Tobago': 'Trinidad and Tobago',
        'China Hong Kong SAR': 'China',
        'Iran': 'Iran, Islamic Republic of'
    }

    drop_columns = ['2022.1', '2012-22', '2022.2']
    rename_columns = {'Million tonnes of carbon dioxide equivalent': 'country'}
    country_groups = ['Central America', 'Eastern Africa', 'Middle Africa', 'Western Africa']
    not_countries = ["Source:", "Notes:", "Growth", "Data ", "European Union", "OECD", "0.05%", "Other "]

    df = (
        pd.read_excel(fl, sheet_name='CO2e Emissions', header=2)
        .drop(columns = drop_columns)
        .rename(columns = rename_columns)
        .loc[lambda x: x['country'].notnull()]
        .loc[lambda x: ~x['country'].str.contains('total', case=False)]
        .loc[lambda x: ~x['country'].isin(country_groups)]
        .loc[lambda x:  ~(x['country'].str.contains('|'.join(not_countries)))]
        .assign(country = lambda x: x.country.replace(replace_dict))
    )

    # reshape dataframe
    df = df_wide_to_long(df, value_name='emissions', var_name='year')

    # convert from million metric tones to metric tonnes
    df['total_emissions'] = df['emissions'].apply(lambda x: x * 10**6)

    # get actor_id from country name
    df_iso = pd.DataFrame(
        data=[(name, country_lookup(name)) for name in set(list(df.country))],
        columns=['country', 'actor_id']
    )

    if not_found:=list(df_iso.loc[df_iso['actor_id'].isnull(), 'country']):
        print(f"Countries not found: {not_found}")

    df_out = pd.merge(df, df_iso, on=['country'])

    # sum across actors, needed because we are including Hong Kong as part of China
    df_out = df_out.groupby(by=['actor_id', 'year']).sum(numeric_only=True).reset_index()

    # create datasource_id
    df_out = df_out.assign(datasource_id = datasourceDict['datasource_id'])
    df_out['emissions_id'] = df_out.apply(
        lambda row: f"energy_institute_statistical_review_2023:{row['actor_id']}:{row['year']}", axis=1)

    # check types and sort
    astype_dict = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }
    emissionsAggColumns = astype_dict.keys()

    df_emissionsAgg = (
        df_out[emissionsAggColumns]
        .astype(astype_dict)
        .sort_values(by=['actor_id', 'year'])
    )

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_emissionsAgg.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        'GHGs_included_CO2_and_CH4': 'GHGs included: CO2 and CH4',
        'production_consumption_emissions_energy_processing_and_flaring': 'Production and consumption emissions from energy, process emissions, and flaring',
        'primary_source': 'Primary source: emissions derived from activity data'
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)