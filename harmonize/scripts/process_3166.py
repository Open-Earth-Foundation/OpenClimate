import logging
import requests
import json

apihost = None
INPUT_FILE = "data/raw/3166/iso3166-2.json"
OUTPUT_DIR = "data/processed/3166/"

PUBLISHER = {
    "id": "esosedi",
    "name": "esosedi",
    "URL": "https://github.com/esosedi/"
}

DATASOURCE = {
    "datasource_id": "esosedi:3166:2.3.10",
    "name": "esosedi 3166-2 mapping of ISO 3166-2 to FIPS",
    "publisher": PUBLISHER["id"],
    "published": "2021-12-10",
    "URL": "https://github.com/esosedi/3166"
}

TAGS = [
    {'tag_id': 'geo',
     'tag_name': 'geographical data'},
    {'tag_id': 'id',
     'tag_name': 'id data'},
    {'tag_id': 'name',
     'tag_name': 'name data'},
    {'tag_id': 'geonames',
      'tag_name': 'data extracted from GeoNames'},
    {'tag_id': 'CC-BY-4.0',
     'tag_name': 'Creative Commons Attribution 4.0 International license'},
    {'tag_id': 'MIT',
     'tag_name': 'MIT license'},
    {'tag_id': 'extract',
     'tag_name': 'Dataset extracted from a larger database'},
    {'tag_id': 'evanp',
     'tag_name': 'Dataset by Evan Prodromou'}
]

import csv

def write_csv(name, rows):
    with open(f'{OUTPUT_DIR}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

def output_records(actor_id, record, actor_identifiers, actor_names):
    if 'fips' in record and record['fips'] != '':
        actor_identifiers.append({
            'actor_id': actor_id,
            'identifier': record['fips'],
            'namespace': 'FIPS',
            'datasource_id': DATASOURCE['datasource_id']
        })
    if 'reference' in record:
        if 'geonames' in record['reference'] and record['reference']['geonames'] != '' and record['reference']['geonames'] != None:
            actor_identifiers.append({
                'actor_id': actor_id,
                'identifier': record['reference']['geonames'],
                'namespace': 'geonames',
                'datasource_id': DATASOURCE['datasource_id']
            })
        if 'openstreetmap' in record['reference'] and record['reference']['openstreetmap'] != '' and record['reference']['openstreetmap'] != None:
            actor_identifiers.append({
                'actor_id': actor_id,
                'identifier': record['reference']['openstreetmap'],
                'namespace': 'openstreetmap',
                'datasource_id': DATASOURCE['datasource_id']
            })
    if 'names' in record:
        for language, name in record['names'].items():
            if (name != ''):
                actor_names.append({
                    'actor_id': actor_id,
                    'name': name,
                    'language': language,
                    'datasource_id': DATASOURCE['datasource_id']
                })


cache = {}
session = requests.Session()
def is_actor_id(code):
    global session
    global cache
    if (code in cache):
        return cache[code]
    r = session.get(f'{apihost}/api/v1/search/actor?identifier={code}')
    if r.status_code != 200:
        raise Exception("Bad response")
    resp = r.json()
    logging.debug(resp)
    if not resp['success']:
        raise Exception("Bad response")
    cache[code] = True if len(resp['data']) > 0 else False
    logging.debug(f'{code} -> {cache[code]}')
    return cache[code]

def main():

    data = None

    with open(INPUT_FILE) as f:
        # Parse the JSON data from the file
        data = json.load(f)

    actor_identifiers = []
    actor_names = []

    for id, country in data.items():

        actor_id = country['iso']

        if not is_actor_id(actor_id):
            continue

        output_records(actor_id, country, actor_identifiers, actor_names)

        for region in country['regions']:
            if 'iso' in region and region['iso'] != '':
                actor_id = f'{country["iso"]}-{region["iso"]}'
                if not is_actor_id(actor_id):
                    continue
                region['fips'] = country['fips'] + region['fips']
                output_records(actor_id, region, actor_identifiers, actor_names)

    write_csv('Publisher', [PUBLISHER])
    write_csv('DataSource', [DATASOURCE])
    write_csv('Tag', TAGS)
    write_csv('DataSourceTag', list(map(lambda t: {'datasource_id': DATASOURCE['datasource_id'], 'tag_id': t['tag_id']}, TAGS)))
    write_csv('ActorIdentifier', actor_identifiers)
    write_csv('ActorName', actor_names)

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