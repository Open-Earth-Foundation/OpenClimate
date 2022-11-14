if __name__ == "__main__":
    import rdata
    import pandas as pd
    from utils import name_harmonize_iso
    from utils import read_iso_codes
    import os
    from pathlib import Path
    from utils import make_dir

    # Create directory to store output
    outputDir = "../data/processed/UNLOCODE_to_ClimActor/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # entity_type ClimActor key dictionary
    fl_key_dict = '../resources/key_dict.rda'
    fl_key_dict = os.path.abspath(fl_key_dict)
    parsed = rdata.parser.parse_file(fl_key_dict)
    converted = rdata.conversion.convert(parsed)
    df = converted['key_dict']
    df = df.loc[df.entity_type.isin(['City'])]

    # read UNLOCODE
    fl = 'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-UNLOCODE/main/UNLOCODE/Actor.csv'
    df_unl = pd.read_csv(fl,keep_default_na=False)
    df_unl['iso2'] = [val.split(' ')[0] for val in df_unl['actor_id']]

    # read ISO data
    df_iso_harm = name_harmonize_iso()
    df_iso_tmp = read_iso_codes()
    df_iso = pd.merge(df_iso_harm, df_iso_tmp, 
                       left_on=["actor_id"], 
                       right_on=["iso2"], 
                       how="left")

    # only keep city name and iso values
    df_iso = df_iso.dropna()
    df_iso = df_iso[['name', 'iso2','iso3']]

    # add state column to locode
    df_unl['state'] = df_unl['is_part_of'].str.rsplit("-", n=1, expand=True)[1]

    # merge ISO values into UNLOCODE dataset
    df_merged = pd.merge(df_unl, df_iso, 
                         left_on=['iso2'], 
                         right_on=['iso2'], 
                         how='left')
    df_merged = (
        df_merged[['actor_id', 'name_x', 'iso2', 'iso3', 'state']]
        .rename(columns={'actor_id': 'locode', 'name_x': 'locode_city_name'})
    )

    df_copy = df.copy()
    df_copy['state'] = df_copy['right'].str.rsplit(",", n=1, expand=True)[1]
    df = df_copy

    # merge UNLOCODE onto ClimActor key dictionary
    # match the "wrong" and "iso" in ClimActor with "city_name" and "iso3" in UNLOCODE
    df_out = pd.merge(df, df_merged, 
                      left_on=['iso', 'wrong', 'state'], 
                      right_on=['iso3', 'locode_city_name', 'state'], 
                      how='left')

    # filter nans
    filt = ~(df_out['locode'].isna())
    df_matched_with_state = df_out.loc[filt]

    # merge UNLOCODE onto ClimActor key dictionary
    # match the "wrong" and "iso" in ClimActor with "city_name" and "iso3" in UNLOCODE
    df_out = pd.merge(df.reset_index().loc[~filt], df_merged, 
                      left_on=['iso', 'wrong'], 
                      right_on=['iso3', 'locode_city_name'], 
                      how='left')

    # filter nans
    filt = ~(df_out['locode'].isna())
    df_matched_without_state = df_out.loc[filt]

    fil = (df_matched_without_state['state_x'].isnull()) 
    df_matched_without_state = df_matched_without_state.loc[fil]

    df_output = pd.concat([df_matched_without_state, df_matched_with_state])

    # pick just the wrong names
    df_wrong = df_output.loc[df_output['wrong'] != df_output['right'], ['wrong', 'locode']]

    # add additional columns
    df_wrong['preferred'] = 0
    df_wrong['language'] = 'und'
    df_wrong['datasource_id'] = 'UNLOCODE:2022-1'

    # rename columns
    df_wrong = df_wrong.rename(columns={'wrong':'name', 'locode':'actor_id'})

    # remove nan actor_ids
    df_wrong = df_wrong.loc[~df_wrong['actor_id'].isna()]

    # ensure correct type
    df_out_wrong = df_wrong.astype({
        'name': str,
        'actor_id': str,
        'language': str,
        'preferred': int,
        'datasource_id': str}
    )

    # pick just the wrong names
    df_right = df_output[['right', 'locode']]

    # add additional columns
    df_tmp = df_right.copy()
    df_tmp['preferred'] = 1
    df_tmp['language'] = 'und'
    df_tmp['datasource_id'] = 'UNLOCODE:2022-1'
    df_right = df_tmp

    # rename columns
    df_right = df_right.rename(columns={'right':'name', 'locode':'actor_id'})

    # remove nan actor_ids
    df_right = df_right.loc[~df_right['actor_id'].isna()]

    # ensure correct type
    df_out_right = df_right.astype({
        'name': str,
        'actor_id': str,
        'language': str,
        'preferred': int,
        'datasource_id': str}
    )

    df_out_right = df_out_right.drop_duplicates()
    df_final = pd.concat([df_out_right, df_out_wrong]).drop_duplicates()
    df_final = df_final.sort_values(by='actor_id')


    # save matches
    df_final.to_csv(f'{outputDir}/ActorName.csv', index=False)
