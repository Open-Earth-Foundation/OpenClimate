#!/usr/bin/python
# unlocode_to_openclimate.py -- convert UNLOCODE data to OpenClimate format

import csv
import re

INPUT_DIR = 'loc221csv'
OUTPUT_DIR = 'UNLOCODE'

PUBLISHER = {
    "id": "UNECE",
    "name": "United Nations Economic Commission for Europe (UNECE)",
    "URL": "https://unece.org/"
}

DATASOURCE = {
    "datasource_id": "UNLOCODE:2022-1",
    "name": "UN/LOCODE (CODE FOR TRADE AND TRANSPORT LOCATIONS) Issue 2022-1",
    "publisher": PUBLISHER["id"],
    "published": "2022-07-08",
    "URL": "https://unece.org/trade/uncefact/unlocode"
}

LOCODE_COLUMNS = [
    "Ch",
    "ISO 3166-1",
    "LOCODE",
    "Name",
    "NameWoDiacritics",
    "SubDiv",
    "Function",
    "Status",
    "Date",
    "IATA",
    "Coordinates",
    "Remarks"
]

ACTOR_COLUMNS = [
    "actor_id",
    "type",
    "name",
    "is_part_of",
    "datasource_id"
]

ACTOR_NAME_COLUMNS = [
    "actor_id",
    "name",
    "language",
    "preferred",
    "datasource_id"
]

ACTOR_IDENTIFIER_COLUMNS = [
    "actor_id",
    "identifier",
    "namespace",
    "datasource_id"
]

TERRITORY_COLUMNS = [
    "actor_id",
    "lat",
    "lng",
    "datasource_id"
]

SUBDIVS_COLUMNS = [
    "country_code",
    "region_code",
    "name",
    "type"
]


def write_csv(name, rows):
    with open(f'{OUTPUT_DIR}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def prepare_output_file(name, column_names):
    with open(f'{OUTPUT_DIR}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=column_names)
        writer.writeheader()


def write_output_row(filename, column_names, row):
    with open(f'{OUTPUT_DIR}/{filename}.csv', mode='a') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=column_names)
        writer.writerow(row)


def coordinates_to_decimal(coords):

    lat_deg = int(coords[0:2])
    lat_min = int(coords[2:4])
    lat_dir = coords[4:5]

    lat = round(lat_deg*10000 + (lat_min*10000)/60) * \
        (-1 if lat_dir == "S" else 1)

    lng_deg = int(coords[6:9])
    lng_min = int(coords[9:11])
    lng_dir = coords[11:12]

    lng = round(lng_deg*10000 + (lng_min*10000)/60) * \
        (-1 if lng_dir == "W" else 1)

    return (lat, lng)


def handle_input_row(row, subdivs):

    # Skip if no LOCODE

    if row["LOCODE"] == "":
        return

    actor_id = f'{row["ISO 3166-1"].strip()} {row["LOCODE"].strip()}'

    # Test for function = road station; not perfect but...
    # Test if name is air, rail, or ferry port with regular expression
    regex = (
        '^Port\sof'
        '|\sPort$'
        '|\sPt\s?/'
        '|Pt\.'
        '|\sPort\s?/'
        '|\sApt\s?/'
        '|\sApt$'
        '|\sRailway\sStation.*'
        '|\sFerryport'
        '|Ferry\sPort'
        '|\sTerminal'
        '|.+Airport'
    )

    if re.search(regex, row["Name"]) or row["ISO 3166-1"].strip() == "XZ":
        # We want to delete bad existing rows

        write_output_row("Actor.delete", ["actor_id"], {
            "actor_id": actor_id
        })
        write_output_row("ActorName.delete", ["actor_id"], {
            "actor_id": actor_id
        })
        write_output_row("ActorIdentifier.delete", ["actor_id"], {
            "actor_id": actor_id
        })
        write_output_row("Territory.delete", ["actor_id"], {
            "actor_id": actor_id
        })

    else:

        if row["SubDiv"] == "":
            parent_id = row["ISO 3166-1"].strip()
        else:
            subdiv_id = f'{row["ISO 3166-1"].strip()}-{row["SubDiv"].strip()}'
            if subdiv_id in subdivs:
                parent_id = subdiv_id
            else:
                parent_id = row["ISO 3166-1"].strip()

        write_output_row("Actor", ACTOR_COLUMNS, {
            "actor_id": actor_id,
            "type": "city",
            "name": row["Name"],
            "is_part_of": parent_id,
            "datasource_id": DATASOURCE["datasource_id"]
        })

        write_output_row("ActorName", ACTOR_NAME_COLUMNS, {
            "actor_id": actor_id,
            "name": row["Name"],
            "language": "und",
            "preferred": 0,
            "datasource_id": DATASOURCE["datasource_id"]
        })

        write_output_row("ActorIdentifier", ACTOR_IDENTIFIER_COLUMNS, {
            "actor_id": actor_id,
            "identifier": actor_id,
            "namespace": "UNLOCODE",
            "datasource_id": DATASOURCE["datasource_id"]
        })

        if (row["NameWoDiacritics"] != row["Name"]):
            write_output_row("ActorName", ACTOR_NAME_COLUMNS, {
                "actor_id": actor_id,
                "name": row["NameWoDiacritics"],
                "language": "und",
                "preferred": 0,
                "datasource_id": DATASOURCE["datasource_id"]
            })

        if row["Coordinates"] != "":
            (lat, lng) = coordinates_to_decimal(row["Coordinates"])
            write_output_row("Territory", TERRITORY_COLUMNS, {
                "actor_id": actor_id,
                "lat": lat,
                "lng": lng,
                "datasource_id": DATASOURCE["datasource_id"]
            })


def read_subdivs():
    subdivs = {}
    with open(f'{INPUT_DIR}/2022-1 SubdivisionCodes.csv') as csvfile:
        reader = csv.DictReader(csvfile, fieldnames=SUBDIVS_COLUMNS)
        for row in reader:
            subdivs[f'{row["country_code"].strip()}-{row["region_code"].strip()}'] = {
                "name": row["name"],
                "type": row["type"]
            }
    return subdivs


def main():

    write_csv('Publisher', [PUBLISHER])
    write_csv('DataSource', [DATASOURCE])

    prepare_output_file('Actor', ACTOR_COLUMNS)
    prepare_output_file('ActorName', ACTOR_NAME_COLUMNS)
    prepare_output_file('ActorIdentifier', ACTOR_IDENTIFIER_COLUMNS)
    prepare_output_file('Territory', TERRITORY_COLUMNS)

    prepare_output_file('Actor.delete', ["actor_id"])
    prepare_output_file('ActorName.delete', ["actor_id"])
    prepare_output_file('ActorIdentifier.delete', ["actor_id"])
    prepare_output_file('Territory.delete', ["actor_id"])

    subdivs = read_subdivs()

    for i in [1, 2, 3]:
        with open(f'{INPUT_DIR}/2022-1 UNLOCODE CodeListPart{i}.csv') as csvfile:
            reader = csv.DictReader(csvfile, fieldnames=LOCODE_COLUMNS)
            for row in reader:
                handle_input_row(row, subdivs)


if __name__ == "__main__":
    main()
