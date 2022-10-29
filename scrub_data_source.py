from schema import tables, tagged_tables
import psycopg2

NO_DATASOURCE_ID = [
    "EmissionsAggTag",
    "EmissionsBreakdown",
    "EmissionsByScope",
    "EmissionsBySector",
    "Methodology",
    "MethodologyToTag",
    "OrganizationContext",
    "Publisher",
    "Tag",
    "TargetTag"
]

def scrub_table(curs, table, datasource_id):

    qry = f'''
    DELETE FROM "{table}"
    WHERE datasource_id = %s
    '''

    curs.execute(qry, [datasource_id])

def scrub_tag_table(curs, table, tagged_table, pkey, datasource_id):

    qry = f'''
    DELETE FROM "{table}"
    WHERE EXISTS (
        SELECT {pkey}
        FROM "{tagged_table}"
        WHERE "{tagged_table}"."{pkey}" = "{table}"."{pkey}"
        AND "{tagged_table}"."datasource_id" = %s
    )
    '''

    curs.execute(qry, [datasource_id])

def scrub_data_source(host, dbname, user, password, datasource_id):

    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host) as conn:

        with conn.cursor() as curs:

            for table in tables.keys():
                if table in tagged_tables:
                    tagged_table = tagged_tables[table]
                    pkey = tables[tagged_table]
                    # This is true for all existing tables
                    assert(len(pkey) == 1)
                    scrub_tag_table(curs, table, tagged_table, pkey[0], datasource_id)
                elif table in NO_DATASOURCE_ID:
                    continue
                else:
                    scrub_table(curs, table, datasource_id)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbname', help='database name')
    parser.add_argument('--user', help='database user')
    parser.add_argument('--password', help='database password')
    parser.add_argument('--host', help='database host')
    parser.add_argument('datasource_id', help='directory with CSV files for OpenClimate tables')
    args = parser.parse_args()
    scrub_data_source(args.host, args.dbname, args.user, args.password, args.datasource_id)