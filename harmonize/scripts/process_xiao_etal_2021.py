import csv
import os
from pathlib import Path
import pandas as pd
import numpy as np
from typing import List
from typing import Dict
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


def is_whole(num):
    if isinstance(num, int):
        return True
    try:
        val = num.is_integer()
        return val
    except AttributeError:
        return False


def get_actors(fl=None):
    en_dash = chr(0x2013)
    df = pd.read_excel(fl, sheet_name="Constituent entity list", header=1).loc[0:43]
    df_tmp1 = df.loc[:, ["No.", "Constituent entity", "Abbreviation"]]
    df_tmp2 = df.loc[:, ["No..1", "Constituent entity.1", "Abbreviation.1"]]
    df_tmp2.columns = df_tmp1.columns
    df_actors = (
        pd.concat([df_tmp1, df_tmp2], ignore_index=True)
        .dropna()
        .replace({"Constituent entity": {en_dash: "-"}}, regex=True)
        .assign(actor_id=lambda x: x.apply(lambda x: f"RU-{x['Abbreviation']}", axis=1))
        .assign(subnat=lambda x: x["Constituent entity"].str.strip())
        .rename(columns={"No.": "num"})
        .loc[:, ["num", "subnat", "actor_id"]]
    )

    filt = [is_whole(num) for num in df_actors["num"]]
    df_actors = df_actors.loc[filt, ["subnat", "actor_id"]].reset_index(drop=True)
    return df_actors


def get_sheet_names(fl):
    return pd.ExcelFile(fl).sheet_names


def get_data_v1(fl, df_actors):
    sheet_names = get_sheet_names(fl)
    en_dash = chr(0x2013)
    millon_tonnes_to_tonnes = 10**6
    output = []
    for year in [sheet for sheet in sheet_names if sheet.isnumeric()]:
        df = (
            pd.read_excel(fl, sheet_name=str(year))
            .replace({"Gasoline": {"-": 0}})
            .replace({"CO2 (Million tonnes)": {en_dash: "-"}}, regex=True)
            .replace({"CO2 (Million tonnes)": {"\xa0": " "}}, regex=True)
            .astype({"Gasoline": float})
            .replace({"Total": {"-": np.NaN}})
            .dropna(subset=["Total"])
            .assign(
                total_emissions=lambda x: x["Total"] * millon_tonnes_to_tonnes,
                year=year,
                subnat=lambda x: x["CO2 (Million tonnes)"].str.strip(),
            )
            .replace({"subnat": {"Republic of Sakha": "Republic of Sakha (Yakutia)"}})
            .replace({"subnat": {"Republic of Adygea": "Republic of Adygeya"}})
            .merge(df_actors, on="subnat")
            .loc[:, ["subnat", "actor_id", "year", "total_emissions"]]
        )
        output.append(df)
    return pd.concat(output)


def get_data_v2(fl, df_actors):
    year = fl.stem[0:4]
    en_dash = chr(0x2013)
    millon_tonnes_to_tonnes = 10**6
    df = (
        pd.read_excel(fl, sheet_name="Sum by energy types")
        .rename(columns={"Unnamed: 0": "subnat"})
        .replace({"Gasoline": {"-": 0}})
        .replace({"subnat": {en_dash: "-"}}, regex=True)
        .replace({"subnat": {"\xa0": " "}}, regex=True)
        .replace({"subnat": {"_": " "}}, regex=True)
        .replace({"subnat": {"St Petersburg city": "St. Petersburg city"}}, regex=True)
        .replace(
            {
                "subnat": {
                    "Karachayevo Chircassian Repu": "Karachayevo Chircassian Republic"
                }
            },
            regex=True,
        )
        .replace({"subnat": {"Trans Baikal": "Trans-Baikal"}}, regex=True)
        .replace({"subnat": {"Kabardino Balkarian": "Kabardino-Balkarian"}}, regex=True)
        .astype({"Gasoline": float})
        .replace({"Total": {"-": np.NaN}})
        .dropna(subset=["Total"])
        .assign(
            total_emissions=lambda x: x["Total"] * millon_tonnes_to_tonnes,
            year=year,
            subnat=lambda x: x["subnat"].str.strip().replace(r"\s+", " ", regex=True),
        )
        .replace({"subnat": {"Republic of Sakha": "Republic of Sakha (Yakutia)"}})
        .replace({"subnat": {"Republic of Adygea": "Republic of Adygeya"}})
        .merge(df_actors, on="subnat")
        .loc[:, ["subnat", "actor_id", "year", "total_emissions"]]
    )
    return df


if __name__ == "__main__":
    # output directory
    outputDir = "../data/processed/xiao_etal_2021_RU_constituents/"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    inputDir = "../data/raw/xiao_etal_2021_RU_constituents/"
    inputDir = os.path.abspath(inputDir)
    path = Path(inputDir)
    files = list(path.glob(f"*Energy*"))
    fl_actors = next(path.glob("*2005-2016*"))

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        "id": "Xiao et al. (2021)",
        "name": "Xiao et al. (2021)",
        "URL": "https://www.nature.com/articles/s41597-021-00966-z",
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        "datasource_id": "xiao_etal_2021:RU_constituent:v4",
        "name": "CO2 emission accounts of Russia’s constituent entities 2005-2019",
        "publisher": f"{publisherDict['id']}",
        "published": "2021-04-27",
        "URL": "https://figshare.com/articles/dataset/CO2_emission_accounts_of_Russia_s_constituent_entities_2005-2019/13084007/4",
    }
    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    # get actor names and ids
    df_actors = get_actors(fl_actors)

    # loop over files and store dfs in list
    output = []
    for file in files:
        df_tmp = None
        if file.stem.startswith("2005"):
            df_tmp = get_data_v1(file, df_actors)
        else:
            df_tmp = get_data_v2(file, df_actors)

        output.append(df_tmp)

    # concat dataframe together (2005-2019)
    df_out = pd.concat(output)

    # create ids
    df_out = df_out.assign(datasource_id=datasourceDict["datasource_id"])
    df_out["emissions_id"] = df_out.apply(
        lambda row: f"{publisherDict['id'].replace(' ', '_').replace('.', '')}:{row['actor_id']}:{row['year']}",
        axis=1,
    )

    # remove Sevastopol city and Crimea, internationally recognized as Ukraine and not in our database
    filt = ~df_out["actor_id"].isin(["RU-SEV", "RU-CRI"])
    df_out = df_out.loc[filt]

    # incorrectly labeled
    df_out.loc[
        df_out["subnat"] == "Novosibirsk Region", "actor_id"
    ] = "RU-NVS"  # was 'RU-NVE'
    df_out.loc[
        df_out["subnat"] == "Ivanovo Region", "actor_id"
    ] = "RU-IVA"  # was 'RU-IVE'

    # sort specific columns
    columns = ["actor_id", "year", "total_emissions", "datasource_id", "emissions_id"]
    df_emissionsAgg = df_out[columns].sort_values(by=["actor_id", "year"])

    # ensure columns have correct types
    df_emissionsAgg = df_emissionsAgg.astype(
        {
            "emissions_id": str,
            "actor_id": str,
            "year": int,
            "total_emissions": int,
            "datasource_id": str,
        }
    )

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=["actor_id", "year"])

    # convert to csv
    df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    tagDictList = [
        {"tag_id": "fossil_CO2_only", "tag_name": "Fossil CO2 only"},
        {"tag_id": "includes_bunker_fuel", "tag_name": "Includes bunker fuels"},
    ]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)
