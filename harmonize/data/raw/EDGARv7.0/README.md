# EDGAR

**Date accessed**: 2022-12-20

**Data source**: [EDGARv7.0](https://edgar.jrc.ec.europa.eu/dataset_ghg70)

**Publisher**: [Joint Research Centre (JRC)](https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/joint-research-centre_en)

**License**: Users of the data are obliged to acknowledge the source of the data with a reference to the EDGARv7.0 website ([link](https://edgar.jrc.ec.europa.eu/dataset_ghg70)) to Crippa et al. ([2021](https://edgar.jrc.ec.europa.eu/report_2021), [2022](https://edgar.jrc.ec.europa.eu/report_2022)).

Co-authorship and involvement of the EDGAR Team in the emission data analysis is highly appreciated. User’s comments and requests can be sent via email to the [authors](jrc-edgar@ec.europa.eu).

**Contact**: For more information or data: JRC-EDGAR@ec.europa.eu

**Notes**: Data for specific gases is also available. There are also monthly maps and annual gridmaps.

## Data Download Script
download zip file of Total GHG in CO2eq
```sh
wget https://jeodpp.jrc.ec.europa.eu/ftp/jrc-opendata/EDGAR/datasets/v70_FT2021_GHG/v70_FT2021_GHG_AR4_AR5.zip
```
and unzip it
```sh
unzip v70_FT2021_GHG_AR4_AR5.zip
```

Here I only including the unzipped data, I am not saving the zipped data.

## Description
 Emissions Database for Global Atmospheric Research version 7.0 (EDGARv7.0) provides emissions of the three main greenhouse gases (CO2, CH4, N2O) and fluorinated gases per sector and country.

 Emission country totals are expressed in kton substance / year. The IPCC 1996 and 2006 codes are used for specification of the sectors.

CO2 emissions are provided separately for CO2_excl_short-cycle_org_C and CO2_short-cycle_org_C. Emissions of CO2_excl_short-cycle_org_C include all fossil CO2 sources, such as fossil fuel combustion, non-metallic mineral processes (e.g. cement production), metal (ferrous and non-ferrous) production processes, urea production, agricultural liming and solvents use. To harmonise global CO2 emission estimates, for the first time we incorporate IEA CO2 emissions from fossil fuel combustion sources (IEA; 2021b), representing the first IEA-EDGAR CO2 emission dataset. Large scale biomass burning with Savannah burning, forest fires, and sources and sinks from land-use, land-use change and forestry (LULUCF) are excluded. Preliminary estimates of wild fires and LULUCF emissions up to 2020 can be found at: https://edgar.jrc.ec.europa.eu/report_2022.

Emissions of fluorinated gases have been derived by multiple sources, most notably from country reporting where available. When not the case, activity data statistics have been derived by UNEP data, from scientific literature and expert judgment.

For the energy related sectors the activity data are primarily based on IEA data from IEA (2021a) World Energy Balances, (Internet: link), all rights reserved, as modified by Joint Research Centre, European Commission, whereas the activity data for the agricultural sectors originate primarily from FAO (2021) (Internet: link). United States Geological Survey (USGS), International Fertiliser Association (IFA), Gas Flaring Reduction Partnership (GGFR)/U.S. National Oceanic and Atmospheric Administration (NOAA), UNFCCC and World Steel Association (worldsteel) recent statistics are also used for activity data. Additional information can be found in Crippa et al. (2021, 2022 ).

- Total GHG emissions from EDGARv7.0: https://edgar.jrc.ec.europa.eu/dataset_ghg70
- GHG emissions are expressed in kton CO2eq. They are aggregated using Global Warming Potential values from IPCC AR4 (GWP-100 AR4)
- GHG emissions include CO2 (fossil only), CH4, N2O and F-gases

Compared to EDGARv6.0 the following updates have been included:

- Update of activity data for combustion related emissions based on IEA (2021a) data up to the year 2019
- Update of activity data for agriculture related emissions based on FAO statistics (2022) up to 2019 (for crop related emissions) and 2020 (for livestock related emissions)
- Update of all activity data up to 2021 for CO2 process emissions, as reported in Crippa et al. 2022
- Extension of GHG emission time series for the latest years up to 2021 using a Fast Track approach. The Fast Track approach for CO2 emissions is described in Crippa et al. (2022), while for non-CO2 GHGs a publication is upcoming


## Other resources
- [More information](https://edgar.jrc.ec.europa.eu/)
- [CO2 emissions of all world countries - 2022 Report](https://edgar.jrc.ec.europa.eu/report_2022?vis=pop#data_download)
