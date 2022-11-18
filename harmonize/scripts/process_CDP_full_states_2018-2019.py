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
        #df_tmp.loc[(filt) & (df_tmp['Row Name'] == 'Total gross emissions (excludes sinks)')]

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

            df_out['year'] = pd.to_datetime(df_out['accounting_stop']).dt.year

            concat_list.append(df_out)

    # concat them all together
    df_out = pd.concat(concat_list, ignore_index=True)

    filt = (~df_out['Total (Scope 1 + Scope 2) emissions'].isna())
    df_agg = df_out.loc[filt].copy()

    # Now need to find the ISO code for each subnational
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

    df_final['year'] = df_final['year'].astype(int)

    # create id columns
    df_final['datasource_id'] = datasourceDict['datasource_id']

    df_final['emissions_id'] = df_final.apply(lambda row:
                                              f"CDP_full_states_regions_2018-2019:{row['actor_id']}:{row['year']}",
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


def harmonize_targets(fl=None, reportingYear=None, fl_climactor=None, datasourceDict=None):
    df = pd.read_csv(fl)

    # list of account numbers (organizations)
    accountNumbers = list(set(df['Account Number']))

    # initialize target list
    dataFrameList = []

    # this is different from year to year
    parent_section = '5. Strategy'

    for accountNumber in accountNumbers:
        filt = (
            (df['Year Reported to CDP'] == reportingYear) &
            (df['Parent Section'] == parent_section) &
            (df['Account Number'] == accountNumber)
        )

        # select emissions section
        df_tmp = df.loc[filt]

        subnational = list(set(df_tmp['Organization']))
        country = list(set(df_tmp['Country']))

        # do you have a GHG emissions reduction target in place
        filt = (df_tmp['Question Number'] == '5.2')
        has_target = df_tmp.loc[filt, 'Response Answer']

        # list of possible target types
        targetTypes = [
            'Base year emissions target',
            'Base year intensity target',
            'Baseline scenario (business as usual) target',
            'Fixed level target'
        ]

        # if has target then parse out information
        if has_target.isin(targetTypes).all():
            target_list = has_target.to_list()

            for target in target_list:
                if target == "Base year emissions target":
                    filt = (df_tmp['Question Number'] == '5.2a')
                    df_targ = pd.pivot(df_tmp.loc[filt],
                                       index='Row Number',
                                       columns='Column Name',
                                       values='Response Answer')
                    nRecords = len(df_targ)
                    tmp = pd.DataFrame({**{'country': country,
                                           'subnational': subnational,
                                           'target_type': target,
                                           'target_unit': 'percent',
                                           }})
                    df_country = pd.concat([tmp]*nRecords, ignore_index=True)
                    df_out = pd.DataFrame({**df_country.to_dict(orient='list'),
                                           **df_targ.to_dict(orient='list')})

                    dataFrameList.append(df_out)
                    continue
                if target == 'Base year intensity target':
                    filt = (df_tmp['Question Number'] == '5.2b')
                    df_targ = pd.pivot(df_tmp.loc[filt],
                                       index='Row Number',
                                       columns='Column Name',
                                       values='Response Answer')
                    nRecords = len(df_targ)
                    tmp = pd.DataFrame({**{'country': country,
                                           'subnational': subnational,
                                           'target_type': target,
                                           'target_unit': 'percent'
                                           }})
                    df_country = pd.concat([tmp]*nRecords, ignore_index=True)

                    df_out = pd.DataFrame({**df_country.to_dict(orient='list'),
                                           **df_targ.to_dict(orient='list')})

                    dataFrameList.append(df_out)
                    continue
                if target == 'Baseline scenario (business as usual) target':
                    filt = (df_tmp['Question Number'] == '5.2c')
                    df_targ = pd.pivot(df_tmp.loc[filt],
                                       index='Row Number',
                                       columns='Column Name',
                                       values='Response Answer')
                    nRecords = len(df_targ)
                    tmp = pd.DataFrame({**{'country': country,
                                           'subnational': subnational,
                                           'target_type': target,
                                           'target_unit': 'percent'
                                           }})
                    df_country = pd.concat([tmp]*nRecords, ignore_index=True)

                    df_out = pd.DataFrame({**df_country.to_dict(orient='list'),
                                           **df_targ.to_dict(orient='list')})

                    dataFrameList.append(df_out)
                    continue
                if target == 'Fixed level target':
                    filt = (df_tmp['Question Number'] == '5.2d')
                    df_targ = pd.pivot(df_tmp.loc[filt],
                                       index='Row Number',
                                       columns='Column Name',
                                       values='Response Answer')
                    nRecords = len(df_targ)
                    tmp = pd.DataFrame({**{'country': country,
                                           'subnational': subnational,
                                           'target_type': target,
                                           'target_unit': 'percent'
                                           }})
                    df_country = pd.concat([tmp]*nRecords, ignore_index=True)

                    df_out = pd.DataFrame({**df_country.to_dict(orient='list'),
                                           **df_targ.to_dict(orient='list')})

                    dataFrameList.append(df_out)
                    continue
                else:
                    print(f"{target} for {accountNumber} not in {targetTypes}")
                    continue

    # stich all the target dataframes together
    df_out = pd.concat(dataFrameList)

    # replace not applicaable with NaN
    df_out = df_out.replace("Question not applicable", np.NaN)

    df_out = df_out.rename(columns={
        'Base year': 'baseline_year',
        'Target year': 'target_year',
        'Percentage reduction target': 'target_value',
        'Percentage reduction target in emissions intensity': 'percent_reduction_target_in_emissions_intensity',
        'Percentage reduction target from business as usual': 'percent_reduction_target_from_bau',
        'Estimated business as usual absolute emissions in target year (metric tonnes CO2e)': 'target_year_bau_emissions',
        'Sector': 'sector',
        'Intensity unit (Emissions per)': 'intensity_unit'
    })

    # merge values for other target_types
    # fill 'Fixed-level target' target type with target_year_emissions
    df_out['target_value'] = df_out.target_value.fillna(
        df_out.percent_reduction_target_in_emissions_intensity)
    df_out['target_value'] = df_out.target_value.fillna(
        df_out.percent_reduction_target_from_bau)

    filt = ~df_out['target_value'].isna()
    df_out = df_out.loc[filt]

    # get ISO codes for actor ID
    df_out = df_out.copy()

    # Now need to find the ISO code for each subnational
    df_clim = pd.read_csv(fl_climactor).drop_duplicates()
    df_clim = df_clim.loc[df_clim['entity_type'].isin(['Region', 'nan'])]

    # name harmonize
    df_out['subnational_harmonized'] = (
        df_out['subnational']
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
    df_final = pd.merge(df_out, df_sub, left_on=[
                        "subnational_harmonized"], right_on=["name_harmonized"], how="left")

    # this is just to rename df_final
    df_out = df_final.copy()

    # create id columns
    df_out['datasource_id'] = datasourceDict['datasource_id']
    df_out['target_id'] = df_out.apply(lambda row:
                                       f"CDP_full_states_regions_2018-2019:{row['actor_id']}:{row['target_year']}",
                                       axis=1)

    # replace baseline_year with target_year if fixed level target
    filt = df_out['target_type'] == 'Fixed level target'
    df_out.loc[filt, 'baseline_year'] = df_out.loc[filt, 'target_year']

    #
    columns = [
        'target_id',
        'actor_id',
        'target_type',
        'baseline_year',
        'target_year',
        'target_value',
        'target_unit',
        'datasource_id',
    ]
    df_out = df_out[columns]

    filt = ~df_out['target_year'].isna()
    df_out = df_out.loc[filt]

    # drop duplicates
    filt = ~df_out['actor_id'].isna()
    df_out = df_out.loc[filt].drop_duplicates()

    # TODO: understand these targets
    # they are listed as a percentage in the questionnaire,
    # but they should be in units of tCO2e
    # drop fixed level targets for now
    filt = (df_out['target_type'] != 'Fixed level target')
    df_out = df_out.loc[filt]

    # drop where baseline year is 0, that doesn't make sense
    filt = ~df_out['baseline_year'].isin(['0'])
    df_out = df_out.loc[filt]

    # drop records without a baseline year
    filt = ~df_out['baseline_year'].isna()
    df_out = df_out.loc[filt]

    # change target_value type to float
    df_out['target_value'] = df_out['target_value'].astype(float)

    # ensure data has correct types
    df_out = df_out.astype(
        {
            'target_id': str,
            'actor_id': str,
            'target_type': str,
            'baseline_year': int,
            'target_year': int,
            'target_value': int,
            'target_unit': str,
            'datasource_id': str
        }
    )

    # sort by actor_id and year
    df_out = df_out.sort_values(by=['actor_id', 'target_year'])

    return df_out


if __name__ == "__main__":
    import numpy as np
    import os
    import pandas as pd
    from pathlib import Path
    from utils import make_dir
    from utils import write_to_csv

    # Create directory to store output
    outputDir = "../data/processed/CDP_full_states_regions_2018-2019/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to raw dataset
    fl = '../data/raw/CDP_full_states_regions_2018_2019/2018_-_2019_Full_States_and_Regions_Dataset.csv'
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
        'datasource_id': 'CDP_full_states_regions:2018-2019',
        'name': '2018-2019 Full States and Regions Dataset',
        'publisher': 'CDP',
        'published': '2020-04-30',
        'URL': 'https://data.cdp.net/States-and-Regions/2018-2019-Full-States-and-Regions-Dataset/hmhn-9g99'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # -------------------------------------------
    # EmissionsAgg table
    # -------------------------------------------
    df_2018 = harmonize_emissions(
        fl=fl,
        reportingYear=2018,
        fl_climactor=fl_climactor,
        datasourceDict=datasourceDict
    )

    df_2019 = harmonize_emissions(
        fl=fl,
        reportingYear=2019,
        fl_climactor=fl_climactor,
        datasourceDict=datasourceDict
    )

    df_out = (pd.concat([df_2018, df_2019])
              .sort_values(by=['actor_id', 'year'])
              .drop_duplicates()
              )

    # convert to csv
    df_out.to_csv(f'{outputDir}/EmissionsAgg.csv', index=False)

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
    df_target_2018 = harmonize_targets(
        fl=fl,
        reportingYear=2018,
        fl_climactor=fl_climactor,
        datasourceDict=datasourceDict
    )

    df_target_2019 = harmonize_targets(
        fl=fl,
        reportingYear=2019,
        fl_climactor=fl_climactor,
        datasourceDict=datasourceDict
    )

    # merge 2018 and 2019 together, sort the values
    df_targets = pd.concat([df_target_2018, df_target_2019], ignore_index=True)
    df_targets = df_targets.sort_values(by=['actor_id', 'target_year'])

    df_targets.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
