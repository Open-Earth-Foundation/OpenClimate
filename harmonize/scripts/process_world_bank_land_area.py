if __name__ == "__main__":
    import concurrent.futures
    import os
    from pathlib import Path
    import pandas as pd
    from utils import df_wide_to_long
    from utils import make_dir
    from utils import write_to_csv
    from utils import iso3_to_iso2
    from utils import df_drop_unnamed_columns

    # where to create tables
    outputDir = "../data/processed/world_bank_land_area"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # read dataset
    fl = "../data/raw/world_bank_land_area/API_AG.LND.TOTL.K2_DS2_en_csv_v2_4661929.csv"
    fl = os.path.abspath(fl)
    df = pd.read_csv(fl, header=2)

    fl_cities = "../data/raw/simplemaps_world_cities_database/worldcities.csv"
    fl_cities = os.path.abspath(fl_cities)
    df_cities = pd.read_csv(fl_cities)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'world_bank',
        'name': 'World Bank Open Data',
        'URL': 'https://data.worldbank.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        'datasource_id': 'world_bank:LandArea:v20220916',
        'name': 'Land Area (AG.LND.TOTL.K2)',
        'publisher': 'world_bank',
        'published': '2022-09-16',
        'URL': 'https://data.worldbank.org/indicator/AG.LND.TOTL.K2'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # Territor table
    # ------------------------------------------
    # get iso2 code from name
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(iso3_to_iso2, name, return_input=True)
                   for name in list(set(df['Country Code']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # merge in_database into dataframe
    df_iso = pd.DataFrame(data, columns=['Country Code', 'actor_id'])

    # merge in actor_id
    df = pd.merge(df, df_iso, on='Country Code')

    # filter actors not in database
    filt = ~(df['actor_id'].isna())
    df = df.loc[filt]

    # drop the unnamed columns
    df = df_drop_unnamed_columns(df=df)

    # convert from wide to long
    df = df_wide_to_long(df=df, value_name='area', var_name='year')

    # get latest data
    filt = df['year'] == 2020
    df = df.loc[filt]

    # drop nan area
    filt = ~(df['area'].isna())
    df = df.loc[filt]

    # only get capital cities
    filt = (df_cities['capital'] == 'primary')
    df_lat = df_cities.loc[filt, ['iso2', 'lat', 'lng']]

    # append missing values to dataframe
    # MO : 22.210928, 113.552971 (https://www.latlong.net/place/macao-china-656.html)
    # NA : -22.560881,17.065755. (https://www.countrycoordinate.com/city-windhoek-namibia/)
    # PS : 31.898043, 35.204269. (https://www.latlong.net/place/ramallah-palestine-13002.html)
    appendDict = {
        'iso2': ['MO', 'NA', 'PS'],
        'lat': [22.210928, -22.560881, 31.898043],
        'lng': [113.552971, 17.065755, 35.204269]
    }
    df_tmp = pd.DataFrame(appendDict)
    df_lat = pd.concat([df_lat, df_tmp], ignore_index=True)

    # multiply by 10,000
    df_lat.loc[:, 'lat'] *= 10_000
    df_lat.loc[:, 'lng'] *= 10_000

    # merge in lat and lng
    df_out = pd.merge(df, df_lat, left_on='actor_id', right_on='iso2')

    # add datasource
    df_out['datasource_id'] = datasourceDict['datasource_id']

    # select columns
    columns = [
        'actor_id',
        'area',
        'lat',
        'lng',
        'datasource_id'
    ]
    df_out = df_out[columns]

    # ensure data has correct types
    df_out = df_out.astype({
        'actor_id': str,
        'area': int,
        'lat': int,
        'lng': int,
        'datasource_id': str
    })

    # sort colmns
    df_out = df_out.sort_values(by=['actor_id'])

    # save to csv
    df_out.drop_duplicates().to_csv(
        f'{outputDir}/Territory.csv', index=False)
