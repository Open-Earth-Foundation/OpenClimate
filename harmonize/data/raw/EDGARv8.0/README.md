# EDGAR

**Date accessed**: 2023-11-21

**Data source**: [EDGARv8.0](https://edgar.jrc.ec.europa.eu/dataset_ghg80)

**Publisher**: [Joint Research Centre (JRC)](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/joint-research-centre_en)

**License**: [Creative Commons Attribution 4.0 International (CC BY 4.0) license](https://creativecommons.org/licenses/by/4.0/)

Co-authorship and involvement of the EDGAR Team in the emission data analysis is highly appreciated. User’s comments and requests can be sent via email to the [authors](jrc-edgar@ec.europa.eu).

**Contact**: For more information or data: JRC-EDGAR@ec.europa.eu

**Notes**: Data for specific gases is also available. There are also monthly maps and annual gridmaps.

## Data Download Script
download zip file of Total GHG in CO2eq
```sh
wget https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/EDGAR/datasets/v80_FT2022_GHG/EDGAR_AR5_GHG_1970_2022.zip
```
and unzip it
```sh
unzip EDGAR_AR5_GHG_1970_2022.zip
```

## Description
EDGARv8.0 is the second product of the new EDGAR Community GHG emissions database, which is the outcome of an agreement between JRC and IEA to work more closely to gather and provide consistent harmonised CO2 emissions from fossil fuel combustion.

EDGARv8.0 provides estimates for emissions of the three main greenhouse gases (CO2, CH4, N2O) and fluorinated gases per sector and country.

CO2 emissions are provided separately for the fossil and bio components. Emissions of fossil CO2 (also named CO2_excl_short-cycle_org_C) include all fossil CO2 sources, such as fossil fuel combustion, non-metallic mineral processes (e.g. cement production), metal (ferrous and non-ferrous) production processes, urea production, agricultural liming and solvents use. To harmonise global fossil CO2 emission estimates, we incorporate IEA CO2 emissions from fossil fuel combustion sources (2022b), in the joint IEA-EDGAR CO2 emission dataset (v2). Emissions of bio CO2 (also named CO2_short-cycle_org_C) include emissions from the combustion of biofuels (e.g. primary solid biomass, liquid biofuels, etc.). Large scale biomass burning with Savannah burning, forest fires, and sources and sinks from land-use, land-use change and forestry (LULUCF) are excluded. Preliminary estimates of wild fires and LULUCF emissions up to 2022 can be found at: https://edgar.jrc.ec.europa.eu/report_2023.
