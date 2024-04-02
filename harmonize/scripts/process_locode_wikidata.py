from csv import DictReader, DictWriter

PUBLISHER = {
 "id": "OEF:WD",
 "name": "Open Earth Foundation extracts from Wikidata",
 "URL": "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize"
}

DATASOURCE = {
  "datasource_id": PUBLISHER["id"] + ":locode-wikidata:20240227",
  "name": "Matching process between Wikidata and UN/LOCODE",
  "publisher": PUBLISHER["id"],
  "published": "2024-02-27",
  "URL": "https://github.com/Open-Earth-Foundation/LocodeBot"
}

TAGS = {
    'geo' : "geographical data",
    'contextual' : "contextual data",
    'identifier' : "identifier mapping",
    'wikidata' : "data extracted from Wikidata",
    'cc0' : "Creative Commons CC0 license",
    'extract' : "Dataset extracted from a larger database",
    'oef' : "Dataset from Open Earth Foundation",
    'locode' : "Related to UN/LOCODE",
    'evanp' : "Dataset by Evan Prodromou",
    'locodebot' : 'Mapping from LocodeBot'
}

INPUT_DIR = '../data/raw/locode-wikidata-20240227/'
OUTPUT_DIR = '../data/processed/' + DATASOURCE['datasource_id'] + '/'

def main() -> None:

    with open(f'{OUTPUT_DIR}/Publisher.csv', 'w') as f:
      writer = DictWriter(f, fieldnames=PUBLISHER.keys())
      writer.writeheader()
      writer.writerow(PUBLISHER)

    with open(f'{OUTPUT_DIR}/DataSource.csv', 'w') as f:
      writer = DictWriter(f, fieldnames=DATASOURCE.keys())
      writer.writeheader()
      writer.writerow(DATASOURCE)

    with open(f'{OUTPUT_DIR}/Tag.csv', 'w') as f:
      tagWriter = DictWriter(f, fieldnames=['tag_id', 'tag_name'])
      tagWriter.writeheader()
      with open(f'{OUTPUT_DIR}/DataSourceTag.csv', 'w') as g:
        dataSourceTagWriter = DictWriter(g, fieldnames=['datasource_id', 'tag_id'])
        dataSourceTagWriter.writeheader()
        for tag_id, tag_name in TAGS.items():
          tagWriter.writerow({'tag_id': tag_id, 'tag_name': tag_name})
          dataSourceTagWriter.writerow({'datasource_id': DATASOURCE['datasource_id'], 'tag_id': tag_id})

    with open(f'{OUTPUT_DIR}/ActorIdentifier.csv', 'w') as f:
      writer = DictWriter(f, fieldnames = ['actor_id','identifier','namespace', 'datasource_id'])
      writer.writeheader()
      for i in range(1, 3):
        with open(f'{INPUT_DIR}/match{i}.csv', 'r') as g:
          reader = DictReader(g)
          for row in reader:
            actor_id = row['LOCODE'][0:2] + ' ' + row['LOCODE'][2:]
            writer.writerow({'actor_id': actor_id, 'identifier': row['wikidata_id'], 'namespace': 'Wikidata', 'datasource_id': DATASOURCE['datasource_id']})

if __name__ == "__main__":
  main()