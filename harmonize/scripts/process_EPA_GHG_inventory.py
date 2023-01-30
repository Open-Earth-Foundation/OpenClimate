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
    import concurrent.futures
    import os
    import pandas as pd
    from pathlib import Path
    import re
    from utils import df_wide_to_long
    from utils import state_to_iso2
    from utils import make_dir
    from utils import write_to_csv

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

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

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

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    # concatenate all the files
    df_concat = pd.concat([read_each_file(fl=fl)
                           for fl in files], ignore_index=True)

    # make "of" lowercase in "District Of Columbia"
    filt = df_concat['state'] == 'District Of Columbia'
    df_concat.loc[filt, 'state'] = 'District of Columbia'

    # get iso2 code from name
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        results = [executor.submit(state_to_iso2, name, return_input=True, is_part_of='US')
                   for name in list(set(df_concat['state']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # return iso2 as dataframe
    df_iso = pd.DataFrame(data, columns=['name', 'actor_id'])

    # merge datasets (wide, each year is a column)
    df_out = pd.merge(df_concat, df_iso,
                      left_on=["state"],
                      right_on=['name'],
                      how="left")

    # convert to metric tonnes
    df_out['total_emissions'] = df_out.apply(lambda row:
                                             row['total_emissions'] * 10**6,
                                             axis=1)

    # create datasource and emissions id
    df_out['datasource_id'] = datasourceDict['datasource_id']
    df_out['emissions_id'] = df_out.apply(lambda row:
                                          f"EPA_state_GHG_inventory:{row['actor_id']}:{row['year']}",
                                          axis=1)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df_out[emissionsAggColumns]

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

        tags = ['country_reported_data']

        for tag in tags:
            dataSourceTagDict = {
                'datasource_id': f"{datasourceDict['datasource_id']}",
                'tag_id': tag
            }

            write_to_csv(outputDir=outputDir,
                         tableName='DataSourceTag',
                         dataDict=dataSourceTagDict,
                         mode='a')
