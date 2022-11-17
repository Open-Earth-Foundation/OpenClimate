def harmonize_emissions(fl=None, reportingYear=None, fl_climactor=None, datasourceDict=None):
    df = pd.read_csv(fl)

    # list of account numbers (organizations)
    accountNumbers = list(set(df['Account Number']))

    # list to concatenate to
    concat_list = []

    for accountNumber in accountNumbers:

        filt = (
            (df['Year Reported to CDP'] == reportingYear) &
            (df['Parent Section'] == '3. Emissions - Region-wide') &
            (df['Account Number'] == accountNumber)
        )

        # select emissions section
        df_tmp = df.loc[filt]

        # check that there is data

        # if (len(df_tmp)) & (list(df_tmp.loc[df_tmp['Question Number'] == '3.1', 'Response Answer'])[0] == 'Yes'):
        # get subnational and country
        subnational = list(set(df_tmp['Organization']))
        country = list(set(df_tmp['Country']))

        # dates of the accounting year or 12-month period for your region’s latest region-wide GHG emissions inventory.
        filt = (df_tmp['Question Number'] == '3.2')
        accountingStart = list(df_tmp.loc[(filt) & (
            df_tmp['Column Name'] == 'From'), 'Response Answer'])
        accountingStop = list(df_tmp.loc[(filt) & (
            df_tmp['Column Name'] == 'To'), 'Response Answer'])

        # the boundary of your latest region-wide GHG emissions inventory
        filt = (df_tmp['Question Number'] == '3.3')
        boundary = list(df_tmp.loc[filt, 'Response Answer'])

        # name of the primary protocol, standard, or methodology you have used to calculate GHG emissions
        # explain how it has been used as well as any additional protocols and processes for data collection.
        filt = (df_tmp['Question Number'] == '3.4')
        protocol = list(df_tmp.loc[(filt) & (
            df_tmp['Column Name'] == 'Primary protocol'), 'Response Answer'])
        protocolExplanation = list(df_tmp.loc[(filt) & (
            df_tmp['Column Name'] == 'Explanation'), 'Response Answer'])

        # TODO, this must be separate
        # gases included in latest region-wide GHG emissions inventory
        filt = (df_tmp['Question Number'] == '3.5')
        ghg_included = list(df_tmp.loc[filt, 'Response Answer'])

        # GHG emissions data you have reported here been externally verified either in part or in whole?
        filt = (df_tmp['Question Number'] == '3.6')
        df_exclude = df_tmp.loc[(filt) & (
            df_tmp['Row Name'] == 'Total gross emissions (excludes sinks)')]
        filt = (df_exclude['Column Name'] ==
                'Emissions of latest inventory (metric tonnes CO2e)')
        inventoryEmissionsExcludeSink = list(
            df_exclude.loc[filt, 'Response Answer'])

        filt = (df_exclude['Column Name'] == 'Level of confidence')
        confidenceExcludeSink = list(df_exclude.loc[filt, 'Response Answer'])

        filt = (df_exclude['Column Name'] == 'Comments')
        commentExcludeSink = list(df_exclude.loc[filt, 'Response Answer'])

        filt = (df_tmp['Question Number'] == '3.6')
        df_include = df_tmp.loc[(filt) & (
            df_tmp['Row Name'] == 'Total net emissions (includes sinks)')]
        filt = (df_include['Column Name'] ==
                'Emissions of latest inventory (metric tonnes CO2e)')
        inventoryEmissionsIncludeSink = list(
            df_include.loc[filt, 'Response Answer'])

        filt = (df_include['Column Name'] == 'Level of confidence')
        confidenceIncludeSink = list(df_include.loc[filt, 'Response Answer'])

        filt = (df_include['Column Name'] == 'Comments')
        commentIncludeSink = list(df_include.loc[filt, 'Response Answer'])

        # do you track emissions by scope
        filt = (df_tmp['Question Number'] == '3.9')
        trackEmissionsByScope = list(df_tmp.loc[(filt), 'Response Answer'])

        filt = (df_tmp['Question Number'] == '3.9')
        measureByScope = list(df_tmp.loc[(filt), 'Response Answer'])
        if measureByScope:
            # TODO: more work needed to pull out level of confidence for each scope
            # scope emissions without level confidence
            filt = (df_tmp['Question Number'] == '3.9a')
            df_scope = pd.pivot(df_tmp.loc[(filt) & (df_tmp['Column Name'] != 'Level of confidence')],
                                index='Row Number',
                                columns='Column Name',
                                values='Response Answer')

            # ignore index name
            df_scope.index.name = None

            confidenceExcludeSink = [np.nan] if len(
                confidenceExcludeSink) == 0 else confidenceExcludeSink
            confidenceIncludeSink = [np.nan] if len(
                confidenceIncludeSink) == 0 else confidenceIncludeSink

            # print(commentExcludeSink)
            # make dataframe with subnational info
            df_out = pd.DataFrame({**{'subnational': subnational,
                                      'country': country,
                                      'reporting_year': reportingYear,
                                      'accounting_start': accountingStart,
                                      'accounting_stop': accountingStop,
                                      'emissions_exc_sink': inventoryEmissionsExcludeSink,
                                      'emissions_inc_sink': inventoryEmissionsIncludeSink,
                                      'comment_inc_sink': commentIncludeSink,
                                      'comment_exc_sink': commentExcludeSink,
                                      'confidence_inc_sink': confidenceIncludeSink,
                                      'confidence_exc_sink': confidenceExcludeSink,
                                      'protocol': protocol,
                                      'boundary': boundary},
                                   **df_scope.to_dict(orient='list')})

            df_out = df_out.replace("Question not applicable", np.NaN)

            df_out['year'] = pd.to_datetime(df_out['accounting_stop']).dt.year

            concat_list.append(df_out)

    # concat them all together
    df_out = pd.concat(concat_list, ignore_index=True)

    filt = (~df_out['Total (Scope 1 + Scope 2) emissions'].isna())
    df_agg = df_out.loc[filt].copy()

    # Now need to find the ISO code for each subnational
    #fl = 'https://raw.githubusercontent.com/datadrivenenvirolab/ClimActor/master/data-raw/key_dict_7Sep2022.csv'
    df_clim = pd.read_csv(fl_climactor).drop_duplicates()
    df_clim = df_clim.loc[df_clim['entity_type'].isin(['Region', 'nan'])]

    # name harmonize
    df_agg['subnational_harmonized'] = (
        df_agg['subnational']
        .replace(to_replace=list(df_clim['wrong']),
                 value=list(df_clim['right']))
    )

    # read ISO-3166
    df_sub = pd.read_csv(
        'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-ISO-3166/main/ISO-3166-2/ActorName.csv')

    # name harmonize ISO-3166
    df_sub['name_harmonized'] = (
        df_sub['name']
        .replace(to_replace=list(df_clim['wrong']),
                 value=list(df_clim['right']))
    )

    # final table
    df_final = pd.merge(df_agg, df_sub, left_on=[
                        "subnational_harmonized"], right_on=["name_harmonized"], how="left")

    filt = ~df_final['accounting_stop'].isna()
    df_final = df_final.loc[filt]

    # df_final.loc[df_final['actor_id'].isna()]

    df_final['year'] = df_final['year'].astype(int)

    # create id columns
    df_final['datasource_id'] = datasourceDict['datasource_id']

    df_final['emissions_id'] = df_final.apply(lambda row:
                                              f"CDP_full_states_regions_2021:{row['actor_id']}:{row['year']}",
                                              axis=1)

    df_final = df_final.rename(
        columns={'Total (Scope 1 + Scope 2) emissions': 'total_emissions'})

    df_final['total_emissions'] = df_final['total_emissions'].astype(float)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df_final[emissionsAggColumns]

    # ensure type
    df_emissionsAgg = df_emissionsAgg.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    filt = df_emissionsAgg['actor_id'] != 'nan'
    df_emissionsAgg = df_emissionsAgg.loc[filt]

    return df_emissionsAgg


if __name__ == "__main__":
    import numpy as np
    import os
    import pandas as pd
    from pathlib import Path
    from utils import make_dir
    from utils import write_to_csv

    # Create directory to store output
    outputDir = "../data/processed/CDP_full_states_regions_2021/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to raw dataset
    fl = '../data/raw/CDP_full_states_regions_2021/2021_Full_States_and_Regions_Dataset.csv'
    fl = os.path.abspath(fl)

    # path to climactor
    fl_climactor = '../resources/key_dict.csv'
    fl_climactor = os.path.abspath(fl_climactor)

    # -------------------------------------------
    # Publisher table
    # -------------------------------------------
    publisherDict = {
        'id': 'CDP',
        'name': 'Carbon Disclosure Project',
        'URL': 'https://www.cdp.net/en'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # -------------------------------------------
    # DataSource table
    # -------------------------------------------
    datasourceDict = {
        'datasource_id': 'CDP_full_states_regions:2021',
        'name': '2021 Full States and Regions Dataset',
        'publisher': 'CDP',
        'published': '2022-05-06',
        'URL': 'https://data.cdp.net/Governance/2021-Full-States-and-Regions-Dataset/8t47-xqwz'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # -------------------------------------------
    # EmissionsAgg table
    # -------------------------------------------
    df_out = harmonize_emissions(
        fl=fl,
        reportingYear=2021,
        fl_climactor=fl_climactor,
        datasourceDict=datasourceDict
    )

    # convert to csv
    df_out.drop_duplicates().to_csv(
        f'{outputDir}/EmissionsAgg.csv', index=False)

    # -------------------------------------------
    # Tag table
    # -------------------------------------------
    if not Path(f"{outputDir}/Tag.csv").is_file():
        # create Tag file
        tagDictList = [
            {
                'tag_id': 'self_reported',
                'tag_name': 'self reported'
            }
        ]

        for tagDict in tagDictList:
            write_to_csv(outputDir=outputDir,
                         tableName='Tag',
                         dataDict=tagDict,
                         mode='a')

    # -------------------------------------------
    # DataSourceTag table
    # -------------------------------------------
    if not Path(f"{outputDir}/DataSourceTag.csv").is_file():

        tags = ['self_reported']

        for tag in tags:
            dataSourceTagDict = {
                'datasource_id': f"{datasourceDict['datasource_id']}",
                'tag_id': tag
            }

            write_to_csv(outputDir=outputDir,
                         tableName='DataSourceTag',
                         dataDict=dataSourceTagDict,
                         mode='a')

    # -------------------------------------------
    # Target table
    # -------------------------------------------
    # df_targets = harmonize_cdp_states_regions_targets(
    #        fl=fl,
    #        fl_climactor=fl_climactor,
    #        datasourceDict=datasourceDict)

    #df_targets.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
