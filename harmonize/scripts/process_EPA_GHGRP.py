def extract_company(string):
    '''
    extract majority parent from string like 
    'EXXONMOBIL CORP (48.2%);SHELL OIL CO (51.8%);'
    '''
    import re
    parents = string.split(';')
    if len(parents) > 1:
        maxx = 0
        for parent in parents:
            if parent:
                result = re.search(r"(.*)\s[\(]([0-9]*\.?[0-9]*)", parent)
                if result:
                    name_tmp = result.groups()[0]
                    percent_str = result.groups()[1]
                    if percent_str:
                        percent_tmp = float(percent_str)
                    else:
                        percent_tmp = 100

                    if percent_tmp > maxx:
                        maxx = percent_tmp
                        name = name_tmp
                        percent = percent_tmp
    else:
        parent = parents[0]
        result = re.search(r"(.*)\s[\(]([0-9]*\.?[0-9]*)", parent)
        if result:
            name = result.groups()[0]
            percent_str = result.groups()[1]
            if percent_str:
                percent = float(percent_str)
            else:
                percent = 100
        else:
            name = ''
            percent = 100
    return name


def get_lei_publishdate():
    url = f"https://api.gleif.org/api/v1/lei-records/"
    payload = {}
    headers = {'Accept': 'application/vnd.api+json'}
    response = requests.request("GET", url, headers=headers, data=payload)
    data = json.loads(response.text)
    publishDate = (
        datetime
        .datetime
        .strptime(data['meta']['goldenCopy']['publishDate'],
                  '%Y-%m-%dT%H:%M:%SZ')
        .strftime('%Y-%m-%d')
    )
    return publishDate


if __name__ == '__main__':
    import concurrent.futures
    import datetime
    import json
    import numpy as np
    import os
    from pathlib import Path
    import pandas as pd
    import re
    import requests
    from utils import make_dir
    from utils import lei_from_name
    from utils import write_to_csv

    # define paths
    outputDirSite = '../data/processed/EPA_GHGRP/site/'
    outputDirSite = os.path.abspath(outputDirSite)
    make_dir(path=Path(outputDirSite).as_posix())

    outputDirOrganization = '../data/processed/EPA_GHGRP/organization/'
    outputDirOrganization = os.path.abspath(outputDirOrganization)
    make_dir(path=Path(outputDirOrganization).as_posix())

    # read data
    # https://stackoverflow.com/questions/17977540/pandas-looking-up-the-list-of-sheets-in-an-excel-file
    fl = '../data/raw/EPA_GHGRP/EPA_GHGRP_flight_20221206.xls'
    fl = os.path.abspath(fl)
    xl = pd.ExcelFile(fl)
    sheets = xl.sheet_names
    df = pd.concat([pd.read_excel(fl, header=6, sheet_name=sheet)
                   for sheet in sheets])

    # read actor unlocode data
    fl_clim = '../data/processed/UNLOCODE/Actor.csv'
    fl_clim = os.path.abspath(fl_clim)
    df_clim = pd.read_csv(fl_clim)

    # already parsed LEI codes
    fl_leiCodes = '../resources/EPA_GHGRP_LEI_codes_20221216.csv'
    fl_leiCodes = os.path.abspath(fl_leiCodes)
    fl_leiCodes = Path(fl_leiCodes)

    # call GLEIF API to get publish date
    publishDate = get_lei_publishdate()

    # -------------------------------------------
    # Publisher table (organization)
    # -------------------------------------------
    publisherDictLEI = {
        "id": "GLEIF",
        "name": "Global Legal Entity Identifier Foundation",
        "URL": "https://www.gleif.org/en"
    }

    write_to_csv(outputDir=outputDirOrganization,
                 tableName='Publisher',
                 dataDict=publisherDictLEI,
                 mode='w')

    # -------------------------------------------
    # DataSource table (organization)
    # -------------------------------------------
    datasourceDictLEI = {
        "datasource_id": f"GLEIF_golden_copy",
        "name": "information on Legal Entity Identifiers (LEIs) and related reference data in a ready-to-use format",
        "publisher": "GLEIF",
        "published": f"{publishDate}",
        "URL": "https://www.gleif.org/en/lei-data/gleif-golden-copy/download-the-golden-copy#/",
    }

    write_to_csv(outputDir=outputDirOrganization,
                 tableName='DataSource',
                 dataDict=datasourceDictLEI,
                 mode='w')

    # -------------------------------------------
    # Publisher table (site)
    # -------------------------------------------
    publisherDictEPA = {
        "id": "EPA",
        "name": "United States Environmental Protection Agency",
        "URL": "https://www.epa.gov/"
    }

    write_to_csv(outputDir=outputDirSite,
                 tableName='Publisher',
                 dataDict=publisherDictEPA,
                 mode='w')

    # -------------------------------------------
    # DataSource table (site)
    # -------------------------------------------
    datasourceDictEPA = {
        "datasource_id": f"EPA_GHGRP:2021",
        "name": "EPA Greenhouse Gas Reporting Program ",
        "publisher": "EPA",
        "published": "2021",
        "URL": "https://www.epa.gov/ghgreporting/data-sets"
    }

    write_to_csv(outputDir=outputDirSite,
                 tableName='DataSource',
                 dataDict=datasourceDictEPA,
                 mode='w')

    #############################################
    # some data pre-processing
    #############################################
    # some facilities have nan parent company, but still want to include them
    filt = df['PARENT COMPANIES'].isna()
    df.loc[filt, 'PARENT COMPANIES'] = '- (100%)'

    # new columns
    df['city'] = [city.title() for city in df['CITY NAME']]
    df['iso2'] = [f'US-{state}' for state in df['STATE']]

    # add company name
    data = [(company, extract_company(company))
            for company in set(df['PARENT COMPANIES'])]
    df_company = pd.DataFrame(data, columns=['PARENT COMPANIES', 'company'])
    df = pd.merge(df, df_company, on=['PARENT COMPANIES'], how="left")

    if fl_leiCodes.is_file():
        df_lei = pd.read_csv(fl_leiCodes)
    else:
        # this takes about 10 minutes
        with concurrent.futures.ThreadPoolExecutor() as executor:
            results = [executor.submit(lei_from_name, name)
                       for name in list(set(df['company']))]
            data = [f.result()
                    for f in concurrent.futures.as_completed(results)]

        # dataframe with lei
        df_lei = pd.DataFrame(
            data, columns=['name', 'country', 'region', 'lei', 'status', 'datasource_id'])

        # save lei codes
        fl_leiCodes = '../resources/EPA_GHGRP_LEI_codes.csv'
        fl_leiCodes = os.path.abspath(fl_leiCodes)
        df_lei.to_csv(fl_leiCodes, index=False)

    # merge datasets (wide, each year is a column)
    df_out = pd.merge(df, df_lei,
                      left_on=["company"],
                      right_on=['name'],
                      how="left")

    df_city_iso = df_out[['city', 'iso2']].drop_duplicates()

    # this takes 2 and half minutes (could be moved up?)
    data = []
    for name, is_part_of in list(zip(df_city_iso['city'], df_city_iso['iso2'])):
        filt = (df_clim['name'] == name) & (
            df_clim['is_part_of'] == is_part_of)
        if sum(filt):
            actor_id = df_clim.loc[filt, 'actor_id'].values[0]
        else:
            actor_id = np.NaN
        data.append((name, is_part_of, actor_id))

    # return locode as dataframe
    df_loc = pd.DataFrame(data, columns=['name', 'iso2', 'locode'])

    # merge locode in dataframee
    df_out = pd.merge(df_out, df_loc,
                      left_on=["city", "iso2"],
                      right_on=["name", "iso2"],
                      how="left")

    #############################################
    # extract orgaization relevant data
    #############################################
    actorColumnsFacility = [
        'company',
        'region',
        'lei',
        'locode',
        'iso2'
    ]

    actorRenameDict = {
        'company': 'name',
        'lei': 'actor_id',
        'region': 'is_part_of',
    }

    df_actor = (
        df_out[actorColumnsFacility]
        .rename(columns=actorRenameDict)
        .drop_duplicates()
    )

    # fill nans in organization is_part_of with blank
    # can not guarantee the organization is in the ISO2
    df_actor['is_part_of'] = df_actor.is_part_of.fillna('')
    df_actor['type'] = 'organization'
    df_actor['datasource_id'] = datasourceDictLEI['datasource_id']
    df_actor['language'] = 'en'
    df_actor['preferred'] = 1
    df_actor['identifier'] = df_actor['actor_id']
    df_actor['namespace'] = 'LEI'
    df_actor_tmp = df_actor.copy()

    filt = ~(df_actor_tmp['actor_id'].isna())
    df_actor_tmp = df_actor_tmp.loc[filt]

    # -------------------------------------------
    # Actor table (organization)
    # -------------------------------------------
    actorColumns = [
        'actor_id',
        'type',
        'name',
        'is_part_of',
        'datasource_id',
    ]

    df_actor = df_actor_tmp[actorColumns].astype({
        'name': str,
        'actor_id': str,
        'is_part_of': str,
        'datasource_id': str,
        'type': str
    })

    df_actor.drop_duplicates().to_csv(
        f'{outputDirOrganization}/Actor.csv', index=False)

    # -------------------------------------------
    # ActorIdentifier table (organization)
    # -------------------------------------------
    actorIdentifierColumns = [
        'actor_id',
        'identifier',
        'namespace',
        'datasource_id',
    ]
    df_actorIdentifier = df_actor_tmp[actorIdentifierColumns].astype({
        'actor_id': str,
        'identifier': str,
        'namespace': str,
        'datasource_id': str
    })

    df_actorIdentifier.drop_duplicates().to_csv(
        f'{outputDirOrganization}/ActorIdentifier.csv', index=False)

    # -------------------------------------------
    # ActorName table (organization)
    # -------------------------------------------
    actorNameColumns = [
        'actor_id',
        'name',
        'language',
        'preferred',
        'datasource_id',
    ]
    df_actorName = df_actor_tmp[actorNameColumns].astype({
        'actor_id': str,
        'name': str,
        'language': str,
        'preferred': str,
        'datasource_id': str
    })
    df_actorName.drop_duplicates().to_csv(
        f'{outputDirOrganization}/ActorName.csv', index=False)

    #############################################
    # extract site relevant data
    #############################################
    actorColumnsFacility = [
        'REPORTING YEAR',
        'GHG QUANTITY (METRIC TONS CO2e)',
        'FACILITY NAME',
        'lei',
        'locode',
        'GHGRP ID',
        'iso2'
    ]

    actorRenameDict = {
        'REPORTING YEAR': 'year',
        'GHG QUANTITY (METRIC TONS CO2e)': 'total_emissions',
        'FACILITY NAME': 'name',
        'lei': 'is_owned_by',
        'locode': 'is_part_of',
    }

    df_actor = (
        df_out[actorColumnsFacility]
        .rename(columns=actorRenameDict)
        .drop_duplicates()
    )
    df_actor['is_part_of'] = df_actor.is_part_of.fillna(df_actor.iso2)
    df_actor['is_owned_by'] = df_actor.is_owned_by.fillna('')
    df_actor['type'] = 'site'
    df_actor['datasource_id'] = datasourceDictEPA['datasource_id']
    df_actor['actor_id'] = df_actor.apply(
        lambda row: f"{row['is_part_of']}:EPA_{row['GHGRP ID']}", axis=1)
    df_actor['emissions_id'] = df_actor.apply(
        lambda row: f"{row['actor_id']}:{row['year']}", axis=1)
    df_actor['language'] = 'en'
    df_actor['preferred'] = 1
    df_actor['identifier'] = df_actor['actor_id']
    df_actor['namespace'] = 'EPA GHGRP facility code'
    df_actor_tmp = df_actor.copy()

    # -------------------------------------------
    # Actor Table (site)
    # -------------------------------------------
    actorColumns = [
        'actor_id',
        'type',
        'name',
        'is_part_of',
        'is_owned_by',
        'datasource_id',
    ]

    df_actor = df_actor_tmp[actorColumns].astype({
        'name': str,
        'actor_id': str,
        'is_owned_by': str,
        'is_part_of': str,
        'datasource_id': str,
        'type': str
    })

    df_actor.drop_duplicates().to_csv(
        f'{outputDirSite}/Actor.csv', index=False)

    # -------------------------------------------
    # ActorIdentifier table (site)
    # -------------------------------------------
    actorIdentifierColumns = [
        'actor_id',
        'identifier',
        'namespace',
        'datasource_id',
    ]
    df_actorIdentifier = df_actor_tmp[actorIdentifierColumns].astype({
        'actor_id': str,
        'identifier': str,
        'namespace': str,
        'datasource_id': str
    })

    df_actorIdentifier.drop_duplicates().to_csv(
        f'{outputDirSite}/ActorIdentifier.csv', index=False)

    # -------------------------------------------
    # ActorName table (site)
    # -------------------------------------------
    actorNameColumns = [
        'actor_id',
        'name',
        'language',
        'preferred',
        'datasource_id',
    ]
    df_actorName = df_actor_tmp[actorNameColumns].astype({
        'actor_id': str,
        'name': str,
        'language': str,
        'preferred': str,
        'datasource_id': str
    })

    df_actorName.drop_duplicates().to_csv(
        f'{outputDirSite}/ActorName.csv', index=False)

    # -------------------------------------------
    # EmissionsAgg table (site)
    # -------------------------------------------
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id",
    ]
    df_emissionsAgg = df_actor_tmp[emissionsAggColumns].astype({
        "emissions_id": str,
        "actor_id": str,
        "year": int,
        "total_emissions": int,
        "datasource_id": str,
    })

    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDirSite}/EmissionsAgg.csv', index=False)
