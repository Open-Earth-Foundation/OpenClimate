# openclimate_to_elasticsearch.py -- import and hopefully update data from OC to ES
# Copyright 2023 Open Earth Foundation.
# License: Apache-2.0

from elasticsearch import Elasticsearch
import psycopg2
import logging


def main(args):

    logging.info(
        f'Connecting to ElasticSearch node {args.esnode} as user {args.esuser}')

    es = Elasticsearch(
        args.esnode,
        basic_auth=(args.esuser, args.espassword)
    )

    logging.info(
        f'Connecting to PostgreSQL server {args.host} database {args.dbname} as user {args.user}')

    with psycopg2.connect(dbname=args.dbname, user=args.user, password=args.password, host=args.host) as conn:

        with conn.cursor() as curs:

            logging.info(f'Querying all ActorName rows')

            # To avoid surprises, we explicitly list out the columns we expect from the database
            # instead of using SELECT *

            qry = f'''
            SELECT 
                an.actor_id, an.name, an.language, an.preferred, an.datasource_id, an.created, an.last_updated, 
                ac.type,
                GDP.gdp, 
                pop.population
            FROM "ActorName" AS an
            LEFT JOIN "Actor" AS ac
            ON ac.actor_id = an.actor_id
            LEFT JOIN (
                SELECT actor_id, gdp, year
                FROM "GDP"
                WHERE (actor_id, year) IN (
                SELECT actor_id, MAX(year) AS max_year
                FROM "GDP"
                GROUP BY actor_id
                )
            ) AS GDP
            ON an.actor_id = GDP.actor_id
            LEFT JOIN (
                SELECT actor_id, population, year
                FROM "Population"
                WHERE (actor_id, year) IN (
                SELECT actor_id, MAX(year) AS max_year
                FROM "Population"
                GROUP BY actor_id
                )
            ) AS pop
            ON an.actor_id = pop.actor_id
            '''

            curs.execute(qry)

            for an in curs:

                # Unpack the tuple

                (actor_id, name, language, preferred,
                 datasource_id, created, last_updated,
                 type, gdp, population) = an

                logging.info(
                    f'Indexing actor {actor_id} name {name} in language {language} with population {population} and GDP {gdp}')

                id = actor_id + ":" + language + ":" + name

                doc = {"actor_id": actor_id, "name": name,
                       "language": language, "preferred": preferred,
                       "type": type, "gdp": gdp, "population": population}
                meta = {"created": created, "last_updated": last_updated,
                        "datasource_id": datasource_id}

                # TODO: need to figure out how to insert metadata

                resp = es.index(index=args.esindex, id=id, document=doc)

                logging.debug(f'ElasticSearch response: {resp}')

    es.close()


if __name__ == "__main__":
    import argparse
    import os
    logging.basicConfig(level=logging.INFO)
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbname', help='database name',
                        default=os.environ.get('OPENCLIMATE_DATABASE'))
    parser.add_argument('--user', help='database user',
                        default=os.environ.get('OPENCLIMATE_USER'))
    parser.add_argument('--password', help='database password',
                        default=os.environ.get('OPENCLIMATE_PASSWORD'))
    parser.add_argument('--host', help='database host',
                        default=os.environ.get('OPENCLIMATE_HOST'))
    parser.add_argument('--esnode', help='elasticsearch node URL',
                        default=os.environ.get('OPENCLIMATE_ES_NODE'))
    parser.add_argument('--esindex', help='elasticsearch index',
                        default=os.environ.get('OPENCLIMATE_ES_INDEX'))
    parser.add_argument('--esuser', help='elasticsearch user',
                        default=os.environ.get('OPENCLIMATE_ES_USER'))
    parser.add_argument('--espassword', help='elasticsearch password',
                        default=os.environ.get('OPENCLIMATE_ES_PASSWORD'))
    args = parser.parse_args()
    main(args)
