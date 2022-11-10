
OUTPUT_DIR = 'ISO-3166-2'
INPUT_DIR = 'subdivisions'
DATASOURCE = {
    "datasource_id": "ISO 3166-2:2020",
    "name": "Codes for the representation of names of countries and their subdivisions – Part 2: Country subdivision code",
    "publisher": "ISO",
    "published": "2020-08-01",
    "URL": "https://www.iso.org/standard/72482.html"
}

import csv

def slurp_file(name):
    data = []
    with open(f'{INPUT_DIR}/{name}.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
    return data

def write_csv(name, rows):
    with open(f'{OUTPUT_DIR}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

def best_name(id, subdivision_names):
    matching = list(filter(lambda x: x["subdivision_code"] == id, subdivision_names))
    en = list(filter(lambda x: x["language"] == "en", matching))
    name = None
    if len(en) == 0:
        name = matching[0]["subdivision_name"]
    else:
        name = en[0]["subdivision_name"]
    return name

def generate_actors(subdivisions, subdivision_names):
    actors = []
    for subdivision in subdivisions:
        actors.append({
            "actor_id": subdivision['subdivision_code'],
            "type": "adm1" if subdivision['subdivision_parent'] == '' else "adm2",
            "is_part_of": subdivision['alpha_2_code'] if subdivision['subdivision_parent'] == '' else subdivision['subdivision_parent'],
            "name": best_name(subdivision['subdivision_code'], subdivision_names),
            "datasource_id": DATASOURCE['datasource_id']
        })
    return actors

def language_of(subdivision_name):
    if subdivision_name['language'] != '':
        return subdivision_name['language']
    elif subdivision_name['language_alpha_3_code'] != '':
        return subdivision_name['language_alpha_3_code']
    else:
        return 'und'

def generate_names(subdivision_names):

    actor_names = []

    for subdivision_name in subdivision_names:
        actor_names.append({
            "actor_id": subdivision_name['subdivision_code'],
            "name": subdivision_name['subdivision_name'],
            "language": language_of(subdivision_name),
            "preferred": 1,
            "datasource_id": DATASOURCE['datasource_id']
        })
        if subdivision_name['subdivision_name_local_variation'] != '':
            actor_names.append({
                "actor_id": subdivision_name['subdivision_code'],
                "name": subdivision_name['subdivision_name_local_variation'],
                "language": language_of(subdivision_name),
                "preferred": 0,
                "datasource_id": DATASOURCE['datasource_id']
            })

    return actor_names

def generate_ids(subdivisions):
    return list(map(lambda subdivision: {
            "actor_id": subdivision['subdivision_code'],
            "identifier": subdivision['subdivision_code'],
            "namespace": 'ISO-3166-2',
            "datasource_id": DATASOURCE['datasource_id']
        }, subdivisions))

def main():
    subdivisions = slurp_file('subdivisions')
    subdivision_names = slurp_file('subdivision-names')

    actors = generate_actors(subdivisions, subdivision_names)
    actor_names = generate_names(subdivision_names)
    actor_ids = generate_ids(subdivisions)

    write_csv('DataSource', [DATASOURCE])
    write_csv('Actor', actors)
    write_csv('ActorName', actor_names)
    write_csv('ActorIdentifier', actor_ids)

if __name__ == "__main__":
    main()