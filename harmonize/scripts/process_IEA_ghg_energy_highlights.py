import csv
import os
from pathlib import Path
import pandas as pd
import pycountry
import re
from typing import List
from typing import Dict
from utils import df_wide_to_long
from utils import make_dir

def no_duplicates(df, col):
        """True if no duplicate values"""
        return ~df.duplicated(subset=[col]).any()

def simple_write_csv(
    output_dir: str = None, name: str = None, rows: List[Dict] | Dict = None
) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f"{output_dir}/{name}.csv", mode="w") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


def country_lookup(name):
    try:
        return pycountry.countries.lookup(name).alpha_2
    except LookupError:
        return float('NaN')


def simple_write_csv(output_dir: str = None,
                     name: str = None,
                     rows: List[Dict] | Dict = None) -> None:

    if isinstance(rows, dict):
        rows = [rows]

    with open(f'{output_dir}/{name}.csv', mode='w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    # output directory
    outputDir = '../data/processed/IEA/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/IEA/GHGHighlights.XLS'
    fl = os.path.abspath(fl)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'IEA',
        'name': 'International Energy Agency',
        'URL': 'https://www.iea.org/'
    }

    simple_write_csv(outputDir, "Publisher", publisherDict)

    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'IEA:GHG_energy_highlights:2022',
        'name': 'Greenhouse Gas Emissions from Energy Highlights',
        'publisher': f"{publisherDict['id']}",
        'published': '2022-09-01',
        'URL': "https://www.iea.org/data-and-statistics/data-product/greenhouse-gas-emissions-from-energy-highlights",
        'citation': 'IEA. (2022). Greenhouse Gas Emissions from Energy Highlights [Data set]. IEA. https://www.iea.org/data-and-statistics/data-product/greenhouse-gas-emissions-from-energy-highlights'
    }

    simple_write_csv(outputDir, "DataSource", datasourceDict)

    # =================================================================
    # EmissionsAgg
    # =================================================================
    #xl = pd.ExcelFile(fl)
    #sheets = xl.sheet_names

    sheet_name = 'GHG Energy'
    new_col_name = sheet_name.lower().replace(' ','_')
    df_raw = pd.read_excel(fl, sheet_name=sheet_name, header=3)

    # create a regular expression to match the desired values
    pattern = re.compile(r'^(?!\d{4}[.-]\d{1,4})')

    # filter the list to keep only values that match the pattern
    columns_to_keep = list(filter(lambda x: re.match(pattern, str(x)), df_raw.columns))
    units = columns_to_keep[0]

    rename_columns = {f'{units}': 'country'}

    not_countries = [
        'Central America',
        'Eastern Africa',
        'Middle Africa',
        'Western Africa',
        'Asia (excl. China)',
        'World',
        'Middle East',
        'Region/Country/Economy',
        'Chinese Taipei',
        '   Annex I EIT   ',
        'Former Soviet Union (if no detail)',
        'Europe',
        'Annex B Kyoto Parties',
        '   Annex II Parties   ',
        '      Europe      ',
        'Non-Annex I Parties ',
        '      North America      ',
        '      Asia Oceania',
        'G20',
        'Hong Kong, China',
        'Africa',
        'Asia (excl. China)',
        'IEA/Accession/Association',
        'Asia',
        'Annex I Parties ',
        'Oceania',
        'Former Yugoslavia (if no detail)',
        'Americas',
        'Former Soviet Union (if no detail)',
        'Former Yugoslavia (if no detail)',
    ]

    remove_with_terms = [
        "Source:",
        "Notes:",
        "Growth",
        "Data ",
        "European Union",
        "OECD",
        "0.05%",
        "Other ",'G7', 'G8', 'Annex', 'if no detail',
        'Europe',
        'Chinese Taipei',
        'World', 'Africa', 'Asia', 'Americas',
        'Middle East', 'IEA/Accession/Association', 'Oceania',
        'Region/Country/Economy',
        'North America','G20', 'incl.'
    ]

    replace_dict = {
        'Republic of Türkiye': 'Turkey',
        'DPR of Korea': 'North Korea',
        "People's Rep. of China": "People's Republic of China",
        'Islamic Rep. of Iran': 'Islamic Republic of Iran',
        'Syrian Arab Republic ': 'Syrian Arab Republic',
        'United Rep. of Tanzania': 'Tanzania',
        'Dem. Rep. of Congo': 'Congo, the Democratic Republic of the'
    }

    df = (
        df_raw[columns_to_keep]
        .rename(columns = rename_columns)
        .loc[lambda x: x['country'].notnull()]
        .loc[lambda x: ~x['country'].str.contains('total', case=False)]
        .loc[lambda x: ~(x['country'].str.contains('|'.join(remove_with_terms)))]
        .assign(country = lambda x: x.country.replace(replace_dict))
    )

    # reshape dataframe
    df_tmp = df_wide_to_long(df, value_name=f"{new_col_name}", var_name='year')

    # remove null values
    df_tmp = df_tmp.loc[df_tmp['ghg_energy'] != '..']

    # get actor_id from country name
    df_iso = pd.DataFrame(
        data=[(name, country_lookup(name)) for name in set(list(df.country))],
        columns=['country', 'actor_id']
    )

    # manually add Kosovo to df_iso
    df_iso.loc[df_iso['country'] == 'Kosovo', 'actor_id'] = 'XK'

    if not_found:=list(df_iso.loc[df_iso['actor_id'].isnull(), 'country']):
        print(f"Countries not found: {not_found}")

    df_out = (
        pd.merge(df_tmp, df_iso, on=['country'])
        .assign(units = units)
        .assign(total_emissions = lambda x: x['ghg_energy'] * 10**6)
        .assign(emissions_id = lambda x: x.apply(lambda row: f"IEA_GHG_energy:{row['actor_id']}:{row['year']}", axis=1))
        .assign(datasource_id = datasourceDict['datasource_id'])

    )

    # drop null actor_ids (this drops "Korea", not sure if North, South, or united)
    df_out = df_out.loc[df_out['actor_id'].notnull()]

    # check types and sort
    astype_dict = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }

    outColumns = astype_dict.keys()

    df_emissionsAgg = (
        df_out[outColumns]
        .astype(astype_dict)
        .sort_values(by=['actor_id', 'year'])
    )

    if not no_duplicates(df_out, 'emissions_id'):
        print('There are duplicates emission_ids')

    # convert to csv
    df_emissionsAgg.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================

    # dictionary of tag_id : tag_name
    tagDict = {
        'energy_related_ghg': 'Energy related greenhouse gas emissions',
        "GHGs_included_CO2_CH4_N2O": "GHGs included: CO2, CH4, and N2O",
        'includes_fugitive_emissions': 'Includes fugitive emissions',
        "GWP_100_AR4": "Uses GWP100 from IPCC AR4",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": datasourceDict["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)