import csv
import os
from pathlib import Path
from typing import List
from typing import Dict
from utils import harmonize_eucom_emissions
from utils import harmonize_eucom_pledges
from utils import make_dir

def simple_write_csv(
    output_dir: str = None, name: str = None, rows: List[Dict] | Dict = None
) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f"{output_dir}/{name}.csv", mode="w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/DDL-EUCoM-compilation"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # dataset
    fl = '../data/raw/DDL-EUCoM-compilation/EUCovenantofMayors2022_clean_NCI_7Jun22.csv'
    fl = os.path.abspath(fl)

    # locode directory
    input_dir = "../data/raw/unlocode/loc221csv"
    input_dir = os.path.abspath(input_dir)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        "id": "DDL",
        "name": "Data-Driven EnviroLab",
        "URL": "https://datadrivenlab.org/"
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

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

    simple_write_csv(outputDir, "DataSource", dataSourceDict)

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    df_emissionsAgg = harmonize_eucom_emissions(fl=fl,
                                                datasourceDict=dataSourceDict,
                                                input_dir = input_dir)

    # save to csv
    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDir}/EmissionsAgg.csv', index=False)

    # ------------------------------------------
    # Target
    # ------------------------------------------
    df_target = harmonize_eucom_pledges(fl=fl,
                                        datasourceDict=dataSourceDict,
                                        input_dir = input_dir)

    # replace emissions
    replace_dict = {'target_type': {
        'Absolute emissions reduction':'Absolute emission reduction'
        }
    }
    df_target = df_target.replace(replace_dict)

    # convert to csv
    df_target.drop_duplicates().to_csv(
        f'{outputDir}/Target.csv', index=False)

    # ------------------------------------------
    # DataSourceTag table
    # ------------------------------------------
    # dictionary of tag_id : tag_name
    tagDict = {
        "city_reported_data": "City-reported data",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": dataSourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)