import csv
import concurrent.futures
import numpy as np
import os
from pathlib import Path
import pandas as pd
import pycountry
from typing import List
from typing import Dict
from utils import make_dir
from utils import write_to_csv
from utils import country_to_iso2


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
    outputDir = '../data/processed/openGHGMap_R2021A/'
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # raw data file path
    fl = '../data/raw/openGHGMap_R2021A/allcountries_summary.xlsx'
    fl = os.path.abspath(fl)

    # climactor path
    fl_clim = '../resources/country_dict_updated.csv'
    fl_clim = os.path.abspath(fl_clim)

    # locode to climactor mapping
    fl_locode = '../resources/key_dict_LOCODE_to_climactor.csv'
    fl_locode = os.path.abspath(fl_locode)

    # subnational ISO-3166-2 codes for regions (created using chatGPT)
    fl_region_codes = '../resources/openGHGmap_region_codes_20230105.csv'
    fl_region_codes = os.path.abspath(fl_region_codes)

    # =================================================================
    # Publisher
    # =================================================================
    publisherDict = {
        'id': 'NTNU',
        'name': 'Norwegian University of Science and Technology',
        'URL': 'https://www.ntnu.edu/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')
    # =================================================================
    # DataSource
    # =================================================================
    datasourceDict = {
        'datasource_id': 'openGHGmap:R2021A',
        'name': 'European OpenGHGMap',
        'publisher': publisherDict['id'],
        'published': '2021-01-01',
        'URL': 'https://openghgmap.net/data/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # =================================================================
    # EmissionsAgg
    # =================================================================

    # version R2021A only has data for 2018
    COVERAGE_YEAR = 2018

    # -----------------------------
    # load raw data
    # -----------------------------
    # admin_levels: 1=countries, 2-3=unsused, 4-5=NUTS-2, 6-7=counties, 8+=munis
    df = pd.read_excel(fl)

    # -----------------------------
    # name harmonize the countries
    # -----------------------------
    df_clim = pd.read_csv(fl_clim, keep_default_na=False)

    # name harmonize
    df['country_harmonized'] = (
        df['Country'].str.title()
        .replace(to_replace=list(df_clim['wrong']),
                 value=list(df_clim['right']))
    )

    # -----------------------------
    # replace "wrong" names
    # -----------------------------
    replace_dict = {
        "Czech-Republic": "Czechia",
        "Ireland-And-Northern-Ireland": "Ireland",
        "Great-Britain": "United Kingdom of Great Britain and Northern Ireland",
        "Turkey": "Türkiye",
    }

    df['country_harmonized'] = df['country_harmonized'].replace(replace_dict)

    # -----------------------------
    # get country ISO-3166-1 code
    # -----------------------------
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(country_to_iso2, name, return_input=True)
                   for name in list(set(df['country_harmonized']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # put iso code in dataframe
    df_iso = pd.DataFrame(data, columns=['country_harmonized', 'ISO-3166-1'])

    # add alpha_3 values
    df_iso['alpha_3'] = (
        df_iso['ISO-3166-1']
        .apply(lambda x: pycountry.countries.get(alpha_2=x).alpha_3)
    )

    # -----------------------------
    # merge iso code
    # -----------------------------
    df = pd.merge(df, df_iso, on=['country_harmonized'])

    # -----------------------------
    # just level 1 (COUNTRIES)
    # -----------------------------
    columns = [
        'Country',
        'Region Name',
        'admin_level',
        'Total (t CO2)',
        'country_harmonized',
        'ISO-3166-1',
        'alpha_3'
    ]

    # only select greater than 8 admin level
    filt = (df['admin_level'] == 1)
    df_country_tmp = df[columns].loc[filt]

    # drop duplicates
    df_country_tmp = df_country_tmp.drop_duplicates()

    df_country_tmp['year'] = COVERAGE_YEAR

    df_country_tmp = df_country_tmp.rename(columns={
        'Total (t CO2)': 'total_emissions',
        'ISO-3166-1': 'actor_id'
    })

    # create id columns
    df_country_tmp['datasource_id'] = datasourceDict['datasource_id']

    # create emissions_id columns
    df_country_tmp['emissions_id'] = df_country_tmp.apply(lambda row:
                                                          f"openGHGmap:{row['actor_id']}:{row['year']}",
                                                          axis=1)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    filt = ~df_country_tmp['actor_id'].isna()
    df_country_tmp = df_country_tmp.loc[filt]

    # ensure type
    df_emissionsAgg_country = df_country_tmp[emissionsAggColumns].astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_emissionsAgg_country = df_emissionsAgg_country.sort_values(
        by=['actor_id', 'year'])

    # -----------------------------
    # dataset with ISO1, region, admin, ISO2
    # -----------------------------
    data = []
    for iso1 in sorted(set(df['ISO-3166-1'])):
        filt = df['ISO-3166-1'] == iso1
        df_tmp = df.loc[filt]

        filt = (df_tmp['admin_level'] > 1) & (df_tmp['admin_level'] < 8)
        df_tmp = df_tmp.loc[filt]

        df_regions = df_tmp[['Region Name', 'admin_level']].drop_duplicates()

        for region, level in zip(df_regions['Region Name'], df_regions['admin_level']):
            try:
                tmp = pycountry.subdivisions.lookup(region)
                if tmp.country_code == iso1:
                    data.append((iso1, region, level, tmp.code))
                else:
                    data.append((iso1, region, level, np.NaN))
            except LookupError as e:
                data.append((iso1, region, level, np.NaN))

    df_iso2 = pd.DataFrame(
        data, columns=['ISO-3166-1', 'Region Name', 'admin_level', 'ISO-3166-2'])

    # -----------------------------
    # just level 4
    # -----------------------------
    df_lev4_fixed = pd.read_csv(fl_region_codes)
    df_lev4_fixed = df_lev4_fixed.rename(columns={' ISO-3166-2': 'ISO-3166-2'})
    df_lev4_fixed['admin_level'] = 4
    df_admin_47 = pd.concat(
        [df_iso2.loc[df_iso2['ISO-3166-2'].notnull()], df_lev4_fixed])

    # -----------------------------
    # levels 4 through 7 (SUBNAT)
    # -----------------------------
    columns = [
        'Country',
        'Region Name',
        'admin_level',
        'Total (t CO2)',
        'country_harmonized',
        'ISO-3166-1',
        'alpha_3'
    ]

    # only select greater than 8 admin level
    filt = (df['admin_level'] >= 4) & (df['admin_level'] <= 7)
    df_subnat_tmp = df[columns].loc[filt]

    # drop duplicates
    df_subnat_tmp = df_subnat_tmp.drop_duplicates()

    df_subnat = pd.merge(df_subnat_tmp,
                         df_admin_47,
                         left_on=['ISO-3166-1', 'Region Name', 'admin_level'],
                         right_on=['ISO-3166-1', 'Region Name', 'admin_level'])

    df_subnat['year'] = COVERAGE_YEAR

    df_subnat = df_subnat.rename(columns={
        'Total (t CO2)': 'total_emissions',
        'ISO-3166-2': 'actor_id'
    })

    # create id columns
    df_subnat['datasource_id'] = datasourceDict['datasource_id']

    # create emissions_id columns
    df_subnat['emissions_id'] = df_subnat.apply(lambda row:
                                                f"openGHGmap:{row['actor_id']}:{row['year']}",
                                                axis=1)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    filt = ~df_subnat['actor_id'].isna()
    df_subnat = df_subnat.loc[filt]

    # ensure type
    df_emissionsAgg_subnat = df_subnat[emissionsAggColumns].astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_emissionsAgg_subnat = df_emissionsAgg_subnat.sort_values(
        by=['actor_id', 'year'])

    # -----------------------------
    # just level 8 (CITIES)
    # -----------------------------
    columns = [
        'Country',
        'Region Name',
        'admin_level',
        'Total (t CO2)',
        'country_harmonized',
        'ISO-3166-1',
        'alpha_3'
    ]

    # only select greater than 8 admin level
    filt = (df['admin_level'] >= 8)
    df_city = df[columns].loc[filt]

    # drop duplicates
    df_city = df_city.drop_duplicates()

    df_locode = pd.read_csv(fl_locode)

    df_city_tmp = pd.merge(
        df_city,
        df_locode[['wrong', 'right', 'coerced_wrong', 'iso3', 'locode']],
        left_on=['Region Name', 'alpha_3'],
        right_on=['wrong', 'iso3']
    )

    df_city_tmp['year'] = COVERAGE_YEAR

    df_city_tmp = df_city_tmp.rename(columns={
        'Total (t CO2)': 'total_emissions',
        'locode': 'actor_id'
    })

    # create id columns
    df_city_tmp['datasource_id'] = datasourceDict['datasource_id']

    # create emissions_id columns
    df_city_tmp['emissions_id'] = df_city_tmp.apply(lambda row:
                                                    f"openGHGmap:{row['actor_id']}:{row['year']}",
                                                    axis=1)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    filt = ~df_city_tmp['actor_id'].isna()
    df_city_tmp = df_city_tmp.loc[filt]

    # ensure type
    df_emissionsAgg_city = df_city_tmp[emissionsAggColumns].astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_emissionsAgg_city = df_emissionsAgg_city.sort_values(
        by=['actor_id', 'year'])

    # merge datasets together
    df_emissionsAgg = pd.concat(
        [df_emissionsAgg_country, df_emissionsAgg_subnat, df_emissionsAgg_city]).reset_index()

    # ISO code changed (https://www.iso.org/obp/ui/#iso:code:3166:FR)
    df_emissionsAgg.loc[df_emissionsAgg['actor_id']
                        == 'FR-75', 'actor_id'] = 'FR-75C'

    df_emissionsAgg = df_emissionsAgg.drop(columns=['index']).drop_duplicates()

    actor_files = [
        os.path.abspath('../data/processed/ISO-3166-1/Actor.csv'),
        os.path.abspath('../data/processed/ISO-3166-2/Actor.csv'),
        os.path.abspath('../data/processed/Kosovo/Actor.csv'),
        os.path.abspath('../data/processed/UNLOCODE/Actor.csv'),
    ]
    df_actors = pd.concat([pd.read_csv(fl)['actor_id'] for fl in actor_files])

    fl_delete = os.path.abspath('../data/processed/UNLOCODE/Actor.delete.csv')
    df_del = pd.read_csv(fl_delete)

    # in this part, df_actors is a series and df_del is a dataframe
    df_actors = (
        pd.merge(df_actors, df_del['actor_id'], indicator=True, how='outer')
        .query('_merge=="left_only"')
        .drop('_merge', axis=1)
    )

    filt = df_emissionsAgg['actor_id'].isin(set(df_actors['actor_id']))
    df_emissionsAgg = df_emissionsAgg.loc[filt]

    # convert to csv
    df_emissionsAgg.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================

    tagDictList = [
        {'tag_id': 'spatially_diaggregated',
            'tag_name': 'Spatially disaggregates national reported emissions'},
        {'tag_id': 'co2_only', 'tag_name': 'CO2 only'},
    ]
    simple_write_csv(outputDir, 'Tag', tagDictList)

    dataSourceTagDictList = [
        {'datasource_id': datasourceDict['datasource_id'], 'tag_id': tag['tag_id']} for tag in tagDictList]
    simple_write_csv(outputDir, 'DataSourceTag', dataSourceTagDictList)
