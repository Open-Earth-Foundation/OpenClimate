import csv
#from difflib import SequenceMatcher
import json
import pandas as pd
from pathlib import Path
import pathlib
import re
import xlrd
import glob
import os

def make_dir(path=None):
    """Create a new directory at this given path. 

    path = None
    """
    assert isinstance(path, str), (
        f"Path must be a string; you passed a {type(path)}"
    )
    
    # parents = True creates missing parent paths
    # exist_ok = True igores FileExistsError exceptions
    # these settings mimick the POSIX mkdir -p command
    Path(path).mkdir(parents=True, exist_ok=True)
    
def read_json(fl):
    
    assert isinstance(fl, str), (
        f"fl must be a string; you passed a {type(fl)}"
    )
    
    # Opening JSON file
    with open(fl) as json_file:
        data = json.load(json_file)
        return data

def get_fieldnames(tableName=None, schema_json=None):
    """switcher to get field names for each table
    
    schema_json is a json file containing the openClimate schema
        {table_name : list_of_table_columns}
    """
    
    if schema_json is None:
        schema_json = '/Users/luke/Documents/jupyterlab/OpenClimate/openClimate_schema.json'
    
    assert isinstance(schema_json, str), (
        f"schema_json must be a string; not a {type(schema_json)}"
    )
    
    # switcher stuff needs to be a JSON
    switcher = read_json(fl='/Users/luke/Documents/jupyterlab/OpenClimate/openClimate_schema.json')
    return switcher.get(tableName.lower(), f"{tableName} not in {list(switcher.keys())}")


def write_to_csv(outputDir=None, 
                 tableName=None, 
                 dataDict=None, 
                 mode=None):
    
    # set default values 
    outputDir = '.' if outputDir is None else outputDir
    tableName = 'Output' if tableName is None else tableName
    dataDict = {} if dataDict is None else dataDict
    mode = 'w' if mode is None else mode
        
    # ensure correct type
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(dataDict, dict), f"dataDict must be a dictionary"
    acceptableModes = ['r', 'r+', 'w', 'w+', 'a', 'a+', 'x']
    assert mode in acceptableModes, f"mode {mode} not in {acceptableModes}"
    
    # test that dataDict has all the necessary fields
    fieldnames_in_dict = [key in get_fieldnames(tableName) for key in dataDict]
    assert all(fieldnames_in_dict), f"Key mismatch: {tuple((dataDict.keys()))} != {get_fieldnames(tableName)}"
    
    # remove a trailing "/" in the path
    out_dir = Path(outputDir).as_posix()

    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    # write to file 
    with open(f'{out_dir}/{tableName}.csv', mode) as f:
        w = csv.DictWriter(f, fieldnames=get_fieldnames(tableName))
        
        # only write header once
        # this helped (https://9to5answer.com/python-csv-writing-headers-only-once)
        if f.tell() == 0:
            w.writeheader()
        
        w.writerow(dataDict)
        
        
def df_to_csv(df=None, 
              outputDir=None, 
              tableName=None):
    
    # set default values 
    outputDir = '.' if outputDir is None else outputDir
    tableName = 'Output' if tableName is None else tableName
    
    # ensure correct type
    assert isinstance(df, pd.core.frame.DataFrame), f"df must be a DataFrame"
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    
    # remove a trailing "/" in the path
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    df.to_csv(f'{out_dir}/{tableName}.csv', index=False)

def df_wide_to_long(df=None, 
                    value_name=None, 
                    var_name=None):
    
    # set default values (new column names)
    var_name = "year" if var_name is None else var_name          # new column name with {value_vars}
    value_name = "values" if value_name is None else value_name  # new column name with values
    
    # ensure correct type
    assert isinstance(df, pd.core.frame.DataFrame), f"df must be a DataFrame"
    assert isinstance(var_name, str), f"var_name must a be string"
    assert isinstance(value_name, str), f"value_name must be a string"
    
    # ensure column names are strings
    df.columns = df.columns.astype(str)
    
    # columns to use as identifiers (columns that are not number)
    id_vars = [val for val in list(df.columns) if not val.isdigit()]

    # columns to unpivot (columns that are numbers)
    value_vars = [val for val in list(df.columns) if val.isdigit()]

    # Unpivot (melt) a DataFrame from wide to long format
    df_long = df.melt(id_vars = id_vars, 
                            value_vars = value_vars,
                            var_name = var_name, 
                            value_name = value_name)
    
    # convert var_name column to int
    df_long[var_name] = df_long[var_name].astype(int)
    
    return df_long

def find_regex_in_csv(fl=None, 
                      regex=None):
    """
    example:
    find_regex_in_csv(regex='Swaziland')
    """
    if fl is None:
        fl = '/Users/luke/Documents/work/data/ClimActor/country_dict_August2020.csv'

    # ensure correct type
    assert isinstance(fl, str), f"fl must a be string"
    assert isinstance(regex, str), f"regex must be a string"

    # return first first element with name
    with open(fl, "r") as file:
        reader = csv.reader(file)
        for line in reader:
            if re.search(regex, ','.join(line)):
                matched_line = line
                return line
                break
                

# TODO: separate these into conversion file

def gigagram_to_metric_ton(val):
    ''' 1 gigagram = 1000 tonnes  '''
    return val * 1000


# TODO: separate the functions below into a separate file specifically for data readers

def read_iso_codes(fl=None):
    ''' read iso codes
    this reads iso codes from web into dataframe
    with columns ['country', 'country_french', 'iso2', 'iso3']

    input
    -----
    fl: path to file

    output
    ------
    df: dataframe with iso codes

    source:
    -----
    https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-ISO-3166/main/ISO-3166-1.csv
    '''

    # TODO provide name harmonized name
    
    if fl is None:
        fl = 'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-ISO-3166/main/ISO-3166-1.csv'

    # keep_deault_na=False is required so the Alpha-2 code "NA"
    # is parsed as a string and not converted to NaN
    df = pd.read_csv(fl, keep_default_na=False)

    # rename columns
    df = df.rename(columns={'English short name':'country', 
                        'French short name':'country_french',
                        'Alpha-2 code':'iso2',
                        'Alpha-3 code': 'iso3'})

    # only keep needed columns
    df = df[['country', 'country_french', 'iso2', 'iso3']]

    return df


def get_climactor_country(fl=None):
    # open climactor
    #fl = 'https://raw.githubusercontent.com/datadrivenenvirolab/ClimActor/master/data-raw/country_dict_August2020.csv'
    
    if fl is None:
        fl = '/Users/luke/Documents/work/data/ClimActor/country_dict_updated.csv'
        
    df = pd.read_csv(fl)
    df['right'] = df['right'].str.strip()
    df['wrong'] = df['wrong'].str.strip()
    return df



def check_all_names_match(df=None, column=None):
    
    # default value
    column = 'country' if column is None else column
    
    # get climActor names
    df_climactor = get_climactor_country()

    # sanity check
    filt = df[column].isin(list(df_climactor['right']))
    assert len(df.loc[filt]) == len(df)
    
    
def read_goc_facilities():
    fl = '/Users/luke/Documents/work/data/GoC_large_facilities/raw/Greenhouse_gas_emissions_from_large_facilities.csv'
    df = pd.read_csv(fl, encoding='latin-1')
    return df


def read_subdivisions():
    fl = "https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-UNLOCODE/main/loc221csv/2022-1%20SubdivisionCodes.csv"
    colnames=['country', 'subdivision', 'name', 'type']
    df = pd.read_csv(fl, names=colnames)
    return df


def df_columns(df):
    return list(df.columns)


def unlocode_name_dict():    
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

    # TODO change this to use pathlib.Path
    
    INPUT_DIR = '/Users/luke/Documents/work/projects/OpenClimate-UNLOCODE/loc221csv'
    all_files = glob.glob(os.path.join(INPUT_DIR, "*CodeListPart*.csv"))

    df_raw = pd.concat((pd.read_csv(f, names=LOCODE_COLUMNS) for f in all_files), ignore_index=True)
    filt = ~df_raw['LOCODE'].isna()
    df_raw = df_raw.loc[filt]
    name_dict = dict(zip(df_raw.NameWoDiacritics, df_raw.Name))
    
    return name_dict

    
def name_harmonize_iso():
    # name harmonize
    from utils import read_iso_codes
    #df_iso = read_iso_codes()
    # keep_default_na=False ensure ISO code NA is parsed
    df_iso = pd.read_csv('/Users/luke/Documents/work/projects/OpenClimate-ISO-3166/ISO-3166-1/Actor.csv',
                         keep_default_na=False)

    df_climactor = get_climactor_country()

    #len(df_iso)

    #column = 'name'
    #filt = df_iso[column].isin(list(df_climactor['right']))
    #len(df_iso.loc[filt])

    #set(df_iso['name']) - set(df_iso.loc[filt, 'name'])

    # name harmonize country column
    df_iso['name'] = df_iso['name'].replace(to_replace = list(df_climactor['wrong']), 
                                            value = list(df_climactor['right']))

    #column = 'name'
    #filt = df_iso[column].isin(list(df_climactor['right']))
    #len(df_iso.loc[filt])

    #set(df_iso['name']) - set(df_iso.loc[filt, 'name'])
    
    return df_iso




def read_primap(fl=None):
    ''' read primap from web

    this reads the PRIMAP data from the zenoodo server.

    input
    ------
    fl: path to file

    output
    ------
    pandas dataframe

    source:
    -------
    https://zenodo.org/record/5494497

    Datasets on zenodo server
    - https://zenodo.org/record/5494497/files/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_20-Sep_2021.csv
    - https://zenodo.org/record/5494497/files/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_no_extrap_20-Sep_2021.csv
    - https://zenodo.org/record/5494497/files/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_no_extrap_no_rounding_20-Sep_2021.csv
    - https://zenodo.org/record/5494497/files/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_no_rounding_20-Sep_2021.csv
    - https://zenodo.org/record/5494497/files/PRIMAP-hist_v2.3.1_data-description.pdf
    - https://zenodo.org/record/5494497/files/PRIMAP-hist_v2.3.1_updated_figures.pdf

    '''
    # set default path
    if fl is None:
        fl = "https://zenodo.org/record/5494497/files/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_no_extrap_20-Sep_2021.csv"

    # read as pandas dataframe
    df = pd.read_csv(fl)

    return df

# formerly filter primap
def subset_primap(df=None, entity=None, category=None, scenario=None):
    '''filter primap dataset

    input
    -----
    df: primap dataframe
    entity: Gas categories using global warming potentials (GWP)
            from either Second Assessment Report (SAR) or Fourth Assessment Report (AR4).
            (see table in notes) [default: CO2]
    category: IPCC (Intergovernmental Panel on Climate Change) 2006 categories for emissions.
            (see table in notes) [default: M.0.EL]
    scenario: HISTCR or HISTTP [default: HISTCR]
        - HISTCR: In this scenario country-reported data (CRF, BUR, UNFCCC)
                  is prioritized over third-party data (CDIAC, FAO, Andrew, EDGAR, BP).
        - HISTTP: In this scenario third-party data (CDIAC, FAO, Andrew, EDGAR, BP)
                  is prioritized over country-reported data (CRF, BUR, UNFCCC)

    output
    ------
    filtered dataframe

    notes:
    -----

    -----------------------------------------------------------------------
    Entity_code            Description
    -----------------      ------------------------------------------------
    CH4                    Methane
    CO2                    Carbon Dioxide
    N2O                    Nitrous Oxide
    HFCS (SARGWP100)       Hydrofluorocarbons (SAR)
    HFCS (AR4GWP100)       Hydrofluorocarbons (AR4)
    PFCS SARGWP100         Perfluorocarbons (SAR)
    PFCS (AR4GWP100)       Perfluorocarbons (AR4)
    SF6                    Sulfur Hexafluoride
    NF3                    Nitrogen Trifluoride
    FGASES SARGWP100       Fluorinated Gases (SAR): HFCs, PFCs, SF$_6$, NF$_3$
    FGASES (AR4GWP100)     Fluorinated Gases (AR4): HFCs, PFCs, SF$_6$, NF$_3$
    KYOTOGHG SARGWP100     Kyoto greenhouse gases (SAR)
    KYOTOGHG (AR4GWP100)   Kyoto greenhouse gases (AR4)


    -----------------------------------------------------------------------
    Category_code Description
    ---------     -----------------------------------------------------------
    M.0.EL        National Total excluding LULUCF
    1             Energy
    1.A           Fuel Combustion Activities
    1.B           Fugitive Emissions from Fuels
    1.B.1         Solid Fuels
    1.B.2         Oil and Natural Gas
    1.B.3         Other Emissions from Energy Production
    1.C           Carbon Dioxide Transport and Storage
                  (currently no data available)
    2             Industrial Processes and Product Use (IPPU)
    2.  A         Mineral Industry
    2.B           Chemical Industry
    2.C           Metal Industry
    2.D           Non-Energy Products from Fuels and Solvent Use
    2.E           Electronics Industry
                  (no data available as the category is only used for
                  fluorinated gases which are only resolved at the level
                  of category IPC2)
    2 F           Product uses as Substitutes for Ozone Depleting Substances
                  (no data available as the category is only used for
                  fluorinated gases which are only resolved at the level
                  of category IPC2)
    2.G           Other Product Manufacture and Use
    2.H           Other
    M.AG          Agriculture, sum of IPC3A and IPCMAGELV
    3.A           Livestock
    M.AG.ELV      Agriculture excluding Livestock
    4             Waste
    5             Other
    -----------------------------------------------------------------------


    ----------------------------------------------------------------------
    code       Region_Description
    ---------  -----------------------------------------------------------
    EARTH      Aggregated emissions for all countries.
    ANNEXI     Annex I Parties to the Convention
    NONANNEXI  Non-Annex I Parties to the Convention
    AOSIS      Alliance of Small Island States
    BASIC      BASIC countries (Brazil, South Africa, India and China)
    EU27BX     European Union post Brexit
    LDC        Least Developed Countries
    UMBRELLA   Umbrella Group
    '''

    # set default values
    entity = 'CO2' if entity is None else entity
    category = 'M.0.EL' if category is None else category
    scenario = 'HISTCR' if scenario is None else scenario

    # filtering criteria
    filt = (
        (df['entity'] == entity) &
        (df['category (IPCC2006_PRIMAP)'] == category) &
        (df['scenario (PRIMAP-hist)'] == scenario)
    )

    # filtered dataset
    return df.loc[filt]


def filter_primap(df=None, identifier=None, emissions=None):

    identifier = 'identifier' if identifier is None else identifier
    emissions = 'emissions' if emissions is None else emissions
    
    # drop PRIMAP specific ISO codes and ANT
    # ANT = The Netherlands Antilles
    # which dissolved on October 10, 2010
    isoCodesToDrop = [
        'EARTH',
        'ANNEXI',
        'NONANNEXI',
        'AOSIS',
        'BASIC',
        'EU27BX',
        'LDC',
        'UMBRELLA',
        'ANT',  
    ]

    # filtered dataset
    filt = ~ df[identifier].isin(isoCodesToDrop)
    df = df.loc[filt]

    # filter where total emissions NaN
    filt = ~df[emissions].isna()
    df = df.loc[filt]
    return df


def remove_country_groups(df, column=None):
    """This needs to happen after you remove whitespace from names"""

    # set column name
    column = 'country' if column is None else column

    country_groups = [
        'ASEAN-5',
        'Australia and New Zealand',
        'Advanced economies',
        'Africa (Region)',
        'Asia and Pacific',
        'Caribbean',
        'Central America',
        'Central Asia and the Caucasus',
        'East Asia',
        'Eastern Europe',
        'Emerging and Developing Asia',
        'Emerging and Developing Europe',
        'Emerging market and developing economies',
        'Euro area',
        'Europe',
        'European Union',
        'Latin America and the Caribbean',
        'Major advanced economies (G7)',
        'Middle East (Region)',
        'Middle East and Central Asia',
        'North Africa',
        'North America',
        'Other advanced economies',
        'Pacific Islands',
        'South America',
        'South Asia',
        'Southeast Asia',
        'Sub-Saharan Africa',
        'Sub-Saharan Africa (Region)',
        'West Bank and Gaza',
        'Western Europe',
        'Western Hemisphere (Region)',
        'World',
    ]

    # remove country_groups
    filt = ~df[column].isin(country_groups) 
    df = df.loc[filt]
    return df

    
# TODO: separate into primap specific file (?)
def harmonize_primap_emissions(fl=None,
                               outputDir=None, 
                               tableName=None,
                               datasourceDict=None,
                               entity=None, 
                               category=None, 
                               scenario=None):
    '''harmonize primap dataset

    haramonize primap to conform to open cliamte schema

    input
    ------
    outputDir: directory where table will be created
    tableName: name of the table to create
    datasourceDict: dictionary with datasource info

    output
    -------
    df: final dataframe with emissions info
    '''
    
    # set default values
    entity = 'KYOTOGHG (AR4GWP100)' if entity is None else entity
    category = 'M.0.EL' if category is None else category
    scenario = 'HISTCR' if scenario is None else scenario

    # set default path
    if fl is None:
        fl = "https://zenodo.org/record/5494497/files/Guetschow-et-al-2021-PRIMAP-hist_v2.3.1_no_extrap_20-Sep_2021.csv"

    # ensure input types are correct
    assert isinstance(fl, str), f"fl must be a string"
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(datasourceDict, dict), f"datasourceDict must be a dictionary"
    
    # TODO add section to ensure datasourceDict have correct keys
    
    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    # read iso
    df_iso = read_iso_codes()
    
    # read subset of primap
    df_pri_tmp = read_primap(fl=fl)
    df_pri = subset_primap(df_pri_tmp, entity=entity, category=category, scenario=scenario)

    # merge datasets
    df_merged = pd.merge(df_pri, df_iso, 
                         left_on=['area (ISO3)'], 
                         right_on=["iso3"], 
                         how="left")
    
    # convert from wide to long dataframe
    df_long = df_wide_to_long(df=df_merged,
                              value_name="emissions",
                              var_name="year")

    # filter un-necessary ISO codes and where emissions ana (removes 251 records)
    df = filter_primap(df=df_long, identifier="iso3", emissions="emissions")
    
    # rename columns
    df = df.rename(columns={'iso2': 'actor_id'})

    # filter out ISO3 code ANT (netherland antilles)
    filt = ~(df['area (ISO3)'] == 'ANT')
    df = df.loc[filt]

    def gigagram_to_metric_ton(val):
        ''' 1 gigagram = 1000 tonnes  '''
        return val * 1000
    
    # create id columns
    df['datasource_id'] = datasourceDict['datasource_id']
    df['emissions_id'] = df.apply(lambda row: 
                                  f"{row['source']}:{row['actor_id']}:{row['year']}", 
                                  axis=1)

    # convert emissions to metric tons
    df['total_emissions'] = df['emissions'].apply(gigagram_to_metric_ton)

    # Create EmissionsAgg table
    emissionsAggColumns = ["emissions_id",
                           "actor_id",
                           "year",
                           "total_emissions",
                           "datasource_id"]

    df_emissionsAgg = df[emissionsAggColumns]

    # ensure columns have correct types
    df_emissionsAgg = df_emissionsAgg.astype({'emissions_id': str,
                                              'actor_id': str,
                                              'year': int,
                                              'total_emissions': int,
                                              'datasource_id': str})

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_emissionsAgg.to_csv(f'{out_dir}/{tableName}.csv', index=False)

    return df


def harmonize_imf_gdp(outputDir=None, 
                      tableName=None,
                      datasourceDict=None):
    
    # ensure input types are correct
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(datasourceDict, dict), f"datasourceDict must be a dictionary"
    
    # TODO add section to ensure methodologyDict and datasourceDict have correct keys
    
    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    # read dataset
    workbook = xlrd.open_workbook_xls('/Users/luke/Documents/work/data/GDP/country/imf-dm-export-20221017.xls', 
                                      ignore_workbook_corruption=True)  
    df_gdp_tmp = pd.read_excel(workbook)

    # open climactor and isocode dataset 
    df_climactor = get_climactor_country()
    df_iso = name_harmonize_iso()

    # rename column
    df_gdp_tmp = df_gdp_tmp.rename(columns={"GDP, current prices (Billions of U.S. dollars)":"country"})

    # filter out NaN country names and IMF lines
    filt = (
        ~(df_gdp_tmp['country'].isna()) &
        ~(df_gdp_tmp['country'] == '©IMF, 2022')
    )

    df_gdp_tmp = df_gdp_tmp.loc[filt]

    # avoids a SettingWithCopyWarning
    df_tmp = df_gdp_tmp.copy()

    # remove trailing white space
    df_tmp['country'] = df_tmp['country'].str.strip()
    df_out = df_tmp.copy()
    df_out = remove_country_groups(df_out, column='country')

    # name harmonize country column
    df_out['country_harmonized'] = (
        df_out['country']
        .replace(to_replace = list(df_climactor['wrong']),
                 value = list(df_climactor['right']))
    )

    # sanity check that names match
    check_all_names_match(df_out, 'country_harmonized')

    # unpivot the dataset wide to long
    df_long = df_wide_to_long(df=df_out, value_name='GDP')

    # remove any records with no GDP data
    filt = ~(df_long['GDP'] == 'no data')
    df_long = df_long.loc[filt]

    # convert to float
    df_long['GDP'] = df_long['GDP'].astype(float)

    # convert GDP to USD instead of billion USD
    df_long['GDP'] = df_long['GDP'] * 10**9

    # filter years
    filt = (df_long['year'] <= 2021)
    df_long = df_long.loc[filt]

    # change type
    df_long['GDP'] = df_long['GDP'].astype(int)

    # merge ISO codes into dataframe to get actor_id
    df_out = pd.merge(df_long, df_iso, left_on=["country_harmonized"], right_on=["name"], how="left")

    # filter out Kosovo (not in our emission or pledge databases)
    filt = (df_out['country_harmonized'] != 'Kosovo')
    df_out = df_out.loc[filt]

    # rename GDP to lowercase 
    df_out = df_out.rename(columns={'GDP':'gdp'})

    # set datasource ID
    df_out['datasource_id'] = datasourceDict['datasource_id']

    # create final dataframe
    columns = ['actor_id', 'gdp', 'year', 'datasource_id']
    df_out = df_out[columns]

    # ensure types are correct
    df_out = df_out.astype({
        'actor_id': str,
        'gdp': int,
        'year': int,
        'datasource_id': str
    })

    # sort dataframe and save
    df_out = df_out.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_out.to_csv(f'{out_dir}/{tableName}.csv', index=False)
    
    return df_out


def create_eccc_ghgrp_actor_tables(DataSourceDict=None, 
                                 PublisherDict=None):
    # get iso codes
    df_iso = read_iso_codes()

    # get canadian provinces
    df_subdiv = read_subdivisions()
    filt = df_subdiv['country'] == 'CA'
    df_provinces = df_subdiv.loc[filt]

    # read facility GHGs
    df = read_goc_facilities()

    # create companies dataframe
    columns = [
        'Facility ID',
        'Facility name',
        'Company name',
        'City',
        'Province',
        'Latitude',
        'Longitude',
    ]

    # only get company information
    df_companies = df[columns]

    # drop duplicates
    df_companies = df_companies.drop_duplicates()

    # merge on province names
    df_out = pd.merge(df_companies, df_provinces, left_on=["Province"], right_on=["name"], how="left")

    # drop uneeded columns
    df_out = df_out.drop(columns=['name'])

    # sanity check, make sure all match
    assert ~sum(df_out['subdivision'].isna())

    # add type, datasource_id, actor_id, and is_part_of
    df_out["namespace"] = 'ECCC GHGRP'
    df_out['type'] = "site"

    df_out['datasource_id'] = DataSourceDict['datasource_id']

    df_out['actor_id'] = df_out.apply(lambda row: 
                                      f"{PublisherDict['id']}:GHGRP:{row['Facility ID']}", 
                                      axis=1)

    df_out['is_part_of'] = df_out.apply(lambda row: 
                                      f"{row['country']}-{row['subdivision']}", 
                                      axis=1)

    df_out['identifier'] = df_out.apply(lambda row: 
                                      f"ECCC_GHGRP{row['Facility ID']}", 
                                      axis=1)

    # rename columns
    df_out = df_out.rename(columns={'Facility name':'name', 'Company name':'is_owned_by'})

    # create Actor table
    columns = [
        'actor_id', 
        'type', 
        'name', 
        'is_part_of', 
        'is_owned_by', 
        'datasource_id'
    ]

    df_actor = df_out[columns]

    # ensure types are correct
    df_actor = df_actor.astype({
        'actor_id': str,
        'type': str,
        'name': str,
        'is_part_of': str,
        'is_owned_by': str,
        'datasource_id':str,
    })
    

    columns = [
        "actor_id",
        "identifier",
        "namespace",
        "datasource_id"
    ]
    
    df_actorIdentifier = df_out[columns]

    # ensure types are correct
    df_actorIdentifier = df_actorIdentifier.astype({
        'actor_id': str,
        'identifier': str,
        'namespace': str,
        'datasource_id':str,
    })

    df_out['language'] = 'und'
    df_out['preferred'] = 0

    columns = [
        "actor_id",
        "name",
        "language",
        "preferred",
        "datasource_id"
    ]

    df_actorName = df_out[columns]


    # ensure types are correct
    df_actorName = df_actorName.astype({
        'actor_id': str,
        'name': str,
        'language': str,
        "preferred": bool,
        'datasource_id':str,
    })
    
    
    df_out = df_out.rename(columns={'Latitude':'lat', 'Longitude':'lng'})
    df_out['lat'] = df_out['lat'] * 10000
    df_out['lng'] = df_out['lng'] * 10000

    columns = [
        "actor_id",
        "lat",
        "lng",
        "datasource_id"
    ]

    # how should we handle pipelines? 
    # lat/lng are 0 for these fornow

    df_territory = df_out[columns]

    # ensure types are correct
    df_territory = df_territory.astype({
        'actor_id': str,
        'lat': int,
        'lng': int,
        'datasource_id':str,
    })
    

    dict_out=  {'Actor': df_actor,
           'ActorIdentifier': df_actorIdentifier, 
           'ActorName': df_actorName,
           'Territory': df_territory}
    return dict_out


def create_eccc_ghgrp_facilities_emissions_table(DataSourceDict=None, 
                                                 MethodologyDict=None):
    # get canadian provinces
    df_subdiv = read_subdivisions()
    filt = df_subdiv['country'] == 'CA'
    df_provinces = df_subdiv.loc[filt]

    # read facility GHGs
    df = read_goc_facilities()


    # merge on province names
    df_out = pd.merge(df, df_provinces, left_on=["Province"], right_on=["name"], how="left")

    # drop uneeded columns
    df_out = df_out.drop(columns=['name'])

    # sanity check, make sure all match
    assert ~sum(df_out['subdivision'].isna())

    # some facilities emissions reported as "3 234.123", whats with the white space?
    filt = ~(df_out['Total emissions'].str.contains(' '))
    df_out = df_out.loc[filt]

    # merge on Actor table to get actor_id
    fl = '/Users/luke/Documents/jupyterlab/OpenClimate/Actor_ECCC-GHGRP_facilities/Actor.csv'
    df_actor = pd.read_csv(fl)


    # merge on province names
    df_out = pd.merge(df_out, df_actor, 
                      left_on=["Facility name", "Company name"], 
                      right_on=["name", "is_owned_by"], how="left")


    # ensure they all match
    assert (~sum(df_out['actor_id'].isna()))

    # get datasource_id from dataSource table
    df_out['datasource_id'] = DataSourceDict['datasource_id']

    df_out['methodology_id'] = MethodologyDict['methodology_id']

    df_out['emissions_id'] = df_out.apply(lambda row: 
                                      f"ECCC:GHGRP:{row['Facility ID']}:{row['Report year']}", 
                                      axis=1)

    df_out = df_out.rename(columns={'Report year':'year', 'Total emissions': 'total_emissions'})


    # make units are kilotonnes
    assert all(list(df_out['Units'] == 'kilotonnes of carbon dioxide equivalents (kt CO2 eq)'))

    df_out['total_emissions'] = df_out['total_emissions'].astype('float')

    # convert from kilotonnes to tonnes
    df_out['total_emissions'] = df_out['total_emissions'] * 1000


    columns = [
        'emissions_id',
        'actor_id',
        'year',
        'total_emissions',
        'methodology_id',
        'datasource_id',
    ]

    # only get company information
    df_emissions = df_out[columns]

    df_emissions = df_emissions.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'methodology_id': str,
        'datasource_id': str
    })
    
    return df_emissions
    

    
def create_eccc_nir_emissionsAgg(DataSourceDict=None, 
                                           PublisherDict=None):
    fl = '/Users/luke/Documents/work/data/Can_provinces/ghg-emissions-regional-en.csv'

    df = pd.read_csv(fl, header=2, names=['province', '1990', '2005', '2020']) # MegaTonnes

    changeDict = {
        'Newfoundland and Labrador (NL)': 'CA-NL',
        'Prince Edward Island (PE)': 'CA-PE',
        'Nova Scotia (NS)': 'CA-NS',
        'New Brunswick (NB)': 'CA-NB',
        'Quebec (QC)': 'CA-QC',
        'Ontario (ON)': 'CA-ON',
        'Manitoba (MB)': 'CA-MB',
        'Saskatchewan (SK)': 'CA-SK',
        'Alberta (AB)': 'CA-AB',
        'British Columbia (BC)': 'CA-BC',
        'Yukon (YT)': 'CA-YT',
        'Northwest Territories (NT)': 'CA-NT',
        'Nunavut (NU)[A]': 'CA-NU',
    }

    df['province'] = df['province'].replace(changeDict)
    df = df.rename(columns={'province':'actor_id'})

    df = df[0:13]

    # before 1999, CA-NU was part of CA-NT
    df.loc[df['actor_id'] == 'CA-NT', '1990'] = 1.8

    from utils import df_wide_to_long

    df_out = df_wide_to_long(df=df, value_name='total_emissions')

    df_out = df_out.dropna()

    # convert to tonnes from megatones
    df_out['total_emissions'] = (df_out['total_emissions'].astype(float) * 10**6).astype(int)

    # get datasource_id from dataSource table
    df_out['datasource_id'] = DataSourceDict['datasource_id']

    df_out['methodology_id'] = MethodologyDict['methodology_id']

    df_out['emissions_id'] = df_out.apply(lambda row: 
                                      f"ECCC_NIR_2022:{row['actor_id']}:{row['year']}", 
                                      axis=1)
    
    cols = [
        "emissions_id",
        "actor_id",
        "year",
        "total_emissions",
        "methodology_id",
        "datasource_id"
    ]
    df_out = df_out[cols]
    
    df_out = df_out.astype({
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'methodology_id': str,
        'datasource_id': str
    })
        
    return df_out


def harmonize_unfccc_emissions(fl=None,
                               outputDir=None, 
                               tableName=None,
                               datasourceDict=None):
    '''harmonize UNFCCC dataset

    haramonize UNFCCC to conform to open climate schema

    input
    ------
    fl: file path to raw data
    outputDir: directory where table will be created
    tableName: name of the table to create
    datasourceDict: dictionary with datasource info

    output
    -------
    df: final dataframe with emissions info
    '''
    # TODO: pull out all the nested functions and refactor the code
    
    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    # read iso
    df_iso = read_iso_codes()
    
    # path to raw UNFCCC dataset
    if fl is None:
        fl = ('/Users/luke/Documents/work/data/UNFCCC/raw/'
              'Time Series - GHG total without LULUCF, in kt CO₂ equivalent.xlsx')
    # ensure input types are correct
    assert isinstance(fl, str), f"fl must be a string"
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(datasourceDict, dict), f"datasourceDict must be a dictionary"
    
    # read excel file into pandas
    df = pd.read_excel(fl, skiprows=2, na_values=True)
    df_tmp = df.copy()
    first_row_with_all_NaN = df[df.isnull().all(axis=1) == True].index.tolist()[0]
    df = df.loc[0:first_row_with_all_NaN-1]

    # alternative names for countries in UNFCCC
    alt_names = {
        'United States of America (the)': ['United States of America'],
        'Russian Federation (the)': ['Russian Federation'],
        'United Kingdom of Great Britain and Northern Ireland (the)': ['United Kingdom of Great Britain and Northern Ireland'],
        'Netherlands (the)': ['Netherlands'],
        }

    # replace alt_names with names in ISO-3166
    for correctName in alt_names.keys():
        filt = df['Party'].isin(alt_names[correctName])
        df.loc[filt, 'Party'] = correctName

    # merge datasets (wide, each year is a column)
    df_wide = pd.merge(df, df_iso, 
                       left_on=["Party"], 
                       right_on=['country'], 
                       how="left")

    # filter out null values in English short name
    filt = df_wide['country'].notnull()
    df_wide = df_wide.loc[filt]


    # convert from wide to long dataframe (was def_merged_long)
    df_long = df_wide_to_long(df=df_wide,
                              value_name="emissions",
                              var_name="year")
    
    # rename columns 
    df = df_long.rename(columns={'iso3': 'identifier',
           'iso2': 'actor_id'})

    # convert year to int
    df['year'] = df['year'].astype('int16')

    # create id columns
    df['datasource_id'] = datasourceDict['datasource_id']
    df['emissions_id'] = df.apply(lambda row: 
                                  f"UNFCCC-annex1-GHG:{row['actor_id']}:{row['year']}", 
                                  axis=1)

    # CO₂ total without LULUCF, in kt
    def kilotonne_to_metric_ton(val):
        ''' 1 Kilotonne = 1000 tonnes  '''
        return val * 1000

    df['total_emissions'] = df['emissions'].apply(kilotonne_to_metric_ton)

    # Create EmissionsAgg table
    emissionsAggColumns = ["emissions_id", 
                          "actor_id", 
                          "year", 
                          "total_emissions",
                          "datasource_id"]

    df_emissionsAgg = df[emissionsAggColumns]

    # ensure data has correct types
    df_emissionsAgg = df_emissionsAgg.astype({'emissions_id': str,
                                             'actor_id': str,
                                             'year': int,
                                             'total_emissions': int,
                                             'datasource_id': str})

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_emissionsAgg.to_csv(f'{out_dir}/{tableName}.csv', index=False)
    
    return df_emissionsAgg 



def df_columns_as_str(df=None):
    df.columns = df.columns.astype(str)
    return df

def df_drop_nan_columns(df=None):
    return df.loc[:, df.columns.notna()]

def df_drop_unnamed_columns(df=None):
    return df.loc[:, ~df.columns.str.contains('^Unnamed')]

def read_eccc_ghg_inventory_fl(fl=None, province=None):
    
    assert isinstance(fl, pathlib.PurePath), (
        f"{fl} is not a string or pathlib.PosixPath"
    )
    
    # get province name from filename if not provided
    if province is None:
        # get province from stem of file
        result = re.search(r"EN_GHG_IPCC_(.*)", fl.stem)
        province = ''.join(result.groups()) 
        
        # change NT&NU combined to just NT
        if province=='NT&NU':
            province = 'NT'
    
    else:
        assert isinstance(province, str), (
            f"{province} is not type string"
        )

    # read raw dataset
    df = pd.read_excel(fl, sheet_name='Summary', header=4)
    df = df_columns_as_str(df)
    df = df_drop_unnamed_columns(df)

    # extract units
    units = df.iloc[0,1]

    # filter, only get total of all GHG cats
    filt = df['Greenhouse Gas Categories'] == 'TOTAL'
    df = df.loc[filt]

    # convert from wide to long
    df_long = df_wide_to_long(df=df, value_name='emissions', var_name='year')

    # add province column
    df_long['actor_id'] = f"CA-{province}"
    df_long['units'] = units
    
    return df_long



def harmonize_eccc_ghg_inventory(dataDir=None,                               
                                 outputDir=None,
                                 tableName=None,
                                 datasourceDict=None):
    
    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    assert isinstance(dataDir, str), f"dataDir must be a string"
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(datasourceDict, dict), f"datasourceDict must be a dictionary"
    
    # get list of files
    path = Path(dataDir)
    files = sorted((path.glob('EN_GHG_IPCC_*.xlsx')))

    # merge into one dataset, the provinces are being read the file name
    # 
    df_out = pd.concat([read_eccc_ghg_inventory_fl(fl=fl) for fl in files], ignore_index=True)

    # convert emissions to tonnes
    if set(df_out['units']) == {'kt CO2  eq'}:
        df_out['emissions'] = df_out['emissions'] * 10**3
        df_out = df_out.rename(columns={'emissions' : 'total_emissions'})

    # create datasource and emissions id
    df_out['datasource_id'] = datasourceDict['datasource_id']
    df_out['emissions_id'] = df_out.apply(lambda row: 
                                  f"ECCC_GHG_inventory:{row['actor_id']}:{row['year']}", 
                                  axis=1)

    # Create EmissionsAgg table
    emissionsAggColumns = ["emissions_id", 
                          "actor_id", 
                          "year", 
                          "total_emissions",
                          "datasource_id"]

    df_emissionsAgg = df_out[emissionsAggColumns]

    # ensure data has correct types
    df_emissionsAgg = df_emissionsAgg.astype({'emissions_id': str,
                                             'actor_id': str,
                                             'year': int,
                                             'total_emissions': int,
                                             'datasource_id': str})

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_emissionsAgg.to_csv(f'{out_dir}/{tableName}.csv', index=False)

    return df_emissionsAgg 


def harmonize_eucom_emissions(fl=None,
                                    outputDir=None, 
                                    tableName=None,
                                    datasourceDict=None):
    # set default path
    if fl is None:
        fl = '/Users/luke/Documents/work/data/EUCoM/raw/EUCovenantofMayors2022_clean_NCI_7Jun22.csv'

    # ensure input types are correct
    assert isinstance(fl, str), f"fl must be a string"
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(datasourceDict, dict), f"datasourceDict must be a list"

    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    # read EUCoM
    df = pd.read_csv(fl)

    # drop Kosovo for now
    # only partially recognized and not recognized by UN
    # cities in Kosovo are not reporting emissions anyway
    filt = df['country'] != 'Kosovo'
    df = df.loc[filt]

    # dictionary with {NameWoDiacritics: nameWithDiactrics}
    locodeDict = unlocode_name_dict()

    #name.astype(str).map(name_dict)
    df['name_with_diacritic'] = [locodeDict[name] if locodeDict.get(name) else name for name in df['name']]

    # filter where total emissions NaN
    filt = ~df['total_co2_emissions'].isna()
    df = df.loc[filt]

    # only keep select columns
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
     'total_co2_emissions'
    ]
    df = df[columns]

    # drop duplicates
    df_out = df.drop_duplicates(
        subset = ['name', 'country',  'total_co2_emissions_year', 'total_co2_emissions'],
        keep = 'first').reset_index(drop = True)

    # TODO: this can be streamlined using out ISO database
    # create dataframe with iso codes and country names
    df_iso_harm = name_harmonize_iso()
    df_iso_tmp = read_iso_codes()

    df_iso = pd.merge(df_iso_harm, df_iso_tmp, 
                       left_on=["actor_id"], 
                       right_on=["iso2"], 
                       how="left")

    # drop actor_id EARTH
    filt = df_iso['actor_id'] != 'EARTH'
    df_iso = df_iso.loc[filt]
    df_iso = df_iso[['name', 'iso2','iso3']]

    # test that all ISO codes match
    assert sum(df_iso['iso2'].isna())==0, (
        f"{sum(df_iso['iso2'].isna())} ISO codes did not match"
    )

    # merge EUCoM with ISO codes, so we get ISO2 and ISO3 codes 
    df_with_iso = pd.merge(df_out, df_iso, left_on=["iso"], right_on=["iso3"], how="left")

    assert sum(df_with_iso.iso3.isna()) == 0, (
        f"{sum(df_with_iso.iso3.isna())} ISO codes did not match in EUCoM"
    )

    # read UNLOCODE, name includes diacritics
    fl = 'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-UNLOCODE/main/UNLOCODE/Actor.csv'
    df_unl = pd.read_csv(fl)

    # split UNLOCODE to get ISO2 code
    df_unl['iso2'] = [val.split(' ')[0] for val in df_unl['actor_id']]

    # convert to uppercase
    df_unl['name_title_case'] = df_unl['name'].str.title()

    # convert to titlecase
    df_with_iso['name_with_diacritic_title_case'] = df_with_iso['name_with_diacritic'].str.title()
    df_with_iso['name_without_diacritic_title_case'] = df_with_iso['name_x'].str.title()

    # merge EUCoM with UNLOCODE datasets (try matching with diactrics)
    df_wide = pd.merge(df_with_iso, df_unl, 
                       left_on=['name_with_diacritic_title_case', "iso2"], 
                       right_on=['name_title_case', "iso2"], 
                       how="left")

    # merge EUCoM with UNLOCODE datasets (try matching without diactrics)
    df_wide2 = pd.merge(df_with_iso, df_unl, 
                       left_on=['name_without_diacritic_title_case', "iso2"], 
                       right_on=['name_title_case', "iso2"], 
                       how="left")

    # remove nan actors
    df_wide = df_wide.loc[~df_wide['actor_id'].isna()]
    df_wide2 = df_wide2.loc[~df_wide2['actor_id'].isna()]

    # concatenate the two datasets into one
    df_out = pd.concat([df_wide, df_wide2], ignore_index=False)

    # drop duplicates on actor_id
    df_merged = df_out.drop_duplicates(
        subset = ['actor_id'],
        keep = 'first').reset_index(drop = True)

    # rename some columns
    df = df_merged.rename(columns={
        'total_co2_emissions_year':'year', 
        'total_co2_emissions':'total_emissions'
    })


    # TODO: tag the primary datasource for eacy record
    # Commented out code is to get primary datasource for each record
    # not necessary for right now
    
    # long to short data_source_name
    #shortDatasourceNameDict = {
    #    'EUCovenantofMayors2022': 'EUCoM', 
    #    'GCoMEuropeanCommission2021': 'GCoMEC', 
    #    'GCoMHarmonized2021': 'GCoMH'
    #}

    # condition one column on another (https://datagy.io/pandas-conditional-column/)
    #df['data_source_short'] = df['data_source'].map(shortDatasourceNameDict)



    # TODO: add check to make sure values match dict
    # datasource id dictionary
    #datasource_id_dict = {
    #    'EUCovenantofMayors2022': 'EUCoM:2022', 
    #    'GCoMEuropeanCommission2021': 'GCoMEC:v2', 
    #    'GCoMHarmonized2021': 'GCoMH:2021'
    #}


    #assert all(x in [dataSourceDict['datasource_id'] for dataSourceDict in dataSourceDictList]  
    #           for x in list(datasource_id_dict.values())), (
    #    f"Some keys in datasource_id_dict do not match dataSourceDictList"
    #)

    #df['datasource_id'] = df['data_source'].map(datasource_id_dict)
    

    # create id columns
    df['datasource_id'] = datasourceDict['datasource_id']

    df['emissions_id'] = df.apply(lambda row: 
                              f"DDL-EUCoM:{row['actor_id']}:{row['year']}", 
                              axis=1)
    
    # create emissions_id columns
    #df['emissions_id'] = df.apply(lambda row: 
    #                              f"{row['data_source_short']}:{row['actor_id']}:{row['year']}",
    #                              axis=1)


    # Create EmissionsAgg table
    emissionsAggColumns = [
        "emissions_id", 
        "actor_id",
        "year",
        "total_emissions",
        "datasource_id"
    ]

    df_emissionsAgg = df[emissionsAggColumns]

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

    # convert to csv
    df_emissionsAgg.to_csv(f'{out_dir}/{tableName}.csv', index=False)

    return df


def match_locode_to_climactor():
    import rdata

    # entity_type ClimActor key dictionary
    parsed = rdata.parser.parse_file('/Users/luke/Documents/work/projects/ClimActor/data/key_dict.rda')
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

    # save matches
    df_output.to_csv('./key_dict_LOCODE_matchs.csv', index=False)
    
    return df_output
    
    

    
def harmonize_epa_state_ghg(dataDir=None,                               
                                 outputDir=None,
                                 tableName=None,
                                 datasourceDict=None):

    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
        
    # get list of files
    if dataDir is None:
        dataDir = '/Users/luke/Documents/work/data/EPA_state_GHG'
       
    assert isinstance(dataDir, str), f"dataDir must be a string"
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(datasourceDict, dict), f"datasourceDict must be a dictionary"
    
    path = Path(dataDir)
    files = sorted((path.glob('*.csv')))

    df_sub = pd.read_csv('https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-ISO-3166/main/ISO-3166-2/Actor.csv')
    df_sub = df_sub[['actor_id','is_part_of','name']]
    filt = (df_sub['is_part_of'] == 'US')
    df_sub = df_sub.loc[filt]
    df_sub['name'] = df_sub['name'].str.title()

    def read_each_file(fl):
        df = pd.read_csv(fl)
        firstColumnName = df.columns[0]
        filt = df[f"{firstColumnName}"] == 'Total'
        df = df.loc[filt]
        result = re.search(r"(.*)\sEmissions.*", firstColumnName)
        state = ''.join(result.groups()) 
        df = df.rename(columns={f"{firstColumnName}": "state"})
        df["state"] = f"{state}"
        df_long = df_wide_to_long(df=df,
                                  value_name='total_emissions',
                                  var_name="year")
        return df_long


    # concatenate the files
    df_concat = pd.concat([read_each_file(fl=fl) for fl in files], ignore_index=True)
    
    # convert to metric tonnes
    df_concat['total_emissions'] = df_concat.apply(lambda row: 
                                             row['total_emissions'] * 10**6, 
                                             axis=1)
    
    # merge on subnationals to get actor_id
    df_out = pd.merge(df_concat, df_sub, 
                               left_on=["state"], 
                               right_on=["name"], 
                               how="left")
    
    # create datasource and emissions id
    df_out['datasource_id'] = datasourceDict['datasource_id']
    df_out['emissions_id'] = df_out.apply(lambda row: 
                                          f"EPA_state_GHG_inventory:{row['actor_id']}:{row['year']}", 
                                          axis=1)
    
    
    # Create EmissionsAgg table
    emissionsAggColumns = ["emissions_id", 
                          "actor_id", 
                          "year", 
                          "total_emissions",
                          "datasource_id"]

    df_emissionsAgg = df_out[emissionsAggColumns]

    # ensure data has correct types
    df_emissionsAgg = df_emissionsAgg.astype({'emissions_id': str,
                                             'actor_id': str,
                                             'year': int,
                                             'total_emissions': int,
                                             'datasource_id': str})

    # sort by actor_id and year
    df_emissionsAgg = df_emissionsAgg.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_emissionsAgg.to_csv(f'{out_dir}/{tableName}.csv', index=False)
    
    return df_emissionsAgg


def harmonize_eucom_pledges(fl=None,
                            outputDir=None, 
                            tableName=None,
                            datasourceDict=None):
    # set default path
    if fl is None:
        fl = '/Users/luke/Documents/work/data/EUCoM/raw/EUCovenantofMayors2022_clean_NCI_7Jun22.csv'

    # ensure input types are correct
    assert isinstance(fl, str), f"fl must be a string"
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(datasourceDict, dict), f"datasourceDict must be a list"

    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
    
    # read EUCoM
    df = pd.read_csv(fl)

    # drop Kosovo for now
    # only partially recognized and not recognized by UN
    # cities in Kosovo are not reporting emissions anyway
    filt = df['country'] != 'Kosovo'
    df = df.loc[filt]

    # dictionary with {NameWoDiacritics: nameWithDiactrics}
    locodeDict = unlocode_name_dict()

    #name.astype(str).map(name_dict)
    df['name_with_diacritic'] = [locodeDict[name] if locodeDict.get(name) else name for name in df['name']]

    # filter where total emissions NaN
    filt = ~df['total_co2_emissions'].isna()
    df = df.loc[filt]


    # only keep select columns
    columns = [
        'name',
        'country',
        'name_with_diacritic',
        'ghg_reduction_target_type',
        'baseline_year',
        'target_year',
        'percent_reduction',
        'url',
        'action_description',
        'data_source',
        'country',
        'iso',
        'entity_type',
        'GCoM_ID',
        'ghgs_included', 
    ]
    df = df[columns]


    filt = ~(df['percent_reduction'].isna())
    df = df.loc[filt] # 2569/6187 , 41%

    filt = ~(df['target_year'].isna())
    df = df.loc[filt]  # 2518/6187 , 40%

    ##df.isna().sum()

    # drop duplicates
    df_out = df.drop_duplicates(
        subset = ['name', 'country',  'iso', 'baseline_year', 'target_year', 'percent_reduction'],
        keep = 'last').reset_index(drop = True)


    # TODO: this can be streamlined using out ISO database
    # create dataframe with iso codes and country names
    df_iso_harm = name_harmonize_iso()
    df_iso_tmp = read_iso_codes()

    df_iso = pd.merge(df_iso_harm, df_iso_tmp, 
                       left_on=["actor_id"], 
                       right_on=["iso2"], 
                       how="left")

    # drop actor_id EARTH
    filt = df_iso['actor_id'] != 'EARTH'
    df_iso = df_iso.loc[filt]
    df_iso = df_iso[['name', 'iso2','iso3']]

    # test that all ISO codes match
    assert sum(df_iso['iso2'].isna())==0, (
        f"{sum(df_iso['iso2'].isna())} ISO codes did not match"
    )


    # merge EUCoM with ISO codes, so we get ISO2 and ISO3 codes 
    df_with_iso = pd.merge(df_out, df_iso, left_on=["iso"], right_on=["iso3"], how="left")


    assert sum(df_with_iso.iso3.isna()) == 0, (
        f"{sum(df_with_iso.iso3.isna())} ISO codes did not match in EUCoM"
    )

    # read UNLOCODE, name includes diacritics
    fl = 'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-UNLOCODE/main/UNLOCODE/Actor.csv'
    df_unl = pd.read_csv(fl, keep_default_na=False)

    # split UNLOCODE to get ISO2 code
    df_unl['iso2'] = [val.split(' ')[0] for val in df_unl['actor_id']]

    # convert to uppercase
    df_unl['name_title_case'] = df_unl['name'].str.title()

    # convert to titlecase
    df_with_iso['name_with_diacritic_title_case'] = df_with_iso['name_with_diacritic'].str.title()
    df_with_iso['name_without_diacritic_title_case'] = df_with_iso['name_x'].str.title()

    # merge EUCoM with UNLOCODE datasets (try matching with diactrics)
    df_wide = pd.merge(df_with_iso, df_unl, 
                       left_on=['name_with_diacritic_title_case', "iso2"], 
                       right_on=['name_title_case', "iso2"], 
                       how="left")

    # merge EUCoM with UNLOCODE datasets (try matching without diactrics)
    df_wide2 = pd.merge(df_with_iso, df_unl, 
                       left_on=['name_without_diacritic_title_case', "iso2"], 
                       right_on=['name_title_case', "iso2"], 
                       how="left")

    # remove nan actors
    df_wide = df_wide.loc[~df_wide['actor_id'].isna()]
    df_wide2 = df_wide2.loc[~df_wide2['actor_id'].isna()]

    # concatenate the two datasets into one
    df_out = pd.concat([df_wide, df_wide2], ignore_index=False)

    # drop duplicates on actor_id
    df_merged = df_out.drop_duplicates(
        subset = ['actor_id'],
        keep = 'first').reset_index(drop = True)


    # target_id  actor_id target_type baseline_year target_year target_value target_unit URL

    # rename some columns
    df = df_merged.rename(columns={
        'ghg_reduction_target_type':'target_type', 
        'percent_reduction':'target_value',
        'url': 'URL'
    })


    
    # long to short data_source_name
    #shortDatasourceNameDict = {
    #    'EUCovenantofMayors2022': 'EUCoM', 
    #    'GCoMEuropeanCommission2021': 'GCoMEC', 
    #    'GCoMHarmonized2021': 'GCoMH'
    #}

    # condition one column on another (https://datagy.io/pandas-conditional-column/)
    #df['data_source_short'] = df['data_source'].map(shortDatasourceNameDict)



    # TODO: add check to make sure values match dict
    # datasource id dictionary
    #datasource_id_dict = {
    #    'EUCovenantofMayors2022': 'EUCoM:2022', 
    #    'GCoMEuropeanCommission2021': 'GCoMEC:v2', 
    #    'GCoMHarmonized2021': 'GCoMH:2021'
    #}


    #assert all(x in [dataSourceDict['datasource_id'] for dataSourceDict in dataSourceDictList]  
    #           for x in list(datasource_id_dict.values())), (
    #    f"Some keys in datasource_id_dict do not match dataSourceDictList"
    #)

    #df['datasource_id'] = df['data_source'].map(datasource_id_dict)

    # create id columns
    df['datasource_id'] = datasourceDict['datasource_id']
    
    
    # create emissions_id columns
    df['target_id'] = df.apply(lambda row: 
                                  f"DDL-EUCoM:EUCoM_pledge:{row['actor_id']}",
                                  axis=1)


    df['target_unit'] = 'percent'

    # Create EmissionsAgg table
    targetColumns = [
        "target_id", 
        "actor_id",
        "target_type",
        "baseline_year",
        "target_year",
        "target_value",
        'target_unit',
        "URL",
        "datasource_id"
    ]

    df_target = df[targetColumns]

    # drop nans in target_type
    # have to do this before change type to str
    filt = ~(df_target["target_type"].isna())
    df_target = df_target.loc[filt]
        
    # ensure type
    df_target = df_target.astype({
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

    # fill missing URL with 
    filt = df_target['URL'] == 'nan'
    df_target.loc[filt, 'URL'] = ''

    # filter out Intensity targets, need clarity on these
    # URL looks like they are Absolute emission reduction
    # ZHI YI: these records mostly came from JRC, no mention of being "per capita"
    filt = df_target["target_type"] != 'Intensity target'
    df_target = df_target.loc[filt]
        
    # sort by actor_id and year
    df_target = df_target.sort_values(by=['actor_id', 'baseline_year'])

    # convert to csv
    df_target.to_csv(f'{out_dir}/{tableName}.csv', index=False)

    return df


def harmonize_us_climate_alliance_pledge(outputDir=None, 
                                    tableName=None,
                                    dataSourceDict=None):
    # ensure input types are correct
    assert isinstance(outputDir, str), f"outputDir must a be string"
    assert isinstance(tableName, str), f"tableName must be a string"
    assert isinstance(dataSourceDict, dict), f"dataSourceDict must be a dict"
    
    # output directory
    out_dir = Path(outputDir).as_posix()
    
    # create out_dir if does not exist
    make_dir(path=out_dir)
        
    climateAllianceData = [
        ['California', 'US-CA', 'Absolute emissions reduction', '0', 'percent', '1990', '2020', '', 'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=200520060AB32'],
        ['California', 'US-CA', 'Absolute emissions reduction', '40', 'percent', '1990', '2030', '', 'https://www.ca.gov/archive/gov39/wp-content/uploads/2018/09/9.10.18-Executive-Order.pdf'],
        ['California', 'US-CA', 'Absolute emissions reduction', '80', 'percent', '1990', '2050', '', 'https://www.ca.gov/archive/gov39/wp-content/uploads/2018/09/9.10.18-Executive-Order.pdf'], 
        ['Colorado', 'US-CO', 'Absolute emissions reduction', '26', 'percent', '2005', '2025', '', 'https://leg.colorado.gov/sites/default/files/2019a_1261_signed.pdf'], 
        ['Colorado', 'US-CO', 'Absolute emissions reduction', '50', 'percent', '2005', '2030', '', 'https://leg.colorado.gov/sites/default/files/2019a_1261_signed.pdf'], 
        ['Colorado', 'US-CO', 'Absolute emissions reduction', '90', 'percent', '2005', '2050', '', 'https://leg.colorado.gov/sites/default/files/2019a_1261_signed.pdf'], 
        ['Connecticut', 'US-CT', 'Absolute emissions reduction', '45', 'percent', '2001', '2030', '', 'https://www.cga.ct.gov/2018/act/pa/pdf/2018PA-00082-R00SB-00007-PA.pdf'],
        ['Connecticut', 'US-CT', 'Absolute emissions reduction', '80', 'percent', '2001', '2050', '', 'https://www.cga.ct.gov/2018/act/pa/pdf/2018PA-00082-R00SB-00007-PA.pdf'],
        ['Delaware', 'US-DE', 'Absolute emissions reduction', '26', 'percent', '2005', '2025', '26-28', 'https://documents.dnrec.delaware.gov/energy/Documents/Climate/Plan/Delaware-Climate-Action-Plan-2021.pdf'],
        ['Hawaii', 'US-HI', 'Absolute emissions reduction', '50', 'percent', '2005', '2030', '', 'https://trackbill.com/bill/hawaii-governor-message-1340-act-238/2266076/'], 
        ['Illinois', 'US-IL', 'Absolute emissions reduction', '26', 'percent', '2005', '2030', '26-28', 'https://www2.illinois.gov/epa/topics/climate/Pages/default.aspx'],
        ['Louisiana', 'US-LA', 'Absolute emissions reduction', '26', 'percent', '2005', '2025', '26-28', 'https://gov.louisiana.gov/assets/ExecutiveOrders/2020/JBE-2020-18-Climate-Initiatives-Task-Force.pdf'],
        ['Louisiana', 'US-LA', 'Absolute emissions reduction', '40', 'percent', '2005', '2030', '40-50', 'https://gov.louisiana.gov/assets/ExecutiveOrders/2020/JBE-2020-18-Climate-Initiatives-Task-Force.pdf'],
        ['Louisiana', 'US-LA', 'Absolute emissions reduction', '100', 'percent', '2005', '2050', '', 'https://gov.louisiana.gov/assets/ExecutiveOrders/2020/JBE-2020-18-Climate-Initiatives-Task-Force.pdf'],
        ['Maine', 'US-ME', 'Absolute emissions reduction', '45', 'percent', '1990', '2030', '', 'https://www.maine.gov/governor/mills/sites/maine.gov.governor.mills/files/inline-files/Executive%20Order%209-23-2019_0.pdf'],
        ['Maine', 'US-ME', 'Absolute emissions reduction', '80', 'percent', '1990', '2050', '', 'https://www.maine.gov/governor/mills/sites/maine.gov.governor.mills/files/inline-files/Executive%20Order%209-23-2019_0.pdf'],
        ['Maryland', 'US-MD', 'Absolute emissions reduction', '60', 'percent', '2006', '2031', '', 'https://www.gfrlaw.com/what-we-do/insights/climate-solutions-now-act-2022'],
        ['Maryland', 'US-MD', 'Absolute emissions reduction', '100', 'percent', '2006', '2045', '', 'https://www.gfrlaw.com/what-we-do/insights/climate-solutions-now-act-2022'],
        ['Massachusetts', 'US-MA', 'Absolute emissions reduction', '33', 'percent', '1990', '2025', '', 'https://www.mass.gov/doc/2025-and-2030-ghg-emissions-limit-letter-of-determination/download'],
        ['Massachusetts', 'US-MA', 'Absolute emissions reduction', '50', 'percent', '1990', '2030', '', 'https://www.mass.gov/doc/2025-and-2030-ghg-emissions-limit-letter-of-determination/download'],
        ['Michigan', 'US-MI', 'Absolute emissions reduction', '28', 'percent', '2005', '2025', '', 'https://www.michigan.gov/egle/-/media/Project/Websites/egle/Documents/Offices/OCE/MI-Healthy-Climate-Plan.pdf?rev=d13f4adc2b1d45909bd708cafccbfffa'],
        ['Michigan', 'US-MI', 'Absolute emissions reduction', '52', 'percent', '2005', '2030', '', 'https://www.michigan.gov/egle/-/media/Project/Websites/egle/Documents/Offices/OCE/MI-Healthy-Climate-Plan.pdf?rev=d13f4adc2b1d45909bd708cafccbfffa'],
        ['Minnesota', 'US-MN', 'Absolute emissions reduction', '30', 'percent', '2005', '2025', '', 'https://www.pca.state.mn.us/air-water-land-climate/climate-change-initiatives#:~:text=The%20Next%20Generation%20Energy%20Act%20requires%20the%20state%20to%20reduce,renewable%20energy%20standards%20in%20Minnesota.'],
        ['Minnesota', 'US-MN', 'Absolute emissions reduction', '80', 'percent', '2005', '2050', '', 'https://www.pca.state.mn.us/air-water-land-climate/climate-change-initiatives#:~:text=The%20Next%20Generation%20Energy%20Act%20requires%20the%20state%20to%20reduce,renewable%20energy%20standards%20in%20Minnesota.'], 
        ['Nevada', 'US-NV', 'Absolute emissions reduction', '28', 'percent', '2005', '2025', '', 'https://www.leg.state.nv.us/App/NELIS/REL/80th2019/Bill/6431/Text'],
        ['Nevada', 'US-NV', 'Absolute emissions reduction', '45', 'percent', '2005', '2030', '', 'https://www.leg.state.nv.us/App/NELIS/REL/80th2019/Bill/6431/Text'],
        ['Nevada', 'US-NV', 'Absolute emissions reduction', '100', 'percent', '2005', '2050', '', 'https://www.leg.state.nv.us/App/NELIS/REL/80th2019/Bill/6431/Text'],
        ['New Jersey', 'US-NJ', 'Absolute emissions reduction', '0', 'percent', '1990', '2020', '', 'https://pub.njleg.gov/bills/2018/PL19/197_.htm'],
        ['New Jersey', 'US-NJ', 'Absolute emissions reduction', '50', 'percent', '2006', '2030', '', 'https://nj.gov/infobank/eo/056murphy/pdf/EO-274.pdf'], 
        ['New Jersey', 'US-NJ', 'Absolute emissions reduction', '80', 'percent', '2006', '2050', '', 'https://pub.njleg.gov/bills/2018/PL19/197_.htm'],
        ['New Mexico', 'US-NM', 'Absolute emissions reduction', '45', 'percent', '2005', '2030', '', 'https://www.governor.state.nm.us/wp-content/uploads/2019/01/EO_2019-003.pdf'],
        ['New York', 'US-NY', 'Absolute emissions reduction', '40', 'percent', '1990', '2030', '', 'https://legislation.nysenate.gov/pdf/bills/2019/S6599'],
        ['New York', 'US-NY', 'Absolute emissions reduction', '85', 'percent', '1990', '2050', '', 'https://legislation.nysenate.gov/pdf/bills/2019/S6599'],
        ['North Carolina', 'US-NC', 'Absolute emissions reduction', '50', 'percent', '2005', '2030', '', 'https://governor.nc.gov/media/2907/open'],
        ['North Carolina', 'US-NC', 'Absolute emissions reduction', '100', 'percent', '2005', '2050', '', 'https://governor.nc.gov/media/2907/open'],
        ['Oregon', 'US-OR', 'Absolute emissions reduction', '45', 'percent', '1990', '2035', '', 'https://www.oregon.gov/gov/Documents/executive_orders/eo_20-04.pdf'],
        ['Oregon', 'US-OR', 'Absolute emissions reduction', '80', 'percent', '1990', '2050', '', 'https://www.oregon.gov/gov/Documents/executive_orders/eo_20-04.pdf'],
        ['Pennsylvania', 'US-PA', 'Absolute emissions reduction', '26', 'percent', '2005', '2025', '', 'https://www.oa.pa.gov/Policies/eo/Documents/2019-01.pdf'],
        ['Pennsylvania', 'US-PA', 'Absolute emissions reduction', '80', 'percent', '2005', '2050', '', 'https://www.oa.pa.gov/Policies/eo/Documents/2019-01.pdf'],
        ['Puerto Rico', 'US-PR', 'Absolute emissions reduction', '50', 'percent', '2019', '2025', '', 'https://www.ncsl.org/research/energy/greenhouse-gas-emissions-reduction-targets-and-market-based-policies.aspx#:~:text=Description%3A%20In%202019%2C%20Puerto%20Rico,targets%20of%20100%25%20by%202041.'],
        ['Rhode Island', 'US-RI', 'Absolute emissions reduction', '10', 'percent', '1990', '2020', '', 'http://webserver.rilin.state.ri.us/Statutes/TITLE42/42-6.2/42-6.2-2.HTM'],
        ['Rhode Island', 'US-RI', 'Absolute emissions reduction', '45', 'percent', '1990', '2035', '', 'http://webserver.rilin.state.ri.us/Statutes/TITLE42/42-6.2/42-6.2-2.HTM'],
        ['Rhode Island', 'US-RI', 'Absolute emissions reduction', '80', 'percent', '1990', '2040', '', 'http://webserver.rilin.state.ri.us/Statutes/TITLE42/42-6.2/42-6.2-2.HTM'],
        ['Rhode Island', 'US-RI', 'Absolute emissions reduction', '100', 'percent', '1990', '2050', '', 'http://webserver.rilin.state.ri.us/Statutes/TITLE42/42-6.2/42-6.2-2.HTM'],
        ['Vermont', 'US-VT', 'Absolute emissions reduction', '26', 'percent', '2005', '2025', '', 'https://legislature.vermont.gov/Documents/2020/Docs/ACTS/ACT153/ACT153%20As%20Enacted.pdf'],
        ['Vermont', 'US-VT', 'Absolute emissions reduction', '40', 'percent', '1990', '2030', '', 'https://legislature.vermont.gov/Documents/2020/Docs/ACTS/ACT153/ACT153%20As%20Enacted.pdf'],
        ['Vermont', 'US-VT', 'Absolute emissions reduction', '80', 'percent', '1990', '2050', '', 'https://legislature.vermont.gov/Documents/2020/Docs/ACTS/ACT153/ACT153%20As%20Enacted.pdf'],
        ['Washington', 'US-WA', 'Absolute emissions reduction', '0', 'percent', '1990', '2020', '', 'https://lawfilesext.leg.wa.gov/biennium/2019-20/Pdf/Bills/Session%20Laws/House/2311-S2.SL.pdf#page=1'],
        ['Washington', 'US-WA', 'Absolute emissions reduction', '45', 'percent', '1990', '2030', '', 'https://lawfilesext.leg.wa.gov/biennium/2019-20/Pdf/Bills/Session%20Laws/House/2311-S2.SL.pdf#page=1'],
        ['Washington', 'US-WA', 'Absolute emissions reduction', '70', 'percent', '1990', '2040', '', 'https://lawfilesext.leg.wa.gov/biennium/2019-20/Pdf/Bills/Session%20Laws/House/2311-S2.SL.pdf#page=1'],
        ['Washington', 'US-WA', 'Absolute emissions reduction', '95', 'percent', '1990', '2050', '', 'https://lawfilesext.leg.wa.gov/biennium/2019-20/Pdf/Bills/Session%20Laws/House/2311-S2.SL.pdf#page=1'],
        ['Wisconsin', 'US-WI', 'Absolute emissions reduction', '26', 'percent', '2005', '2025', '26-28', 'https://evers.wi.gov/Documents/EO%20038%20Clean%20Energy.pdf'],
    ]

    columns =[
        'state', 
        'actor_id', 
        'target_type', 
        'target_value', 
        'target_unit',
        'baseline_year',
        'target_year', 
        'actual_range',
        'URL'
    ]

    # dataset in pandas dataframe
    df = pd.DataFrame(climateAllianceData, columns = columns)

    # create datasource_id
    df['datasource_id'] = dataSourceDict['datasource_id']

    # create emissions_id columns
    df['target_id'] = df.apply(lambda row: 
                                  f"{dataSourceDict['publisher']}:{row['actor_id']}:{row['target_year']}",
                                  axis=1)

    # select relevant columns
    columns = [
        "target_id",
        "actor_id",
        "target_type",
        "baseline_year",
        "target_year",
        "target_value",
        'target_unit',
        "URL",
        "datasource_id",
    ]

    df_out = df[columns]

    # ensure type is correct
    df_out = df_out.astype({
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
    df_out = df_out.sort_values(by=['actor_id', 'target_year'])

    # convert to csv
    df_out.to_csv(f'{out_dir}/{tableName}.csv', index=False)

    
    
def harmonize_cdp2022_states_regions(fl=None, datasourceDict=None):
    # load raw data
    #fl = '/Users/luke/Documents/work/data/CDP/2022/2022_Full_States_and_Regions_Dataset.csv'
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
    df_agg = df_filt.groupby(by=['subnational'], as_index=False)['Emissions (metric tonnes CO2e)'].sum()

    # merge in the year from df_filt
    df_agg = pd.merge(df_agg, df_filt[['subnational', 'year']].drop_duplicates(), 
         left_on='subnational', 
         right_on='subnational', 
         how='left')
    
    # drop records with years such as 2018/2019
    #filt = ~df_agg['year'].str.contains('/')
    #df_agg = df_agg.loc[filt]

    # Now need to find the ISO code for each subnational
    fl = 'https://raw.githubusercontent.com/datadrivenenvirolab/ClimActor/master/data-raw/key_dict_7Sep2022.csv'
    df_clim = pd.read_csv(fl).drop_duplicates()
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
                                  f"CD_Full_states_regions:2022:{row['actor_id']}:{row['year']}", 
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