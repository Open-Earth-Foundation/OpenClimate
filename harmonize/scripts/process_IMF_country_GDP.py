def remove_country_groups(df, column=None):
    """This needs to happen after you remove whitespace from names"""

    # set column name
    column = 'country' if column is None else column

    country_groups = [
        'ASEAN-5',
        'Australia and New Zealand',
        'Advanced economies',
        'Africa (Region)',
        'Asia and Pacific',
        'Caribbean',
        'Central America',
        'Central Asia and the Caucasus',
        'East Asia',
        'Eastern Europe',
        'Emerging and Developing Asia',
        'Emerging and Developing Europe',
        'Emerging market and developing economies',
        'Euro area',
        'Europe',
        'European Union',
        'Latin America and the Caribbean',
        'Major advanced economies (G7)',
        'Middle East (Region)',
        'Middle East and Central Asia',
        'North Africa',
        'North America',
        'Other advanced economies',
        'Pacific Islands',
        'South America',
        'South Asia',
        'Southeast Asia',
        'Sub-Saharan Africa',
        'Sub-Saharan Africa (Region)',
        'West Bank and Gaza',
        'Western Europe',
        'Western Hemisphere (Region)',
        'World',
        '©IMF, 2022',
    ]

    # remove country_groups
    filt = ~df[column].isin(country_groups)
    df = df.loc[filt]
    return df


if __name__ == "__main__":
    import concurrent.futures
    import os
    from pathlib import Path
    import pandas as pd
    from utils import df_wide_to_long
    from utils import country_to_iso2
    from utils import make_dir
    from utils import write_to_csv
    import xlrd

    # where to create tables
    outputDir = "../data/processed/IMF_country_GDP"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # PRIMPAP dataset
    fl_climactor = '../resources/country_dict_updated.csv'
    fl_climactor = os.path.abspath(fl_climactor)

    fl = '../data/raw/IMF_country_GDP/imf-dm-export-20221017.xls'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        "id": "IMF",
        "name": "International Montary Fund",
        "URL": "https://www.imf.org/en/Home"
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        "datasource_id": 'IMF:WEO202211',
        "name": 'World Economic Outlook (October 2022)',
        "publisher": 'IMF',
        "published": '2022-10-01',
        "URL": 'https://www.imf.org/external/datamapper/NGDPD@WEO/WEOWORLD'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    # read dataset
    workbook = xlrd.open_workbook_xls(fl, ignore_workbook_corruption=True)
    df = pd.read_excel(workbook)
    df = df.rename(
        columns={'GDP, current prices (Billions of U.S. dollars)': 'country'})

    # remove trailing white space
    df['country'] = df['country'].str.strip()

    # filtering
    filt = ~(df['country'].isna())
    df = df.loc[filt]
    df = remove_country_groups(df, column='country')

    # read climactor and name harmonize
    df_clim = pd.read_csv(fl_climactor).drop_duplicates()
    df['country_harmonized'] = (
        df['country']
        .replace(to_replace=list(df_clim['wrong']),
                 value=list(df_clim['right']))
    )

    # change these names so can grab actor_id from openClimate API
    change_dictionary = {
        'Cape Verde': 'Cabo Verde',
        'Turkey': 'Türkiye',
        'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland (the)',
        'Czech Republic': 'Czechia',
        'Dem. Rep. Congo': 'The Democratic Republic of the Congo',
        'South Korea': "The Republic of Korea",
        'Laos': "Lao People's Democratic Republic",
        'Kyrgyz Republic': 'Kyrgyzstan',
        "Cote d'Ivoire": "Côte d'Ivoire",
        'Swaziland': 'Eswatini',
        'Russia': 'The Russian Federation',
        'Syria': 'Syrian Arab Republic'
    }

    df['country_harmonized'] = df['country_harmonized'].replace(
        change_dictionary)

    # change "Congo" to "The Congo" so openClimate grabs correct actor_id
    df['country_harmonized'] = df['country_harmonized'].replace(
        to_replace=['Congo'], value=['The Congo'])

    # query openClimate API get country actor_id
    with concurrent.futures.ProcessPoolExecutor(max_workers=8) as executor:
        results = [executor.submit(country_to_iso2, name, return_input=True)
                   for name in list(set(df['country_harmonized']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # iso dataframe merged with df
    df_iso = pd.DataFrame(data, columns=['name', 'actor_id'])
    df_out = pd.merge(
        df, df_iso, left_on='country_harmonized', right_on='name')

    # unpivot the dataset wide to long
    df_long = df_wide_to_long(df=df_out, value_name='gdp')
    df_long = df_long.copy()

    # remove any records with no GDP data
    filt = ~(df_long['gdp'] == 'no data')
    df_long = df_long.loc[filt]

    # convert to float and USD from billion USD
    df_long['gdp'] = df_long['gdp'].astype(float)
    df_long['gdp'] = df_long['gdp'] * 10**9
    df_long['gdp'] = df_long['gdp'].astype(int)

    # filter years
    filt = (df_long['year'] <= 2021)
    df_long = df_long.loc[filt]

    # set datasource ID
    df_long['datasource_id'] = datasourceDict['datasource_id']

    # create final dataframe
    columns = ['actor_id', 'gdp', 'year', 'datasource_id']
    df_long = df_long[columns]

    # ensure types are correct
    df_long = df_long.astype({
        'actor_id': str,
        'gdp': int,
        'year': int,
        'datasource_id': str
    })

    # sort dataframe and save
    df_long = df_long.sort_values(by=['actor_id', 'year'])

    # save to csv
    df_long.drop_duplicates().to_csv(
        f'{outputDir}/GDP.csv', index=False)
