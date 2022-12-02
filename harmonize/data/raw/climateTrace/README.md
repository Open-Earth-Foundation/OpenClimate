# Climate TRACE Emissions Inventory

**Date accessed**: 2022-12-01

**Data source**: [Climate TRACE emissions inventory data](https://climatetrace.org/inventory)

**Sector Definition**: [Climate TRACE sectors](https://climatetrace.org/explore)

**Methodology**: [Climate TRACE methodology](https://climatetrace.org/downloads)

**Publisher**: [Climate TRACE](https://climatetrace.org/)

**Terms Of Use**: The Climate TRACE [terms of use](https://climatetrace.org/tos) state Cliamte TRACE data is available under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/), with the exception of the coal mining emissions and metadata, which have been made available from Global Energy Monitor under a [CC BY-NC-SA 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ml)

## Data Download Script
```sh
wget -O climate_trace_emissions_inventory_20221201.csv https://api.next.climatetrace.org/v3/emissions/timeseries/sectors\?since\=2015\&to\=2021\&download\=csv\&combined\=false
```

## Description
Climate TRACE’s emissions inventory is a comprehensive account of GHG emissions based primarily on direct, independent observation. See the Climate TRACE report [Bringing Radical Transparency to Global Emissions](https://www.climatetrace.org/public/papers/2021/ClimateTRACE_BringingRadicalTransparencytoGlobalEmissions_FullReport.pdf) for more information.