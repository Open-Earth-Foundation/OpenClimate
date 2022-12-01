if __name__ == "__main__":
    import numpy as np
    import os
    import pandas as pd
    from pathlib import Path
    from utils import make_dir
    from utils import write_to_csv
    from utils_cdp import harmonize_cdp_city_emissions

    # Create directory to store output
    outputDir = "../data/processed/CDP_citywide_emissions/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to raw dataset
    #fl = '../data/raw/CDP_full_states_regions_2018_2019/2018_-_2019_Full_States_and_Regions_Dataset.csv'
    #fl = os.path.abspath(fl)

    datasets = {
        '2016': '../data/raw/CDP_citywide_emissions_2016/2016_-_Citywide_GHG_Emissions.csv',
        '2017': '../data/raw/CDP_citywide_emissions_2017/2017_-_Cities_Community_Wide_Emissions.csv',
        '2018': '../data/raw/CDP_citywide_emissions_2018/2018_City-wide_Emissions.csv',
        '2019': '../data/raw/CDP_citywide_emissions_2019/2019_City-wide_Emissions.csv',
        '2020': '../data/raw/CDP_citywide_emissions_2020/2020_-_City-Wide_Emissions.csv',
        '2021': '../data/raw/CDP_citywide_emissions_2021/2021_City-wide_Emissions.csv',
    }

    # path to climactor
    fl_climactor = '../resources/country_dict_updated.csv'
    fl_climactor = os.path.abspath(fl_climactor)

    fl_climactor_city = '../resources/key_dict.csv'
    fl_climactor_city = os.path.abspath(fl_climactor_city)

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
        '2016': {
            'datasource_id': 'CDP_citywide_ghg_emissions:2016',
            'name': '2016 - Citywide GHG Emissions',
            'publisher': 'CDP',
            'published': '2018-10-04',
            'URL': 'https://data.cdp.net/Emissions/2016-Citywide-GHG-Emissions/dfed-thx7'
        },
        '2017':  {
            'datasource_id': 'CDP_citywide_community_emissions:2017',
            'name': '2017 - Cities Community Wide Emissions',
            'publisher': 'CDP',
            'published': '2018-10-04',
            'URL': 'https://data.cdp.net/Emissions/2017-Cities-Community-Wide-Emissions/kyi6-dk5h'
        },
        '2018':  {
            'datasource_id': 'CDP_citywide_emissions:2018',
            'name': '2018 - City-wide Emissions',
            'publisher': 'CDP',
            'published': '2020-04-30',
            'URL': 'https://data.cdp.net/Emissions/2018-City-wide-Emissions/wii4-buw5'
        },
        '2019': {
            'datasource_id': 'CDP_citywide_emissions:2019',
            'name': '2019 - City-wide Emissions',
            'publisher': 'CDP',
            'published': '2021-03-01',
            'URL': 'https://data.cdp.net/Emissions/2019-City-wide-Emissions/542d-zyj8'
        },
        '2020': {
            'datasource_id': 'CDP_citywide_emissions:2020',
            'name': '2020 - City-wide Emissions',
            'publisher': 'CDP',
            'published': '2021-07-15',
            'URL': 'https://data.cdp.net/Emissions/2020-City-Wide-Emissions/p43t-fbkj'
        },
        '2021':  {
            'datasource_id': 'CDP_citywide_emissions:2021',
            'name': '2021 - City-wide Emissions',
            'publisher': 'CDP',
            'published': '2021-12-24',
            'URL': 'https://data.cdp.net/Emissions/2021-City-wide-Emissions/tmta-7i7p'
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

    df_list = []
    for reportingYear in np.arange(2016, 2022):
        reportingYear = str(reportingYear)
        datasourceDict = datasources[reportingYear]
        fl = datasets[reportingYear]
        fl = os.path.abspath(fl)

        # harmonize_cdp_city_emissions(fl=None, fl_climactor=None, fl_climactor_city=None, reportingYear=None, datasourceDict=None):
        df_list.append(harmonize_cdp_city_emissions(
            fl=fl,
            fl_climactor=fl_climactor,
            fl_climactor_city=fl_climactor_city,
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
    # -------------------------------------------
    # df_target_2018 = harmonize_targets(
    #    fl=fl,
    #    reportingYear=2018,
    #    fl_climactor=fl_climactor,
    #    datasourceDict=datasourceDict
    # )

    # df_target_2019 = harmonize_targets(
    #    fl=fl,
    #    reportingYear=2019,
    #    fl_climactor=fl_climactor,
    #    datasourceDict=datasourceDict
    # )

    # merge 2018 and 2019 together, sort the values
    #df_targets = pd.concat([df_target_2018, df_target_2019], ignore_index=True)
    #df_targets = df_targets.sort_values(by=['actor_id', 'target_year'])

    #df_targets.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
