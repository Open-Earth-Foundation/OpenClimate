# openclimate_to_elasticsearch.py -- import and hopefully update data from OC to ES
# Copyright 2023 Open Earth Foundation.
# License: Apache-2.0

from elasticsearch import Elasticsearch
import psycopg2
import logging

def main(args):

    logging.info(f'Connecting to ElasticSearch node {args.esnode} as user {args.esuser}')

    es = Elasticsearch(
        args.esnode,
        basic_auth=(args.esuser, args.espassword)
    )

    logging.info(f'Connecting to PostgreSQL server {args.host} database {args.dbname} as user {args.user}')

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

                logging.info(f'Indexing actor {actor_id} name {name} in language {language}')

                id = actor_id + ":" + language + ":" + name

                doc ={"actor_id": actor_id, "name": name, "language": language, "preferred": preferred}
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