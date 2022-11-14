if __name__ == "__main__":
    import pandas as pd
    import csv
    from pathlib import Path
    from utils import make_dir
    from utils import write_to_csv
    import os

    # Create directory to store output
    outputDir = "../data/processed/C2ES_canadian_ghg_targets/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())
    
    # path to CDP2022 dataset
    fl='../data/raw/C2ES_canadian_ghg_targets/Canada-provinces-c2es-targets.csv'
    fl = os.path.abspath(fl)
    
    # -------------------------------------------
    # Publisher table
    # -------------------------------------------
    publisherDict = {
        'id': 'C2ES',
        'name': 'Center for Climate and Energy Solutions',
        'URL': 'https://www.c2es.org/'
    }

    # create publisher, methodology, datasrouce tables
    write_to_csv(outputDir=outputDir, 
                 tableName='Publisher', 
                 dataDict=publisherDict, 
                 mode='w')


    # -------------------------------------------
    # DataSource table
    # -------------------------------------------
    datasourceDict = {
        'datasource_id': 'C2ES:canadian_GHG_targets',
        'name': 'Canadian Provincial GHG Emissions Targets',
        'publisher': 'C2ES',
        'published': '2022-11-13',
        'URL': 'https://www.c2es.org/document/canadian-provincial-ghg-emission-targets/'
    }
    
    write_to_csv(outputDir=outputDir, 
                 tableName='DataSource', 
                 dataDict=datasourceDict, 
                 mode='w')

    # -------------------------------------------
    # Target table
    # -------------------------------------------
    df = pd.read_csv(fl)
    
    # add IDs
    df['datasource_id'] = datasourceDict['datasource_id']

    df['target_id'] = df.apply(lambda row: 
                               f"C2ES:{row['actor_id']}:{row['target_year']}", 
                               axis=1)

    # final columns
    columns = [
        'target_id', 
        'actor_id', 
        'target_type', 
        'baseline_year',
        'target_year',
        'target_value', 
        'target_unit',
        'URL', 
        'datasource_id'
    ]

    df = df[columns]

    # ensure data has correct types
    df = df.astype(
        {
        'target_id': str,
        'actor_id': str,
        'target_type': str,
        'baseline_year': int,
        'target_year': int,
        'target_value': int,
        'target_unit': str,
        'datasource_id': str
        }
    )

    # sort by actor_id and target_year
    df_final = df.sort_values(by=['actor_id', 'target_year'])

    # save as csv
    df_final.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
    
