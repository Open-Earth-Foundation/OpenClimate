# import all files

from pathlib import Path
from import_openclimate_data import import_openclimate_data

def import_all_data(processed, host, dbname, user, password):

    prereqs = [
        "ISO-3166-1",
        "Kosovo",
        "ISO-3166-2",
        "UNLOCODE"
    ]

    for prereq in prereqs:
        import_openclimate_data(processed + '/' + prereq, host, dbname, user, password)

    pp = Path(processed)

    for f in pp.iterdir():
        if f.is_dir() and f.name not in prereqs:
            import_openclimate_data(str(f), host, dbname, user, password)

if __name__ == "__main__":
    import argparse
    import os
    parser = argparse.ArgumentParser()
    parser.add_argument('--dbname', help='database name', default=os.environ.get('OPENCLIMATE_DATABASE'))
    parser.add_argument('--user', help='database user', default=os.environ.get('OPENCLIMATE_USER'))
    parser.add_argument('--password', help='database password', default=os.environ.get('OPENCLIMATE_PASSWORD'))
    parser.add_argument('--host', help='database host', default=os.environ.get('OPENCLIMATE_HOST'))
    parser.add_argument('--processed', help='directory with subdirectories', default=os.environ.get('PROCESSED_DATA_DIR'))
    args = parser.parse_args()
    import_all_data(args.processed, args.host, args.dbname, args.user, args.password)