if __name__ == "__main__":
    import os
    import pandas as pd
    from pathlib import Path
    from utils import make_dir
    from utils import write_to_csv

    # Create directory to store output
    outputDir = "../data/processed/C2ES_US_ghg_targets/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to dataset
    fl = '../data/raw/C2ES_US_ghg_targets/US-states-c2es-targets.csv'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'C2ES',
        'name': 'Center for Climate and Energy Solutions',
        'URL': 'https://www.c2es.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    dataSourceDict = {
        'datasource_id': 'C2ES:US_GHG_targets',
        'name': 'U.S. State Greenhouse Gas Emission Targets',
        'publisher': 'C2ES',
        'published': '2022-08-01',
        'URL': 'https://www.c2es.org/document/greenhouse-gas-emissions-targets/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=dataSourceDict,
                 mode='w')

    # ------------------------------------------
    # Target table
    # ------------------------------------------
    df = pd.read_csv(fl)

    # create datasource_id
    df['datasource_id'] = dataSourceDict['datasource_id']

    # create emissions_id columns
    df['target_id'] = df.apply(lambda row:
                               f"{dataSourceDict['publisher']}:{row['actor_id']}:{row['target_year']}",
                               axis=1)

    # select relevant columns
    columns = [
        "target_id",
        "actor_id",
        "target_type",
        "baseline_year",
        "target_year",
        "target_value",
        'target_unit',
        "URL",
        "datasource_id",
    ]

    df_out = df[columns]

    # ensure type is correct
    df_out = df_out.astype({
        "target_id": str,
        "actor_id": str,
        "target_type": str,
        "baseline_year": int,
        "target_year": int,
        "target_value": int,
        'target_unit': str,
        "URL": str,
        "datasource_id": str
    })

    # sort by actor_id and target_year
    df_out = df_out.sort_values(by=['actor_id', 'target_year'])

    # save as csv
    df_out.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
