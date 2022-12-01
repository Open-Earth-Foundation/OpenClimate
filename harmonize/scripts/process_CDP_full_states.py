if __name__ == "__main__":
    import numpy as np
    import os
    import pandas as pd
    from pathlib import Path
    from utils import make_dir
    from utils import write_to_csv
    from utils_cdp import harmonize_cdp_states_regions
    from utils_cdp import harmonize_cdp_states_targets

    # flags to run sections of code
    create_emissionsAgg = False
    create_targets = False

    # Create directory to store output
    outputDir = "../data/processed/CDP_full_states_regions/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to raw dataset
    #fl = '../data/raw/CDP_full_states_regions_2018_2019/2018_-_2019_Full_States_and_Regions_Dataset.csv'
    #fl = os.path.abspath(fl)

    datasets = {
        '2018': '../data/raw/CDP_full_states_regions_2018_2019/2018_-_2019_Full_States_and_Regions_Dataset.csv',
        '2019': '../data/raw/CDP_full_states_regions_2018_2019/2018_-_2019_Full_States_and_Regions_Dataset.csv',
        '2020': '../data/raw/CDP_full_states_regions_2020/2020_-_Full_States_and_Regions_Dataset.csv',
        '2021': '../data/raw/CDP_full_states_regions_2021/2021_Full_States_and_Regions_Dataset.csv',
        '2022': '../data/raw/CDP_full_states_regions_2022/2022_Full_States_and_Regions_Dataset.csv',
    }

    # path to climactor
    fl_climactor = '../resources/key_dict.csv'
    fl_climactor = os.path.abspath(fl_climactor)

    # -------------------------------------------
    # Publisher table
    # -------------------------------------------
    publisherDict = {
        'id': 'CDP',
        'name': 'Carbon Disclosure Project',
        'URL': 'https://www.cdp.net/en'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # -------------------------------------------
    # DataSource table
    # -------------------------------------------
    tableName = 'DataSource'
    file_path = Path(f"{outputDir}/{tableName}.csv")

    datasources = {
        '2018':  {
            'datasource_id': 'CDP_full_states_regions:2018-2019',
            'name': '2018-2019 Full States and Regions Dataset',
            'publisher': 'CDP',
            'published': '2020-04-30',
            'URL': 'https://data.cdp.net/States-and-Regions/2018-2019-Full-States-and-Regions-Dataset/hmhn-9g99'
        },
        '2019': {
            'datasource_id': 'CDP_full_states_regions:2018-2019',
            'name': '2018-2019 Full States and Regions Dataset',
            'publisher': 'CDP',
            'published': '2020-04-30',
            'URL': 'https://data.cdp.net/States-and-Regions/2018-2019-Full-States-and-Regions-Dataset/hmhn-9g99'
        },
        '2020': {
            'datasource_id': 'CDP_full_states_regions:2020',
            'name': '2020 Full States and Regions Dataset',
            'publisher': 'CDP',
            'published': '2021-07-15',
            'URL': 'https://data.cdp.net/Governance/2020-Full-States-and-Regions-Dataset/d4kx-9jfn'
        },
        '2021':  {
            'datasource_id': 'CDP_full_states_regions:2021',
            'name': '2021 Full States and Regions Dataset',
            'publisher': 'CDP',
            'published': '2022-05-06',
            'URL': 'https://data.cdp.net/Governance/2021-Full-States-and-Regions-Dataset/8t47-xqwz'
        },
        '2022':  {
            'datasource_id': 'CDP_full_states_regions:2022',
            'name': '2022 Full States and Regions Dataset',
            'publisher': 'CDP',
            'published': '2022-11-07',
            'URL': 'https://data.cdp.net/Governance/2022-Full-States-and-Regions-Dataset/4f7q-tgy5'
        }
    }

    # loop over dictionary of dataSources
    for _, datasourceDict in datasources.items():
        if (file_path.is_file()):
            if datasourceDict['datasource_id'] not in list(pd.read_csv(file_path)['datasource_id']):
                write_to_csv(outputDir=outputDir,
                             tableName=tableName,
                             dataDict=datasourceDict,
                             mode='a')
        else:
            write_to_csv(outputDir=outputDir,
                         tableName=tableName,
                         dataDict=datasourceDict,
                         mode='a')

    # -------------------------------------------
    # EmissionsAgg table
    # -------------------------------------------
    if create_emissionsAgg:
        df_list = []
        for reportingYear in np.arange(2018, 2023):
            reportingYear = str(reportingYear)
            datasourceDict = datasources[reportingYear]
            fl = datasets[reportingYear]
            fl = os.path.abspath(fl)
            df_list.append(harmonize_cdp_states_regions(
                fl=fl,
                fl_climactor=fl_climactor,
                reportingYear=reportingYear,
                datasourceDict=datasourceDict)
            )

        df_out = (pd.concat(df_list)
                  .sort_values(by=['actor_id', 'year'])
                  .drop_duplicates(subset=['emissions_id'], keep='last')
                  )

        # convert to csv
        df_out.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

        # -------------------------------------------
        # Tag table
        # -------------------------------------------
        if not Path(f"{outputDir}/Tag.csv").is_file():
            # create Tag file
            tagDictList = [
                {
                    'tag_id': 'self_reported',
                    'tag_name': 'self reported'
                }
            ]

            for tagDict in tagDictList:
                write_to_csv(outputDir=outputDir,
                             tableName='Tag',
                             dataDict=tagDict,
                             mode='a')

        # -------------------------------------------
        # DataSourceTag table
        # -------------------------------------------
        tableName = 'DataSourceTag'
        file_path = Path(f"{outputDir}/{tableName}.csv")

        if not file_path.is_file():
            tags = ['self_reported']
            for tag in tags:
                for _, datasourceDict in datasources.items():
                    dataSourceTagDict = {
                        'datasource_id': f"{datasourceDict['datasource_id']}",
                        'tag_id': tag
                    }

                    if (file_path.is_file()):
                        if datasourceDict['datasource_id'] not in list(pd.read_csv(file_path)['datasource_id']):
                            write_to_csv(outputDir=outputDir,
                                         tableName=tableName,
                                         dataDict=dataSourceTagDict,
                                         mode='a')

                    else:
                        write_to_csv(outputDir=outputDir,
                                     tableName=tableName,
                                     dataDict=dataSourceTagDict,
                                     mode='a')

    # -------------------------------------------
    # Target table
    # (Needs work, targets in differnt parts of questionnaire for each year)
    # -------------------------------------------
    if create_targets:
        df_list = []
        for reportingYear in np.arange(2018, 2021):
            reportingYear = str(reportingYear)
            datasourceDict = datasources[reportingYear]
            fl = datasets[reportingYear]
            fl = os.path.abspath(fl)
            df_list.append(harmonize_cdp_states_targets(
                fl=fl,
                reportingYear=reportingYear,
                fl_climactor=fl_climactor,
                datasourceDict=datasourceDict)
            )

        df_out = (pd.concat(df_list)
                  .sort_values(by=['actor_id', 'target_year'])
                  .drop_duplicates(subset=['target_id'], keep='last')
                  )

        # convert to csv
        df_out.to_csv(f'{outputDir}/Target.csv', index=False)
