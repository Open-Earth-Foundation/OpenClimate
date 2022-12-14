if __name__ == "__main__":
    import os
    import pandas as pd
    from pathlib import Path
    import re
    from utils import make_dir
    from utils import write_to_csv

    # Create directory to store output
    outputDir = "../data/processed/climate_mayors/"
    outputDir = os.path.abspath(outputDir)
    out_dir = Path(outputDir)

    # create directory if does not exist
    make_dir(path=out_dir.as_posix())

    # path to dataset
    fl = '../data/raw/climate_mayors/ClimateMayors2022_Mar_clean_NCI.csv'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    publisherDict = {
        'id': 'climate_mayors',
        'name': 'Climate Mayors',
        'URL': 'https://climatemayors.org/'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='Publisher',
                 dataDict=publisherDict,
                 mode='w')

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    datasourceDict = {
        'datasource_id': 'climate_mayors:compendium_2020',
        'name': 'Climate Action Compendium',
        'publisher': f"{publisherDict['id']}",
        'published': '2020-12-01',
        'URL': 'https://climatemayors.org/wp-content/uploads/2020/12/Cities_Climate_Action_Compendium_180105-1.pdf'
    }

    write_to_csv(outputDir=outputDir,
                 tableName='DataSource',
                 dataDict=datasourceDict,
                 mode='w')

    # ------------------------------------------
    # Target table
    # ------------------------------------------
    df = pd.read_csv(fl)

    # remove anything without a commitment
    filt = ~df['raw_commitment'].isna()
    df = df.loc[filt]

    # capture city from string with "<city>, <2-letter state code>" or "Washington D.C."
    city_regex = r'([^,]*)[,\s]?[A-Z]?[A-Z]?'
    df['city'] = [re.findall(city_regex, name)[0] for name in df['name']]

    # set(df['ghg_reduction_target_type'])

    searchfor = ['GHG', 'greenhouse gases', 'co2', 'fossil fuels']
    filt = (
        (df['raw_commitment'].str.contains('|'.join(searchfor)))
        &
        (df[['target_year', 'percent_reduction', 'baseline_year']].notnull().all(axis=1))
    )

    df_out = df.loc[filt]
    df_out = df_out.copy()
    df_out['state'] = df_out['state'].replace('NC2', 'NC')
    df_out['iso2'] = df_out.apply(lambda row: f"US-{row['state']}", axis=1)

    # read actor unlocode data
    fl_clim = '/Users/luke/Documents/work/projects/OpenClimate/harmonize/data/processed/UNLOCODE/Actor.csv'
    fl_clim = os.path.abspath(fl_clim)
    df_clim = pd.read_csv(fl_clim)

    df_tmp = df_out[['city', 'iso2']].drop_duplicates()

    data = []
    for name, is_part_of in list(zip(df_tmp['city'], df_tmp['iso2'])):
        filt = (
            (df_clim['name'] == name) &
            (df_clim['is_part_of'] == is_part_of)
        )
        if sum(filt):
            actor_id = df_clim.loc[filt, 'actor_id'].values[0]
        else:
            actor_id = np.NaN
        data.append((name, is_part_of, actor_id))

    # return locode as dataframe
    df_loc = pd.DataFrame(data, columns=['name', 'iso2', 'locode'])

    # merge locode in dataframee
    df_merge = pd.merge(df_out, df_loc,
                        left_on=["city", "iso2"],
                        right_on=["name", "iso2"],
                        how="left")

    renameColumnsDict = {
        'locode': 'actor_id',
        'percent_reduction': 'target_value',
        'raw_commitment': 'summary'
    }
    df_merge = df_merge.rename(columns=renameColumnsDict)

    df_merge['URL'] = 'https://climatemayors.org/wp-content/uploads/2020/12/Cities_Climate_Action_Compendium_180105-1.pdf'
    df_merge['target_unit'] = 'percent'
    df_merge['target_type'] = 'Absolute emission reduction'
    df_merge['is_net_zero'] = 0
    df_merge['target_id'] = df_merge.apply(
        lambda row: f"US_climate_mayors:{row['actor_id']}:{row['target_year']}", axis=1)
    df_merge['datasource_id'] = datasourceDict['datasource_id']

    columns = [
        'target_id',
        'actor_id',
        'target_type',
        'baseline_year',
        'target_year',
        'target_value',
        'target_unit',
        'URL',
        'datasource_id'
    ]

    df_merge = df_merge[columns]

    # ensure type is correct
    df_merge = df_merge.astype({
        "target_id": str,
        "actor_id": str,
        "target_type": str,
        "baseline_year": int,
        "target_year": int,
        "target_value": int,
        'target_unit': str,
        "URL": str,
        "datasource_id": str
    })

    # sort by actor_id and target_year
    df_merge = df_merge.sort_values(by=['actor_id', 'target_year'])

    # save as csv
    df_merge.drop_duplicates().to_csv(f'{outputDir}/Target.csv', index=False)
