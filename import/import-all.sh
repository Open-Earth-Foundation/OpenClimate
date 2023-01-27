#!/bin/sh

export IMPORTER=/opt/openclimate-import/import_openclimate_data.py

echo Importing country records
python3 $IMPORTER $PROCESSED_DATA_DIR/ISO-3166-1
echo Importing Kosovo
python3 $IMPORTER $PROCESSED_DATA_DIR/Kosovo
echo Importing provinces, states and regions
python3 $IMPORTER $PROCESSED_DATA_DIR/ISO-3166-2
echo Importing cities
python3 $IMPORTER $PROCESSED_DATA_DIR/UNLOCODE

for DATASOURCE in $PROCESSED_DATA_DIR/*; do
    if [ -d $DATASOURCE ]; then
        echo Importing `basename $DATASOURCE`
        python3 $IMPORTER $DATASOURCE
    fi
done