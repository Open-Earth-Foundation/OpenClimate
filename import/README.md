# OpenClimate-data-ingestion

Scripts for importing a datasource in the single-actor-table CSV structure

# Scripts

- import_openclimate_data.py: imports data into the database from a directory
  of CSV files
- scrub_data_source.py: removes all records in the database related to a
  given data source

# Import directory format

The import format is a directory of CSV files.

Each file has the name of a table in the OpenClimate schema. So, `Actor.csv`
contains Actors.

Each row of the file is a row of data to either add or update in the table.

Columns from the schema that aren't in the file will be ignored.

If the row already exists in the database, it will be updated instead.

Don't include timestamp columns `created` and `last_updated` in CSV files.

To delete rows from a table, include a file called `<TableName>.delete.csv`. Each row should include the keys for the table to delete.

# Environment variables

The scripts have command-line arguments that can get pretty cumbersome. You
can use these environment variables to avoid long command lines. You can
add them to .bashrc or whatever if you want to make them available all the
time.

- `OPENCLIMATE_HOST`: hostname to connect to
- `OPENCLIMATE_DATABASE`: database to connect to
- `OPENCLIMATE_USER`: database user
- `OPENCLIMATE_PASSWORD`: access password

These are kind of a security issue, so be careful with them.

## Importing data to a developer environment

Here are the steps to import data in the developer environment. One of the containers that docker-compose creates is a shell that can be used for running import scripts.

In this container, `/opt/import` includes the data importer script, and `/var/local/harmonize` is the data harmonization directory.

1. In your OpenClimate directory, run `docker-compose --profile oc exec hub-importer /bin/sh` to log into the hub-importer shell.
2. Run `cd /opt/import` to change to the importer directory.
3. Run `pip3 install psycopg2-binary` to install the PostgreSQL library for Python.
4. Run `python3 import_openclimate_data.py <data source directory>` to import a data source.

Four important directories to import, in order:

- /var/local/harmonize/data/processed/ISO-3166-1/ for countries (about 250)
- /var/local/harmonize/data/processed/Kosovo/ for this one country
- /var/local/harmonize/data/processed/ISO-3166-2/ for regions (about 5000)
- /var/local/harmonize/data/processed/UNLOCODE/ for cities (about 120,000)

This should get you a good geographical hierarchy.
