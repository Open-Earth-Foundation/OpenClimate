from genericpath import isfile
from pathlib import Path
import csv
import psycopg2
from datetime import datetime
from schema import tables, pkeys
import logging

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

    if len(toupdate) > 1:
        qry = f'''
        INSERT INTO "{table}" ({", ".join(map(lambda col: f'"{col}"', columns))})
        VALUES ({", ".join(['%s'] * len(vals))})
        ON CONFLICT ({", ".join(map(lambda col: f'"{col}"', pkey))})
        DO UPDATE
            SET ({", ".join(map(lambda col: f'"{col}"', toupdate))}) = ({", ".join(map(lambda col: f'EXCLUDED."{col}"', toupdate))})
            WHERE {" OR ".join(map(lambda col: f'("{table}"."{col}" IS NULL AND EXCLUDED."{col}" IS NOT NULL) OR ("{table}"."{col}" IS NOT NULL AND EXCLUDED."{col}" IS NULL) OR ("{table}"."{col}" != EXCLUDED."{col}")', toupdate[:-1]))}
        '''
    else:
        qry = f'''
        INSERT INTO "{table}" ({", ".join(map(lambda col: f'"{col}"', columns))})
        VALUES ({", ".join(['%s'] * len(vals))})
        ON CONFLICT ({", ".join(map(lambda col: f'"{col}"', pkey))})
        DO NOTHING
        '''

    curs.execute(qry, vals)

def import_table(curs, table, pkey, path):

    with path.open() as f:
        data = csv.DictReader(f)
        for row in data:
            import_row(curs, table, pkey, row)

def delete_row(curs, table, pkey, row):

    vals = list(map(lambda v: None if v == '' else v, row.values()))

    qry = f'''
    DELETE FROM "{table}"
    WHERE {" AND ".join(list(map(lambda x: f'{x} = %s', list(row.keys()))))}
    '''

    curs.execute(qry, vals)

def delete_from_table(curs, table, pkey, path):
    with path.open() as f:
        data = csv.DictReader(f)
        for row in data:
            delete_row(curs, table, pkey, row)

def import_openclimate_data(dir, host, dbname, user, password):

    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host) as conn:

        with conn.cursor() as curs:

            for table in tables:
                p = Path(dir + "/" + table + ".csv")
                if p.is_file():
                    import_table(curs, table, pkeys[table], p)

            # For deletions, we work in reverse order!
            for table in reversed(tables):
                p = Path(dir + "/" + table + ".delete.csv")
                if p.is_file():
                    delete_from_table(curs, table, pkeys[table], p)

def update_actor_data_coverage(host, dbname, user, password):

    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host) as conn:

        with conn.cursor() as curs:

            qry = f'''
            insert into "ActorDataCoverage" (actor_id, has_data, created_at, updated_at)
            SELECT actor_id,
            (0 < (select count(*) from "EmissionsAgg" where "EmissionsAgg".actor_id = "Actor".actor_id))
            OR (0 < (select count(*) from "Target" where "Target".actor_id = "Actor".actor_id))
            as has_data,
            NOW() as created_at,
            NOW() as updated_at
            FROM "Actor"
            ON CONFLICT (actor_id)
                DO UPDATE
                    SET (has_data, updated_at) = (EXCLUDED.has_data, EXCLUDED.updated_at);
            '''

            curs.execute(qry)

if __name__ == "__main__":
    import argparse
    import os
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbname', help='database name', default=os.environ.get('OPENCLIMATE_DATABASE'))
    parser.add_argument('--user', help='database user', default=os.environ.get('OPENCLIMATE_USER'))
    parser.add_argument('--password', help='database password', default=os.environ.get('OPENCLIMATE_PASSWORD'))
    parser.add_argument('--host', help='database host', default=os.environ.get('OPENCLIMATE_HOST'))
    parser.add_argument('dir', help='directory with CSV files for OpenClimate tables')
    args = parser.parse_args()
    import_openclimate_data(args.dir, args.host, args.dbname, args.user, args.password)
    update_actor_data_coverage(args.host, args.dbname, args.user, args.password)