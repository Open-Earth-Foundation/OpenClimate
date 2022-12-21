import csv
import concurrent.futures
import os
from pathlib import Path
import pandas as pd
from typing import List
from typing import Dict
from utils import make_dir
from utils import write_to_csv
from utils import country_to_iso2


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
    outputDir = '../data/processed/GCB_2022/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/global_carbon_budget_2022/National_Fossil_Carbon_Emissions_2022v1.0.xlsx'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'GCP',
        'name': 'Global Carbon Project',
        'URL': 'https://www.globalcarbonproject.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'GCB2022:national_fossil_emissions:v1.0',
        'name': 'Data supplement to the Global Carbon Budget 2022: National Fossil Carbon Emissions 2022 v1.0',
        'publisher': 'GCP',
        'published': '2022-11-04',
        'URL': 'https://www.icos-cp.eu/science-and-impact/global-carbon-budget/2022'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # =================================================================
    # EmissionsAgg
    # =================================================================
    #xl = pd.ExcelFile(fl)
    #sheets = xl.sheet_names

    # regions to drop
    df_regions = pd.read_excel(fl, sheet_name='Regions', names=[
                               'region', 'countries'])
    columns_to_drop = list(
        df_regions['region']) + ['KP Annex B', 'Bunkers', 'Statistical Difference', 'World']

    # raw dataset
    df = pd.read_excel(fl, header=11, sheet_name='Territorial Emissions').rename(
        columns={'Unnamed: 0': 'year'})

    # Drop the columns
    df = df.drop(columns=columns_to_drop)

    # change these names so can grab actor_id from openClimate API
    change_dictionary = {
        "Bonaire, Saint Eustatius and Saba": "Bonaire, Sint Eustatius and Saba",
        "Czech Republic": "Czechia",
        "Faeroe Islands": "Faroe Islands",
        "Wallis and Futuna Islands": "Wallis and Futuna",
        "Laos": "Lao People's Democratic Republic",
        "Occupied Palestinian Territory": "Palestine",
        "Turkey": "Türkiye",
        "Cape Verde": "Cabo Verde",
        "North Korea": "Korea, the Democratic People's Republic of",
        "South Korea": "The Republic of Korea",
        "Swaziland": "Eswatini",
    }

    df = df.rename(columns=change_dictionary)

    # country name to iso2
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(country_to_iso2, name, return_input=True)
                   for name in list(set(df.columns))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # put iso code in dataframe
    df_iso = pd.DataFrame(data, columns=['name', 'actor_id'])

    # country columns
    columns = list(df.columns)
    columns.remove('year')

    # convert country to separte column
    df_out = pd.melt(df, id_vars=['year'], value_vars=columns,
                     var_name='Country', value_name='Emissions')

    # merge iso codes
    df_out = pd.merge(df_out, df_iso, left_on=['Country'], right_on=['name'])

    # create datasource_id
    df_out['datasource_id'] = datasourceDict['datasource_id']

    # conversion
    # All values in million tonnes of carbon per year.
    # For values in million tonnes of CO2 per year, multiply the values below by 3.664
    million_tonnes_to_tonnnes = 10**6
    C_to_CO2 = 3.664

    # convert emissions from million tonnes Carbon to tonnes CO2
    df_out['total_emissions'] = df_out['Emissions'].apply(
        lambda x: x * million_tonnes_to_tonnnes * C_to_CO2)

    # create emissions ID
    df_out['emissions_id'] = df_out.apply(
        lambda row: f"GCB2022:{row['actor_id']}:{row['year']}", axis=1)

    # remove null values in total_emissions
    df_out = df_out.loc[df_out['total_emissions'].notnull()]

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df_out[emissionsAggColumns]

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
    tagDictList = [{'tag_id': 'fossil_co2',
                    'tag_name': 'Fossil CO2'}]
    simple_write_csv(outputDir, 'Tag', tagDictList)

    dataSourceTagDictList = [
        {'datasource_id': datasourceDict['datasource_id'], 'tag_id': tag['tag_id']} for tag in tagDictList]
    simple_write_csv(outputDir, 'DataSourceTag', dataSourceTagDictList)
