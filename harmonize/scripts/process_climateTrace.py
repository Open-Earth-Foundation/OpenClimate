import csv
import concurrent.futures
from openclimate import Client
import os
from pathlib import Path
import pandas as pd
from typing import List
from typing import Dict
from utils import make_dir


client = Client()
def iso3_to_iso2(name):
    try:
        return (name, list(client.search(identifier=name)['actor_id'])[0])
    except:
        return (name, None)


def simple_write_csv(
    output_dir: str = None, name: str = None, rows: List[Dict] | Dict = None
) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f"{output_dir}/{name}.csv", mode="w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    # output directory
    outputDir = '../data/processed/climate_trace/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/climateTrace/climate_trace_emissions_inventory_20221201.csv'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'climate TRACE',
        'name': 'Climate TRACE',
        'URL': 'https://climatetrace.org/'
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'climateTRACE:country_inventory',
        'name': 'climate TRACE: country inventory',
        'publisher': 'climate TRACE',
        'published': '2022-12-02',
        'URL': 'https://climatetrace.org/inventory',
        'citation': 'Climate TRACE. (2022). Climate TRACE Emissions Inventory [Data set]. Climate TRACE. https://climatetrace.org/inventory'
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # read data from file
    df = pd.read_csv(fl)

    # get ISO2 from ISO3
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        results = [executor.submit(iso3_to_iso2, name)
                   for name in list(set(df['region']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # return ISO as dataframe
    df_iso = pd.DataFrame(data, columns=['iso3', 'iso2'])

    # manually add ISO2 code for Kosovo
    df_iso.loc[df_iso['iso3'] == 'XKX', 'iso2'] = 'XK'

    # merge datasets
    df_out = pd.merge(df, df_iso, left_on='region', right_on='iso3')

    df_out['emissions_id'] = df_out.apply(lambda row:
                                          f"climateTRACE:{row['iso2']}:{row['year']}",
                                          axis=1)

    df_out['sector_id'] = df_out.apply(lambda row:
                                       f"climateTRACE:sector:{row['sector/subsector']}",
                                       axis=1)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    # sum across sectors
    columns = ['iso2', 'year', 'co2e100']
    groupby_columns = ['iso2', 'year']
    df_tmp = df_out[columns].groupby(by=groupby_columns).sum().reset_index()

    # rename columns
    df_tmp = df_tmp.rename(
        columns={'iso2': 'actor_id', 'co2e100': 'total_emissions'})

    # datasource and emissions ids
    df_tmp['datasource_id'] = datasourceDict['datasource_id']

    df_tmp['emissions_id'] = df_tmp.apply(lambda row:
                                          f"climateTRACE:{row['actor_id']}:{row['year']}",
                                          axis=1)

    # clean up the column and make sure type is correct
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_tmp = df_tmp[emissionsAggColumns]

    # ensure columns have correct types
    df_tmp = df_tmp.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_emissionsAgg = df_tmp.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_emissionsAgg.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

    # =================================================================
    # sectors
    # (descriptions from https://climatetrace.org/inventory#data)
    # =================================================================
    sectors = {
        'agriculture': 'Greenhouse gas emissions from the growing of crops and livestock for food and raw materials for non-food consumption.',
        'buildings': 'Greenhouse gas emissions from onsite fuel combustion in residential, commercial and institutional buildings.',
        'fluorinated-gases': 'Greenhouse gas emissions from the release of fluorinated gases used in refrigeration, air-conditioning, transport, and industry.',
        'fossil-fuel-operations': 'Greenhouse gas emissions from oil and gas production, refining, and coal mining.',
        'manufacturing': 'Greenhouse gas emissions from cement, aluminum, steel, and other manufacturing processes.',
        'mineral-extraction': 'Greenhouse gas emissions from mining and quarrying of minerals and ores.',
        'power': 'Greenhouse gas emissions from electricity generation.',
        'transportation': 'Greenhouse gas emissions from on-road vehicles, aviation, shipping, railways and other modes of transportation.',
        'waste': 'Greenhouse gas emissions from solid waste disposal on land, wastewater, waste incineration and any other waste management activity.'
    }

    df_sector = pd.DataFrame({
        'sector_id': [f"climateTRACE:sector:{val}" for val in list(sectors.keys())],
        'name': list(sectors.values())}
    )

    df_sector['namespace'] = 'climateTRACE:sector'
    df_sector['datasource_id'] = datasourceDict['datasource_id']

    # clean up the column and make sure type is correct
    sectorColumns = [
        "sector_id",
        "name",
        "namespace",
        "datasource_id"
    ]

    df_sector = df_sector[sectorColumns]

    # ensure columns have correct types
    df_sector = df_sector.astype({
        'sector_id': str,
        'name': str,
        'namespace': str,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_sector = df_sector.sort_values(by=['sector_id'])

    # convert to csv
    df_sector.to_csv(f'{outputDir}/Sector.csv', index=False)

    # =================================================================
    # EmissionsBySector
    # =================================================================
    emissionsBySectorColumns = [
        "emissions_id",
        "sector_id",
        "co2e100"
    ]

    df_emissionsBySector = (
        df_out[emissionsBySectorColumns]
        .rename(columns={'co2e100': 'emissions_value'})
        .astype({
            'emissions_id': str,
            'sector_id': str,
            'emissions_value': int
        })
    )

    # convert to csv
    df_emissionsBySector.to_csv(
        f'{outputDir}/EmissionsBySector.csv', index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "GHGs_included_CO2_CH4_N2O": "GHGs included: CO2, CH4, and N2O",
        "GWP_100_AR6": "Uses GWP100 from IPCC AR6",
        "Sectors_included_in_climateTrace": "Sectors: agriculture, buildings, fluorinated-gases, fossil-fuel-operations, manufacturing, mineral-extraction, power, transportation, and waste",
        "estimates_from_satellite_remote_sensing_and_AI": "Estimates derived using satellite retrievals, remote-sensing, and artificial intelligence",
        "EDGAR_data": "Includes some data from the EDGAR database",
        "FAOSTAT_data": "Includes some data from FAOSTAT"
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)