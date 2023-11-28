import csv
import os
from pathlib import Path
import pandas as pd
import requests
from typing import List
from typing import Dict
from utils import make_dir


def get_iso2_from_name(name: str = None, type_code: str = "adm1") -> str:
    """get the region code from name

    - get ISO-3166-1 alpha-2 code from country
    - get ISO-3166-2 alpha-2 code from adm1 or adm2 (i.e. subnationals)
    - get UN-LOCODE from city

    Args:
        name (str): actor name to search for (default: None)
        type_code (str): actor type (default: "country")
                         ['country', 'adm1', 'adm2', 'city']
    Returns:
        str: region code corresponding to name

    Example:
    >> get_iso2_from_type('Ireland') # returns 'IE'
    """
    # https://github.com/Open-Earth-Foundation/OpenClimate/blob/develop/api/API.md
    url = f"https://openclimate.openearth.dev/api/v1/search/actor?name={name}"
    headers = {"Accept": "application/vnd.api+json"}
    response = requests.request("GET", url, headers=headers).json()
    for data in response.get("data", []):
        if data.get("type") == type_code:
            return (name, data.get("actor_id", None))
    return (name, None)


def get_actor_id(name):
    actor_id = get_iso2_from_name(name=name, type_code="adm1")
    if actor_id[1] is not None:
        return actor_id

    actor_id = get_iso2_from_name(name=name, type_code="country")
    if actor_id[1] is not None:
        return actor_id

    return (name, None)


def simple_write_csv(
    output_dir: str = None,
    name: str = None,
    data: List[Dict] | Dict = None,
    mode: str = "w",
    extension: str = "csv",
) -> None:

    if isinstance(data, dict):
        data = [data]

    with open(f"{output_dir}/{name}.{extension}", mode=mode) as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/UK_BEIS"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # BEIS dataset
    fl = "../data/raw/UK_BEIS/2005-21-uk-local-authority-ghg-emissions-update-060723.xlsx"
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        "id": "BEIS",
        "name": "Department of Business, Energy, and Industrial Strategy",
        "URL": "https://www.gov.uk/government/organisations/department-for-business-energy-and-industrial-strategy",
    }

    simple_write_csv(
        output_dir=outputDir, name="Publisher", data=publisherDict, mode="w"
    )

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        "datasource_id": "BEIS:UK_regional_GHG:2023-07-06",
        "name": "UK local authority and regional greenhouse gas emissions national statistics, 2005 to 2021",
        "publisher": publisherDict["id"],
        "published": "2023-07-06",
        "URL": "https://www.gov.uk/government/statistics/uk-local-authority-and-regional-greenhouse-gas-emissions-national-statistics-2005-to-2021",
    }
    simple_write_csv(
        output_dir=outputDir, name="DataSource", data=datasourceDict, mode="w"
    )

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    regions = [
        "England Total",
        "London Total",
        "National Total",
        "Northern Ireland Total",
        "Scotland Total",
        "Wales Total",
    ]

    sectors = [
        "Industry Electricity",
        "Industry Gas ",
        "Large Industrial Installations",
        "Industry 'Other'",
        "Commercial Electricity",
        "Commercial Gas ",
        "Commercial 'Other'",
        "Public Sector Electricity",
        "Public Sector Gas ",
        "Public Sector 'Other'",
        "Domestic Electricity",
        "Domestic Gas",
        "Domestic 'Other'",
        "Road Transport (A roads)",
        "Road Transport (Motorways)",
        "Road Transport (Minor roads)",
        "Diesel Railways",
        "Transport 'Other'",
        "Agriculture Electricity",
        "Agriculture Gas",
        "Agriculture 'Other'",
        "Agriculture Livestock",
        "Agriculture Soils",
        "Landfill",
        "Waste Management 'Other'",
    ]

    output_columns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id",
    ]

    # sheet_names = pd.ExcelFile(fl).sheet_names
    df = pd.read_excel(fl, sheet_name="1_1", header=4, na_values="[x]")

    filt = df["Region/Country"].isin(regions)
    df_out = (
        df.loc[filt]
        .assign(total_emissions=lambda x: x[sectors].sum(axis=1) * 10**3)
        .rename(columns={"Region/Country": "country", "Calendar Year": "year"})
        .assign(country=lambda x: x["country"].str.replace(r"\sTotal$", "", regex=True))
        .assign(
            country=lambda x: x["country"].str.replace(
                r"Wales", "Wales [Cymru GB-CYM]", regex=True
            )
        )
        .assign(
            country=lambda x: x["country"].str.replace(
                r"National", "United Kingdom", regex=True
            )
        )
        .loc[:, ["country", "year", "total_emissions"]]
    )

    df_actor_id = pd.DataFrame(
        [get_actor_id(name) for name in set(df_out["country"])],
        columns=["country", "actor_id"],
    )

    df_emissionsAgg = (
        pd.merge(df_out, df_actor_id, on="country")
        .loc[lambda x: x["actor_id"].notnull()]
        .assign(
            emissions_id=lambda x: x.apply(
                lambda row: f"BLEIS:{row['actor_id']}:{row['year']}", axis=1
            )
        )
        .assign(datasource_id=datasourceDict["datasource_id"])
        .loc[:, output_columns]
        .astype({"total_emissions": int, "year": int})
        .sort_values(by=["actor_id", "year"])
    )

    # save to csv
    df_emissionsAgg.drop_duplicates().to_csv(
        f"{outputDir}/EmissionsAgg.csv", index=False
    )

    # ------------------------------------------
    # Tag table
    # ------------------------------------------
    tagDictList = [
        {
            "tag_id": "country_or_3rd_party",
            "tag_name": "Country-reported data or third party",
        }
    ]

    simple_write_csv(output_dir=outputDir, name="Tag", data=tagDictList, mode="w")

    # ------------------------------------------
    # DataSourceTag table
    # ------------------------------------------
    datasource_id = f"{datasourceDict['datasource_id']}"
    tags = ["combined_datasets"]
    dataSourceTagDict = [
        {"datasource_id": datasource_id, "tag_id": tag} for tag in tags
    ]

    simple_write_csv(
        output_dir=outputDir, name="DataSourceTag", data=dataSourceTagDict, mode="w"
    )
