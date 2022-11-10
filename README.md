# OpenClimate-harmonize

This is the start of a package to harmonize DIGS datasources for ingestion into the OpenClimate schema.
This repository contains functions to process datasets and contains harmonized ingest-ready datasets. 

All functions are contains `utils.py`. 

## Harmonizing PRIMAP

```python
if __name__ == "__main__":
    from utils import write_to_csv
    from utils import harmonize_primap_emissions

    # where to create tables
    outputDir = "./data_emissions/country/PRIMAP/v2.4"
    
    # PRIMAP dataset url
    fl=('https://zenodo.org/record/7179775/files/'
        'Guetschow-et-al-2022-PRIMAP-hist_v2.4_no_extrap_11-Oct-2022.csv?download=1')

    publisherDict = {
        'id': 'PRIMAP',
        'name': 'Potsdam Realtime Integrated Model for probabilistic Assessment of emissions Path',
        'URL': 'https://www.pik-potsdam.de/paris-reality-check/primap-hist/'
    }

    methodologyDict = {
        "methodology_id": f'PRIMAP:v2.4:methodology',
        "name": 'PRIMAP methodology based on a compliation of multiple publicly available data sources',
        "methodology_link": 'https://essd.copernicus.org/articles/8/571/2016/'
    }

    datasourceDict = {
        'datasource_id': 'PRIMAP:10.5281/zenodo.7179775:v2.4',
        'name': 'PRIMAP-hist_v2.4_no_extrap (scenario=HISTCR)',
        'publisher': 'PRIMAP',
        'published': '2022-10-17',
        'URL': 'https://zenodo.org/record/7179775'
    }


    # create publisher, methodology, datasrouce tables
    write_to_csv(outputDir=outputDir, 
                 tableName='Publisher', 
                 dataDict=publisherDict, 
                 mode='w')
    write_to_csv(outputDir=outputDir, 
                 tableName='Methodology', 
                 dataDict=methodologyDict, 
                 mode='w')
    write_to_csv(outputDir=outputDir, 
                 tableName='DataSource', 
                 dataDict=datasourceDict, 
                 mode='w')

    # create emissionsAgg table
    harmonize_primap_emissions(
        fl=fl,
        entity='KYOTOGHG (AR4GWP100)', 
        category='M.0.EL', 
        scenario='HISTCR',
        outputDir=outputDir, 
        tableName='EmissionsAgg',
        methodologyDict=methodologyDict, 
        datasourceDict=datasourceDict
    )
    
    # this will output four csv files (Publisher.csv, Methodology.csv, DataSource.csv, EmissionsAgg.csv)
```

Harmonized emissions data for each data source is in the `/data_emissions` directory
