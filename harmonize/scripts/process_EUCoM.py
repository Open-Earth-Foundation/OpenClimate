if __name__ == "__main__":
    import os
    from pathlib import Path
    from utils import harmonize_eucom_emissions
    from utils import harmonize_eucom_pledges
    from utils import make_dir
    from utils import write_to_csv

    # where to create tables
    outputDir = "../data/processed/DDL-EUCoM-compilation"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # dataset
    fl = '../data/raw/DDL-EUCoM-compilation/EUCovenantofMayors2022_clean_NCI_7Jun22.csv'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        "id": "DDL",
        "name": "Data-Driven EnviroLab",
        "URL": "https://datadrivenlab.org/"
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    dataSourceDict = {
        "datasource_id": 'DDL:EUCoM-compilation:2022',
        "name": 'DDL EUCoM compilation',
        "publisher": f"{publisherDict['id']}",
        "published": '2022-01-01',
        "URL": 'https://datadrivenlab.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=dataSourceDict,
                 mode='w')

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    df_emissionsAgg = harmonize_eucom_emissions(fl=fl,
                                                datasourceDict=dataSourceDict)

    # save to csv
    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDir}/EmissionsAgg.csv', index=False)

    # ------------------------------------------
    # Target
    # ------------------------------------------
    df_target = harmonize_eucom_pledges(fl=fl,
                                        datasourceDict=dataSourceDict)

    # convert to csv
    df_target.drop_duplicates().to_csv(
        f'{outputDir}/Target.csv', index=False)

    # ------------------------------------------
    # Tag table
    # ------------------------------------------
    if not Path(f"{outputDir}/Tag.csv").is_file():
        # create Tag file
        tagDictList = [
            {
                'tag_id': 'city_reported_data',
                'tag_name': 'City-reported data'
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

        tags = ['city_reported_data']

        for tag in tags:
            dataSourceTagDict = {
                'datasource_id': f"{dataSourceDict['datasource_id']}",
                'tag_id': tag
            }

            write_to_csv(outputDir=outputDir,
                         tableName='DataSourceTag',
                         dataDict=dataSourceTagDict,
                         mode='a')
