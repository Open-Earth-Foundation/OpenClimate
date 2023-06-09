import csv
import os
import pandas as pd
from pathlib import Path
from typing import List
from typing import Dict
from utils import make_dir

def simple_write_csv(output_dir: str = None,
                     name: str = None,
                     rows: List[Dict] | Dict = None) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f'{output_dir}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    outputDir = "../data/processed/CA_province_targets/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    make_dir(path=out_dir.as_posix())

    # path to raw data
    fl = '../data/raw/CA_province_targets/CA_targets.csv'
    fl = os.path.abspath(fl)

    # -------------------------------------------
    # Publisher table
    # -------------------------------------------
    publisherDict = {
        'id': 'OEF',
        'name': 'Open Earth Foundation',
        'URL': 'https://www.openearth.org/'
    }

    # create publisher, methodology, datasrouce tables
    simple_write_csv(outputDir, "Publisher", publisherDict)


    # -------------------------------------------
    # DataSource table
    # -------------------------------------------
    datasourceDict = {
        'datasource_id': f"{publisherDict['id']}:canadian_targets",
        'name': 'Canadian province emission targets',
        'publisher': publisherDict['id'],
        'published': '2023-05-31',
        'URL': ''
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # -------------------------------------------
    # Target table
    # -------------------------------------------
    df = pd.read_csv(fl)

    df['datasource_id'] = datasourceDict['datasource_id']
    df['target_id'] = df.apply(lambda row:
                               f"{publisherDict['id']}:{row['actor_id']}:{row['target_year']}",
                               axis=1)

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

    df = df.astype(
        {
        'target_id': str,
        'actor_id': str,
        'target_type': str,
        'baseline_year': int,
        'target_year': int,
        'target_value': int,
        'target_unit': str,
        'URL': str,
        'datasource_id': str
        }
    )

    df_final = df.sort_values(by=['actor_id', 'target_year'])

    df_final.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)

