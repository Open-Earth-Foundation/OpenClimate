#!/bin/bash

python3 import_openclimate_data.py $PROCESSED_DATA_DIR/ISO-3166-1
python3 import_openclimate_data.py $PROCESSED_DATA_DIR/Kosovo
python3 import_openclimate_data.py $PROCESSED_DATA_DIR/ISO-3166-2
python3 import_openclimate_data.py $PROCESSED_DATA_DIR/UNLOCODE

for DATASOURCE in $PROCESSED_DATA_DIR/*; do
    if [ -d $DATASOURCE ]; then
        python3 import_openclimate_data.py $DATASOURCE
    fi
done