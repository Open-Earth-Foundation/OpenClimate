# European OpenGHGMap
### A city-level CO2 emissions inventory for Europe

**Date accessed**: 2022-12-20

**Data source**: [OpenGHGMap R2021A](https://openghgmap.net/data/)

**Publisher**: [NTNU](https://www.ntnu.edu/)

**Citation**:

Moran, D., Pichler, P.-P., Zheng, H., Muri, H., Klenner, J., Kramel, D., Többen, J., Weisz, H., Wiedmann, T., Wyckmans, A., Strømman, A. H., and Gurney, K. R.: Estimating CO2 Emissions for 108,000 European Cities, Earth Syst. Sci. Data 14, 845-864. 2022. [https://doi.org/10.5194/essd-14-845-2022](https://doi.org/10.5194/essd-14-845-2022)

**Contact**: [Daniel Moran](https://folk.ntnu.no/daniemor/)

**License**: licensed under the [Open Data Commons Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/). You are free to re-use this data for any purpose, but any derived data must use the same, or similar, license as the ODbL. For more on the license please read the OSM's [page about copyright and license](https://www.openstreetmap.org/copyright).

## Data Download Script

Excel file with all admin levels
```sh
wget https://openghgmap.net/data/allcountries_summary.xlsx
```

## Description
This project maps CO2 emissions across Europe. The aim is to estimate an emissions inventory for each of the ~116 000 administrative jurisdictions across Europe and the UK.

The model spatially disaggregates each country's official (Eurostat) CO2 emissions inventory to places using OpenStreetMap. Vehicle emissions are attributed across fuel stations, train emissions at stations, aviation bunker fuel emissions at airports, and so on. Industrial source emissions are located at the registered address where these emissions phyiscally occur or are legally controlled. Data are for the year 2018.