def read_eccc_ghgrp(fl=None):
    """reads ECCC GHGRP data into a pandas dataframe

    Args:
        fl (str): path to ECCC GHGRP dataset. Defaults to None.

    Returns:
        pandas.core.frame.DataFrame: ECCC GHGRP data
    """
    encoding = "ISO-8859-1"
    df = pd.read_csv(fl, encoding=encoding)
    df.columns = [(col
                   .split('/')[0]
                   .lstrip()
                   .rstrip()
                   .replace(" ", "_")
                   .replace("(", "")
                   .replace(")", "")
                   )
                  for col in list(df.columns)]
    return df


def openclimate(name=None, is_part_of=None):
    """simple openclimate API interface

    Args:
        name: name you want to search for
        is_part_of: region it belongs to

    Returns:
        actor_id: the actor id of the name

    Notes:
        API documentation: https://github.com/Open-Earth-Foundation/OpenClimate/blob/develop/api/API.md
    """
    url = f"https://openclimate.network/api/v1/search/actor?name={name}"
    payload = {}
    headers = {'Accept': 'application/vnd.api+json'}
    response = requests.request("GET", url, headers=headers, data=payload)
    dataList = dict(response.json())['data']
    if dataList:
        for data in dataList:
            if data['is_part_of'] == is_part_of:
                actor_id = data['actor_id']
                return actor_id
                break
    else:
        return np.NaN


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
    import requests
    from utils import make_dir
    from utils import lei_from_name
    from utils import write_to_csv

    # define paths
    outputDirFacility = '../data/processed/ECCC_GHGRP/site/'
    outputDirFacility = os.path.abspath(outputDirFacility)
    make_dir(path=Path(outputDirFacility).as_posix())

    outputDirCompany = '../data/processed/ECCC_GHGRP/organization/'
    outputDirCompany = os.path.abspath(outputDirCompany)
    make_dir(path=Path(outputDirCompany).as_posix())

    # read data
    fl = '../data/raw/ECCC_GHGRP/PDGES-GHGRP-GHGEmissionsGES-2004-Present.csv'
    fl = os.path.abspath(fl)
    df = read_eccc_ghgrp(fl)

    # call GLEIF API to get publish date
    publishDate = get_lei_publishdate()

    # -------------------------------------------
    # Publisher table (company)
    # -------------------------------------------
    PublisherDictLEI = {
        "id": "GLEIF",
        "name": "Global Legal Entity Identifier Foundation",
        "URL": "https://www.gleif.org/en"
    }

    write_to_csv(outputDir=outputDirCompany,
                 tableName='Publisher',
                 dataDict=PublisherDictLEI,
                 mode='w')

    # -------------------------------------------
    # DataSource table (company)
    # -------------------------------------------
    DataSourceDictLEI = {
        "datasource_id": f"GLEIF_golden_copy:{publishDate}",
        "name": "information on Legal Entity Identifiers (LEIs) and related reference data in a ready-to-use format",
        "publisher": "GLEIF",
        "published": f"{publishDate}",
        "URL": "https://www.gleif.org/en/lei-data/gleif-golden-copy/download-the-golden-copy#/",
    }

    write_to_csv(outputDir=outputDirCompany,
                 tableName='DataSource',
                 dataDict=DataSourceDictLEI,
                 mode='w')

    # -------------------------------------------
    # Publisher table (company)
    # -------------------------------------------
    PublisherDictECCC = {
        'id': 'ECCC',
        'name': 'Environment and Climate Change Canada',
        'URL': 'https://www.canada.ca/en/environment-climate-change.html'
    }

    write_to_csv(outputDir=outputDirFacility,
                 tableName='Publisher',
                 dataDict=PublisherDictECCC,
                 mode='w')

    # -------------------------------------------
    # DataSource table (company)
    # -------------------------------------------
    DataSourceDictECCC = {

        'datasource_id': 'ECCC_GHGRP:2022-04-14',
        'name': 'ECCC GreenHouse Gas Reporting Program facility emissions',
        'publisher': 'ECCC',
        'published': '2022-04-14',
        'URL': 'https://indicators-map.canada.ca/App/CESI_ICDE?keys=AirEmissions_GHG&GoCTemplateCulture=en-CA'
    }

    write_to_csv(outputDir=outputDirFacility,
                 tableName='DataSource',
                 dataDict=DataSourceDictECCC,
                 mode='w')

    # company names, could use "Reporting_Company_Legal_Name"
    tradeNames = set(list(df["Reporting_Company_Trade_Name"]))

    # list to store lei data for each company as a tuple
    data = []

    # multiprocessing to make simulataneous api calls
    with concurrent.futures.ProcessPoolExecutor(max_workers=4) as executor:
        results = [executor.submit(lei_from_name, name) for name in tradeNames]

        for f in concurrent.futures.as_completed(results):
            data.append(f.result())

    # read data into dataframe
    df_lei = pd.DataFrame(data,
                          columns=['company_name', 'country', 'region', 'lei', 'lei_status', 'datasource_id'])

    filt = ~df_lei['lei'].isna()
    df_tmp = df_lei.loc[filt]

    filt = ~df_tmp['region'].isnull()
    df_tmp = df_tmp.loc[filt]

    filt = ~df_tmp['company_name'].isnull()
    df_tmp = df_tmp.loc[filt]

    df_tmp = df_tmp.copy()

    df_tmp = df_tmp.rename(
        columns={'company_name': 'name', 'region': 'is_part_of', 'lei': 'actor_id'})

    df_tmp['type'] = 'organization'
    df_tmp['language'] = 'en'
    df_tmp['preferred'] = 1
    df_tmp['identifier'] = df_tmp['actor_id']
    df_tmp['namespace'] = 'LEI'

    # ensure types are correct
    df_tmp = df_tmp.astype({
        'actor_id': str,
        'name': str,
        'type': str,
        'is_part_of': str,
        'datasource_id': str,
        'identifier': str,
        'namespace': str,
        'language': str,
        'preferred': str,
    })

    # merge datasets
    df_out = pd.merge(
        df, df_tmp, left_on='Reporting_Company_Trade_Name', right_on='name')

    # rename cities to title case
    df_out['city'] = [str(city).title()
                      for city in df_out['Facility_City_or_District_or_Municipality']]

    # rename columns
    df_out = df_out.rename(columns={
        'GHGRP_ID': 'ghgrp_id',
        'Reference_Year': 'year',
        'Total_Emissions_tonnes_CO2e': 'total_emissions',
    })

    # filter our nan actors
    filt = ~df_out['actor_id'].isna()
    df_out = df_out.loc[filt]

    # create dataframe of city, province, iso, unlocode, this take about 2 minutes
    # city and province tuples
    city_and_prov = list(
        zip(df_out.city, df_out.Facility_Province_or_Territory))

    # get locode from city and ISO code
    data = []
    for city, prov in set(city_and_prov):
        ISO = openclimate(name=prov, is_part_of='CA')
        locode = openclimate(name=city, is_part_of=ISO)
        data.append((city, prov, ISO, locode))

    # dataframe of locode
    df_city = pd.DataFrame(
        data, columns=['city', 'province', 'ISO2', 'UNLOCODE'])

    # merge to get locode
    df_tmp = pd.merge(df_out, df_city, on='city')

    # is owned by is same as LEI
    df_tmp['is_owned_by'] = df_tmp['actor_id']

    # remove nan LOCODES
    filt = ~df_tmp['UNLOCODE'].isna()
    df_tmp = df_tmp.loc[filt]

    # ---------------------
    # Actor.csv (company)
    # ---------------------
    actorColumns = ['actor_id', 'name', 'type', 'is_part_of']
    df_actor = df_tmp[actorColumns].drop_duplicates()
    df_actor = df_actor.sort_values(by=['is_part_of', 'name'])

    df_actor['datasource_id'] = DataSourceDictLEI['datasource_id']

    df_actor.to_csv(f'{outputDirCompany}/Actor.csv', index=False)

    # ---------------------
    # ActorIdentifier.csv (company)
    # ---------------------
    actorIdentifierColumns = ['actor_id',
                              'identifier', 'namespace']
    df_actorIdentifier = df_tmp[actorIdentifierColumns].drop_duplicates()
    df_actorIdentifier['datasource_id'] = DataSourceDictLEI['datasource_id']

    df_actorIdentifier.to_csv(
        f'{outputDirCompany}/ActorIdentifier.csv', index=False)

    # ---------------------
    # ActorName.csv (company)
    # ---------------------
    actorNameColumns = ["actor_id", "name",
                        "language", "preferred"]
    df_actorName = df_tmp[actorNameColumns].drop_duplicates()
    df_actorName = df_actorName.sort_values(by=['name'])
    df_actorName['datasource_id'] = DataSourceDictLEI['datasource_id']
    df_actorName.to_csv(f'{outputDirCompany}/ActorName.csv', index=False)

    # ---------------------
    # Actor.csv (facility)
    # ---------------------
    df_tmp = df_tmp.copy()
    df_tmp['lei'] = df_tmp['actor_id']
    df_tmp['actor_id_facility'] = df_tmp.apply(
        lambda row: f"{row['UNLOCODE']}:{row['lei']}", axis=1)

    actorColumns = ['Facility_Name', 'actor_id_facility', 'is_owned_by']
    df_actor = df_tmp[actorColumns]
    df_actor = df_actor.rename(columns={
        'Facility_Name': 'name',
        'actor_id_facility': 'actor_id'
    })

    df_actor['datasource_id'] = DataSourceDictECCC['datasource_id']
    df_actor['type'] = 'site'
    df_actor.to_csv(f'{outputDirFacility}/Actor.csv', index=False)

    #df_actor = df_tmp[actorColumns].drop_duplicates()
    #df_actor = df_actor.sort_values(by=['is_part_of', 'name'])

    ## ActorIdentifier (facility)

    # ---------------------
    # ActorIdentifier.csv (facility)
    # ---------------------
    actorIdentifierColumns = ['actor_id_facility']
    df_actorIdentifier = df_tmp[actorIdentifierColumns]
    df_actorIdentifier = df_actorIdentifier.rename(columns={
        'actor_id_facility': 'actor_id'
    })

    df_actorIdentifier['identifier'] = df_actorIdentifier['actor_id']
    df_actorIdentifier['datasource_id'] = DataSourceDictECCC['datasource_id']
    df_actorIdentifier['namespace'] = 'LOCODE_LEI'

    df_actorIdentifier.to_csv(
        f'{outputDirFacility}/ActorIdentifier.csv', index=False)

    # ---------------------
    # ActorName.csv (facility)
    # ---------------------
    actorNameColumns = ['Facility_Name', 'actor_id_facility']
    df_actorName = df_tmp[actorNameColumns]
    df_actorName = df_actorName.rename(columns={
        'Facility_Name': 'name',
        'actor_id_facility': 'actor_id'
    })

    df_actorName['language'] = 'en'
    df_actorName['preferred'] = 1
    df_actorName['datasource_id'] = DataSourceDictECCC['datasource_id']

    df_actorName.to_csv(f'{outputDirFacility}/ActorName.csv', index=False)

    # ---------------------
    # EmissionsAgg.csv (facility)
    # ---------------------
    emissionsAggColumns = ['year', 'total_emissions', 'actor_id_facility']
    df_emissionsAgg = df_tmp[emissionsAggColumns]
    df_emissionsAgg = df_emissionsAgg.rename(columns={
        'actor_id_facility': 'actor_id'
    })

    df_emissionsAgg['emissions_id'] = df_emissionsAgg.apply(lambda row:
                                                            f"ECCC_GHGRP:{row['actor_id']}{row['year']}",
                                                            axis=1)

    df_emissionsAgg['datasource_id'] = DataSourceDictECCC['datasource_id']

    df_emissionsAgg = df_emissionsAgg.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    df_emissionsAgg.to_csv(
        f'{outputDirFacility}/EmissionsAgg.csv', index=False)
