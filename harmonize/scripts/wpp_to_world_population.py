INPUT_FILE = "source/WPP2022_GEN_F01_DEMOGRAPHIC_INDICATORS_COMPACT_REV1/Estimates-Table 1.csv"
OUTPUT_DIR = "World Population Prospects 2022"

PUBLISHER = {
    "id": "UNPD",
    "name": "United Nations Population Division",
    "URL": "https://population.un.org/"
}

DATASOURCE = {
    "datasource_id": "UNPD:WPP:2022",
    "name": "World Population Prospects 2022: Demographic indicators by region, subregion and country, annually for 1950-2100",
    "publisher": PUBLISHER["id"],
    "published": "2022-07-01",
    "URL": "https://population.un.org/wpp/Download/Standard/MostUsed/"
}

import csv

def slurp_file(name):
    data = []
    with open(name) as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            data.append(row)
    return data

def write_csv(name, rows):
    with open(f'{OUTPUT_DIR}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def main():

    input = slurp_file(INPUT_FILE)
    output = []

    for row in input:
        if row[2] == "WORLD":
            output.append({
                "actor_id": "EARTH",
                "year": row[10],
                "population": int(row[11].replace(" ", "")) * 1000,
                "datasource_id": DATASOURCE["datasource_id"]
            })

    write_csv('Publisher', [PUBLISHER])
    write_csv('DataSource', [DATASOURCE])
    write_csv('Population', output)

if __name__ == "__main__":
    main()