import concurrent.futures
import csv
import openclimate
import os
from pathlib import Path
import pandas as pd
from typing import List
from typing import Dict
from utils import make_dir


def simple_write_csv(
    output_dir: str = ".",
    name: str = "_output",
    rows: List[Dict] | Dict = None,
    mode: str = "w",
) -> None:

    filename = f"{output_dir}/{name}.csv"

    rows = [rows] if isinstance(rows, dict) else rows

    with open(filename, mode=mode) as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader() if csvfile.tell() == 0 else None
        writer.writerows(rows)


def no_duplicates(df, col):
    """True if no duplicates"""
    return ~df.duplicated(subset=[col]).any()


def is_country(input_string):
    county_fua_and_gadm = ["US-Counties", "all-cities-FUA", "China-GADM-prefecture"]
    found = not any(substring in input_string for substring in county_fua_and_gadm)
    return found


def preprocess(fl=None):
    # dropping values <= 0
    df = (
        pd.read_csv(fl, parse_dates=["date"])
        .loc[lambda x: x['value (KtCO2 per day)']>0]
        .assign(year=lambda x: x["date"].dt.year)
        .loc[:, ["city", "country", "sector", "year", "value (KtCO2 per day)"]]
        .groupby(["city", "country", "year"])
        .sum(numeric_only=True)
        .reset_index()
        .assign(total_emissions=lambda x: x["value (KtCO2 per day)"] * 1000)
        .loc[:, ["city", "country", "year", "total_emissions"]]
    )
    return df


def get_parts_of_iso(iso):
    df_parts = client.parts(actor_id=iso, part_type="adm1").get("actor_id")
    return list(df_parts) + [iso]


def get_cities_from_part(part):
    try:
        df_tmp = client.parts(actor_id=part, part_type="city").loc[
            :, ["actor_id", "name"]
        ]
        df_tmp["is_part_of"] = part
        return df_tmp
    except:
        pass


if __name__ == "__main__":
    # output directory
    outputDir = "../data/processed/carbon_monitor_cities/"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    data_dir = "../data/raw/carbon_monitor_cities"
    data_dir = os.path.abspath(data_dir)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        "id": "Carbon Monitor Cities",
        "name": "Carbon Monitor Cities",
        "URL": "https://cities.carbonmonitor.org/",
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        "datasource_id": "carbon_monitor_cities:v0325",
        "name": "Near-real-time daily estimates of CO2 emissions from 1500 cities worldwide",
        "publisher": f"{publisherDict['id']}",
        "published": "2022-03-26",
        "URL": "https://figshare.com/articles/dataset/Near-real-time_daily_estimates_of_CO2_emissions_from_1500_cities_worldwide/19425665/1",
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    # initiate open cliamte
    client = openclimate.Client()

    # data directory and files
    files = list(Path(data_dir).glob("*.csv"))
    files = [file for file in files if is_country(file.stem)]

    # merge data together
    df_out = pd.concat([preprocess(file) for file in files])

    # replace some country names
    replace_dict = {
        "country": {
            "United States": "United States of America",
            "United Kingdom": "United Kingdom of Great Britain and Northern Ireland",
            "Vietnam": "Viet Nam",
            "Korea": "Korea, the Republic of",
            "Turkey": "Türkiye",
            "Russia": "Russian Federation",
        }
    }

    df_out = df_out.replace(replace_dict)

    # list of countries in dataset
    country_list = df_out["country"].drop_duplicates().tolist()

    # countries in OpenClimate
    df_country = openclimate.Client().country_codes()

    # merge ISO codes into df_out
    data = [
        (name, list(df_country.loc[df_country["name"] == name, "actor_id"])[0])
        for name in country_list
    ]
    df_iso = pd.DataFrame(data, columns=["country", "iso"])
    df_out = df_out.merge(df_iso, on="country")

    # list of ISO codes
    iso_codes = df_out["iso"].drop_duplicates().tolist()

    df_list = []
    for iso in iso_codes:
        parts = get_parts_of_iso(iso)

        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = [executor.submit(get_cities_from_part, part) for part in parts]
            data = [f.result() for f in concurrent.futures.as_completed(results)]

        # merge name with locode
        df_city = pd.concat(data)
        cities_frame = (
            df_out.loc[df_out["iso"] == iso, "city"].drop_duplicates().to_frame()
        )
        df_ = cities_frame.merge(df_city, left_on="city", right_on="name")

        # filter the DataFrame to only include rows with city counts of 1
        counts = df_["city"].value_counts()
        df_filtered = df_[df_["city"].isin(counts[counts == 1].index)]
        df_filtered = df_filtered.assign(iso=iso)

        # merge actor_id into df_out, this is a tmp dataframe
        df_tmp = df_out.loc[df_out["iso"] == iso].merge(df_filtered, on=["city", "iso"])
        df_tmp = df_tmp.loc[
            :, ["actor_id", "year", "total_emissions", "iso", "is_part_of", "city"]
        ]
        df_list.append(df_tmp)

    # final type dictionary
    astype_dict = {
        "emissions_id": str,
        "actor_id": str,
        "year": int,
        "total_emissions": int,
        "datasource_id": str,
    }

    # final dataset
    df_emissionsAgg = (
        pd.concat(df_list)
        .assign(datasource_id=datasourceDict["datasource_id"])
        .assign(
            emissions_id=lambda x: x.apply(
                lambda row: f"carbon_monitor_cities:{row['actor_id']}:{row['year']}",
                axis=1,
            )
        )
        .loc[:, astype_dict.keys()]
        .astype(astype_dict)
        .sort_values(by="actor_id")
    )

    # convert to csv
    df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "ghgs_included_fossil_CO2": "GHGs included: Fossil CO2",
        "includes_cement": "Includes emissions from cement production",
        "sectors_power_residential_industry_ground_transport_aviation": "Sectors: power generation, residential and commercial buildings, industry, ground transportation, and aviation",
        "disaggregates_national_emissions_using_GRACED": "Disaggregates the Carbon Monitor national emissions to cities using the Global Gridded Daily CO2 Emissions Dataset (GRACED)",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)
