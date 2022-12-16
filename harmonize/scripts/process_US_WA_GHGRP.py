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
    import uuid

    # define paths
    outputDirSite = '../data/processed/US_WA_GHGRP/site/'
    outputDirSite = os.path.abspath(outputDirSite)
    make_dir(path=Path(outputDirSite).as_posix())

    outputDirOrganization = '../data/processed/US_WA_GHGRP/organization/'
    outputDirOrganization = os.path.abspath(outputDirOrganization)
    make_dir(path=Path(outputDirOrganization).as_posix())

    # read data
    # https://stackoverflow.com/questions/17977540/pandas-looking-up-the-list-of-sheets-in-an-excel-file
    fl = '../data/raw/US_WA_dept_ecology_GHGRP/GHG_Reporting_Program_Publication.csv'
    df = pd.read_csv(fl)

    # read actor unlocode data
    fl_clim = '../data/processed/UNLOCODE/Actor.csv'
    fl_clim = os.path.abspath(fl_clim)
    df_clim = pd.read_csv(fl_clim)

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
    publisherDict = {
        'id': 'washington_dept_ecology',
        'name': 'Washington Department of Ecology',
        'URL': 'https://ecology.wa.gov/'
    }

    write_to_csv(outputDir=outputDirSite,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # -------------------------------------------
    # DataSource table (site)
    # -------------------------------------------
    datasourceDict = {
        'datasource_id': 'US_WA_ecology:GHG_facility_reporting',
        'name': 'GHG Reporting Program Publication',
        'publisher': 'washington_dept_ecology',
        'published': '2022-08-23',
        'URL': 'https://data.wa.gov/Natural-Resources-Environment/GHG-Reporting-Program-Publication/idhm-59de'
    }

    write_to_csv(outputDir=outputDirSite,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    #############################################
    # some data pre-processing
    #############################################
    columns = [
        'Reporter',
        'Year',
        'Sector',
        'Subsector',
        'Parent Company',
        'City',
        'Total Emissions (MTCO2e)',
        'Biogenic Carbon Dioxide (MTCO2e)',
        'Notes',
        'Point Size',
        'Location',
        'New Georeferenced Column'
    ]

    df = df[columns]

    # search for facilties that are in EPA dataset already
    # TODO: this could be sped up with concurrent.futures
    # and should have a test to make sure it is in EPA namespace
    # instead of just checking the type for site
    output = []
    for reporter in set(df['Reporter']):
        name = reporter.replace("#", "").replace("&", "")
        #url = f"http://localhost/api/v1/search/actor?q={name}"
        url = f"http://dev.openclimate.network/api/v1/search/actor?q={name}"
        payload = {}
        headers = {'Accept': 'application/vnd.api+json'}
        response = requests.request("GET", url, headers=headers, data=payload)
        dataList = dict(response.json())['data']
        actor_id = np.NaN
        for data in dataList:
            if data['type'] == 'site':
                if data['name'].replace("#", "").replace("&", "").upper() == name.upper():
                    actor_id = data['actor_id']
                    output.append((reporter, actor_id))
                    break

    # merge actor_id from factories in EPA with df
    df_fac = pd.DataFrame(output, columns=['Reporter', 'actor_id'])
    df = pd.merge(df, df_fac, on=['Reporter'])

    # create ISO code for facility
    df['iso2'] = 'US-WA'

    # Get LEI
    # TODO: should also check uppercase in lei_from_name
    legalNames = list(set(df["Parent Company"]))
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(lei_from_name, name)
                   for name in legalNames]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # dataframe with lei
    df_lei = pd.DataFrame(
        data, columns=['name', 'country', 'region', 'lei', 'status', 'datasource_id'])

    # merge datasets (wide, each year is a column)
    df = pd.merge(df, df_lei,
                  left_on=["Parent Company"],
                  right_on=['name'],
                  how="left")

    # Get LOCODE
    df_tmp = df[['City', 'iso2']].drop_duplicates()
    data = []
    for name, is_part_of in list(zip(df_tmp['City'], df_tmp['iso2'])):
        filt = (
            (df_clim['name'] == name) &
            (df_clim['is_part_of'] == is_part_of)
        )
        if sum(filt):
            actor_id = df_clim.loc[filt, 'actor_id'].values[0]
        else:
            actor_id = np.NaN
        data.append((name, is_part_of, actor_id))

    df_loc = pd.DataFrame(data, columns=['name', 'iso2', 'locode'])

    # merge locode in dataframee
    df = pd.merge(df, df_loc,
                  left_on=["City", "iso2"],
                  right_on=["name", "iso2"],
                  how="left")

    # create ID for facility
    df['Reporter_ID'] = df.apply(
        lambda row: f"US_WA_{uuid.uuid5(uuid.NAMESPACE_OID, row['Reporter'])}", axis=1)

    # nonbiogenic emissions
    df['total_nonbiogenic_emissions_(MTCO2e)'] = df['Total Emissions (MTCO2e)'] - \
        df['Biogenic Carbon Dioxide (MTCO2e)']

    #############################################
    # extract orgaization relevant data
    #############################################
    actorColumnsFacility = [
        'Parent Company',
        'region',
        'lei',
        'locode',
        'iso2'
    ]

    actorRenameDict = {
        'Parent Company': 'name',
        'lei': 'actor_id',
        'region': 'is_part_of',
    }

    df_actor = (
        df[actorColumnsFacility]
        .rename(columns=actorRenameDict)
        .drop_duplicates()
    )

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
        'Year',
        'total_nonbiogenic_emissions_(MTCO2e)',
        'Reporter',
        'lei',
        'locode',
        'Reporter_ID',
        'iso2',
        'actor_id'
    ]

    actorRenameDict = {
        'Year': 'year',
        'otal_nonbiogenic_emissions_(MTCO2e)': 'total_emissions',
        'Reporter': 'name',
        'lei': 'is_owned_by',
        'locode': 'is_part_of',
    }

    df_actor = (
        df[actorColumnsFacility]
        .rename(columns=actorRenameDict)
        .drop_duplicates()
    )
    df_actor['is_part_of'] = df_actor.is_part_of.fillna(df_actor.iso2)
    df_actor['is_owned_by'] = df_actor.is_owned_by.fillna('')
    df_actor['type'] = 'site'
    df_actor['datasource_id'] = datasourceDict['datasource_id']
    # df_actor['actor_id'] = df_actor.apply(
    #    lambda row: f"{row['is_part_of']}:US_WA_{row['Reporter_ID']}", axis=1)
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
    # sum across sectors
    columns = ['actor_id', 'Year', 'total_nonbiogenic_emissions_(MTCO2e)']
    groupby_columns = ['actor_id', 'Year']
    df_tmp = df[columns].groupby(by=groupby_columns).sum().reset_index()

    # rename columns
    df_tmp = df_tmp.rename(
        columns={'Year': 'year',
                 'total_nonbiogenic_emissions_(MTCO2e)': 'total_emissions'})

    # datasource and emissions ids
    df_tmp['datasource_id'] = datasourceDict['datasource_id']

    df_tmp['emissions_id'] = df_tmp.apply(lambda row:
                                          f"US_WA_GHG_facilities:{row['actor_id']}:{row['year']}",
                                          axis=1)

    # clean up the column and make sure type is correct
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df_tmp[emissionsAggColumns]

    df_emissionsAgg = df_emissionsAgg.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    df_emissionsAgg.drop_duplicates().to_csv(
        f'{outputDirSite}/EmissionsAgg.csv', index=False)

    #############################################
    # extract sector relevant information
    #############################################
    sectorColumns = [
        'Sector',
        'Year',
        'total_nonbiogenic_emissions_(MTCO2e)',
        'Reporter',
        'lei',
        'locode',
        'Reporter_ID',
        'iso2',
        'actor_id'
    ]

    sectorRenameDict = {
        'Year': 'year',
        'total_nonbiogenic_emissions_(MTCO2e)': 'total_emissions',
        'Sector': 'name',
        'lei': 'is_owned_by',
        'locode': 'is_part_of',
    }

    df_sector = (
        df[sectorColumns]
        .rename(columns=sectorRenameDict)
        .drop_duplicates()
    )

    df_sector['is_part_of'] = df_sector.is_part_of.fillna(df_sector.iso2)
    # df_sector['actor_id'] = df_sector.apply(
    #    lambda row: f"{row['is_part_of']}:US_WA_{row['Reporter_ID']}", axis=1)
    df_sector['emissions_id'] = df_sector.apply(
        lambda row: f"{row['actor_id']}:{row['year']}", axis=1)
    df_sector['namespace'] = 'US_WA_GHGRP:sector'
    df_sector['datasource_id'] = datasourceDict['datasource_id']
    df_sector['sector_id'] = df_sector.apply(
        lambda row: f"US_WA_GHGRP:sector:{row['name']}", axis=1)

    # -------------------------------------------
    # Sector table
    # -------------------------------------------
    # clean up the column and make sure type is correct
    sectorColumns = [
        "sector_id",
        "name",
        "namespace",
        "datasource_id"
    ]

    df_sector_out = df_sector[sectorColumns]

    # ensure columns have correct types
    df_sector_out = df_sector_out.astype({
        'sector_id': str,
        'name': str,
        'namespace': str,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_sector_out = df_sector_out.sort_values(by=['sector_id'])

    df_sector_out.drop_duplicates().to_csv(
        f'{outputDirSite}/Sector.csv', index=False)

    # -------------------------------------------
    # EmissionsBySector table
    # -------------------------------------------
    # emissionsBySector
    columns = ['emissions_id', 'sector_id', 'total_emissions']
    groupby_columns = ['emissions_id', 'sector_id']
    df_emissionsBySector = df_sector[columns].groupby(
        by=groupby_columns).sum().reset_index()

    df_emissionsBySector = df_emissionsBySector.rename(
        columns={'total_emissions': 'emissions_value'})

    df_emissionsBySector = df_emissionsBySector.astype({
        'emissions_id': str,
        'sector_id': str,
        'emissions_value': int,
    })

    df_emissionsBySector.drop_duplicates().to_csv(
        f'{outputDirSite}/EmissionsBySector.csv', index=False)
