if __name__ == '__main__':
    import concurrent.futures
    import os
    from pathlib import Path
    import pandas as pd
    from utils import make_dir
    from utils import write_to_csv
    from utils import iso3_to_iso2

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
        'id': 'climate_trace',
        'name': 'Climate TRACE',
        'URL': 'https://climatetrace.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'climate_trace:country_inventory',
        'name': 'climate TRACE: country inventory',
        'publisher': 'climate_trace',
        'published': '2022-12-02',
        'URL': 'https://climatetrace.org/inventory'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # read data from file
    df = pd.read_csv(fl)

    # get ISO2 from ISO3
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        results = [executor.submit(iso3_to_iso2, name, return_input=True)
                   for name in list(set(df['region']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # return ISO as dataframe
    df_iso = pd.DataFrame(data, columns=['iso3', 'iso2'])

    # merge datasets
    df_out = pd.merge(df, df_iso, left_on='region', right_on='iso3')

    df_out['emissions_id'] = df_out.apply(lambda row:
                                          f"climate_trace:{row['iso2']}:{row['year']}",
                                          axis=1)

    df_out['sector_id'] = df_out.apply(lambda row:
                                       f"climate_trace:sector:{row['sector/subsector']}",
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
                                          f"climate_trace:{row['actor_id']}:{row['year']}",
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
        'sector_id': [f"climate_trace:sector:{val}" for val in list(sectors.keys())],
        'name': list(sectors.values())}
    )

    df_sector['namespace'] = 'climate_trace:sector'
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
