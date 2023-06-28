import { ComponentProps } from "react";
import ContextualDataWidget from "../contextual-data.widget";
import { cleanup, render, screen } from "@testing-library/react";

// captured from https://openclimate.network/actor/CA%20MTR/Montreal_emissions
const NO_DATA_AVAILABLE: ComponentProps<typeof ContextualDataWidget> = {
  current: {
    actor_id: "CA MTR",
    name: "Montreal",
    type: "city",
    icon: null,
    is_part_of: "CA-QC",
    territory: null,
    emissions: {
      "CDP_citywide_ghg_emissions:2016": {
        datasource_id: "CDP_citywide_ghg_emissions:2016",
        name: "2016 - Citywide GHG Emissions",
        publisher: "CDP",
        published: "2018-10-04T00:00:00.000Z",
        URL: "https://data.cdp.net/Emissions/2016-Citywide-GHG-Emissions/dfed-thx7",
        citation: null,
        tags: [
          {
            tag_id: "self_reported",
            tag_name: "self reported",
            created: "2023-03-16T21:08:48.882Z",
            last_updated: "2023-03-16T21:08:48.882Z",
          },
        ],
        data: [
          {
            emissions_id: "CDP_citywide_emissions:CA MTR:2009",
            total_emissions: 13722942,
            year: 2009,
            tags: [],
          },
        ],
      },
      "CDP_citywide_community_emissions:2017": {
        datasource_id: "CDP_citywide_community_emissions:2017",
        name: "2017 - Cities Community Wide Emissions",
        publisher: "CDP",
        published: "2018-10-04T00:00:00.000Z",
        URL: "https://data.cdp.net/Emissions/2017-Cities-Community-Wide-Emissions/kyi6-dk5h",
        citation: null,
        tags: [
          {
            tag_id: "self_reported",
            tag_name: "self reported",
            created: "2023-03-16T21:08:48.882Z",
            last_updated: "2023-03-16T21:08:48.882Z",
          },
        ],
        data: [
          {
            emissions_id: "CDP_citywide_emissions:CA MTR:2013",
            total_emissions: 10791713,
            year: 2013,
            tags: [],
          },
        ],
      },
      "CDP_citywide_emissions:2019": {
        datasource_id: "CDP_citywide_emissions:2019",
        name: "2019 - City-wide Emissions",
        publisher: "CDP",
        published: "2021-03-01T00:00:00.000Z",
        URL: "https://data.cdp.net/Emissions/2019-City-wide-Emissions/542d-zyj8",
        citation: null,
        tags: [
          {
            tag_id: "self_reported",
            tag_name: "self reported",
            created: "2023-03-16T21:08:48.882Z",
            last_updated: "2023-03-16T21:08:48.882Z",
          },
        ],
        data: [
          {
            emissions_id: "CDP_citywide_emissions:CA MTR:2014",
            total_emissions: 11219680,
            year: 2014,
            tags: [],
          },
        ],
      },
      "CDP_citywide_emissions:2020": {
        datasource_id: "CDP_citywide_emissions:2020",
        name: "2020 - City-wide Emissions",
        publisher: "CDP",
        published: "2021-07-15T00:00:00.000Z",
        URL: "https://data.cdp.net/Emissions/2020-City-Wide-Emissions/p43t-fbkj",
        citation: null,
        tags: [
          {
            tag_id: "self_reported",
            tag_name: "self reported",
            created: "2023-03-16T21:08:48.882Z",
            last_updated: "2023-03-16T21:08:48.882Z",
          },
        ],
        data: [
          {
            emissions_id: "CDP_citywide_emissions:CA MTR:2015",
            total_emissions: 10837623,
            year: 2015,
            tags: [],
          },
        ],
      },
      "carbon_monitor_cities:v0325": {
        datasource_id: "carbon_monitor_cities:v0325",
        name: "Near-real-time daily estimates of CO2 emissions from 1500 cities worldwide",
        publisher: "Carbon Monitor Cities",
        published: "2022-03-26T00:00:00.000Z",
        URL: "https://doi.org/10.6084/m9.figshare.19425665.v1",
        citation:
          "Huo, D., et al. (2022). Near-real-time daily estimates of CO2 emissions from 1500 cities worldwide. Figshare. doi:10.6084/m9.figshare.19425665.v1",
        tags: [
          {
            tag_id: "ghgs_included_fossil_CO2",
            tag_name: "GHGs included: Fossil CO2",
            created: "2023-04-11T14:35:43.190Z",
            last_updated: "2023-04-11T14:35:43.190Z",
          },
          {
            tag_id: "includes_cement",
            tag_name: "Includes emissions from cement production",
            created: "2023-06-05T03:12:55.474Z",
            last_updated: "2023-06-05T03:12:55.474Z",
          },
          {
            tag_id:
              "sectors_power_residential_industry_ground_transport_aviation",
            tag_name:
              "Sectors: power generation, residential and commercial buildings, industry, ground transportation, and aviation",
            created: "2023-06-05T03:12:55.475Z",
            last_updated: "2023-06-05T03:12:55.475Z",
          },
          {
            tag_id: "disaggregates_national_emissions_using_GRACED",
            tag_name:
              "Disaggregates the Carbon Monitor national emissions to cities using the Global Gridded Daily CO2 Emissions Dataset (GRACED)",
            created: "2023-06-05T03:12:55.475Z",
            last_updated: "2023-06-05T03:12:55.475Z",
          },
        ],
        data: [
          {
            emissions_id: "carbon_monitor_cities:CA MTR:2019",
            total_emissions: 37672884,
            year: 2019,
            tags: [],
          },
          {
            emissions_id: "carbon_monitor_cities:CA MTR:2020",
            total_emissions: 34654716,
            year: 2020,
            tags: [],
          },
          {
            emissions_id: "carbon_monitor_cities:CA MTR:2021",
            total_emissions: 32957078,
            year: 2021,
            tags: [],
          },
        ],
      },
    },
    population: [],
    gdp: [],
    targets: [],
  },
  parent: {
    actor_id: "CA-QC",
    name: "Quebec",
    type: "adm1",
    icon: null,
    is_part_of: "CA",
    area: 1542056,
    lat: 0,
    lng: 0,
    territory: {
      area: 1542056,
      lat: 0,
      lng: 0,
      datasource: {
        datasource_id: "OEF:WD:subnational-area:20221106",
        name: "Wikidata extract of subnational objects and their areas",
        published: "2022-11-06T00:00:00.000Z",
        URL: "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize/tree/main/source/Wikidata-Subnational-Area",
      },
    },
    emissions: {
      "ECCC:GHG_inventory:2022-04-13": {
        datasource_id: "ECCC:GHG_inventory:2022-04-13",
        name: "ECCC Greenhouse Gas Inventory",
        publisher: "ECCC",
        published: "2022-04-13T00:00:00.000Z",
        URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
        citation: null,
        tags: [
          {
            tag_id: "country_reported_data",
            tag_name: "Country-reported data",
            created: "2023-03-16T21:08:50.375Z",
            last_updated: "2023-03-16T21:08:50.375Z",
          },
          {
            tag_id: "GHGs_included_CO2_CH4_N2O_F_gases",
            tag_name: "GHGs included: CO2, CH4, N2O, and F-gases",
            created: "2023-04-11T14:32:59.192Z",
            last_updated: "2023-04-11T14:32:59.192Z",
          },
          {
            tag_id: "sectors_energy_IPPU_ag_waste",
            tag_name: "Sectors: energy, IPPU, agriculture, and waste",
            created: "2023-04-11T14:32:59.192Z",
            last_updated: "2023-04-11T14:32:59.192Z",
          },
          {
            tag_id: "Excludes_LULUCF",
            tag_name: "Excludes LULUCF",
            created: "2023-04-11T14:32:59.192Z",
            last_updated: "2023-04-11T14:32:59.192Z",
          },
          {
            tag_id: "GWP_100_AR4",
            tag_name: "Uses GWP100 from IPCC AR6",
            created: "2023-04-11T14:32:59.193Z",
            last_updated: "2023-06-09T20:26:43.784Z",
          },
        ],
        data: [
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2020",
            total_emissions: 76241175,
            year: 2020,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2019",
            total_emissions: 83589932,
            year: 2019,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2018",
            total_emissions: 81825711,
            year: 2018,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2017",
            total_emissions: 80253889,
            year: 2017,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2016",
            total_emissions: 78147345,
            year: 2016,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2015",
            total_emissions: 78505163,
            year: 2015,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2014",
            total_emissions: 77982947,
            year: 2014,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2013",
            total_emissions: 80136615,
            year: 2013,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2012",
            total_emissions: 79946366,
            year: 2012,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2011",
            total_emissions: 81538304,
            year: 2011,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2010",
            total_emissions: 79480531,
            year: 2010,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2009",
            total_emissions: 82358830,
            year: 2009,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2008",
            total_emissions: 83766784,
            year: 2008,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2007",
            total_emissions: 88577940,
            year: 2007,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2006",
            total_emissions: 84678304,
            year: 2006,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2005",
            total_emissions: 86344166,
            year: 2005,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2004",
            total_emissions: 89838272,
            year: 2004,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2003",
            total_emissions: 89336969,
            year: 2003,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2002",
            total_emissions: 84397460,
            year: 2002,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2001",
            total_emissions: 82925179,
            year: 2001,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:2000",
            total_emissions: 84698254,
            year: 2000,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1999",
            total_emissions: 84209513,
            year: 1999,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1998",
            total_emissions: 84404262,
            year: 1998,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1997",
            total_emissions: 83227884,
            year: 1997,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1996",
            total_emissions: 83172935,
            year: 1996,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1995",
            total_emissions: 82200103,
            year: 1995,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1994",
            total_emissions: 83460644,
            year: 1994,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1993",
            total_emissions: 81356322,
            year: 1993,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1992",
            total_emissions: 80257946,
            year: 1992,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1991",
            total_emissions: 80143952,
            year: 1991,
            tags: [],
          },
          {
            emissions_id: "ECCC_GHG_inventory:CA-QC:1990",
            total_emissions: 84508702,
            year: 1990,
            tags: [],
          },
        ],
      },
    },
    population: [
      {
        population: 8501833,
        year: 2021,
        datasource_id: "OEF:WD:subnational-population:20221106",
        datasource: {
          datasource_id: "OEF:WD:subnational-population:20221106",
          name: "Wikidata extract of subnational objects and their populations for years since 2016",
          published: "2022-11-06T00:00:00.000Z",
          URL: "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize/tree/main/source/wikidata-subnational-population",
        },
      },
      {
        population: 8604838,
        year: 2020,
        datasource_id: "OEF:WD:subnational-population:20221106",
        datasource: {
          datasource_id: "OEF:WD:subnational-population:20221106",
          name: "Wikidata extract of subnational objects and their populations for years since 2016",
          published: "2022-11-06T00:00:00.000Z",
          URL: "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize/tree/main/source/wikidata-subnational-population",
        },
      },
      {
        population: 8484965,
        year: 2019,
        datasource_id: "OEF:WD:subnational-population:20221106",
        datasource: {
          datasource_id: "OEF:WD:subnational-population:20221106",
          name: "Wikidata extract of subnational objects and their populations for years since 2016",
          published: "2022-11-06T00:00:00.000Z",
          URL: "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize/tree/main/source/wikidata-subnational-population",
        },
      },
      {
        population: 8425996,
        year: 2017,
        datasource_id: "OEF:WD:subnational-population:20221106",
        datasource: {
          datasource_id: "OEF:WD:subnational-population:20221106",
          name: "Wikidata extract of subnational objects and their populations for years since 2016",
          published: "2022-11-06T00:00:00.000Z",
          URL: "https://github.com/Open-Earth-Foundation/OpenClimate-harmonize/tree/main/source/wikidata-subnational-population",
        },
      },
    ],
    gdp: [],
    targets: [
      {
        target_id: "C2ES:CA-QC:2020",
        target_type: "Absolute emission reduction",
        baseline_year: 1990,
        baseline_value: null,
        target_year: 2020,
        target_value: "20",
        target_unit: "percent",
        is_net_zero: false,
        percent_achieved: 48.91524070503414,
        percent_achieved_reason: {
          baseline: {
            year: 1990,
            value: 84508702,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          current: {
            year: 2020,
            value: 76241175,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          target: {
            value: 67606961.6,
          },
        },
        datasource_id: "C2ES:canadian_GHG_targets",
        datasource: {
          datasource_id: "C2ES:canadian_GHG_targets",
          name: "Canadian Provincial GHG Emissions Targets",
          publisher: "C2ES",
          published: "2022-11-13T00:00:00.000Z",
          URL: "https://www.c2es.org/document/canadian-provincial-ghg-emission-targets/",
          created: "2023-03-16T21:08:48.113Z",
          last_updated: "2023-03-16T21:08:48.113Z",
        },
      },
      {
        target_id: "C2ES:CA-QC:2030",
        target_type: "Absolute emission reduction",
        baseline_year: 1990,
        baseline_value: null,
        target_year: 2030,
        target_value: "37",
        target_unit: "percent",
        is_net_zero: false,
        percent_achieved: 26.440670651369807,
        percent_achieved_reason: {
          baseline: {
            year: 1990,
            value: 84508702,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          current: {
            year: 2020,
            value: 76241175,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          target: {
            value: 53240482.260000005,
          },
        },
        datasource_id: "C2ES:canadian_GHG_targets",
        datasource: {
          datasource_id: "C2ES:canadian_GHG_targets",
          name: "Canadian Provincial GHG Emissions Targets",
          publisher: "C2ES",
          published: "2022-11-13T00:00:00.000Z",
          URL: "https://www.c2es.org/document/canadian-provincial-ghg-emission-targets/",
          created: "2023-03-16T21:08:48.113Z",
          last_updated: "2023-03-16T21:08:48.113Z",
        },
      },
      {
        target_id: "net_zero_tracker:CA-QC:2030",
        target_type: "Absolute emission reduction",
        baseline_year: 1990,
        baseline_value: null,
        target_year: 2030,
        target_value: "37",
        target_unit: "percent",
        is_net_zero: false,
        percent_achieved: 26.440670651369807,
        percent_achieved_reason: {
          baseline: {
            year: 1990,
            value: 84508702,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          current: {
            year: 2020,
            value: 76241175,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          target: {
            value: 53240482.260000005,
          },
        },
        datasource_id: "net_zero_tracker",
        datasource: {
          datasource_id: "net_zero_tracker",
          name: "Net Zero Tracker",
          publisher: "net_zero_tracker",
          published: "2022-01-01T00:00:00.000Z",
          URL: "https://zerotracker.net/",
          created: "2023-03-16T21:11:42.380Z",
          last_updated: "2023-03-16T21:11:42.380Z",
        },
      },
      {
        target_id: "OEF:CA-QC:2030",
        target_type: "Absolute emission reduction",
        baseline_year: 1990,
        baseline_value: null,
        target_year: 2030,
        target_value: "37",
        target_unit: "percent",
        is_net_zero: false,
        percent_achieved: 26.440670651369807,
        percent_achieved_reason: {
          baseline: {
            year: 1990,
            value: 84508702,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          current: {
            year: 2020,
            value: 76241175,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          target: {
            value: 53240482.260000005,
          },
        },
        datasource_id: "OEF:canadian_targets",
        datasource: {
          datasource_id: "OEF:canadian_targets",
          name: "Canadian province emission targets",
          publisher: "OEF",
          published: "2023-05-31T00:00:00.000Z",
          URL: null,
          created: "2023-06-09T20:19:20.326Z",
          last_updated: "2023-06-09T20:19:20.326Z",
        },
      },
      {
        target_id: "C2ES:CA-QC:2050",
        target_type: "Absolute emission reduction",
        baseline_year: 1990,
        baseline_value: null,
        target_year: 2050,
        target_value: "80",
        target_unit: "percent",
        is_net_zero: false,
        percent_achieved: 12.228810176258534,
        percent_achieved_reason: {
          baseline: {
            year: 1990,
            value: 84508702,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          current: {
            year: 2020,
            value: 76241175,
            datasource: {
              datasource_id: "ECCC:GHG_inventory:2022-04-13",
              name: "ECCC Greenhouse Gas Inventory",
              published: "2022-04-13T00:00:00.000Z",
              URL: "https://data.ec.gc.ca/data/substances/monitor/canada-s-official-greenhouse-gas-inventory/A-IPCC-Sector/?lang=en",
            },
          },
          target: {
            value: 16901740.39999999,
          },
        },
        datasource_id: "C2ES:canadian_GHG_targets",
        datasource: {
          datasource_id: "C2ES:canadian_GHG_targets",
          name: "Canadian Provincial GHG Emissions Targets",
          publisher: "C2ES",
          published: "2022-11-13T00:00:00.000Z",
          URL: "https://www.c2es.org/document/canadian-provincial-ghg-emission-targets/",
          created: "2023-03-16T21:08:48.113Z",
          last_updated: "2023-03-16T21:08:48.113Z",
        },
      },
      {
        target_id: "net_zero_tracker:CA-QC:2050",
        target_type: "Climate neutral",
        baseline_year: null,
        baseline_value: null,
        target_year: 2050,
        target_value: null,
        target_unit: null,
        is_net_zero: false,
        percent_achieved: null,
        percent_achieved_reason: null,
        datasource_id: "net_zero_tracker",
        datasource: {
          datasource_id: "net_zero_tracker",
          name: "Net Zero Tracker",
          publisher: "net_zero_tracker",
          published: "2022-01-01T00:00:00.000Z",
          URL: "https://zerotracker.net/",
          created: "2023-03-16T21:11:42.380Z",
          last_updated: "2023-03-16T21:11:42.380Z",
        },
      },
    ],
  },
};

describe("contextual data widget with no data available", () => {
  beforeEach(() => render(<ContextualDataWidget {...NO_DATA_AVAILABLE} />));

  afterEach(cleanup);

  test("does not have the last updated message", () => {
    expect(screen.queryByText(/Last updated in/)).toEqual(null);
  });
});
