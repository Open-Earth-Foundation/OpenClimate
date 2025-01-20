from pathlib import Path
from utils import make_dir
from utils import write_to_csv
import csv

CENSUS_YEAR = 2022

DATASOURCE = {
    "datasource_id": "IBGE:agregados-prelimares-por-municipios-br:2024-03-20",
    "name": "Aggregated Results by preliminary Enumeration Areas: Population and Housing Units",
    "publisher": "IBGE",
    "published": "2024-03-20",
    "URL": "https://www.ibge.gov.br/en/statistics/social/population/22836-2022-census-3.html?edicao=39826",
}

PUBLISHER = {
    "id": "IBGE",
    "name": "Instituto Brasileiro de Geografia e Estatística (IBGE)",
    "URL": "https://www.ibge.gov.br/",
}

TAGS = [
    {"tag_id": "br", "tag_name": "Brazil"},
    {"tag_id": "brgov", "tag_name": "Brazilian government data"},
    {"tag_id": "pt", "tag_name": "Data originally in Portuguese"},
    {"tag_id": "population", "tag_name": "Population datasource"},
    {"tag_id": "census", "tag_name": "Census data"},
    {"tag_id": "city", "tag_name": "City data"},
    {"tag_id": "municipality", "tag_name": "Municipality data"},
    {"tag_id": "housing", "tag_name": "Housing data"},
    {"tag_id": "preliminary", "tag_name": "Preliminary data"},
    {"tag_id": "2022", "tag_name": "2022 data"},
]


def read_regions():

    regions = {}
    regions_by_id = {}

    count = 0

    with open("../data/processed/ISO-3166-2/Actor.csv") as csvin:
        reader = csv.DictReader(csvin)
        for row in reader:
            if row["type"] == "adm1" and row["actor_id"].startswith("BR-"):
                count = count + 1
                regions_by_id[row["actor_id"]] = regions[row["name"]] = {
                    "actor_id": row["actor_id"],
                    "name": row["name"],
                    "cities": {},
                }

    print(f"Found {count} regions")

    misses = 0

    with open("../data/processed/UNLOCODE/Actor.csv") as csvin:
        reader = csv.DictReader(csvin)
        for row in reader:
            if row["type"] == "city" and row["actor_id"].startswith("BR "):
                region_id = row["is_part_of"]
                region = regions_by_id.get(region_id)
                if region is None:
                    misses = misses + 1
                    continue
                region["cities"][row["name"]] = {
                    "actor_id": row["actor_id"],
                    "name": row["name"],
                }

    print(f"Missed {misses} cities")

    return regions


def process_ibge_population_data(inputfile, outputDir):

    write_to_csv(
        outputDir=outputDir, tableName="Publisher", dataDict=PUBLISHER, mode="w"
    )

    write_to_csv(
        outputDir=outputDir, tableName="DataSource", dataDict=DATASOURCE, mode="w"
    )

    for i in range(0, len(TAGS)):
        tag = TAGS[i]
        write_to_csv(
            outputDir=outputDir,
            tableName="Tag",
            dataDict=tag,
            mode="w" if i == 0 else "a",
        )
        write_to_csv(
            outputDir=outputDir,
            tableName="DataSourceTag",
            dataDict={
                "datasource_id": DATASOURCE["datasource_id"],
                "tag_id": tag["tag_id"],
            },
            mode="w" if i == 0 else "a",
        )

    regions = read_regions()

    hits = 0
    region_misses = 0
    city_misses = 0

    with open(inputfile) as csvin:
        reader = csv.DictReader(csvin)
        for row in reader:
            region = regions.get(row["NM_UF"])
            if region is None:
                region_misses = region_misses + 1
                continue
            city = region["cities"].get(row["NM_MUN"])
            if city is None:
                city_misses = city_misses + 1
                continue
            hits = hits + 1
            data = {
                "actor_id": city["actor_id"],
                "year": CENSUS_YEAR,
                "population": int(row["v0001"]),
                "datasource_id": DATASOURCE["datasource_id"],
            }
            write_to_csv(
                outputDir=outputDir, tableName="Population", dataDict=data, mode="a"
            )

    print(
        f"Processed {hits} cities, missed {region_misses} regions, {city_misses} cities"
    )


if __name__ == "__main__":
    INPUT_DIR = "../data/raw/IBGE/"
    INPUT_FILE = "Agregados_preliminares_por_municipios_BR.csv"
    INPUT_PATH = Path(INPUT_DIR) / Path(INPUT_FILE)
    OUTPUT_DIR = "../data/processed/" + DATASOURCE["datasource_id"]
    make_dir(path=Path(OUTPUT_DIR).as_posix())
    process_ibge_population_data(INPUT_PATH.as_posix(), OUTPUT_DIR)
