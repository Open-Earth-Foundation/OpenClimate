if __name__ == "__main__":
    import concurrent.futures
    import os
    from pathlib import Path
    import pandas as pd
    from utils import make_dir
    from utils import write_to_csv
    from utils import is_actor_in_database

    # where to create tables
    outputDir = "../data/processed/UN_WPP2022_country_population"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # read data
    fl = "../data/raw/UN_WPP2022_country_population/unpopulation_dataportal_20221207115352.csv"
    fl = os.path.abspath(fl)
    df = pd.read_csv(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'UN_DESA_PD',
        'name': 'United Nations Population Division of the Department of Economic and Social Affairs',
        'URL': 'https://www.un.org/development/desa/pd/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        'datasource_id': 'UN_DESA_PD:WorldPopulation:v2022',
        'name': 'World Population Prospects',
        'publisher': 'UN_DESA_PD',
        'published': '2022-07-11',
        'URL': 'https://population.un.org/wpp/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # Population table
    # ------------------------------------------
    # get iso2 code from name
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(is_actor_in_database, name,)
                   for name in list(set(df['Iso2']))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # merge in_database into dataframe
    df_iso = pd.DataFrame(data, columns=['Iso2', 'in_database'])
    df = pd.merge(df, df_iso, on='Iso2')

    # only get records with ISO code in our database
    df_out = df.loc[df['in_database']]

    # get columns
    columns = ['Iso2', 'Time', 'Value']
    df_pop = df_out[columns]
    df_pop = df_pop.rename(columns={
        'Iso2': 'actor_id',
        'Time': 'year',
        'Value': 'population'
    })

    df_pop['datasource_id'] = datasourceDict['datasource_id']

    # ensure data has correct types
    df_pop = df_pop.astype({
        'actor_id': str,
        'year': int,
        'population': int,
        'datasource_id': str
    })

    # sort colmns
    df_pop = df_pop.sort_values(by=['actor_id', 'year'])

    # save to csv
    df_pop.drop_duplicates().to_csv(
        f'{outputDir}/Population.csv', index=False)
