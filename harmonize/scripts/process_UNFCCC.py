if __name__ == "__main__":
    import concurrent.futures
    import numpy as np
    import os
    from pathlib import Path
    import pandas as pd
    from utils import df_wide_to_long
    from utils import country_to_iso2
    from utils import make_dir
    from utils import write_to_csv

    # where to create tables
    outputDir = "../data/processed/UNFCCC_Annex1"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # PRIMPAP dataset
    fl = ('../data/raw/UNFCCC_Annex1/'
          'Time Series - GHG total without LULUCF, in kt CO₂ equivalent.xlsx')
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'UNFCCC',
        'name': 'The United Nations Framework Convention on Climate Change',
        'URL': 'https://unfccc.int'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        'datasource_id': 'UNFCCC:GHG_ANNEX1:2019-11-08',
        'name': 'UNFCCC GHG total without LULUCF, ANNEX I countries',
        'publisher': 'UNFCCC',
        'published': '2019-11-08',
        'URL': 'https://di.unfccc.int/time_series'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    # create unfccc
    df = pd.read_excel(fl, skiprows=2, na_values=True)
    df_tmp = df.copy()
    first_row_with_all_NaN = df[df.isnull().all(
        axis=1) == True].index.tolist()[0]
    df = df.loc[0:first_row_with_all_NaN-1]

    # this is necessary for df_wide_to_long to work
    df = df.rename(columns={'Last Inventory Year (2020)': '2020'})

    # filter out European Union
    filt = ~(df['Party'].str.contains('European Union'))
    df = df.loc[filt]

    # TODO: this is a temporary fix while the ActorName table is being updated
    filt = df['Party'] == 'United Kingdom of Great Britain and Northern Ireland'
    df.loc[filt, 'Party'] = 'The United Kingdom of Great Britain and Northern Ireland'

    # get iso2 code from name
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        results = [executor.submit(country_to_iso2, name, return_input=True)
                   for name in list(set(df['Party']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # return iso2 as dataframe
    df_iso = pd.DataFrame(data, columns=['name', 'iso2'])

    # merge datasets (wide, each year is a column)
    df_wide = pd.merge(df, df_iso,
                       left_on=["Party"],
                       right_on=['name'],
                       how="left")

    # convert from wide to long dataframe (was def_merged_long)
    df_long = df_wide_to_long(df=df_wide,
                              value_name="emissions",
                              var_name="year")

    # rename columns
    df = df_long.rename(columns={'iso2': 'actor_id'})

    # convert year to int
    df['year'] = df['year'].astype('int16')

    # create datasource_id
    df['datasource_id'] = datasourceDict['datasource_id']

    # create emissions_id
    df['emissions_id'] = df.apply(lambda row:
                                  f"UNFCCC-annex1-GHG:{row['actor_id']}:{row['year']}",
                                  axis=1)

    # CO₂ total without LULUCF, in kt
    def kilotonne_to_metric_ton(val):
        ''' 1 Kilotonne = 1000 tonnes  '''
        return val * 1000

    df['total_emissions'] = df['emissions'].apply(kilotonne_to_metric_ton)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df[emissionsAggColumns]

    # ensure data has correct types
    df_emissionsAgg = df_emissionsAgg.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

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
                'tag_id': '3d_party_validated',
                'tag_name': 'Third party validated'
            },
            {
                'tag_id': 'country_reported_data',
                'tag_name': 'Country-reported data'
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

        tags = ['country_reported_data', '3d_party_validated']

        for tag in tags:
            dataSourceTagDict = {
                'datasource_id': f"{datasourceDict['datasource_id']}",
                'tag_id': tag
            }

            write_to_csv(outputDir=outputDir,
                         tableName='DataSourceTag',
                         dataDict=dataSourceTagDict,
                         mode='a')
