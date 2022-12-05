if __name__ == "__main__":
    import concurrent.futures
    import os
    from pathlib import Path
    import pandas as pd
    from utils import df_wide_to_long
    from utils import iso3_to_iso2
    from utils import make_dir
    from utils import write_to_csv

    # where to create tables
    outputDir = "../data/processed/PIK_PRIMAPv2.4"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # PRIMPAP dataset
    fl = '../data/raw/PIK_PRIMAP-hist/Guetschow-et-al-2022-PRIMAP-hist_v2.4_no_extrap_11-Oct-2022.csv'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'PRIMAP',
        'name': 'Potsdam Realtime Integrated Model for probabilistic Assessment of emissions Path',
        'URL': 'https://www.pik-potsdam.de/paris-reality-check/primap-hist/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        'datasource_id': 'PRIMAP:10.5281/zenodo.7179775:v2.4',
        'name': 'PRIMAP-hist_v2.4_no_extrap (scenario=HISTCR)',
        'publisher': 'PRIMAP',
        'published': '2022-10-17',
        'URL': 'https://zenodo.org/record/7179775'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    # create emissionsAgg table
    df_pri = pd.read_csv(fl)

    # set values
    entity = 'KYOTOGHG (AR4GWP100)'
    category = 'M.0.EL'
    scenario = 'HISTCR'

    # filter PRIMAP dataset
    filt = (
        (df_pri['entity'] == entity) &
        (df_pri['category (IPCC2006_PRIMAP)'] == category) &
        (df_pri['scenario (PRIMAP-hist)'] == scenario)
    )

    # filtered dataset
    df_pri = df_pri.loc[filt]

    # get ISO data
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        results = [executor.submit(iso3_to_iso2, name, return_input=True)
                   for name in list(set(df_pri['area (ISO3)']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # return ISO as dataframe
    df_iso = pd.DataFrame(data, columns=['iso3', 'iso2'])

    # merge datasets
    df_merged = pd.merge(df_pri, df_iso,
                         left_on=['area (ISO3)'],
                         right_on=["iso3"],
                         how="left")

    # filter out ISO3 code ANT (netherland antilles)
    # The Netherlands Antilles dissolved on October 10, 2010
    filt = ~(df_merged['area (ISO3)'] == 'ANT')
    df_merged = df_merged.loc[filt]

    # convert from wide to long dataframe
    df_long = df_wide_to_long(df=df_merged,
                              value_name="emissions",
                              var_name="year")

    # drop custom iso codes, this is not totally necessary
    isoCodesToDrop = [
        'EARTH',
        'ANNEXI',
        'NONANNEXI',
        'AOSIS',
        'BASIC',
        'EU27BX',
        'LDC',
        'UMBRELLA',
        'ANT',
    ]

    filt = ~(df_long['area (ISO3)'].isin(isoCodesToDrop))
    df_long = df_long.loc[filt]

    # filter nan emissions
    filt = ~df_long['emissions'].isna()
    df_long = df_long.loc[filt]

    # rename columns
    df_long = df_long.rename(columns={'iso2': 'actor_id'})

    def gigagram_to_metric_ton(val):
        ''' 1 gigagram = 1000 tonnes  '''
        return val * 1000

    # create id columns
    df_long['datasource_id'] = datasourceDict['datasource_id']
    df_long['emissions_id'] = df_long.apply(lambda row:
                                            f"{row['source']}:{row['actor_id']}:{row['year']}",
                                            axis=1)

    # convert emissions to metric tons
    df_long['total_emissions'] = df_long['emissions'].apply(
        gigagram_to_metric_ton)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df_long[emissionsAggColumns]

    # ensure columns have correct types
    df_emissionsAgg = df_emissionsAgg.astype({'emissions_id': str,
                                              'actor_id': str,
                                              'year': int,
                                              'total_emissions': int,
                                              'datasource_id': str})

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # save to csv
    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDir}/EmissionsAgg.csv', index=False)

    # ------------------------------------------
    # Tag table
    # ------------------------------------------
    if not Path(f"{outputDir}/Tag.csv").is_file():
        # create Tag file
        tagDictList = [
            {
                'tag_id': 'combined_datasets',
                'tag_name': 'Combined datasets'
            },
            {
                'tag_id': 'country_or_3rd_party',
                'tag_name': 'Country-reported data or third party'
            },
            {
                'tag_id': 'peer_reviewed',
                'tag_name': 'Peer reviewed'
            }
        ]

        for tagDict in tagDictList:
            write_to_csv(outputDir=outputDir,
                         tableName='Tag',
                         dataDict=tagDict,
                         mode='a')

    # ------------------------------------------
    # DataSourceTag table
    # ------------------------------------------
    if not Path(f"{outputDir}/DataSourceTag.csv").is_file():

        tags = ['combined_datasets', 'country_or_3rd_party', 'peer_reviewed']

        for tag in tags:
            dataSourceTagDict = {
                'datasource_id': f"{datasourceDict['datasource_id']}",
                'tag_id': tag
            }

            write_to_csv(outputDir=outputDir,
                         tableName='DataSourceTag',
                         dataDict=dataSourceTagDict,
                         mode='a')
