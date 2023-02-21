import csv
import dask
from dask import delayed
import os
from pathlib import Path
import pandas as pd
from typing import List
from typing import Dict
from utils import df_wide_to_long
from utils import make_dir
from utils_UNFCCC import UNFCCC


@delayed
def process_file(file, datasourceDict):
    gigagram_to_tonne = 1000
    un = UNFCCC(fl=file)
    df = (
        un.sector_summary()
        .query(
            "`GHG emissions, Gg CO2 equivalent` == 'GHG emissions without LULUCF / LUCF'"
        )
        .pipe(df_wide_to_long, value_name="emissions", var_name="year")
        .assign(actor_id=un.iso2)
        .assign(emissions=lambda x: x["emissions"] * gigagram_to_tonne)
        .assign(year=lambda x: x["year"].astype(int))
        .assign(
            emissions_id=lambda x: f"UNFCCC_GHG_nonAnnexOne:{x['actor_id']}:{x['year']}"
        )
        .assign(
            emissions_id=lambda x: x.apply(
                lambda row: f"UNFCCC_GHG_nonAnnexOne:{row['actor_id']}:{row['year']}",
                axis=1,
            )
        )
        .assign(datasource_id=datasourceDict["datasource_id"])
        .rename(columns={"emissions": "total_emissions"})
    )
    return df


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
    # output directory
    outputDir = "../data/processed/UNFCCC_nonAnnexOne"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # input data files
    inputDir = "../data/raw/UNFCCC_nonAnnexOne/data"
    inputDir = os.path.abspath(inputDir)
    path = Path(inputDir)
    files = list(path.glob("*.xlsx"))

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        "id": "UNFCCC",
        "name": "The United Nations Framework Convention on Climate Change",
        "URL": "https://unfccc.int",
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        "datasource_id": "UNFCCC:GHG_profiles_nonAnnexOne:2022-09-27",
        "name": "UNFCCC GHG Profiles - Non-Annex I",
        "publisher": publisherDict["id"],
        "published": "2022-09-27",
        "URL": "https://di.unfccc.int/ghg_profile_non_annex1",
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    delayed_outputs = [process_file(file, datasourceDict) for file in files]
    output_list = dask.compute(*delayed_outputs)
    df_out = pd.concat(output_list)

    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id",
    ]

    df_emissionsAgg = df_out[emissionsAggColumns]

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
        {"tag_id": "country_reported_data", "tag_name": "Country-reported data"}
    ]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)
