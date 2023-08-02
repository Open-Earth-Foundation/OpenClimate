#
# creates a file with of countries
# countries are defined as having ISO-3166-2 adm1 levels
#
# Note: this script uses the processed ISO-3166-2 Actor.csv file
#

import pandas as pd
import os
import csv

def list_of_countries(fl_in):
    df = pd.read_csv(fl_in, keep_default_na=False)
    countries = list(df.loc[df['type'] == 'adm1', 'is_part_of'].drop_duplicates())
    data_list = [{'actor_id': country, 'type': 'country'} for country in countries]
    return data_list

def list_to_csv(data_list, fl_out):
    with open(fl_out, 'w', newline='') as file:
        fieldnames = data_list[0].keys()
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data_list)

if __name__ == "__main__":
    FILE_IN = os.path.abspath('../data/processed/ISO-3166-2/Actor.csv')
    FILE_OUT = '../resources/ISO-3166-1_with_adm1.csv'

    data_list = list_of_countries(FILE_IN)
    list_to_csv(data_list, FILE_OUT)
