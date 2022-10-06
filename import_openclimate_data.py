from genericpath import isfile
from pathlib import Path
import csv
import psycopg2
from datetime import datetime

def import_row(curs, table, pkey, row):

    # TODO: check that these always return in order

    columns = list(row.keys())
    vals = list(map(lambda v: None if v == '' else v, row.values()))

    now = datetime.now()

    # Append create and update timestamp

    columns.append('last_updated')
    vals.append(now)

    columns.append('created')
    vals.append(now)

    # These are used for update; remove the pkey!

    nonkeys = list(filter(lambda col: col not in pkey, columns))

    # Remove create timestamp

    toupdate = nonkeys[:-1]

    qry = f'''
    INSERT INTO "{table}" ({", ".join(map(lambda col: f'"{col}"', columns))})
    VALUES ({", ".join(['%s'] * len(vals))})
    ON CONFLICT ({", ".join(map(lambda col: f'"{col}"', pkey))})
    DO UPDATE SET ({", ".join(map(lambda col: f'"{col}"', toupdate))}) = ({", ".join(map(lambda col: f'EXCLUDED."{col}"', toupdate))})
    '''

    curs.execute(qry, vals)

def import_table(curs, table, pkey, path):
    with path.open() as f:
        data = csv.DictReader(f)
        for row in data:
            import_row(curs, table, pkey, row)

def import_openclimate_data(dir, host, dbname, user, password):

    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host) as conn:

        with conn.cursor() as curs:

            # Note that because of foreign key dependencies we need
            # to import in this order. Make sure not to put a table
            # with a foreign key before the table it refers to!

            tables = {
                "Publisher": ["id"],
                "DataSource": ["datasource_id"],
                "Actor": ["actor_id"],
                "ActorIdentifier": ["identifier", "namespace"],
                "ActorName": ["actor_id", "language", "name"],
                "Sector": ["sector_id"],
                "Methodology": ["methodology_id"],
                "EmissionsAgg": ["emissions_id"],
                "EmissionsByScope": ["emissions_id", "scope"],
                "EmissionsBySector": ["emissions_id", "sector_id"]
            }

            for table, pkey in tables.items():
                p = Path(dir + "/" + table + ".csv")
                if p.is_file():
                    import_table(curs, table, pkey, p)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbname', help='database name')
    parser.add_argument('--user', help='database user')
    parser.add_argument('--password', help='database password')
    parser.add_argument('--host', help='database host')
    parser.add_argument('dir', help='directory with CSV files for OpenClimate tables')
    args = parser.parse_args()
    import_openclimate_data(args.dir, args.host, args.dbname, args.user, args.password)