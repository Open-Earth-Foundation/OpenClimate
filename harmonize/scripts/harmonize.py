import numpy as np
import pandas as pd

def harmonize_cdp_states_regions_emissions(fl=None, fl_climactor=None, datasourceDict=None):
    # load raw data
    df = pd.read_csv(fl)

    # select Assessment
    filt = (df['Parent Section'] == 'Assessment') & (df['Section'] == '2. Emissions Inventory')
    df = df.loc[filt]

    # list to concatenate to
    concat_list = []

    for subnat in set(df['Organization Name']):

        filt = df['Organization Name'] == subnat
        df_tmp = df.loc[filt]
        df_tmp = df_tmp[['Country', 'Column Name','Row Number', 'Response Answer']]

        filt = ~df_tmp['Column Name'].isna()
        df_tmp = df_tmp.loc[filt]

        # get country name
        (country,) = set(df_tmp['Country'])

        column_names = [
            'Boundary of inventory relative to jurisdiction boundary',
        #    'Comment',
            'Community-wide inventory attachment (spreadsheet) and/or link (with unrestricted access)',
            'Emissions (metric tonnes CO2e)',
        #    'Gases included in inventory',
            'Inventory year',
            'Population in inventory year',
            'Primary methodology/framework to compile inventory',
            'Scope',
            'Sector',
        #    'Source of Global Warming Potential values',
            'Status of community-wide inventory attachment and/or direct link',
        #    'Sub-sector'
        ]

        df_out = pd.concat([pd.pivot(df_tmp.loc[(df_tmp['Row Number'] == row_number) & (df_tmp['Column Name'].isin(column_names))],
                         index = 'Row Number',
                         columns = 'Column Name',
                         values = 'Response Answer') for row_number in set(df_tmp['Row Number'])])

        df_out.index.name = None

        inventory_year = (
            df_out.loc[~df_out['Inventory year'].isna(),
                       'Inventory year']
            .to_string(index=False)
        )
        population = (
            df_out.loc[~df_out['Population in inventory year'].isna(),
                       'Population in inventory year']
            .to_string(index=False)
        )

        attachment = (
            df_out.loc[~df_out['Community-wide inventory attachment (spreadsheet) and/or link (with unrestricted access)'].isna(),
                       'Community-wide inventory attachment (spreadsheet) and/or link (with unrestricted access)']
            .to_string(index=False)
        )


        methodology = (
            df_out.loc[~df_out['Primary methodology/framework to compile inventory'].isna(),
                       'Primary methodology/framework to compile inventory']
            .to_string(index=False)
        )

        boundary = (
            df_out.loc[~df_out['Boundary of inventory relative to jurisdiction boundary'].isna(),
                       'Boundary of inventory relative to jurisdiction boundary']
            .to_string(index=False)
        )

        inventory_status = (
            df_out.loc[~df_out['Status of community-wide inventory attachment and/or direct link'].isna(),
                       'Status of community-wide inventory attachment and/or direct link']
            .to_string(index=False)
        )

        df_out['subnational'] = subnat
        df_out['country'] = country
        df_out['year'] = inventory_year
        df_out['population'] = population
        df_out['community_inventory_attachment'] = attachment
        df_out['boundary_of_inventory'] = boundary
        df_out['invetory_status'] = inventory_status
        df_out['methodology'] = methodology

        scopes = [
            'Scope 1',
            'Scope 2',
            'Total figure',
            'Scope 1 and 2',
        ]

        sectors = [
            'Agriculture, Forestry and other land use (AFOLU)',
            'Other, please specify: Afforestation and Deforestation',
            'Other, please specify: LULUCF',
            'Other, please specify: Land use, land use change and forestry',
            'Other, please specify: Mudanças do Uso da Terra e Florestas',
        ]

        # only select scopes and sectors
        df_out = df_out.loc[df_out['Scope'].isin(scopes)]
        df_out = df_out.loc[~df_out['Sector'].isin(sectors)]

        # only select these columns
        columns = [
            'country',
            'subnational',
            'Emissions (metric tonnes CO2e)',
            'year',
            'Scope',
            'Sector',
            'population',
            'community_inventory_attachment',
            'boundary_of_inventory',
            'invetory_status',
            'methodology'
        ]

        df_out = df_out[columns]

        # filter out nans in emissions
        filt = ~df_out['Emissions (metric tonnes CO2e)'].isna()
        df_out = df_out.loc[filt]

        # drop records without an inventory year
        # the Series([], )' thing is because I set the year above
        df_out = df_out.loc[~(df_out['year']=='Series([], )')]

        # replace years like 2018/2019 with the last year listed
        filt = df_out['year'].str.contains('/')
        df_out.loc[filt, 'year'] = (df_out.loc[df_out['year'].str.contains('/'), 'year']
                                                                .str
                                                                .extract(r'[0-9]{4}/([0-9]{4})')[0]
                                                                .values
                                                                .tolist()
                                                               )
        concat_list.append(df_out)

    # concat them all together
    df_out = pd.concat(concat_list, ignore_index=True)

    # filter out NaN, "question not application", and <0
    filt = (
        (~df_out['Emissions (metric tonnes CO2e)'].isna()) &
        (df_out['Emissions (metric tonnes CO2e)'] != 'Question not applicable')
    )
    df_filt = df_out.loc[filt]

    # filter out where emissions < 0
    filt = (df_filt['Emissions (metric tonnes CO2e)'].astype(float) > 0)
    df_filt = df_filt.loc[filt]

    # make emissions be float
    df_filt['Emissions (metric tonnes CO2e)'] = df_filt['Emissions (metric tonnes CO2e)'].astype(float)

    # aggregate emissions
    df_agg = df_filt.groupby(by=['subnational', 'year'], as_index=False)['Emissions (metric tonnes CO2e)'].sum()

    # merge in the year from df_filt
    df_agg = pd.merge(df_agg, df_filt[['subnational', 'year']].drop_duplicates(),
         left_on='subnational',
         right_on='subnational',
         how='left')

    df_agg = df_agg.rename(columns={'year_x':'year'})

    # drop records with years such as 2018/2019
    #filt = ~df_agg['year'].str.contains('/')
    #df_agg = df_agg.loc[filt]

    # Now need to find the ISO code for each subnational
    #fl = 'https://raw.githubusercontent.com/datadrivenenvirolab/ClimActor/master/data-raw/key_dict_7Sep2022.csv'
    df_clim = pd.read_csv(fl_climactor).drop_duplicates()
    df_clim = df_clim.loc[df_clim['entity_type'].isin([ 'Region', 'nan'])]

    # name harmonize
    df_agg['subnational_harmonized'] = (
        df_agg['subnational']
        .replace(to_replace = list(df_clim['wrong']),
                 value = list(df_clim['right']))
    )

    # read ISO-3166
    df_sub = pd.read_csv('https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-ISO-3166/main/ISO-3166-2/ActorName.csv')

    # name harmonize ISO-3166
    df_sub['name_harmonized'] = (
        df_sub['name']
        .replace(to_replace = list(df_clim['wrong']),
                 value = list(df_clim['right']))
    )

    # final table
    df_final = pd.merge(df_agg, df_sub, left_on=["subnational_harmonized"], right_on=["name_harmonized"], how="left")

    # remove nan actor ids
    df_final = df_final.loc[~df_final['actor_id'].isna()]

    # rename emissions
    df_final = df_final.rename(columns={'Emissions (metric tonnes CO2e)':'total_emissions'})

    # only pick out emissions and actor id and year
    #df_final = df_final[['total_emissions', 'actor_id', 'year']]

    # add IDs
    df_final['datasource_id'] = datasourceDict['datasource_id']

    df_final['emissions_id'] = df_final.apply(lambda row:
                                  f"CDP_full_states_regions_2022:{row['actor_id']}:{row['year']}",
                                  axis=1)

    # ensure data has correct types
    df_final = df_final.astype(
        {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
        }
    )

    df_final = df_final[['emissions_id', 'actor_id', 'year', 'total_emissions', 'datasource_id']]

    # sort by actor_id and year
    df_final = df_final.sort_values(by=['actor_id', 'year'])

    return df_final


def harmonize_cdp_states_regions_targets(fl=None, fl_climactor=None, datasourceDict=None):
    # load raw data
    df = pd.read_csv(fl)

    # select mitigation target information
    filt = (
        (df['Parent Section'] == 'Targets') & 
        (df['Section'] == '5. Mitigation Targets') &
        (df['Question Name'] == 'Provide details of your emissions reduction target(s).') 
    )
    df = df.loc[filt]

    # -----------------------------------------------------------------
    # Put Mitigation Targets table in useable format
    # -----------------------------------------------------------------
    # list to concatenate to
    concat_list = []
    
    # loop over subnational names
    for subnat in set(df['Organization Name']):

        # find records with subnational
        filt = df['Organization Name'] == subnat
        df_tmp = df.loc[filt]
        
        # the data we want is stored in Response Answer
        df_tmp = df_tmp[['Country', 'Column Name','Row Number', 'Response Answer']]

        # remove any records without a column name
        filt = ~df_tmp['Column Name'].isna()
        df_tmp = df_tmp.loc[filt]

        # save the country name
        (country,) = set(df_tmp['Country'])

        # convert from long to wide
        df_out = pd.concat([pd.pivot(df_tmp.loc[(df_tmp['Row Number'] == row_number)],   
                         index = 'Row Number', 
                         columns = 'Column Name',
                         values = 'Response Answer') for row_number in set(df_tmp['Row Number'])])

        # ignore the index name
        df_out.index.name = None

        # save subnational and country to new dataframe
        df_out['subnational'] = subnat
        df_out['country'] = country

        # concat dataframe to list
        concat_list.append(df_out)

    # concat the dataframes together
    df_out = pd.concat(concat_list, ignore_index=True)

    # replace 'Question not applicable' with NaN
    df_out = df_out.replace('Question not applicable', np.NaN)

    # remove records with no target or base year (129 --> 75)
    filt = ~(df_out['Target year'].isna())
    df_out = df_out.loc[filt]

    # only keep target if its policy / legeslation / decree / ... (75 --> 68)
    filt = ~(df_out['Target status'].isna()) | (df_out['Target status'] == 'Announced')
    df_out = df_out.loc[filt]

    # filter out targets that will use carbon credits to achieve goal (68 --> 61)
    filt = (df_out['Are carbon credits currently used or planned to be used to achieve this target?'] 
            != 'Yes, this target will be achieved using carbon credits but the number of credits required has not been quantified')
    df_out = df_out.loc[filt]

    # filter out nan (61 --> 60)
    filt = ~(df_out['Are carbon credits currently used or planned to be used to achieve this target?'].isna())
    df_out = df_out.loc[filt]

    # filter out targets that are announced or in development (60 --> 48)
    filt = ~df_out['Target status'].isin(['Announced', 'Policies in development'])
    df_out = df_out.loc[filt]

    # rename some of the columns
    df_out = df_out.rename(columns={
        'Base year': 'baseline_year',
        'Target year': 'target_year',
        'Target type': 'target_type',
        'Percentage of emissions reduction (including offsets and carbon dioxide removal)': 'target_value',
        'Net emissions in target year (after offsets and carbon dioxide removal) (metric tonnes CO2e)': 'target_year_emissions',
    })

    # fill 'Fixed-level target' target type with target_year_emissions
    df_out['target_value'] = df_out.target_value.fillna(df_out.target_year_emissions)

    # set target_unit based on target_type
    df_out['target_unit'] = df_out['target_type'].map(
        {'Base year emissions (absolute) target': "percent", 
        'Baseline scenario target': "percent",
        'Fixed-level target': 'tCO2e'}
    )

    # Now need to find the ISO code for each subnational
    df_clim = pd.read_csv(fl_climactor).drop_duplicates()
    df_clim = df_clim.loc[df_clim['entity_type'].isin([ 'Region', 'nan'])]

    # name harmonize
    df_out['subnational_harmonized'] = (
        df_out['subnational']
        .replace(to_replace = list(df_clim['wrong']),
                 value = list(df_clim['right']))
    )

    # read ISO-3166
    df_sub = pd.read_csv('https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-ISO-3166/main/ISO-3166-2/ActorName.csv')

    # name harmonize ISO-3166
    df_sub['name_harmonized'] = (
        df_sub['name']
        .replace(to_replace = list(df_clim['wrong']),
                 value = list(df_clim['right']))
    )

    # merge data with ISO information
    df_final = pd.merge(df_out, df_sub, left_on=["subnational_harmonized"], right_on=["name_harmonized"], how="left")

    # filter out where actor_id
    filt = ~df_final.actor_id.isna()
    df_final = df_final.loc[filt]

    # change target type names
    filt = (df_final['target_type'] == 'Base year emissions (absolute) target')
    df_final.loc[filt, 'target_type'] = 'Absolute emission reduction'

    filt = (df_final['target_type'] == 'Baseline scenario target')
    df_final.loc[filt, 'target_type'] = 'Absolute emission reduction'

    # add IDs
    df_final['datasource_id'] = datasourceDict['datasource_id']

    df_final['target_id'] = df_final.apply(lambda row: 
                                  f"CDP_full_states_regions_2022:{row['actor_id']}:{row['target_year']}", 
                                  axis=1)

    # select only necessary columns
    columns = [
        'target_id', 
        'actor_id', 
        'target_type', 
        'baseline_year', 
        'target_year', 
        'target_value', 
        'target_unit', 
        'datasource_id'
    ]
    
    df_final = df_final[columns]

    # replace NaN in baseline with None
    #df_final['baseline_year'] = df_final['baseline_year'].replace({np.nan: None})
    df_final['baseline_year'] = df_final.baseline_year.fillna(df_final.target_year)

    # change target_value type to float
    df_final['target_value'] = df_final['target_value'].astype(float)

    # ensure data has correct types
    df_final = df_final.astype(
        {
        'target_id': str,
        'actor_id': str,
        'target_type': str,
    #    'baseline_year': int,
        'target_year': int,
        'target_value': int,
        'target_unit': str,
        'datasource_id': str
        }
    )

    # sort by actor_id and year
    df_final = df_final.sort_values(by=['actor_id', 'target_year'])

    return df_final
