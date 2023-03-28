# openclimate_to_elasticsearch.py -- import and hopefully update data from OC to ES
# Copyright 2023 Open Earth Foundation.
# License: Apache-2.0

from elasticsearch import Elasticsearch
import psycopg2
import logging

def get_actor_types(dbname=None, user=None, password=None, host=None):
    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host) as conn:
        with conn.cursor() as curs:
            columns = ("actor_id", "type")
            table_name = "Actor"

            qry = f'''
            SELECT {', '.join(columns)}
            FROM "{table_name}"
            '''

            curs.execute(qry)
            records = curs.fetchall()
            return dict(records)

def get_actor_populations(dbname=None, user=None, password=None, host=None):
    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host) as conn:
        with conn.cursor() as curs:
            columns = ("actor_id", "population")
            table_name = "Population"

            qry = f'''
            SELECT {', '.join(columns)}
            FROM "{table_name}"
            WHERE (actor_id, year) IN (
                SELECT actor_id, MAX(year) AS max_year
                FROM "{table_name}"
                GROUP BY actor_id
            )
            '''

            curs.execute(qry)
            records = curs.fetchall()
            return dict(records)

def get_actor_identifiers(dbname=None, user=None, password=None, host=None):
    with psycopg2.connect(dbname=dbname, user=user, password=password, host=host) as conn:
        with conn.cursor() as curs:
            table_name = "ActorIdentifier"

            qry = f'''
            SELECT actor_id, string_agg(identifier, ',') AS identifiers
            FROM "{table_name}"
            GROUP BY actor_id
            '''

            curs.execute(qry)
            records = curs.fetchall()
            return dict(records)

def main(args):

    db_params = dict(
        dbname=args.dbname,
        user=args.user,
        password=args.password,
        host=args.host
    )

    logging.info(f'get dictionary of actor type and population')
    actor_types = get_actor_types(**db_params)
    actor_populations = get_actor_populations(**db_params)
    actor_identifiers = get_actor_identifiers(**db_params)

    logging.info(f'Connecting to ElasticSearch node {args.esnode} as user {args.esuser}')

    es = Elasticsearch(
        args.esnode,
        basic_auth=(args.esuser, args.espassword)
    )

    logging.info(f'Connecting to PostgreSQL server {args.host} database {args.dbname} as user {args.user}')

    # Delete index if exists
    if es.indices.exists(index=args.esindex):
        es.indices.delete(index=args.esindex)

    settings = {
        'analysis': {
            'analyzer': {
                'asciifolding_lowercase': {
                    'tokenizer': 'standard',
                    'filter': ['lowercase', 'asciifolding']
                }
            }
        }
    }

    # Create new index with settings
    es.indices.create(index=args.esindex, settings=settings)

    properties = {
        'name': {
            'type': 'text',
            'analyzer': 'asciifolding_lowercase'
        },
        'identifier': {
            'type': 'text',
            'fields': {
                'text': {
                    'type': 'text',
                    'analyzer': 'asciifolding_lowercase'
                }
            },
            'analyzer': 'asciifolding_lowercase'
        }
    }

    # Define field mappings
    es.indices.put_mapping(index=args.esindex, properties=properties)

    with psycopg2.connect(dbname=args.dbname, user=args.user, password=args.password, host=args.host) as conn:

        with conn.cursor() as curs:

            logging.info(f'Querying all ActorName rows')

            # To avoid surprises, we explicitly list out the columns we expect from the database
            # instead of using SELECT *

            qry = f'''
            SELECT actor_id, name, language, preferred, datasource_id, created, last_updated
            FROM "ActorName"
            '''

            curs.execute(qry)

            for an in curs:

                # Unpack the tuple

                (actor_id, name, language, preferred, datasource_id, created, last_updated) = an

                actor_type = actor_types.get(actor_id, None)
                actor_population = actor_populations.get(actor_id, None)
                actor_identifier = actor_identifiers.get(actor_id, None)
                identifier_list = actor_identifier.split(',') if isinstance(actor_identifier, str) else None

                logging.info(f'Indexing actor {actor_id} name {name} in language {language}')

                id = actor_id + ":" + language + ":" + name

                doc ={"actor_id": actor_id, "name": name, "language": language, "preferred": preferred,
                      "type": actor_type, "population": actor_population, "identifier":  identifier_list}
                meta = {"created": created, "last_updated": last_updated, "datasource_id": datasource_id}

                # TODO: need to figure out how to insert metadata

                resp = es.index(index=args.esindex, id=id, document=doc)

                logging.debug(f'ElasticSearch response: {resp}')

    es.close()

if __name__ == "__main__":
    import argparse
    import os
    logging.basicConfig(level=logging.INFO)
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbname', help='database name', default=os.environ.get('OPENCLIMATE_DATABASE'))
    parser.add_argument('--user', help='database user', default=os.environ.get('OPENCLIMATE_USER'))
    parser.add_argument('--password', help='database password', default=os.environ.get('OPENCLIMATE_PASSWORD'))
    parser.add_argument('--host', help='database host', default=os.environ.get('OPENCLIMATE_HOST'))
    parser.add_argument('--esnode', help='elasticsearch node URL', default=os.environ.get('OPENCLIMATE_ES_NODE'))
    parser.add_argument('--esindex', help='elasticsearch index', default=os.environ.get('OPENCLIMATE_ES_INDEX'))
    parser.add_argument('--esuser', help='elasticsearch user', default=os.environ.get('OPENCLIMATE_ES_USER'))
    parser.add_argument('--espassword', help='elasticsearch password', default=os.environ.get('OPENCLIMATE_ES_PASSWORD'))
    args = parser.parse_args()
    main(args)