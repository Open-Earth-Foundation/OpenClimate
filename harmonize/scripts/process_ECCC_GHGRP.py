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
    from utils import subnational_to_iso2

    # define paths
    outputDirSite = '../data/processed/ECCC_GHGRP/site/'
    outputDirSite = os.path.abspath(outputDirSite)
    make_dir(path=Path(outputDirSite).as_posix())

    outputDirOrganization = '../data/processed/ECCC_GHGRP/organization/'
    outputDirOrganization = os.path.abspath(outputDirOrganization)
    make_dir(path=Path(outputDirOrganization).as_posix())

    # read unlocode
    fl_clim = '../data/processed/UNLOCODE/Actor.csv'
    fl_clim = os.path.abspath(fl_clim)
    df_clim = pd.read_csv(fl_clim)

    # read data
    fl = '../data/raw/ECCC_GHGRP/PDGES-GHGRP-GHGEmissionsGES-2004-Present.csv'
    fl = os.path.abspath(fl)
    df = read_eccc_ghgrp(fl)

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
    publisherDictECCC = {
        'id': 'ECCC',
        'name': 'Environment and Climate Change Canada',
        'URL': 'https://www.canada.ca/en/environment-climate-change.html'
    }

    write_to_csv(outputDir=outputDirSite,
                 tableName='Publisher',
                 dataDict=publisherDictECCC,
                 mode='w')

    # -------------------------------------------
    # DataSource table (site)
    # -------------------------------------------
    datasourceDictECCC = {
        'datasource_id': 'ECCC_GHGRP:2022-04-14',
        'name': 'ECCC GreenHouse Gas Reporting Program facility emissions',
        'publisher': 'ECCC',
        'published': '2022-04-14',
        'URL': 'https://indicators-map.canada.ca/App/CESI_ICDE?keys=AirEmissions_GHG&GoCTemplateCulture=en-CA'
    }

    write_to_csv(outputDir=outputDirSite,
                 tableName='DataSource',
                 dataDict=datasourceDictECCC,
                 mode='w')

    #############################################
    # some data pre-processing
    #############################################

    # get lei from company legal name
    legalNames = list(set(df["Reporting_Company_Legal_Name"]))
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(lei_from_name, name)
                   for name in legalNames]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # dataframe with lei
    df_lei = pd.DataFrame(
        data, columns=['name', 'country', 'region', 'lei', 'status', 'datasource_id'])

    # merge datasets (wide, each year is a column)
    df_tmp = pd.merge(df, df_lei,
                      left_on=["Reporting_Company_Legal_Name"],
                      right_on=['name'],
                      how="left")

    # get subnational from iso2
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(subnational_to_iso2, name, return_input=True)
                   for name in list(set(df_tmp["Facility_Province_or_Territory"]))]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # dataframe with lei
    df_iso = pd.DataFrame(data, columns=['province', 'iso2'])

    # merge datasets (wide, each year is a column)
    df_out = pd.merge(df_tmp, df_iso,
                      left_on=["Facility_Province_or_Territory"],
                      right_on=['province'],
                      how="left")

    df_out['Facility_City_or_District_or_Municipality'] = df_out['Facility_City_or_District_or_Municipality'].fillna(
        '')
    df_out['city'] = [city.title()
                      for city in df_out['Facility_City_or_District_or_Municipality']]

    # get is_part_of
    data = []
    for name, is_part_of in list(zip(df_out['city'], df_out['iso2'])):
        filt = (df_clim['name'] == name) & (
            df_clim['is_part_of'] == is_part_of)
        if sum(filt):
            actor_id = df_clim.loc[filt, 'actor_id'].values[0]
        else:
            actor_id = np.NaN
        data.append((name, is_part_of, actor_id))

    # return locode as dataframe
    df_loc = pd.DataFrame(data, columns=['city_tmp', 'iso2', 'locode'])

    # merge locode in dataframee
    df_out = pd.merge(df_out, df_loc,
                      left_on=['city', "iso2"],
                      right_on=["city_tmp", "iso2"],
                      how="left")

    df_out['region'] = df_out['region'].fillna(df_out['country'])
    df_tmp = df_out.copy()

    #############################################
    # extract orgaization relevant data
    #############################################
    # create organization dataframe
    df_org = df_tmp.copy()

    actorRenameDict = {
        'lei': 'actor_id',
        'Reporting_Company_Legal_Name': 'name',
        'region': 'is_part_of',
    }

    df_org = df_org.drop(['name'], axis=1).rename(columns=actorRenameDict)

    df_org['name'] = df_org.name.str.title()
    df_org['type'] = 'organization'
    df_org['language'] = 'en'
    df_org['preferred'] = 1
    df_org['identifier'] = df_org['actor_id']
    df_org['namespace'] = 'LEI'
    df_org['datasource_id'] = datasourceDictLEI['datasource_id']

    # -------------------------------------------
    # Actor table (organization)
    # -------------------------------------------
    actorColumnsOrg = [
        'actor_id',
        'type',
        'name',
        'is_part_of',
        'datasource_id'
    ]

    filt = ~(df_org['actor_id'].isna())
    df_actor = (
        df_org.loc[filt, actorColumnsOrg]
        .drop_duplicates()
    )

    df_actor = df_actor.sort_values(by=['actor_id'])

    df_actor.drop_duplicates().to_csv(
        f'{outputDirOrganization}/Actor.csv', index=False)

    # -------------------------------------------
    # ActorIdentifier table (organization)
    # -------------------------------------------
    actorIdentifierColumnsOrg = [
        'actor_id',
        'identifier',
        'namespace',
        'datasource_id',
    ]

    filt = ~(df_org['actor_id'].isna())
    df_actorIdentifier = (
        df_org.loc[filt, actorIdentifierColumnsOrg]
        .drop_duplicates()
    )

    df_actorIdentifier = df_actorIdentifier.sort_values(by=['actor_id'])

    df_actorIdentifier.drop_duplicates().to_csv(
        f'{outputDirOrganization}/ActorIdentifier.csv', index=False)

    # -------------------------------------------
    # ActorName table (organization)
    # -------------------------------------------
    actorNameColumnsOrg = [
        'actor_id',
        'name',
        'language',
        'preferred',
        'datasource_id',
    ]

    filt = ~(df_org['actor_id'].isna())
    df_actorName = (
        df_org.loc[filt, actorNameColumnsOrg]
        .drop_duplicates()
    )

    df_actorName = df_actorName.sort_values(by=['actor_id'])

    df_actorName.drop_duplicates().to_csv(
        f'{outputDirOrganization}/ActorName.csv', index=False)

    #############################################
    # extract site relevant data
    #############################################
    df_site = df_tmp.copy()

    companyColumns = [
        'GHGRP_ID',
        'Reference_Year',
        'Facility_Name',
        'Facility_Location',
        'Facility_City_or_District_or_Municipality',
        'Facility_Province_or_Territory',
        'Reporting_Company_Legal_Name',
        'Total_Emissions_tonnes_CO2e',
        'lei',
        'province',
        'iso2',
        'city',
        'city_tmp',
        'locode'
    ]

    df_site = df_site[companyColumns].rename(columns={
        'locode': 'is_part_of',
        'lei': 'is_owned_by',
        'Reference_Year': 'year',
        'Facility_Name': 'name',
        'Total_Emissions_tonnes_CO2e': 'total_emissions',
    })

    df_site['is_part_of'] = df_site['is_part_of'].fillna(df_site['iso2'])
    df_site['is_owned_by'] = df_site['is_owned_by'].fillna('')
    df_site['datasource_id'] = datasourceDictECCC['datasource_id']
    df_site['type'] = 'site'
    df_site['language'] = 'en'
    df_site['preferred'] = 1
    df_site['namespace'] = 'is_part_of:facility_id'
    df_site['actor_id'] = df_site.apply(
        lambda row: f"{row['is_part_of']}:ECCC_{row['GHGRP_ID']}", axis=1)
    df_site['identifier'] = df_site['actor_id']

    # -------------------------------------------
    # Actor Table (site)
    # -------------------------------------------
    actorColumnsSite = [
        'actor_id',
        'type',
        'name',
        'is_part_of',
        'is_owned_by',
        'datasource_id'
    ]

    filt = ~(df_site['actor_id'].isna())

    df_actor = (
        df_site.loc[filt, actorColumnsSite]
        .drop_duplicates()
    )

    df_actor = df_actor.sort_values(by=['actor_id'])

    df_actor.drop_duplicates().to_csv(
        f'{outputDirSite}/Actor.csv', index=False)

    # -------------------------------------------
    # ActorIdentifier table (site)
    # -------------------------------------------
    actorIdentifierColumnsSite = [
        'actor_id',
        'identifier',
        'namespace',
        'datasource_id',
    ]

    filt = ~(df_site['actor_id'].isna())

    df_actorIdentifier = (
        df_site.loc[filt, actorIdentifierColumnsSite]
        .drop_duplicates()
    )

    df_actorIdentifier = df_actorIdentifier.sort_values(by=['actor_id'])

    df_actorIdentifier.drop_duplicates().to_csv(
        f'{outputDirSite}/ActorIdentifier.csv', index=False)

    # -------------------------------------------
    # ActorName table (site)
    # -------------------------------------------
    actorNameColumnsSite = [
        'actor_id',
        'name',
        'language',
        'preferred',
        'datasource_id',
    ]

    filt = ~(df_site['actor_id'].isna())

    df_actorName = (
        df_site.loc[filt, actorNameColumnsSite]
        .drop_duplicates()
    )

    df_actorName = df_actorName.sort_values(by=['actor_id'])

    df_actorName.drop_duplicates().to_csv(
        f'{outputDirSite}/ActorName.csv', index=False)

    # -------------------------------------------
    # EmissionsAgg table (site)
    # -------------------------------------------
    df_site['emissions_id'] = df_site.apply(lambda row:
                                            f"ECCC_GHGRP:{row['actor_id']}:{row['year']}",
                                            axis=1)

    emissionsAggColumnsSite = [
        'emissions_id',
        'actor_id',
        'year',
        'total_emissions',
        'datasource_id',
    ]

    filt = ~(df_site['actor_id'].isna())

    df_emissionsAgg = (
        df_site.loc[filt, emissionsAggColumnsSite]
        .drop_duplicates()
    )

    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    df_emissionsAgg = df_emissionsAgg.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDirSite}/EmissionsAgg.csv', index=False)
