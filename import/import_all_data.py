# import all files

import logging
from pathlib import Path
from import_openclimate_data import import_openclimate_data
from download_and_expand_zipfile import download_and_expand_zipfile
import shutil

def import_all_data(zipfileurl, processed, host, dbname, user, password):

    logger = logging.getLogger(__name__)

    if zipfileurl:
        logger.info("Downloading and expanding zipfile")
        expand_path = download_and_expand_zipfile(zipfileurl)
        processed = expand_path + "/" + processed

    logger.info('Beginning import')

    prereqs = [
        "ISO-3166-1",
        "Kosovo",
        "ISO-3166-2",
        "UNLOCODE"
    ]

    for prereq in prereqs:
        logger.info(f'Importing {prereq}')
        import_openclimate_data(processed + '/' + prereq, host, dbname, user, password)

    pp = Path(processed)

    logger.info('Beginning import')

    for f in pp.iterdir():
        if f.is_dir() and f.name not in prereqs:
            logger.info(f'Importing {f.name}')
            try:
                import_openclimate_data(str(f), host, dbname, user, password)
            except Exception as err:
                logger.error('Error importing %s: %s', f.name, err)

    if zipfileurl:
        shutil.rmtree(expand_path)

if __name__ == "__main__":
    import argparse
    import os
    logging.basicConfig(level=logging.INFO)
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbname', help='database name', default=os.environ.get('OPENCLIMATE_DATABASE'))
    parser.add_argument('--user', help='database user', default=os.environ.get('OPENCLIMATE_USER'))
    parser.add_argument('--password', help='database password', default=os.environ.get('OPENCLIMATE_PASSWORD'))
    parser.add_argument('--host', help='database host', default=os.environ.get('OPENCLIMATE_HOST'))
    parser.add_argument('--zipfileurl', help='URL of zip file to use for fetching data', default=os.environ.get('ZIP_FILE_URL'))
    parser.add_argument('--processed', help='directory with subdirectories', default=os.environ.get('PROCESSED_DATA_DIR'))
    args = parser.parse_args()
    import_all_data(args.zipfileurl, args.processed, args.host, args.dbname, args.user, args.password)