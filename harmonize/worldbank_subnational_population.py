import logging
import requests

apihost = None
INPUT_FILE = "source/World-Bank-Population-Subnational/World-Bank-Population-Subnational.csv"
OUTPUT_DIR = "data_contextual/subnational/population/OEF:WB:subnational-population:20221106"

PUBLISHER = {
    "id": "OEF:WB",
    "name": "Open Earth Foundation extracts from World Bank",
    "URL": "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize"
}

DATASOURCE = {
    "datasource_id": "OEF:WB:subnational-population:20221106",
    "name": "World Bank population ",
    "publisher": PUBLISHER["id"],
    "published": "2022-11-06",
    "URL": "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize/tree/main/source/World-Bank-Population-Subnational"
}

TAGS = [
    {'tag_id': 'geo',
     'tag_name': 'geographical data'},
    {'tag_id': 'contextual',
     'tag_name': 'contextual data'},
    {'tag_id': 'population',
     'tag_name': 'population of an area'},
    {'tag_id': 'worldbank',
      'tag_name': 'data extracted from the World Bank'},
    {'tag_id': 'cc0',
     'tag_name': 'Creative Commons CC0 license'},
    {'tag_id': 'extract',
     'tag_name': 'Dataset extracted from a larger database'},
    {'tag_id': 'oef',
     'tag_name': 'Dataset from Open Earth Foundation'},
    {'tag_id': 'evanp',
     'tag_name': 'Dataset by Evan Prodromou'}
]

import csv

def slurp_file(name):
    data = []
    with open(name) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
    return data

def write_csv(name, rows):
    with open(f'{OUTPUT_DIR}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

cache = {}
session = requests.Session()
def is_actor_id(code):
    global session
    global cache
    if (code in cache):
        return cache[code]
    r = session.get(f'{apihost}/api/v1/search/actor?identifier={code}&namespace=ISO-3166-2')
    if r.status_code != 200:
        raise Exception("Bad response")
    resp = r.json()
    logging.debug(resp)
    if not resp['success']:
        raise Exception("Bad response")
    cache[code] = True if len(resp['data']) > 0 else False
    logging.debug(f'{code} -> {cache[code]}')
    return cache[code]

namecache = {}
def get_by_name(actor_name):
    global namecache
    global session
    if actor_name in namecache:
        return namecache[actor_name]
    r = session.get(f'{apihost}/api/v1/search/actor?name={actor_name}')
    if r.status_code != 200:
        raise Exception("Bad response")
    resp = r.json()
    if not resp['success']:
        raise Exception("Bad response")
    namecache[actor_name] = resp['data']
    return namecache[actor_name]

def get_countries_from_name(country):
    return list(filter(lambda c: c['type'] == 'country', get_by_name(country)))

def actor_id_from_code(code):
    parts = code.split('_')
    if len(parts) < 3:
        return None
    else:
        candidate = parts[2].replace('.', '-')
        logging.debug(candidate)
        if is_actor_id(candidate):
            return candidate
        else:
            return None

def actor_id_from_name(name):
    nameparts = name.split(', ')
    country = nameparts[0]
    region = nameparts[len(nameparts) - 1]
    logging.debug(country)
    logging.debug(region)
    if len(region) == 0 or len(country) == 0:
        return None
    parent_ids = list(map(lambda c: c['actor_id'], get_countries_from_name(country)))
    logging.debug(parent_ids)
    candidates = list(filter(lambda c: c['is_part_of'] in parent_ids and c['type'] == 'adm1', get_by_name(region)))
    logging.debug(candidates)
    if len(candidates) > 0:
        return candidates[0]['actor_id']
    else:
        return None

def actor_id_from_row(row):
    actor_id = actor_id_from_code(row['Country Code'])
    if not actor_id:
        actor_id = actor_id_from_name(row['Country Name'])
    return actor_id

def main():

    input = slurp_file(INPUT_FILE)

    actor_identifiers = {}
    populations = []

    for row in input:

        actor_id = actor_id_from_row(row)

        if not actor_id:
            logging.info(f'Skipping row {row["Country Code"]}; not a known actor')
            continue


        if actor_id not in actor_identifiers:
            actor_identifiers[actor_id] = {
                'actor_id': actor_id,
                'identifier': row['Country Code'],
                'namespace': 'World Bank',
                'datasource_id': DATASOURCE['datasource_id']
            }

        for year in range(2000, 2016 + 1):
            populations.append({
                'actor_id': actor_id,
                'year': year,
                'population': int(row[f'{year} [YR{year}]']),
                'datasource_id': DATASOURCE['datasource_id']
            })

    write_csv('Publisher', [PUBLISHER])
    write_csv('DataSource', [DATASOURCE])
    write_csv('Tag', TAGS)
    write_csv('DataSourceTag', list(map(lambda t: {'datasource_id': DATASOURCE['datasource_id'], 'tag_id': t['tag_id']}, TAGS)))
    write_csv('ActorIdentifier', list(actor_identifiers.values()))
    write_csv('Population', populations)

if __name__ == "__main__":
    import os
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('-A', '--api', help='API host prefix', default=(os.environ.get('OPENCLIMATE_API') or 'https://openclimate.network'))
    parser.add_argument('-d', '--debug', action='store_true', help='flag for running debug')
    args = parser.parse_args()

    apihost = args.api
    logging.basicConfig(level=logging.DEBUG if args.debug else logging.INFO)

    main()