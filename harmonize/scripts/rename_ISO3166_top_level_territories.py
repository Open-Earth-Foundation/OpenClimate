#
# ON-572 (change type of top-level territories to type 'territory')
#
# FILE_COUNTRIES was created using /scripts/create_countries_list.py
#
# EP created ISO-3166-1/Actor.csv by hand
# this script modifies the hand created processed/ISO-3166-1/Actor.csv
#

import csv
import os
import pandas as pd

if __name__ == "__main__":
    FILE_COUNTRIES = os.path.abspath('../resources/ISO-3166-1_with_adm1.csv')
    FILE_ISO1 = os.path.abspath('../data/processed/ISO-3166-1/Actor.csv')
    FILE_OUT = os.path.abspath('../data/processed/ISO-3166-1/Actor.csv')

    df_countries = pd.read_csv(FILE_COUNTRIES, keep_default_na=False)
    df_iso1 = pd.read_csv(FILE_ISO1, keep_default_na=False)

    # merge countries and iso1 and type of top-level territories
    df_out = (
        pd.merge(df_iso1, df_countries, on='actor_id', how='left')
        .assign(type=lambda df: df['type_y'].fillna('territory'))
        .drop(columns=['type_x', 'type_y'])
    )

    # ensure EARTH retains planet type
    df_out.loc[df_out['actor_id'] == 'EARTH', 'type'] = 'planet'

    # retain original ordering of the columns
    df_out = df_out[df_iso1.columns]

    df_out.to_csv(FILE_OUT, index=False, quotechar='"', quoting=csv.QUOTE_ALL)

