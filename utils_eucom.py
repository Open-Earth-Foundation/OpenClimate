import csv
import pandas as pd
import glob
import os

def process_eucom():
    # read UNLOCODE, name includes diacritics
    fl = 'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-UNLOCODE/filter/UNLOCODE/Actor.csv'
    df_unl = pd.read_csv(fl)

    # test if name exists
    #df_unl.loc[df_unl['name']=='Gélida']
    #df_unl.loc[df_unl['name']=='Sønderborg']
    #df_unl.loc[df_unl['name']=='Aroche']
    
    # read EUCoM, some include diacritics
    fl = '/Users/luke/Documents/work/data/EUCoM/raw/EUCovenantofMayors2022_clean_NCI_7Jun22.csv'
    df = pd.read_csv(fl)

    # ==========================================================
    # creates dictionary of LOCODE w/ and w/out diacritics {name_with_out_diacritic : name}
    # can be pulled out and named something like name_dictionary():
    LOCODE_COLUMNS = [
      "Ch",
      "ISO 3166-1",
      "LOCODE",
      "Name",
      "NameWoDiacritics",
      "SubDiv",
      "Function",
      "Status",
      "Date",
      "IATA",
      "Coordinates",
      "Remarks"
    ]

    INPUT_DIR = '/Users/luke/Documents/work/projects/OpenClimate-UNLOCODE/loc221csv'
    all_files = glob.glob(os.path.join(INPUT_DIR, "*CodeListPart*.csv"))

    df_raw = pd.concat((pd.read_csv(f, names=LOCODE_COLUMNS) for f in all_files), ignore_index=True)

    filt = ~df_raw['LOCODE'].isna()
    df_raw = df_raw.loc[filt]
    name_dict = dict(zip(df_raw.NameWoDiacritics, df_raw.Name))
    # ==========================================================
    
    #name.astype(str).map(name_dict)
    df['name_with_diacritic'] = [name_dict[name] if name_dict.get(name) else name for name in df['name']]

    # filter where total emissions NaN
    filt = ~df['total_co2_emissions'].isna()
    df = df.loc[filt]

    columns = [
     'name',
     'name_with_diacritic',
     'country',
     'iso',
     'entity_type',
     'GCoM_ID',
     'url',
     'lat',
     'lng',
     'region',
     'data_source',
     'total_co2_emissions_year',
     'total_co2_emissions']
    df = df[columns]

    df = df.drop_duplicates(
        subset = ['name', 'country',  'total_co2_emissions_year', 'total_co2_emissions'],
        keep = 'first').reset_index(drop = True)

    # first have to merge ISO codes to get 2-letter code
    from utils import read_iso_codes
    df_iso = read_iso_codes()

    # merge datasets (wide, each year is a column)
    df_with_iso = pd.merge(df, df_iso, left_on=["iso"], right_on=["Alpha-3 code"], how="left")

    # use .title() instead
    # not quite what I want, this has cities with spaces too
    #sum(~df_with_iso['name'].str.isalpha()) # 652

    df_unl['Alpha2'] = [val.split('-')[0] for val in df_unl['actor_id']]

    # convert to uppercase
    df_with_iso['name_upper_eu'] = df_with_iso['name_with_diacritic'].str.upper()

    # convert to uppercase
    df_unl['name_upper_unl'] = df_unl['name'].str.upper()

    # merge datasets (wide, each year is a column)
    # use df_unl['Alpha2'] = [val.split('-')[0] for val in df_unl['actor_id']] instaed of is_part_of
    df_wide = pd.merge(df_with_iso, df_unl, 
                       left_on=["name_upper_eu", "Alpha-2 code"], 
                       right_on=['name_upper_unl', "Alpha2"], 
                       how="left")

    # test if name in dataset
    #'LAGOS' in list(df_unl['name_upper_unl'])

    # drop nans
    filt = ~df_wide['actor_id'].isna() # no actor id
    df_wide = df_wide.loc[filt] # 621 cities
    
    # long to short data_source_name
    create_short_datasource_name = {
        'EUCovenantofMayors2022': 'EUCoM', 
        'GCoMEuropeanCommission2021': 'GCoMEC', 
        'GCoMHarmonized2021': 'GCoMH'
    }
    
    create_datasource_id = {
        'EUCovenantofMayors2022': 'EUCoM:2022', 
        'GCoMEuropeanCommission2021': 'GCoMEC:v2', 
        'GCoMHarmonized2021': 'GCoMH:2021'
    }

    create_methodology_id= {
        'EUCovenantofMayors2022': 'EUCoM:methodology', 
        'GCoMEuropeanCommission2021': 'GCoMEC:methodology', 
        'GCoMHarmonized2021': 'GCoMH:methodology'
    }

    # condition one column on another (https://datagy.io/pandas-conditional-column/)
    df_wide['data_source_short'] = df_wide['data_source'].map(create_short_datasource_name)
    df_wide['datasource_id'] = df_wide['data_source'].map(create_datasource_id)
    df_wide['methodology_id'] = df_wide['data_source'].map(create_methodology_id)
    
    return df_wide

def create_emissionsagg_eucom_table():
    df = process_eucom()

    # {'EUCovenantofMayors2022', 'GCoMEuropeanCommission2021', 'GCoMHarmonized2021'}
    #set(df_wide['data_source'])

    #df.columns

    #  "emissions_id" varchar(255), /* Unique identifier for this record */
    #  "actor_id" varchar(255), /* Responsible party for the emissions */
    #  "year" int, /* Year of emissions, YYYY */
    #  "total_emissions" bigint, /* Integer value of tonnes of CO2 equivalent */
    #  "methodology_id" varchar(255), /* Methodology used */
    #  "datasource_id" varchar(255), /* Source for the data */

    df = df.rename(columns={'total_co2_emissions_year':'year'})

    df = df.rename(columns={'total_co2_emissions':'total_emissions'})

    def create_emission_id(row):
        return f"{row['data_source_short']}:{row['GCoM_ID']}:{row['year']}"

    #def create_datasource_id(row, publisher, doi, version):
    #    return f"{publisher}:{doi}:{version}"

    #def create_methodology_id(row, publisher, version):
    #    return f"{publisher}:{version}:methodology"

    df['emissions_id'] = df.apply(lambda row: create_emission_id(row), axis=1)

    #df['datasource_id'] = df.apply(lambda row: create_datasource_id(row,
    #                                                                'EUCoM',
    #                                                                'XXX',
    #                                                                'vX.X'), axis=1)

    #df['methodology_id'] = df.apply(lambda row: create_methodology_id(row,
    #                                                                  'EUCoM',
    #                                                                  'vX.X'), axis=1)


    #df.columns

    # Create EmissionsAgg table
    emissionsAggColumns = ["emissions_id", #
                           "actor_id", #
                           "year", #
                           "total_emissions",
                           "methodology_id", #
                           "datasource_id" #
    ]

    df_emissionsAgg = df[emissionsAggColumns]
    
    # ensure type
    df_emissionsAgg = df_emissionsAgg.astype({'emissions_id': str,
                                             'actor_id': str,
                                             'year': int,
                                             'total_emissions': int,
                                             'methodology_id': str,
                                             'datasource_id': str})

    return df_emissionsAgg

def get_fieldnames(tableName=None):
    """switcher to get field names for each table"""
    
    switcher = {
        "publisher" : (
            "id",
            "name", 
            "URL"
        ),
        "datasource" : (
            "datasource_id",
            "name", 
            "publisher", 
            "published",
            "URL"
        ),
        "methodology": (
            "methodology_id", 
            "name", 
            "methodology_link"
        ),
        "emissionsagg": (
          "emissions_id",
          "actor_id",
          "year",
          "total_emissions",
          "methodology_id",
          "datasource_id"
        ),
        "population": (
          "actor_id",
          "population",
          "year",
          "created"
        ),
        "territory": (
          "actor_id",
          "area",
          "lat",
          "lng",
          "admin_bound",
          "datasource_id"
        ),
        "gdp": (
          "actor_id",
          "gdp",
          "year",
          "datasource_id"
        ),
        "actor": (
            "actor_id",
            "type", 
            "name", 
            "icon", 
            "hq", 
            "is_part_of", 
            "is_owned_by", 
            "datasource_id"
        )   
    }

    return switcher.get(tableName.lower(), f"{tableName} not in {list(switcher.keys())}")


def write_to_csv(filePath=None, 
                 tableName=None, 
                 dataDict=None, 
                 mode=None):
    
    # set default values 
    filePath = '.' if filePath is None else filePath
    tableName = 'Output' if tableName is None else tableName
    dataDict = {} if dataDict is None else dataDict
    mode = 'w' if mode is None else mode
    
    # ensure correct type
    assert isinstance(filePath, str), f"filePath must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(dataDict, dict), f"dataDict must be a dictionary"
    acceptableModes = ['r', 'r+', 'w', 'w+', 'a', 'a+', 'x']
    assert mode in acceptableModes, f"mode {mode} not in {acceptableModes}"
    
    # test that dataDict has all the necessary fields
    fieldnames_in_dict = [key in dataDict for key in get_fieldnames(tableName)]
    assert all(fieldnames_in_dict), f"Key mismatch: {tuple((dataDict.keys()))} != {get_fieldnames(tableName)}"

    # write to file 
    with open(f'{filePath}/{tableName}.csv', mode) as f:
        w = csv.DictWriter(f, fieldnames=get_fieldnames(tableName))
        
        # only write header once
        # https://9to5answer.com/python-csv-writing-headers-only-once
        if f.tell() == 0:
            w.writeheader()
        
        w.writerow(dataDict)
        
        
def df_to_csv(df=None, 
            filePath=None, 
            tableName=None):
    
    # set default values 
    filePath = '.' if filePath is None else filePath
    tableName = 'Output' if tableName is None else tableName
    
    # ensure correct type
    assert isinstance(df, pd.core.frame.DataFrame), f"df must be a DataFrame"
    assert isinstance(filePath, str), f"filePath must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    
    df.to_csv(f'{filePath}/{tableName}.csv', index=False)
    
    
    
def create_all_eucom_tables():
    # EmissionsAgg.csv

    df_emissionsAgg = create_emissionsagg_eucom_table()

    # sort colmns
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    df_to_csv(df=df_emissionsAgg, tableName="EmissionsAgg")


    # Publisher.csv

    list_PublisherDicts = [{
        "id": "EUCoM",
        "name": "European Union Covenant of Mayors" ,
        "URL": "https://www.eumayors.eu/en/"
    },
    {
        "id": "EC-JRC",
        "name": "European Commission, Joint Research Centre",
        "URL":'https://ec.europa.eu/info/departments/joint-research-centre_en',
    }
    ]

    for dataDict in list_PublisherDicts:
        write_to_csv(filePath='.', tableName='Publisher', dataDict=dataDict, mode='a')


    # DataSource.csv

    list_dataSourceDicts = [{
        "datasource_id": 'EUCoM:2022',
        "name":'European Union Covenant of Mayors 2022',
        "publisher":'EUCoM',
        "published": '2022',
        "URL": 'https://www.eumayors.eu/en/'
    },
    {
        "datasource_id":'GCoMEC:v2',
        "name":'Global Covenant of Mayors - MyCovenant, 2021, Second release',
        "publisher":'EC-JRC',
        "published":'2021',
        "URL":'https://data.jrc.ec.europa.eu/dataset/9cefa6ca-1391-4bcb-a9c8-46e029cf99bb',
    },
    {
        "datasource_id":'GCoMH:2021',
        "name": 'A dataset of GHG emissions for 6,200 cities in Europe and the Southern Mediterranean countries',
        "publisher":'EC-JRC',
        "published": '2021',
        "URL": 'https://data.jrc.ec.europa.eu/dataset/57a615eb-cfbc-435a-a8c5-553bd40f76c9'
    }
    ]

    for dataDict in list_dataSourceDicts:
        write_to_csv(filePath='.', tableName='DataSource', dataDict=dataDict, mode='a')


    # Methodology.csv

    list_MethodologyDicts = [{
        "methodology_id": "EUCoM:methodology",
        "name": "Common Reporting Framework",
        "methodology_link": "https://www.globalcovenantofmayors.org/wp-content/uploads/2019/04/FINAL_Data-TWG_Reporting-Framework_website_FINAL-13-Sept-2018_for-translation.pdf"
    },
    {
        "methodology_id": "GCoMEC:methodology",
        "name": "Common Reporting Framework with additional checks by publishers",
        "methodology_link": "https://data.jrc.ec.europa.eu/dataset/9cefa6ca-1391-4bcb-a9c8-46e029cf99bb"
    },
    {
        "methodology_id": "GCoMH:methodology",
        "name":"Common Reporting Framework with additional checks by publishers",
        "methodology_link": "https://essd.copernicus.org/articles/13/3551/2021/"
    }
    ]

    for dataDict in list_MethodologyDicts:
        write_to_csv(filePath='.', tableName='Methodology', dataDict=dataDict, mode='a')