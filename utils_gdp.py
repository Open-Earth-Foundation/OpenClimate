import csv
import re
from difflib import SequenceMatcher
import pandas as pd
import xlrd
import numpy as np
from utils_eucom import write_to_csv
from utils_eucom import df_to_csv
from utils import read_iso_codes

def df_wide_to_long(df=None, value_name=None, var_name=None):
    
    # set default values (new column names)
    var_name = "year" if var_name is None else var_name          # new column name with {value_vars}
    value_name = "values" if value_name is None else value_name  # new column name with values
    
    # ensure correct type
    assert isinstance(df, pd.core.frame.DataFrame), f"df must be a DataFrame"
    assert isinstance(var_name, str), f"filePath must a be string"
    assert isinstance(value_name, str), f"tableName must be a string"
    
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


def remove_country_groups(df, column=None):
    
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
        'World'
    ]

    # remove country_groups
    filt = ~df[column].isin(country_groups) 
    df = df.loc[filt]
    return df


def get_climactor_country():
    # open climactor
    #fl = 'https://raw.githubusercontent.com/datadrivenenvirolab/ClimActor/master/data-raw/country_dict_August2020.csv'
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
    
    
    
def name_harmonize_iso():
    # name harmonize
    from utils import read_iso_codes
    #df_iso = read_iso_codes()
    df_iso = pd.read_csv('/Users/luke/Documents/work/projects/OpenClimate-ISO-3166/ISO-3166-1/Actor.csv')

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


def find_regex_in_csv(fl=None, regex=None):
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
                

def add_records_to_climactor():
    Details = "wrong,right,iso,region,Landarea,iso2,Population".split(',')

    new_records = [
        ["China, People's Republic of", 'China', 'CHN', 'East Asia and the Pacific', '9388211', 'CN', '1397715000'],
        ['Congo, Dem. Rep. of the', 'Dem. Rep. Congo', 'COD', 'Sub-Saharan Africa', '2267050', 'CD', '86790567'],
        ['Congo, Republic of', 'Congo', 'COG', 'Sub-Saharan Africa', '341500', 'CG', '5380508'],
        ['Hong Kong SAR', 'Hong Kong', 'HKG', 'East Asia and the Pacific', '1050', 'HK', '7507400'],
        ['Lao P.D.R.', 'Laos', 'LAO', 'East Asia and the Pacific', '230800', 'LA', '7169455'],
        ['Macao SAR', 'Macao', 'MAC', 'East Asia and the Pacific', '29.9', 'MO', '640445'],
        ['Micronesia, Fed. States of', 'Micronesia', 'FSM', 'East Asia and the Pacific', '700', 'FM', '113815'],
        ['South Sudan, Republic of', 'South Sudan', 'SSD', 'Middle East and North Africa', '644330', 'SS', '11062113'],
        ['São Tomé and Príncipe', 'Sao Tome and Principe', 'STP', 'Sub-Saharan Africa', '960', 'ST', '215056'],
        ['Türkiye, Republic of', 'Turkey', 'TUR', 'Eastern Europe and Central Asia', '769630', 'TR', '83429615'],
        ['Eswatini', 'Swaziland', 'SWZ', 'Sub-Saharan Africa', '17200', 'SZ', '1249514'],
        ['The Bahamas (the)', 'The Bahamas', 'BHS', 'Latin America and Caribbean', '10010', 'BS', '389482'],
        ['Cayman Islands (the)', 'Cayman Islands', 'CYM', 'Latin America and Caribbean', '240', 'KY', '64948'],
        ['Central African Republic (the)', 'Central African Republic', 'CAF', 'Sub-Saharan Africa', '622980', 'CF', '4745185'],
        ['Comoros (the)', 'Comoros', 'COM', 'Sub-Saharan Africa', '1861', 'KM', '850886'],
        ['Congo (the Democratic Republic of the)', 'Dem. Rep. Congo', 'COD', 'Sub-Saharan Africa', '2267050', 'CD', '86790567'],
        ['Congo (the)', 'Congo', 'COG', 'Sub-Saharan Africa', '341500', 'CG', '5380508'],
        ['Cook Islands (the)', 'Cook Islands', 'COK', 'East Asia and the Pacific', '236', 'CK', '19342'],
        ['Curaçao', 'Curacao', 'CUW', 'Latin America and Caribbean', '444', 'CW', '157538'],
        ['Dominican Republic (the)', 'Dominican Republic', 'DOM', 'Latin America and Caribbean', '48320', 'DO', '10738958'],
        ['Falkland Islands (the) [Malvinas]', 'Falkland Islands', 'FLK', 'Latin America and Caribbean', '12173', 'FK', '2955'],
        ['Faroe Islands (the)', 'Faeroe Islands', 'FRO', 'Europe', '1396', 'FO', '48678'],
        ['Gambia (the)', 'The Gambia', 'GMB', 'Sub-Saharan Africa', '10120', 'GM', '2347706'],
        ['Holy See (the)', 'Holy See', 'VAT', 'Europe', '0', 'VA', '409905'],
        ["Korea (the Democratic People's Republic of)", 'North Korea', 'PRK', 'East Asia and the Pacific', '120410', 'KP', '25666161'],
        ['Korea (the Republic of)', 'South Korea', 'KOR', 'East Asia and the Pacific', '97350', 'KR', '51709098'],
        ["Lao People's Democratic Republic (the)", 'Laos', 'LAO', 'East Asia and the Pacific', '230800', 'LA', '7169455'],
        ['Marshall Islands (the)', 'Marshall Islands', 'MHL', 'East Asia and the Pacific', '180', 'MH', '58791'],
        ['Moldova (the Republic of)', 'Moldova', 'MDA', 'Eastern Europe and Central Asia', '32860', 'MD', '2657637'],
        ['Netherlands (the)', 'Netherlands', 'NLD', 'Europe', '33720', 'NL', '17332850'],
        ['Niger (the)', 'Niger', 'NER', 'Sub-Saharan Africa', '1266700', 'NE', '23310715'],
        ['Northern Mariana Islands (the)', 'Northern Mariana Islands', 'MNP', 'East Asia and the Pacific', '460', 'MP', '57216'],
        ['Philippines (the)', 'Philippines', 'PHL', 'East Asia and the Pacific', '298170', 'PH', '108116615'],
        ['Russian Federation (the)', 'Russia', 'RUS', 'Eastern Europe and Central Asia', '16376870', 'RU', '144373535'],
        ['Réunion', 'Reunion', 'REU', 'Sub-Saharan Africa', '2513', 'RE', '48'],
        ['Saint Helena, Ascension and Tristan da Cunha', 'Saint Helena', 'SHN', 'Sub-Saharan Africa', '308', 'SH', '76425'],
        ['Saint Martin (French part)', 'Saint Martin', 'MAF', 'Latin America and Caribbean', '54.4', 'MF', '38002'],
        ['Sudan (the)', 'Sudan', 'SDN', 'Middle East and North Africa', '2376000', 'SD', '42813238'],
        ['Syrian Arab Republic (the)', 'Syria', 'SYR', 'Middle East and North Africa', '183630', 'SY', '17070135'],
        ['Taiwan (Province of China)', 'Taiwan', 'TWN', 'East Asia and the Pacific', '36193', 'TW', '23780000'],
        ['Tanzania, the United Republic of', 'Tanzania', 'TZA', 'Sub-Saharan Africa', '885800', 'TZ', '58005463'],
        ['Turks and Caicos Islands (the)', 'Turks and Caicos Islands', 'TCA', 'Latin America and Caribbean', '950', 'TC', '38191'],
        ['Türkiye', 'Turkey', 'TUR', 'Eastern Europe and Central Asia', '769630', 'TR', '83429615'],
        ['United Arab Emirates (the)', 'United Arab Emirates', 'ARE', 'Middle East and North Africa', '83600', 'AE', '9770529'],
        ['United Kingdom of Great Britain and Northern Ireland (the)', 'United Kingdom', 'GBR', 'Europe', '241930', 'GB', '66834405'],
        ['United States of America (the)', 'United States of America', 'USA', 'North America', '9147420', 'US', '328239523'],
        ['Virgin Islands (British)', 'British Virgin Islands', 'VGB', 'Latin America and Caribbean', '151', 'VG', '30030'],
        ['Bahamas (the)', 'The Bahamas', 'BHS', 'Latin America and Caribbean', '10010', 'BS', '389482']
    ]
    
    with open('/Users/luke/Documents/work/data/ClimActor/country_dict_updated.csv', 'a') as f: 
        write = csv.writer(f) 
        
        if f.tell() == 0:
            write.writerow(Details) 
            
        write.writerows(new_records) 
    

    
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def get_best_match(test, name_list):
    # creat dictionary of name:similary_value 
    tmp = {val: similar(test, val) for val in name_list}
    # sorted_dict = {k: v for k, v in sorted(tmp.items(), key=lambda item: item[1], reverse=True)}
    # get best_match
    best_match = max(tmp, key=tmp.get)
    
    return test, best_match, tmp[best_match]
    #return {test: [best_match, tmp[best_match]]}
    

def create_all_gdp_tables():
    # conda install -c conda-forge xlrd
    workbook = xlrd.open_workbook_xls('/Users/luke/Documents/work/data/GDP/country/imf-dm-export-20221017.xls', 
                                      ignore_workbook_corruption=True)  
    df_gdp_tmp = pd.read_excel(workbook)

    # remove un-necessary records
    df_gdp_tmp = df_gdp_tmp.dropna()

    df_long = df_wide_to_long(df=df_gdp_tmp, value_name='GDP')

    # replace no data so is -99
    df_long['GDP'] = (df_long['GDP'].replace('no data', -0.000000099))
    df_long['GDP'] = df_long['GDP'].astype(float)

    # rename column
    df_long = df_long.rename(columns={"GDP, current prices (Billions of U.S. dollars)":"country"})

    # convert GDP to USD instead of billion USD
    df_long['GDP'] = df_long['GDP'] * 10**9

    # filter years
    filt = df_long['year'] <=2021
    df_long = df_long.loc[filt]

    # change type
    df_long['GDP'] = df_long['GDP'].astype(int)

    # remove trailing white space
    df_long['country'] = df_long['country'].str.strip()

    df_long = remove_country_groups(df_long, column='country')

    #df_long.head()

    df_climactor = get_climactor_country()

    # name harmonize country column
    df_long['country'] = df_long['country'].replace(to_replace = list(df_climactor['wrong']), 
                                                     value = list(df_climactor['right']))

    # sanity check
    check_all_names_match(df_long, 'country')

    df_iso = name_harmonize_iso()

    #df_iso.head()

    #df_long.head()

    df_out = pd.merge(df_long, df_iso, left_on=["country"], right_on=["name"], how="left")

    df_out = df_out.rename(columns={'GDP':'gdp'})

    df_out['datasource_id'] = 'IMF:WEO202211'

    columns = ['actor_id', 'gdp', 'year', 'datasource_id']
    df_out = df_out[columns]

    
    
    df_out = df_out.astype({
        'actor_id': str,
        'gdp': int,
        'year': int,
        'datasource_id': str
    })
    
    df_out['gdp'] = (df_out['gdp'].replace(-99, np.nan))
    

    df_out = df_out.sort_values(by=['actor_id', 'year'])

    # GDP.csv

    df_to_csv(df=df_out, tableName="GDP")

    # Datasource.csv

    list_dataSourceDicts = [{
        "datasource_id": 'IMF:WEO202211',
        "name":'World Economic Outlook (October 2022)',
        "publisher":'IMF',
        "published": '2022-11',
        "URL": 'https://www.imf.org/external/datamapper/NGDPD@WEO/WEOWORLD'
    }
    ]

    for dataDict in list_dataSourceDicts:
        write_to_csv(filePath='.', tableName='DataSource', dataDict=dataDict, mode='a')

    # Publisher.csv

    list_PublisherDicts = [{
        "id": "IMF",
        "name": "International Montary Fund" ,
        "URL": "https://www.imf.org/en/Home"
    }
    ]

    for dataDict in list_PublisherDicts:
        write_to_csv(filePath='.', tableName='Publisher', dataDict=dataDict, mode='a')

    # Methodology.csv

    list_MethodologyDicts = [{
        "methodology_id": "IMF:WEO202211:methodology",
        "name": "World Economic Outlook Methodology",
        "methodology_link": "https://www.imf.org/en/Publications/WEO"
    }
    ]

    for dataDict in list_MethodologyDicts:
        write_to_csv(filePath='.', tableName='Methodology', dataDict=dataDict, mode='a')