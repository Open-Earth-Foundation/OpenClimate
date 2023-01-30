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
    import os
    import pathlib
    from pathlib import Path
    import pandas as pd
    import re
    from utils import df_wide_to_long
    from utils import make_dir
    from utils import write_to_csv
    from utils import df_columns_as_str
    from utils import df_drop_unnamed_columns

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

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

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

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    # merge all province data into one common dataset
    path = Path(dataDir)
    files = sorted((path.glob('EN_GHG_IPCC_*.xlsx')))
    df_out = pd.concat([read_eccc_ghg_inventory_fl(fl=fl)
                        for fl in files], ignore_index=True)

    # convert emissions to tonnes
    if set(df_out['units']) == {'kt CO2  eq'}:
        df_out['emissions'] = df_out['emissions'] * 10**3
        df_out = df_out.rename(columns={'emissions': 'total_emissions'})

    # create datasource and emissions id
    df_out['datasource_id'] = datasourceDict['datasource_id']
    df_out['emissions_id'] = df_out.apply(lambda row:
                                          f"ECCC_GHG_inventory:{row['actor_id']}:{row['year']}",
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
