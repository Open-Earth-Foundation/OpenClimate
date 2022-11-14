if __name__ == "__main__":
    import os
    from pathlib import Path
    from utils import make_dir
    from utils import write_to_csv
    from harmonize import harmonize_cdp_states_regions_emissions
    from harmonize import harmonize_cdp_states_regions_targets

    # Create directory to store output
    outputDir = "../data/processed/CDP_full_states_regions_2022/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())
    
    # path to raw dataset
    fl = '../data/raw/CDP_full_states_regions_2022/2022_Full_States_and_Regions_Dataset.csv'
    fl = os.path.abspath(fl)

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
    datasourceDict = {
        'datasource_id': 'CDP_full_states_regions:2022',
        'name': '2022 Full States and Regions Dataset',
        'publisher': 'CDP',
        'published': '2022-11-07',
        'URL': 'https://data.cdp.net/Governance/2022-Full-States-and-Regions-Dataset/4f7q-tgy5'
    }

    write_to_csv(outputDir=outputDir, 
                 tableName='DataSource', 
                 dataDict=datasourceDict, 
                 mode='w')

    # -------------------------------------------
    # EmissionsAgg table
    # -------------------------------------------
    df_out = harmonize_cdp_states_regions_emissions(
        fl=fl, 
        fl_climactor=fl_climactor,
        datasourceDict=datasourceDict
    )
    
    # convert to csv
    df_out.drop_duplicates().to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)
    
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
    if not Path(f"{outputDir}/DataSourceTag.csv").is_file():
        
        tags = ['self_reported']
        
        for tag in tags:
            dataSourceTagDict = {
                'datasource_id': f"{datasourceDict['datasource_id']}",
                'tag_id': tag
            }

            write_to_csv(outputDir=outputDir, 
                     tableName='DataSourceTag', 
                     dataDict=dataSourceTagDict, 
                     mode='a')
            
    # -------------------------------------------
    # Target table
    # -------------------------------------------
    df_targets = harmonize_cdp_states_regions_targets(
            fl=fl,
            fl_climactor=fl_climactor,
            datasourceDict=datasourceDict)

    df_targets.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
