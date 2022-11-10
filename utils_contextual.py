import geopandas as gpd
import pandas as pd
import csv
#from utils import read_iso_codes

def read_iso_codes(fl=None):
    ''' read iso codes 
    this reads iso codes from web into dataframe
    
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
    
    if fl is None:
        fl = 'https://raw.githubusercontent.com/Open-Earth-Foundation/OpenClimate-ISO-3166/main/ISO-3166-1.csv'
       
    # keep_deault_na=False is required so the Alpha-2 code "NA" 
    # is parsed as a string and not converted to NaN
    df = pd.read_csv(fl, keep_default_na=False)
    
    return df


def convert_countries_shp_to_geojson():
    """ data downloaded from natural earth 
    https://www.naturalearthdata.com/downloads/50m-cultural-vectors/
    """
    # converted to geojson
    fl = '/Users/gloege/Desktop/data/ne_50m_admin_0_countries.shp'
    df_countries = gpd.read_file(fl)
    df_countries.to_file('/Users/gloege/Projects/OpenClimate/ne_50m_admin_0_countries.geojson', driver='GeoJSON')
    
    
# methodology for UN pop: https://population.un.org/wpp/publications/Files/WPP2022_Methodology.pdf
# publications: https://population.un.org/wpp/publications/
def create_datasource_csv(datasourceDict=None):
    ''' create datasource csv for primap '''

    try:
        with open('./DataSource.csv', 'w') as f:  # You will need 'wb' mode in Python 2.x
            w = csv.DictWriter(f, datasourceDict.keys())
            w.writeheader()
            w.writerow(datasourceDict)
    except AttributeError:
        print(f"Need to supply a dictionary (datasourceDict = {datasourceDict})")
        
def create_publisher_csv(datasourceDict=None):
    ''' create datasource csv for primap '''

    try:
        with open('./Publisher.csv', 'w') as f:  # You will need 'wb' mode in Python 2.x
            w = csv.DictWriter(f, datasourceDict.keys())
            w.writeheader()
            w.writerow(datasourceDict)
    except AttributeError:
        print(f"Need to supply a dictionary (datasourceDict = {datasourceDict})")
        
        
def create_un_population_table():
    """population data downloaded from
   https://population.un.org/dataportal/data/indicators/49/locations 
   
   consider switching to downloading from: https://population.un.org/wpp/Download/Standard/CSV/ 
   """
    #fl = "/Users/gloege/Desktop/unpopulation_dataportal_20221012153912.csv"
    fl = "/Users/gloege/Desktop/data/unpopulation_dataportal_20221018124418.csv"
    df = pd.read_csv(fl)

    columns = ['Iso2', 'Time', 'Value'] # these are model-based estimates 
    df_pop = df[columns]
    df_pop = df_pop.rename(columns={'Iso2': 'actor_id',
                          'Time':'year',
                          'Value': 'population'})

    df_pop['datasource_id'] = 'UN:WorldPopulation:v2022'

    # ensure data has correct types
    df_pop = df_pop.astype({'actor_id': str,
                           'year': int,
                           'population': int,
                           'datasource_id': str})

    # read iso codes
    df_iso = read_iso_codes()

    # filter out actors not in our database
    filt = df_pop['actor_id'].isin( list(set(df_iso['Alpha-2 code'])) )
    df_pop = df_pop.loc[filt]

    # sort colmns
    df_pop = df_pop.sort_values(by=['actor_id', 'year'])

    # convert to csv
    df_pop.to_csv('./Population.csv', index=False)
    
    
# read area dataset
def read_area_data():
    fl = "/Users/gloege/Desktop/API_AG.LND.TOTL.K2_DS2_en_csv_v2_4661929.csv"
    df = pd.read_csv(fl, header=2)
    return df


def filter_area_data():

    # read raw area data
    df = read_area_data()

    # rea in the iso codes
    df_iso = read_iso_codes()

    # merge datasets (wide, each year is a column)
    df_wide = pd.merge(df, df_iso, left_on=["Country Code"], right_on=['Alpha-3 code'], how="left")

    # melt the data 
    # columns to use as identifiers
    id_vars = [val for val in list(df_wide.columns) if not val.isdigit()]

    # columns to unpivot
    value_vars = [val for val in list(df_wide.columns) if val.isdigit()]
    var_name = "year"     # new column name with {value_vars}
    value_name = "area"  # new column name with values

    # Unpivot (melt) a DataFrame from wide to long format
    df_merged_long = df_wide.melt(id_vars=id_vars, 
                            value_vars = value_vars,
                            var_name=var_name, 
                            value_name=value_name)

    # drop records with non alpha-2 code
    # okay to drop these, Kosovo only one that that is sort of a country
    # #filt = df_merged_long['Alpha-2 code'].isna(); set(df_merged_long['Country Name'].loc[filt])
    filt = ~df_merged_long['Alpha-2 code'].isna()
    df_merged_long = df_merged_long.loc[filt]

    columns = ['Alpha-2 code', 'year', 'area']
    df_area = df_merged_long[columns]
    df_area = df_area.rename(columns={'Alpha-2 code':'actor_id'})

    df_area.head()

    filt = df_area['year'] == '2020'
    df_area = df_area.loc[filt]

    return df_area



def read_capital_cities():
    fl = "/Users/gloege/Desktop/simplemaps_worldcities_basicv1.75/worldcities.csv"
    df_cities = pd.read_csv(fl)

    filt = (df_cities['capital'] == 'primary')
    df_cap = df_cities.loc[filt]

    columns = ['lat','lng','iso2']
    df_cap = df_cap[columns]

    return df_cap



def read_countries_geojson():
    # load geojson
    df_countries = gpd.read_file('/Users/gloege/Projects/OpenClimate/ne_50m_admin_0_countries.geojson')
    columns = ['NAME', 'ISO_A2', 'geometry']
    df_geo = df_countries[columns]
    df_geo = df_geo.rename(columns={'geometry':'admin_bound'})

    # france is -99
    df_geo.loc[df_geo['NAME']=="France",'ISO_A2'] = 'FR'

    # norway is -99
    df_geo.loc[df_geo['NAME']=="Norway",'ISO_A2'] = 'NO'
    
    return df_geo


def create_territory_table():
    # read in the data
    df_area = filter_area_data()
    df_cap = read_capital_cities()
    df_geo = read_countries_geojson()

    # merge the datasets along iso-2 codes
    df_out = (
        df_area
        .merge(df_cap, left_on='actor_id', right_on='iso2', how='left')
        .merge(df_geo, left_on='actor_id', right_on='ISO_A2', how='left')
    )

    #len(df_out) #227

    #sum(df_out['area'].isna()) #0

    #filt = ~df_out['area'].isna()
    #df_out = df_out.loc[filt]

    #filt = df_out['year'] == '2020'
    #df_out = df_out.loc[filt]

    #df_out.head()

    columns = ['actor_id', 'area', 'lat','lng','admin_bound']
    df_out = df_out[columns]

    df_out['lat'] = df_out['lat'] * 10000
    df_out['lng'] = df_out['lng'] * 10000

    df_out['datasource_id'] = 'WORLD_BANK:LandArea:v20220916'

    #df_out.head()

    # fill lat lon for missing countries
    #filt = df_out['lat'].isna(); df_out.loc[filt]
    # MO : 22.210928, 113.552971 (https://www.latlong.net/place/macao-china-656.html)
    # NA : -22.560881,17.065755. (https://www.countrycoordinate.com/city-windhoek-namibia/)
    # PS : 31.898043, 35.204269. (https://www.latlong.net/place/ramallah-palestine-13002.html)

    df_out.loc[df_out['actor_id'] == 'MO', ['lat','lng']] = [22.210928 * 10000, 113.552971 * 10000]

    df_out.loc[df_out['actor_id'] == 'NA', ['lat','lng']] = [-22.560881 * 10000, 17.065755 * 10000]

    df_out.loc[df_out['actor_id'] == 'PS', ['lat','lng']] = [31.898043 * 10000, 35.204269 * 10000]

    # ensure data has correct types
    df_out = df_out.astype({
        'actor_id': str,
        'area': int,
        'lat': int,
        'lng': int,
        'admin_bound': str,
        'datasource_id': str
    })



    # sort colmns
    df_out = df_out.sort_values(by=['actor_id'])

    #df_out.head()

    # we are missing actor_id GI, area=10 km**2
    #df_out.loc[df_out['admin_bound'].isnull()]
    #df_out.loc[df_out['admin_bound'].str.contains('None')]

    # convert to csv
    df_out.to_csv('./Territory.csv', index=False)
    return df_out


def main_population():
    publisherDict = {
        'id': 'UN_DESA_PD',
        'name': 'United Nations Population Division of the Department of Economic and Social Affairs',
        'URL': 'https://www.un.org/development/desa/pd/'
    }

    datasourceDict = {
        'datasource_id': 'UN_DESA_PD:WorldPopulation:v2022',
        'name': 'World Population Prospects',
        'publisher': 'UN_DESA_PD',
        'published': '2022-09',
        'URL': 'https://population.un.org/wpp/'
    }

    create_publisher_csv(publisherDict)
    create_datasource_csv(datasourceDict)
    create_un_population_table()
    
    
def main_territory()
    publisherDict = {
        'id': 'world_bank',
        'name': 'World Bank Open Data',
        'URL': 'https://data.worldbank.org/'
    }

    datasourceDict = {
        'datasource_id': 'world_bank:LandArea:v20220916',
        'name': 'Land Area (AG.LND.TOTL.K2)',
        'publisher': 'world_bank',
        'published': '2022-09-16',
        'URL': 'https://data.worldbank.org/indicator/AG.LND.TOTL.K2'
    }

    create_publisher_csv(publisherDict)
    create_datasource_csv(datasourceDict)
    df_out = create_territory_table()