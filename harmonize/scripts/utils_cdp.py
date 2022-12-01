from datetime import datetime
from geopy.geocoders import Nominatim
import numpy as np
import pandas as pd
import re


def remove_trailing_whitespace(stringList=None):
    """remove trailing white space
    """
    return [string.rstrip() for string in stringList]


def harmonize_cdp_states_regions(fl=None, fl_climactor=None, reportingYear=None, datasourceDict=None):
    # load raw data
    df = pd.read_csv(fl)

    reportingYear = str(reportingYear)

    if 'Questionnaire' in df.columns:
        regex = '^CDP\sStates\sand\sRegions\s(?P<report_year>\d*)'
        report_years = [re.match(regex, string).group(
            'report_year') for string in df['Questionnaire']]
        df['Year Reported to CDP'] = report_years

    # list of account numbers (organizations)
    if 'Account Number' in df.columns:
        accountNumbers = list(set(df['Account Number']))
        accountColumn = 'Account Number'

    if 'Organization Number' in df.columns:
        accountNumbers = list(set(df['Organization Number']))
        accountColumn = 'Organization Number'

    if 'Organization Name' in df.columns:
        organizationColumn = 'Organization Name'

    if 'Organization' in df.columns:
        organizationColumn = 'Organization'

    if '3. Emissions - Region-wide' in list(set(df['Parent Section'])):
        parentSection = '3. Emissions - Region-wide'

    if 'Assessment' in list(set(df['Parent Section'])):
        parentSection = 'Assessment'

    # make sure year_reported is string
    df['Year Reported to CDP'] = df['Year Reported to CDP'].astype('str')

    # list to concatenate to
    concat_list = []

    for accountNumber in accountNumbers:

        filt = (
            (df['Year Reported to CDP'] == reportingYear) &
            (df['Parent Section'] == parentSection) &
            (df[accountColumn] == accountNumber)
        )

        # select emissions section
        df_tmp = df.loc[filt]

        # get subnational and country
        subnational = list(set(df_tmp[organizationColumn]))
        country = list(set(df_tmp['Country']))

        # ==================================================================
        # if emissions data is in question 2.1
        # ==================================================================
        filt = (df_tmp['Question Number'] == '2.1')
        report_emissions = list(df_tmp.loc[filt, 'Response Answer'])

        if report_emissions == ['Yes']:

            filt = (df_tmp['Question Number'] == '2.1a')
            df_attach = pd.pivot(df_tmp.loc[(filt)],  # & (df_tmp['Column Name'] != 'Level of confidence')
                                 index='Row Number',
                                 columns='Column Name',
                                 values='Response Answer')

            # ignore index name
            df_attach.index.name = None

            # ------------------------------------------------------------------
            # get inventory year (if applicable)
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '2.1a')
            inventoryYear = list(df_tmp.loc[(filt) & (
                df_tmp['Column Name'] == 'Inventory year'), 'Response Answer'])

            # only run this section if there is an inventory year
            if bool(inventoryYear):
                # case: when Q not applicable
                if inventoryYear == ['Question not applicable']:
                    inventoryYear = [np.NaN]

                # case: when inventory year is 'YYYY/YYYY', pick last year
                if (inventoryYear[0] is not np.NaN) and ('/' in inventoryYear[0]):
                    match = re.match(
                        '(?P<start_year>\d{4})/(?P<end_year>\d{4})', inventoryYear[0])
                    inventoryYear = [match['end_year']]

            # ------------------------------------------------------------------
            # get methodology
            # ------------------------------------------------------------------

            # Boundary of inventory relative to jurisdiction boundary
            filt = (df_tmp['Question Number'] == '2.1b')
            boundary = list(df_tmp.loc[(filt) & (
                df_tmp['Column Name'] == 'Boundary of inventory relative to jurisdiction boundary'), 'Response Answer'])

            # Primary methodology/framework to compile inventory
            filt = (df_tmp['Question Number'] == '2.1b')
            methodology = list(df_tmp.loc[(filt) & (
                df_tmp['Column Name'] == 'Primary methodology/framework to compile inventory'), 'Response Answer'])

            # Gases included in inventory'
            filt = (df_tmp['Question Number'] == '2.1b')
            gases_included = list(df_tmp.loc[(filt) & (
                df_tmp['Column Name'] == 'Gases included in inventory'), 'Response Answer'])

            # Source of Global Warming Potential values
            filt = (df_tmp['Question Number'] == '2.1b')
            gwp_source = list(df_tmp.loc[(filt) & (
                df_tmp['Column Name'] == 'Source of Global Warming Potential values'), 'Response Answer'])

            # ------------------------------------------------------------------
            # 2.1c Provide a breakdown of your community-wide emissions by sector
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '2.1c')
            df_scope = pd.pivot(df_tmp.loc[(filt)],
                                index='Row Number',
                                columns='Column Name',
                                values='Response Answer')

            # ignore index name
            df_scope.index.name = None

            # confidenceExcludeSink = [np.nan] if len(
            #    confidenceExcludeSink) == 0 else confidenceExcludeSink
            # confidenceIncludeSink = [np.nan] if len(
            #    confidenceIncludeSink) == 0 else confidenceIncludeSink

            # ------------------------------------------------------------------
            # add national and year information
            # ------------------------------------------------------------------
            df_scope['subnational'] = subnational[0]
            df_scope['country'] = country[0]
            df_scope['reportingYear'] = reportingYear
            df_scope['inventoryYear'] = inventoryYear[0]

            df_scope = df_scope.rename(
                columns={'Emissions (metric tonnes CO2e)': 'total_emissions'})

            #df_out = df_out.replace("Question not applicable", np.NaN)
            #df_out['year'] = pd.to_datetime(df_out['accounting_stop']).dt.year

            concat_list.append(df_scope)
            continue

        # ==================================================================
        # has a region-wide emissions inventory to report? 3.1
        # ==================================================================
        filt = (df_tmp['Question Number'] == '3.1')
        has_inventory = list(df_tmp.loc[filt, 'Response Answer'])

        if has_inventory == ['Yes']:
            # ------------------------------------------------------------------
            # dates of the accounting year or 12-month period for your region’s latest region-wide GHG emissions inventory.
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.2')
            accountingStart = list(df_tmp.loc[(filt) & (
                df_tmp['Column Name'] == 'From'), 'Response Answer'])
            accountingStop = list(df_tmp.loc[(filt) & (
                df_tmp['Column Name'] == 'To'), 'Response Answer'])

            # inventory year from accountingStop
            inventoryYear = str(pd.to_datetime(accountingStop).year.values[0])

            # ------------------------------------------------------------------
            # 3.3 boundary
            # ------------------------------------------------------------------
            # ...

            # ------------------------------------------------------------------
            # question 3.4
            # Please select the name of the primary protocol, standard, or methodology
            # you have used to calculate GHG emissions
            # and explain how it has been used
            # as well as any additional protocols and processes for data collection.
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.4')
            df_protocol = pd.pivot(df_tmp.loc[(filt)],
                                   index='Row Number',
                                   columns='Column Name',
                                   values='Response Answer')

            # ------------------------------------------------------------------
            # 3.5 Please select which gases are included in your latest region-wide GHG emissions inventory.
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.5')
            gases_included = list(df_tmp.loc[(filt), 'Response Answer'])

            # ------------------------------------------------------------------
            # 3.5a Can you report a region-wide breakdown of emissions by GHG type?
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.5a')
            has_breakdown_by_ghg = list(df_tmp.loc[filt, 'Response Answer'])

            if has_breakdown_by_ghg == ['Yes']:
                # 3.5b Break down your total gross emissions by greenhouse gas type and provide the source of each used global warming potential (GWP).
                filt = (df_tmp['Question Number'] == '3.5b')
                df_ghg_breakdown = pd.pivot(df_tmp.loc[(filt)],
                                            index='Row Number',
                                            columns='Column Name',
                                            values='Response Answer')

            # ------------------------------------------------------------------
            # details of your latest inventory’s total region-wide GHG emissions for the accounting year or 12-month period as reported in 3.2
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.6')
            df_latest_inventory_details = pd.pivot(df_tmp.loc[(filt)],
                                                   index='Row Number',
                                                   columns='Column Name',
                                                   values='Response Answer')

            # ------------------------------------------------------------------
            # 3.7 CCan you report your region-wide base year emissions figure?
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.7')
            has_base_year_emissions = list(df_tmp.loc[filt, 'Response Answer'])

            if has_base_year_emissions == ['Yes']:
                # 3.7a Please report your region-wide base year emissions in the table below.
                filt = (df_tmp['Question Number'] == '3.7a')
                df_base_year_emissions = pd.pivot(df_tmp.loc[(filt)],
                                                  index='Row Number',
                                                  columns='Column Name',
                                                  values='Response Answer')

            # ------------------------------------------------------------------
            # 3.8 Please indicate if your region-wide emissions have increased, decreased,
            # or stayed the same since your last emissions inventory, and please describe why.
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.8')
            df_change_in_inventory = pd.pivot(df_tmp.loc[(filt)],
                                              index='Row Number',
                                              columns='Column Name',
                                              values='Response Answer')

            # ------------------------------------------------------------------
            # if emissions data is in question 3.9
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '3.9')
            report_emissions = list(df_tmp.loc[filt, 'Response Answer'])

            if report_emissions == ['Yes']:
                # scope emissions without level confidence
                # latest questionnaires do not ask about confidence in scope emissions
                filt = (df_tmp['Question Number'] == '3.9a')
                df_scope = pd.pivot(df_tmp.loc[(filt) & (df_tmp['Column Name'] != 'Level of confidence')],
                                    index='Row Number',
                                    columns='Column Name',
                                    values='Response Answer')

                # ignore index name
                df_scope.index.name = None

                # ------------------------------------------------------------------
                # add national and year information
                # ------------------------------------------------------------------
                df_scope['subnational'] = subnational[0]
                df_scope['country'] = country[0]
                df_scope['reportingYear'] = reportingYear
                df_scope['inventoryYear'] = inventoryYear

                columns = [
                    'Total (Scope 1 + Scope 2) emissions',
                    'subnational',
                    'country',
                    'reportingYear',
                    'inventoryYear'
                ]

                df_out = df_scope[columns].rename(
                    columns={'Total (Scope 1 + Scope 2) emissions': 'total_emissions'})

                concat_list.append(df_out)

            # 3.10 Please attach your latest region-wide inventory in the table below.
            filt = (df_tmp['Question Number'] == '3.10')
            df_inventory_attachment = pd.pivot(df_tmp.loc[(filt)],
                                               index='Row Number',
                                               columns='Column Name',
                                               values='Response Answer')

    # ==================================================================
    # concatenate dataframes together
    # ==================================================================
    df_out = pd.concat(concat_list, ignore_index=True)

    # ==================================================================
    # aggregate across non-LULUCF sectors for scope1 and 2 emissions
    # ==================================================================
    if 'Sector' in df_out.columns:
        # filter out LULUCF sectors
        LULUCF_like_sectors = [
            'Agriculture, Forestry and other land use (AFOLU)',
            'Other, please specify: ANZIC Classification: DIV A Agriculture, Forestry and Fishing',
            'Other, please specify: Afforestation and Deforestation',
            'Other, please specify: Agriculture',
            'Other, please specify: Forestry and other land use',
            'Other, please specify: LULUCF',
            'Other, please specify: Land Use',
            'Other, please specify: Land use, land use change and forestry',
            'Other, please specify: Mudança de Uso da Terra e Floresta',
            'Other, please specify: Mudanças do Uso da Terra e Florestas',
            'Other, please specify: Uso de la tierra, cambio de uso de la tierra',
        ]

        # select non-LULUCF sectors
        filt = ~df_out['Sector'].isin(LULUCF_like_sectors)
        df_out = df_out.loc[filt]

        # only select sum of scopes 1 and 2
        filt = df_out['Scope'] == 'Scope 1 and 2'
        df_out = df_out.loc[filt]

        # filter out NaN, "question not application", and <0
        filt = (
            (~df_out['total_emissions'].isna()) &
            (df_out['total_emissions'] != 'Question not applicable')
        )
        df_filt = df_out.loc[filt]

        # filter out where emissions < 0
        filt = (df_filt['total_emissions'].astype(float) > 0)
        df_filt = df_filt.loc[filt]

        # make emissions be float
        df_filt['total_emissions'] = df_filt['total_emissions'].astype(float)

        # aggregate emissions
        df_out = df_filt.groupby(by=['subnational', 'country', 'inventoryYear', 'reportingYear'], as_index=False)[
            'total_emissions'].sum()

    # ==================================================================
    # name harmonize and merge
    # ==================================================================
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
    df_final = pd.merge(df_out, df_sub,
                        left_on=["subnational_harmonized"],
                        right_on=["name_harmonized"],
                        how="left")

    # rename columns
    df_final = df_final.rename(columns={'inventoryYear': 'year'})

    # ensure no nan in year
    filt = ~(df_final['year'] == 'nan')
    df_final = df_final.loc[filt]

    filt = ~df_final['year'].isna()
    df_final = df_final.loc[filt]

    # change type of year
    df_final['year'] = df_final['year'].astype(int)

    # create id columns
    df_final['datasource_id'] = datasourceDict['datasource_id']

    df_final['emissions_id'] = df_final.apply(lambda row:
                                              f"CDP_full_states_regions:{row['actor_id']}:{row['year']}",
                                              axis=1)

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

    # renmove nan emissions
    filt = ~df_emissionsAgg['total_emissions'].isna()
    df_emissionsAgg = df_emissionsAgg.loc[filt]

    # ensure type is correct
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


def harmonize_cdp_states_targets(fl=None, reportingYear=None, fl_climactor=None, datasourceDict=None):
    reportingYear = str(reportingYear)

    df = pd.read_csv(fl)

    # list of account numbers (organizations)
    #accountNumbers = list(set(df['Account Number']))

    if 'Questionnaire' in df.columns:
        regex = '^CDP\sStates\sand\sRegions\s(?P<report_year>\d*)'
        report_years = [re.match(regex, string).group(
            'report_year') for string in df['Questionnaire']]
        df['Year Reported to CDP'] = report_years

    # list of account numbers (organizations)
    if 'Account Number' in df.columns:
        accountNumbers = list(set(df['Account Number']))
        accountColumn = 'Account Number'

    if 'Organization Number' in df.columns:
        accountNumbers = list(set(df['Organization Number']))
        accountColumn = 'Organization Number'

    if 'Organization Name' in df.columns:
        organizationColumn = 'Organization Name'

    if 'Organization' in df.columns:
        organizationColumn = 'Organization'

    if '4. Strategy' in list(set(df['Parent Section'])):
        parentSection = '4. Strategy'

    if '5. Strategy' in list(set(df['Parent Section'])):
        parentSection = '5. Strategy'

    if 'Targets' in list(set(df['Parent Section'])):
        parentSection = 'Targets'

    # make sure year_reported is string
    df['Year Reported to CDP'] = df['Year Reported to CDP'].astype('str')

    #reportingYear = 2020

    # initialize target list
    dataFrameList = []

    for accountNumber in accountNumbers:
        filt = (
            (df['Year Reported to CDP'] == reportingYear) &
            (df['Parent Section'] == parentSection) &
            (df[accountColumn] == accountNumber)
        )

        # select emissions section
        df_tmp = df.loc[filt]

        # get subnational and country
        subnational = list(set(df_tmp[organizationColumn]))
        country = list(set(df_tmp['Country']))

        # ==================================================================
        # 5.1 has action plan for reducing region-wide GHG emissions?
        # ==================================================================
        filt = (df_tmp['Question Number'] == '5.1')
        has_plan = list(df_tmp.loc[filt, 'Response Answer'])
        # print(has_plan)

        if has_plan == ['Yes']:

            # ------------------------------------------------------------------
            # 5.1a Please attach your region's climate change action plan below.
            # ------------------------------------------------------------------
            filt = (df_tmp['Question Number'] == '5.1a')
            df_plan = pd.pivot(df_tmp.loc[(filt)],  # & (df_tmp['Column Name'] != 'Level of confidence')
                               index='Row Number',
                               columns='Column Name',
                               values='Response Answer')

            # ignore index name
            df_plan.index.name = None

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

        # if question 5.2
        if (has_target.isin(targetTypes).all()) & (len(has_target) > 0):
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

        # ==================================================================
        # 4.2  Do you have a regional GHG emissions reduction target?
        # ==================================================================
        filt = (df_tmp['Question Number'] == '4.2')
        has_target = df_tmp.loc[filt, 'Response Answer']

        if (has_target.isin(targetTypes).all()) & (len(has_target) > 0):
            target_list = has_target.to_list()
            for target in target_list:
                # print(accountNumber,target)
                if target == "Base year emissions target":
                    filt = (df_tmp['Question Number'] == '4.2a')
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
                if target == 'Base year intensity target':
                    filt = (df_tmp['Question Number'] == '4.2b')
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
                    filt = (df_tmp['Question Number'] == '4.2c')
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
                    filt = (df_tmp['Question Number'] == '4.2d')
                    df_targ = pd.pivot(df_tmp.loc[filt],
                                       index='Row Number',
                                       columns='Column Name',
                                       values='Response Answer')
                    nRecords = len(df_targ)
                    tmp = pd.DataFrame({**{'country': country,
                                           'subnational': subnational,
                                           'target_type': target,
                                           'target_unit': 'tCO2e'
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

        # get ISO codes for actor ID
        df_out = df_out.copy()

        df_out = df_out.rename(columns={
            'Base year': 'baseline_year',
            'Target year': 'target_year',
            'Percentage reduction target': 'target_value',
            # 'Percentage reduction target in emissions intensity': 'percent_reduction_target_in_emissions_intensity',
            # 'Percentage reduction target from business as usual': 'percent_reduction_target_from_bau',
            'Estimated business as usual absolute emissions in target year (metric tonnes CO2e)': 'target_year_bau_emissions',
            'Sector': 'sector',
            'Intensity unit (Emissions per)': 'intensity_unit'})

        if 'Percentage reduction target in emissions intensity' in list(df_out.columns):
            df_out = df_out.rename(columns={
                'Percentage reduction target in emissions intensity': 'percent_reduction_target_in_emissions_intensity'})

            df_out['target_value'] = df_out.target_value.fillna(
                df_out.percent_reduction_target_in_emissions_intensity)

        # merge values for other target_types
        if 'Percentage reduction target from business as usual' in list(df_out.columns):
            df_out = df_out.rename(columns={
                'Percentage reduction target from business as usual': 'percent_reduction_target_from_bau'})

            df_out['target_value'] = df_out.target_value.fillna(
                df_out.percent_reduction_target_from_bau)

        #filt = ~df_out['target_value'].isna()
        #df_out = df_out.loc[filt]

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
                                           f"CDP_full_states_regions:{row['actor_id']}:{row['target_year']}",
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


def harmonize_cdp_city_emissions(fl=None, fl_climactor=None, fl_climactor_city=None, reportingYear=None, datasourceDict=None):
    # print(reportingYear)
    year = reportingYear
    year = str(year)

    # Now need to find the ISO code for each subnational
    df_clim = pd.read_csv(fl_climactor).drop_duplicates()

    df = pd.read_csv(fl)

    df.columns = df.columns.str.lower()

    # calculate total emissions
    df['total_emissions'] = (
        df['total scope 1 emissions (metric tonnes co2e)'] +
        df['total scope 2 emissions (metric tonnes co2e)']
    )

    if 'measurement year' in df.columns:
        df = df.rename(columns={'measurement year': 'measurement_year'})

    if 'city short name' in df.columns:
        df = df.rename(columns={'city short name': 'city'})

    if 'accounting year' in df.columns:
        df = df.rename(columns={'accounting year': 'measurement_year'})

    # rename all other necessary columns
    df = df.rename(columns={'account number': 'account_number',
                            'city location': 'city_location'})

    # select relevant columns
    columns = [
        'account_number',
        'country',
        'city',
        'city_location',
        'measurement_year',
        'total_emissions',
    ]

    df_tmp = df[columns]

    # make copy of dataframe, otherwise get a warning message
    df_tmp = df_tmp.copy()

    # drop any rows that have a nan in subset
    # this helped: https://towardsdatascience.com/how-to-drop-rows-in-pandas-dataframes-with-nan-values-in-certain-columns-7613ad1a7f25
    df_tmp = df_tmp.dropna(subset=['city', 'measurement_year', 'total_emissions'],
                           how='any',
                           axis='index')

    df_tmp['city'] = remove_trailing_whitespace(df_tmp['city'])

    df_tmp['city'] = df_tmp.city.str.replace('City of ', '')

    # get city name when something like "Chicago, IL"
    df_tmp['city_split'] = [val[0] for val in df_tmp['city'].str.split(',')]

    # get the state from city, if possible
    state = []
    for val in df_tmp['city'].str.split(', '):
        if len(val) > 1:
            state.append(val[1])
        else:
            state.append(np.NaN)

    df_tmp['state'] = state

    # pull year from measurement year
    # this can also be done with regular expressions
    if df_tmp['measurement_year'].sample(1).str.contains('-').values[0]:
        format = '%Y-%m-%d'
        filt = df_tmp['measurement_year'].str.match(
            r'\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}')
        df_tmp = df_tmp.loc[filt]
        df_tmp['year'] = [datetime.strptime(val[1], format).year
                          for val in df_tmp['measurement_year'].str.split(' - ')]

    if df_tmp['measurement_year'].sample(1).str.contains('/').values[0]:
        format = '%m/%d/%Y %I:%M:%S %p'
        df_tmp['year'] = [datetime.strptime(date, format).year
                          for date in df_tmp['measurement_year']]

    # name harmonize countries
    df_tmp['country_harmonized'] = (
        df_tmp['country']
        .replace(to_replace=list(df_clim['wrong']),
                 value=list(df_clim['right']))
    )

    # merge climactor iso codes into (make sure to drop duplicates)
    df_tmp_clim = pd.merge(df_tmp, df_clim[['right', 'iso', 'iso2']].drop_duplicates(),
                           left_on=["country_harmonized"],
                           right_on=["right"], how="left")

    df_tmp_clim['is_part_of'] = df_tmp_clim[['state', 'iso2']].apply(lambda row:
                                                                     np.NaN
                                                                     if row["state"] is np.NaN
                                                                     else f"{row['iso2']}-{row['state']}",
                                                                     axis=1)

    # get rows with missing is_part_of
    filt = df_tmp_clim['is_part_of'].isna()
    df_ = df_tmp_clim.loc[filt]
    df_ = df_.copy()

    # %%time
    # conda install -c conda-forge geopy
    # now get location city is part_of using api
    # this takes a couple minutes !!

    is_part_of = []
    set_geocoder = False
    for target_string in df_['city_location']:

        # if not city_location supplied
        if target_string is np.NaN:
            tmp = np.NaN
            is_part_of.append(tmp)
            continue

        # POSSIBLE_ERROR_SOURCE: only testing two cases
        # extract from format: "(LAT, LON)"
        if re.search('^\(', target_string):
            match = re.match(
                '^\((?P<lat>-?\d*(.\d+)),\s(?P<lon>-?\d*(.\d+))\)$', target_string)

        # extract from format: "POINT (LON LAT)"
        if re.search('^POINT', target_string):
            match = re.match(
                '^(POINT)\s\((?P<lon>-?\d*(.\d+))\s(?P<lat>-?\d*(.\d+))\)$', target_string)

        # storage matches in variables
        lat = float(match.group('lat'))
        lon = float(match.group('lon'))

        # set the geocoder if it isn't set yet
        if not set_geocoder:
            geolocator = Nominatim(user_agent="geoapiExercises")
            set_geocoder = True

        # Return an address by location point.
        location = geolocator.reverse(f"{lat},{lon}")

        # if location is none, then try reversing the order
        if location is None:
            location = geolocator.reverse(f"{lon},{lat}")

        # if the location is still None, then just set it to NaN
        # else pull out the ISO code
        if location is None:
            tmp = np.NaN
        else:
            if 'ISO3166-2-lvl4' in location.raw['address']:
                tmp = location.raw['address']['ISO3166-2-lvl4']

            if ('ISO3166-2-lvl4' not in location.raw['address']) and ('country_code' in location.raw['address']):
                tmp = location.raw['address']['country_code']

        is_part_of.append(tmp)

    df_['is_part_of'] = is_part_of

    df_tmp_clim = pd.concat(
        [df_tmp_clim.loc[~df_tmp_clim['is_part_of'].isna()], df_])

    # read UNLOCODE, name includes diacritics
    fl = 'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-UNLOCODE/main/UNLOCODE/Actor.csv'
    df_unl = pd.read_csv(fl)

    # split UNLOCODE to get ISO2 code
    df_unl['iso2'] = [val.split(' ')[0] for val in df_unl['actor_id']]
    df_unl = df_unl[['actor_id', 'name', 'is_part_of', 'iso2']]

    # dictionary to name harmonze cities
    key_dict = pd.read_csv(fl_climactor_city)
    key_dict = key_dict.loc[key_dict['entity_type'] == 'City']

    # name harmonize
    df_tmp_clim['city_harmonized'] = (
        df_tmp_clim['city_split']
        .replace(to_replace=list(key_dict['wrong']),
                 value=list(key_dict['right']))
    )

    # name harmonize
    df_unl['city_harmonized'] = (
        df_unl['name']
        .replace(to_replace=list(key_dict['wrong']),
                 value=list(key_dict['right']))
    )

    # merge on city, ISO, is_part_of to get locode
    df_ = pd.merge(df_tmp_clim, df_unl,
                   left_on=['city_harmonized', "iso2", "is_part_of"],
                   right_on=['city_harmonized', "iso2", "is_part_of"],
                   how="left")

    df_tmp_clim = df_.copy()

    # create id columns
    df_tmp_clim['datasource_id'] = datasourceDict['datasource_id']

    # create emissions_id columns
    df_tmp_clim['emissions_id'] = df_tmp_clim.apply(lambda row:
                                                    f"CDP_citywide_emissions:{row['actor_id']}:{row['year']}",
                                                    axis=1)

    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    #df_emissionsAgg = pd.concat([df_tmp_out[emissionsAggColumns], df_found_out[emissionsAggColumns]]).drop_duplicates().dropna()
    filt = ~df_tmp_clim['actor_id'].isna()
    df_tmp_clim = df_tmp_clim.loc[filt]

    # ensure type
    df_emissionsAgg = df_tmp_clim[emissionsAggColumns].astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    })

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    return df_emissionsAgg
