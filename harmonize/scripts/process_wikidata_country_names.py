from pathlib import Path
from utils import make_dir
from utils import write_to_csv
import csv
import requests

OPENCLIMATE_SERVER='openclimate.openearth.dev'

DATASOURCE = {
    "datasource_id": "OEF:WD:country-names-un-languages:20230216",
    "name": "Wikidata extract of country names in the 6 UN official languages",
    "publisher": "OEF:WD",
    "published": "2023-02-16",
    "URL": "https://openearth.org/"
}

PUBLISHER = {
    "id": "OEF:WD",
    "name": "Open Earth Foundation extracts from Wikidata",
    "URL": "https://github.com/Open-Earth-Foundation/OpenClimate"
}

TAGS = [
    {
        "tag_id": "oef",
        "tag_name": "OEF-originated data"
    },
    {
        "tag_id": "wikidata",
        "tag_name": "Wikidata-originated data"
    },
    {
        "tag_id": "geo",
        "tag_name": "Geographical data"
    },
    {
        "tag_id": "un",
        "tag_name": "Related to the United Nations"
    },
    {
        "tag_id": "i18n",
        "tag_name": "Internationalization"
    }
]

def is_country_id(id):
    namespace = "ISO-3166-1 alpha-2"
    url = f'''https://{OPENCLIMATE_SERVER}/api/v1/search/actor?namespace={namespace}&identifier={id}'''
    res = requests.get(url)
    json = res.json()
    return json['success'] and len(json['data']) == 1 and json['data'][0]['type'] == 'country'

def process_wikidata_country_names(inputfile, outputDir):

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=PUBLISHER,
                 mode='w')

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=DATASOURCE,
                 mode='w')

    for i in range(0, len(TAGS)):
        tag = TAGS[i]
        write_to_csv(outputDir=outputDir,
                    tableName='Tag',
                    dataDict=tag,
                    mode='w' if i == 0 else 'a')
        write_to_csv(outputDir=outputDir,
                    tableName='DataSourceTag',
                    dataDict={"datasource_id": DATASOURCE["datasource_id"], "tag_id": tag["tag_id"]},
                    mode='w' if i == 0 else 'a')

    with open(inputfile) as csvin:
        reader = csv.DictReader(csvin)
        with open(f'{outputDir}/ActorName.csv', mode='w') as csvout:
            writer = csv.DictWriter(csvout, fieldnames=["actor_id", "name", "language", "datasource_id"])
            writer.writeheader()
            for row in reader:
                if not is_country_id(row["iso31661"]):
                    continue
                for language in ['en','fr','es','ru','ar','zh']:
                    writer.writerow({
                        "actor_id": row['iso31661'],
                        "name": row['label_' + language],
                        "language": language,
                        "datasource_id": DATASOURCE["datasource_id"]
                    })

if __name__ == "__main__":
    INPUT_DIR = "../data/raw/wikidata-country-names-un-languages/"
    INPUT_FILE = "wikidata-country-names-un-languages.csv"
    INPUT_PATH = Path(INPUT_DIR) / Path(INPUT_FILE)
    OUTPUT_DIR = "../data/processed/" + DATASOURCE["datasource_id"]
    make_dir(path=Path(OUTPUT_DIR).as_posix())
    process_wikidata_country_names(INPUT_PATH.as_posix(), OUTPUT_DIR)