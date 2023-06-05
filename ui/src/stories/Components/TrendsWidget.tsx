import React, { FC, useState } from "react";
import style from "./TrendsWidget.module.scss"
import {MdArrowDropDown, MdFilterList, MdLink, MdOpenInNew, MdOutlineFileDownload} from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";
import { readableEmissions } from "../../components/util/units";

interface TrendsWidgetProps {
    data2: object [];
}

const TrendsWidget:FC<TrendsWidgetProps> = ({data2}) => {
    const [openFilterDropdown, setOpenFilterDropdown] = useState<boolean>(false);
    const [activeLine, setActiveLine] = useState('');

    const handleFrilterDropdown = () => {
        if(!openFilterDropdown){
            setOpenFilterDropdown(true)
        } else {
            setOpenFilterDropdown(false)
        }
    }

    let tdata = {
        "emissions": {
            "BP:statistical_review_june2022": {
                "datasource_id": "BP:statistical_review_june2022",
                "name": "Statistical Review of World Energy all data, 1965-2021",
                "publisher": "BP",
                "published": "2022-06-01T00:00:00.000Z",
                "URL": "https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy",
                "tags": [
                    {
                        "tag_id": "CO2_and_CH4",
                        "tag_name": "CO2 and CH4",
                        "created": "2023-02-10T19:20:06.945Z",
                        "last_updated": "2023-02-10T19:20:06.945Z"
                    },
                    {
                        "tag_id": "primary_source",
                        "tag_name": "Primary source: emissions derived from activity data",
                        "created": "2023-02-10T19:20:06.946Z",
                        "last_updated": "2023-02-10T19:20:06.946Z"
                    },
                    {
                        "tag_id": "GHGs_included_CO2_and_CH4",
                        "tag_name": "GHGs included: CO2 and CH4",
                        "created": "2023-03-30T14:37:09.808Z",
                        "last_updated": "2023-03-30T14:37:09.808Z"
                    },
                    {
                        "tag_id": "production_consumption_emissions_energy_processing_and_flaring",
                        "tag_name": "Production and consumption emissions from energy, process emissions, and flaring",
                        "created": "2023-03-30T14:37:09.809Z",
                        "last_updated": "2023-03-30T14:37:09.809Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "BP_review_june2022:CA:2021",
                        "total_emissions": 595422692,
                        "year": 2021,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2020",
                        "total_emissions": 582243625,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2019",
                        "total_emissions": 639321237,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2018",
                        "total_emissions": 642112663,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2017",
                        "total_emissions": 629367080,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2016",
                        "total_emissions": 609108153,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2015",
                        "total_emissions": 626195347,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2014",
                        "total_emissions": 625744460,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2013",
                        "total_emissions": 616126231,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2012",
                        "total_emissions": 600542562,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2011",
                        "total_emissions": 602910481,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2010",
                        "total_emissions": 596705399,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2009",
                        "total_emissions": 580033924,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2008",
                        "total_emissions": 611531537,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2007",
                        "total_emissions": 629267457,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2006",
                        "total_emissions": 602172651,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2005",
                        "total_emissions": 606716964,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2004",
                        "total_emissions": 606658226,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2003",
                        "total_emissions": 608419403,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2002",
                        "total_emissions": 598554929,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2001",
                        "total_emissions": 584936337,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:2000",
                        "total_emissions": 582356560,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1999",
                        "total_emissions": 561177526,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1998",
                        "total_emissions": 557345635,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1997",
                        "total_emissions": 539822962,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1996",
                        "total_emissions": 525159938,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1995",
                        "total_emissions": 515442120,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1994",
                        "total_emissions": 494227768,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1993",
                        "total_emissions": 477188333,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1992",
                        "total_emissions": 479595415,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1991",
                        "total_emissions": 463725716,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "BP_review_june2022:CA:1990",
                        "total_emissions": 480394915,
                        "year": 1990,
                        "tags": []
                    }
                ]
            },
            "PRIMAP:10.5281/zenodo.7179775:v2.4": {
                "datasource_id": "PRIMAP:10.5281/zenodo.7179775:v2.4",
                "name": "PRIMAP-hist CR v2.4",
                "publisher": "PRIMAP",
                "published": "2022-10-17T00:00:00.000Z",
                "URL": "https://doi.org/10.5281/zenodo.7179775",
                "tags": [
                    {
                        "tag_id": "combined_datasets",
                        "tag_name": "Combined datasets",
                        "created": "2023-02-10T20:56:49.605Z",
                        "last_updated": "2023-02-10T20:56:49.605Z"
                    },
                    {
                        "tag_id": "country_or_3rd_party",
                        "tag_name": "Country-reported data or third party",
                        "created": "2023-02-10T20:56:49.605Z",
                        "last_updated": "2023-02-10T20:56:49.605Z"
                    },
                    {
                        "tag_id": "peer_reviewed",
                        "tag_name": "Peer reviewed",
                        "created": "2023-02-10T20:56:49.606Z",
                        "last_updated": "2023-02-10T20:56:49.606Z"
                    },
                    {
                        "tag_id": "GHGs_included_CO2_CH4_N2O_F_gases",
                        "tag_name": "GHGs included: CO2, CH4, N2O, and F-gases",
                        "created": "2023-04-03T14:52:41.151Z",
                        "last_updated": "2023-04-03T14:52:41.151Z"
                    },
                    {
                        "tag_id": "sectors_energy_IPPU_ag_waste_other",
                        "tag_name": "Sectors: energy, IPPU, agriculture, waste, and other",
                        "created": "2023-04-03T14:58:15.218Z",
                        "last_updated": "2023-04-03T14:58:15.218Z"
                    },
                    {
                        "tag_id": "excludes_LULUCF",
                        "tag_name": "Excludes LULUCF",
                        "created": "2023-04-03T14:58:15.219Z",
                        "last_updated": "2023-04-03T14:58:15.219Z"
                    },
                    {
                        "tag_id": "GWP_100_SAR_and_AR4",
                        "tag_name": "Uses GWP100 from IPCC SAR and AR4, depending on the gas",
                        "created": "2023-04-03T14:58:15.220Z",
                        "last_updated": "2023-04-03T14:58:15.220Z"
                    },
                    {
                        "tag_id": "Excludes_international_aviation_shipping",
                        "tag_name": "Excludes emissions from international aviation and shipping",
                        "created": "2023-04-03T14:58:15.221Z",
                        "last_updated": "2023-04-03T14:58:15.221Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2021",
                        "total_emissions": 513000000,
                        "year": 2021,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2020",
                        "total_emissions": 672000000,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2019",
                        "total_emissions": 738000000,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2018",
                        "total_emissions": 743000000,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2017",
                        "total_emissions": 728000000,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2016",
                        "total_emissions": 718000000,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2015",
                        "total_emissions": 736000000,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2014",
                        "total_emissions": 733000000,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2013",
                        "total_emissions": 736000000,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2012",
                        "total_emissions": 730000000,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2011",
                        "total_emissions": 724000000,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2010",
                        "total_emissions": 714000000,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2009",
                        "total_emissions": 701000000,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2008",
                        "total_emissions": 743000000,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2007",
                        "total_emissions": 761000000,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2006",
                        "total_emissions": 739000000,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2005",
                        "total_emissions": 745000000,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2004",
                        "total_emissions": 749000000,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2003",
                        "total_emissions": 747000000,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2002",
                        "total_emissions": 728000000,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2001",
                        "total_emissions": 722000000,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:2000",
                        "total_emissions": 731000000,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1999",
                        "total_emissions": 706000000,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1998",
                        "total_emissions": 693000000,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1997",
                        "total_emissions": 686000000,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1996",
                        "total_emissions": 670000000,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1995",
                        "total_emissions": 649000000,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1994",
                        "total_emissions": 632000000,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1993",
                        "total_emissions": 611000000,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1992",
                        "total_emissions": 609000000,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1991",
                        "total_emissions": 592000000,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1990",
                        "total_emissions": 599000000,
                        "year": 1990,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1989",
                        "total_emissions": 582000000,
                        "year": 1989,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1988",
                        "total_emissions": 571000000,
                        "year": 1988,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1987",
                        "total_emissions": 547000000,
                        "year": 1987,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1986",
                        "total_emissions": 520000000,
                        "year": 1986,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1985",
                        "total_emissions": 541000000,
                        "year": 1985,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1984",
                        "total_emissions": 543000000,
                        "year": 1984,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1983",
                        "total_emissions": 519000000,
                        "year": 1983,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1982",
                        "total_emissions": 521000000,
                        "year": 1982,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1981",
                        "total_emissions": 542000000,
                        "year": 1981,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1980",
                        "total_emissions": 553000000,
                        "year": 1980,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1979",
                        "total_emissions": 554000000,
                        "year": 1979,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1978",
                        "total_emissions": 526000000,
                        "year": 1978,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1977",
                        "total_emissions": 517000000,
                        "year": 1977,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1976",
                        "total_emissions": 504000000,
                        "year": 1976,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1975",
                        "total_emissions": 506000000,
                        "year": 1975,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1974",
                        "total_emissions": 505000000,
                        "year": 1974,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1973",
                        "total_emissions": 500000000,
                        "year": 1973,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1972",
                        "total_emissions": 491000000,
                        "year": 1972,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1971",
                        "total_emissions": 461000000,
                        "year": 1971,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1970",
                        "total_emissions": 451000000,
                        "year": 1970,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1969",
                        "total_emissions": 422000000,
                        "year": 1969,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1968",
                        "total_emissions": 417000000,
                        "year": 1968,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1967",
                        "total_emissions": 391000000,
                        "year": 1967,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1966",
                        "total_emissions": 364000000,
                        "year": 1966,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1965",
                        "total_emissions": 356000000,
                        "year": 1965,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1964",
                        "total_emissions": 337000000,
                        "year": 1964,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1963",
                        "total_emissions": 305000000,
                        "year": 1963,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1962",
                        "total_emissions": 298000000,
                        "year": 1962,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1961",
                        "total_emissions": 282000000,
                        "year": 1961,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1960",
                        "total_emissions": 281000000,
                        "year": 1960,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1959",
                        "total_emissions": 271000000,
                        "year": 1959,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1958",
                        "total_emissions": 265000000,
                        "year": 1958,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1957",
                        "total_emissions": 264000000,
                        "year": 1957,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1956",
                        "total_emissions": 272000000,
                        "year": 1956,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1955",
                        "total_emissions": 248000000,
                        "year": 1955,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1954",
                        "total_emissions": 242000000,
                        "year": 1954,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1953",
                        "total_emissions": 235000000,
                        "year": 1953,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1952",
                        "total_emissions": 234000000,
                        "year": 1952,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1951",
                        "total_emissions": 235000000,
                        "year": 1951,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1950",
                        "total_emissions": 223000000,
                        "year": 1950,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1949",
                        "total_emissions": 212000000,
                        "year": 1949,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1948",
                        "total_emissions": 225000000,
                        "year": 1948,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1947",
                        "total_emissions": 205000000,
                        "year": 1947,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1946",
                        "total_emissions": 197000000,
                        "year": 1946,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1945",
                        "total_emissions": 185000000,
                        "year": 1945,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1944",
                        "total_emissions": 193000000,
                        "year": 1944,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1943",
                        "total_emissions": 189000000,
                        "year": 1943,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1942",
                        "total_emissions": 180000000,
                        "year": 1942,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1941",
                        "total_emissions": 167000000,
                        "year": 1941,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1940",
                        "total_emissions": 154000000,
                        "year": 1940,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1939",
                        "total_emissions": 139000000,
                        "year": 1939,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1938",
                        "total_emissions": 128000000,
                        "year": 1938,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1937",
                        "total_emissions": 136000000,
                        "year": 1937,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1936",
                        "total_emissions": 128000000,
                        "year": 1936,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1935",
                        "total_emissions": 120000000,
                        "year": 1935,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1934",
                        "total_emissions": 121000000,
                        "year": 1934,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1933",
                        "total_emissions": 109000000,
                        "year": 1933,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1932",
                        "total_emissions": 110000000,
                        "year": 1932,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1931",
                        "total_emissions": 116000000,
                        "year": 1931,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1930",
                        "total_emissions": 136000000,
                        "year": 1930,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1929",
                        "total_emissions": 140000000,
                        "year": 1929,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1928",
                        "total_emissions": 134000000,
                        "year": 1928,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1927",
                        "total_emissions": 132000000,
                        "year": 1927,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1926",
                        "total_emissions": 123000000,
                        "year": 1926,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1925",
                        "total_emissions": 113000000,
                        "year": 1925,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1924",
                        "total_emissions": 115000000,
                        "year": 1924,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1923",
                        "total_emissions": 131000000,
                        "year": 1923,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1922",
                        "total_emissions": 105000000,
                        "year": 1922,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1921",
                        "total_emissions": 117000000,
                        "year": 1921,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1920",
                        "total_emissions": 121000000,
                        "year": 1920,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1919",
                        "total_emissions": 111000000,
                        "year": 1919,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1918",
                        "total_emissions": 125000000,
                        "year": 1918,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1917",
                        "total_emissions": 121000000,
                        "year": 1917,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1916",
                        "total_emissions": 111000000,
                        "year": 1916,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1915",
                        "total_emissions": 94500000,
                        "year": 1915,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1914",
                        "total_emissions": 102000000,
                        "year": 1914,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1913",
                        "total_emissions": 113000000,
                        "year": 1913,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1912",
                        "total_emissions": 99900000,
                        "year": 1912,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1911",
                        "total_emissions": 92000000,
                        "year": 1911,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1910",
                        "total_emissions": 82300000,
                        "year": 1910,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1909",
                        "total_emissions": 75100000,
                        "year": 1909,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1908",
                        "total_emissions": 76800000,
                        "year": 1908,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1907",
                        "total_emissions": 75800000,
                        "year": 1907,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1906",
                        "total_emissions": 64700000,
                        "year": 1906,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1905",
                        "total_emissions": 62200000,
                        "year": 1905,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1904",
                        "total_emissions": 59200000,
                        "year": 1904,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1903",
                        "total_emissions": 53100000,
                        "year": 1903,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1902",
                        "total_emissions": 50100000,
                        "year": 1902,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1901",
                        "total_emissions": 47700000,
                        "year": 1901,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1900",
                        "total_emissions": 43900000,
                        "year": 1900,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1899",
                        "total_emissions": 42100000,
                        "year": 1899,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1898",
                        "total_emissions": 38200000,
                        "year": 1898,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1897",
                        "total_emissions": 37100000,
                        "year": 1897,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1896",
                        "total_emissions": 36700000,
                        "year": 1896,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1895",
                        "total_emissions": 35400000,
                        "year": 1895,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1894",
                        "total_emissions": 35900000,
                        "year": 1894,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1893",
                        "total_emissions": 36500000,
                        "year": 1893,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1892",
                        "total_emissions": 35300000,
                        "year": 1892,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1891",
                        "total_emissions": 35200000,
                        "year": 1891,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1890",
                        "total_emissions": 33400000,
                        "year": 1890,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1889",
                        "total_emissions": 31900000,
                        "year": 1889,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1888",
                        "total_emissions": 33900000,
                        "year": 1888,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1887",
                        "total_emissions": 30400000,
                        "year": 1887,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1886",
                        "total_emissions": 28800000,
                        "year": 1886,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1885",
                        "total_emissions": 28100000,
                        "year": 1885,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1884",
                        "total_emissions": 28300000,
                        "year": 1884,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1883",
                        "total_emissions": 26900000,
                        "year": 1883,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1882",
                        "total_emissions": 25900000,
                        "year": 1882,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1881",
                        "total_emissions": 24600000,
                        "year": 1881,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1880",
                        "total_emissions": 24000000,
                        "year": 1880,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1879",
                        "total_emissions": 20500000,
                        "year": 1879,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1878",
                        "total_emissions": 20000000,
                        "year": 1878,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1877",
                        "total_emissions": 19800000,
                        "year": 1877,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1876",
                        "total_emissions": 19300000,
                        "year": 1876,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1875",
                        "total_emissions": 19000000,
                        "year": 1875,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1874",
                        "total_emissions": 18400000,
                        "year": 1874,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1873",
                        "total_emissions": 18100000,
                        "year": 1873,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1872",
                        "total_emissions": 18000000,
                        "year": 1872,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1871",
                        "total_emissions": 17700000,
                        "year": 1871,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1870",
                        "total_emissions": 17000000,
                        "year": 1870,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1869",
                        "total_emissions": 15900000,
                        "year": 1869,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1868",
                        "total_emissions": 16100000,
                        "year": 1868,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1867",
                        "total_emissions": 16600000,
                        "year": 1867,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1866",
                        "total_emissions": 17400000,
                        "year": 1866,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1865",
                        "total_emissions": 15800000,
                        "year": 1865,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1864",
                        "total_emissions": 15500000,
                        "year": 1864,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1863",
                        "total_emissions": 15200000,
                        "year": 1863,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1862",
                        "total_emissions": 14900000,
                        "year": 1862,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1861",
                        "total_emissions": 14700000,
                        "year": 1861,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1860",
                        "total_emissions": 14900000,
                        "year": 1860,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1859",
                        "total_emissions": 14400000,
                        "year": 1859,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1858",
                        "total_emissions": 14000000,
                        "year": 1858,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1857",
                        "total_emissions": 13500000,
                        "year": 1857,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1856",
                        "total_emissions": 13100000,
                        "year": 1856,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1855",
                        "total_emissions": 12700000,
                        "year": 1855,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1854",
                        "total_emissions": 12300000,
                        "year": 1854,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1853",
                        "total_emissions": 11900000,
                        "year": 1853,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1852",
                        "total_emissions": 11600000,
                        "year": 1852,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1851",
                        "total_emissions": 11300000,
                        "year": 1851,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1850",
                        "total_emissions": 11300000,
                        "year": 1850,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1849",
                        "total_emissions": 10200000,
                        "year": 1849,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1848",
                        "total_emissions": 9870000,
                        "year": 1848,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1847",
                        "total_emissions": 9540000,
                        "year": 1847,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1846",
                        "total_emissions": 9210000,
                        "year": 1846,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1845",
                        "total_emissions": 8770000,
                        "year": 1845,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1844",
                        "total_emissions": 8490000,
                        "year": 1844,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1843",
                        "total_emissions": 8210000,
                        "year": 1843,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1842",
                        "total_emissions": 7940000,
                        "year": 1842,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1841",
                        "total_emissions": 7660000,
                        "year": 1841,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1840",
                        "total_emissions": 7380000,
                        "year": 1840,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1839",
                        "total_emissions": 7190000,
                        "year": 1839,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1838",
                        "total_emissions": 7000000,
                        "year": 1838,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1837",
                        "total_emissions": 6810000,
                        "year": 1837,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1836",
                        "total_emissions": 6620000,
                        "year": 1836,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1835",
                        "total_emissions": 6430000,
                        "year": 1835,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1834",
                        "total_emissions": 6240000,
                        "year": 1834,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1833",
                        "total_emissions": 6050000,
                        "year": 1833,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1832",
                        "total_emissions": 5850000,
                        "year": 1832,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1831",
                        "total_emissions": 5660000,
                        "year": 1831,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1830",
                        "total_emissions": 5470000,
                        "year": 1830,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1829",
                        "total_emissions": 5330000,
                        "year": 1829,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1828",
                        "total_emissions": 5190000,
                        "year": 1828,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1827",
                        "total_emissions": 5050000,
                        "year": 1827,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1826",
                        "total_emissions": 4910000,
                        "year": 1826,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1825",
                        "total_emissions": 4780000,
                        "year": 1825,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1824",
                        "total_emissions": 4640000,
                        "year": 1824,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1823",
                        "total_emissions": 4500000,
                        "year": 1823,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1822",
                        "total_emissions": 4360000,
                        "year": 1822,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1821",
                        "total_emissions": 4220000,
                        "year": 1821,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1820",
                        "total_emissions": 4080000,
                        "year": 1820,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1819",
                        "total_emissions": 3980000,
                        "year": 1819,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1818",
                        "total_emissions": 3870000,
                        "year": 1818,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1817",
                        "total_emissions": 3770000,
                        "year": 1817,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1816",
                        "total_emissions": 3670000,
                        "year": 1816,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1815",
                        "total_emissions": 3570000,
                        "year": 1815,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1814",
                        "total_emissions": 3460000,
                        "year": 1814,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1813",
                        "total_emissions": 3360000,
                        "year": 1813,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1812",
                        "total_emissions": 3260000,
                        "year": 1812,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1811",
                        "total_emissions": 3150000,
                        "year": 1811,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1810",
                        "total_emissions": 3050000,
                        "year": 1810,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1809",
                        "total_emissions": 3010000,
                        "year": 1809,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1808",
                        "total_emissions": 2960000,
                        "year": 1808,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1807",
                        "total_emissions": 2910000,
                        "year": 1807,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1806",
                        "total_emissions": 2870000,
                        "year": 1806,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1805",
                        "total_emissions": 2820000,
                        "year": 1805,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1804",
                        "total_emissions": 2770000,
                        "year": 1804,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1803",
                        "total_emissions": 2730000,
                        "year": 1803,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1802",
                        "total_emissions": 2680000,
                        "year": 1802,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1801",
                        "total_emissions": 2630000,
                        "year": 1801,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1800",
                        "total_emissions": 2580000,
                        "year": 1800,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1799",
                        "total_emissions": 2540000,
                        "year": 1799,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1798",
                        "total_emissions": 2500000,
                        "year": 1798,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1797",
                        "total_emissions": 2460000,
                        "year": 1797,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1796",
                        "total_emissions": 2420000,
                        "year": 1796,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1795",
                        "total_emissions": 2380000,
                        "year": 1795,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1794",
                        "total_emissions": 2340000,
                        "year": 1794,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1793",
                        "total_emissions": 2300000,
                        "year": 1793,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1792",
                        "total_emissions": 2260000,
                        "year": 1792,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1791",
                        "total_emissions": 2220000,
                        "year": 1791,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1790",
                        "total_emissions": 2180000,
                        "year": 1790,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1789",
                        "total_emissions": 2140000,
                        "year": 1789,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1788",
                        "total_emissions": 2110000,
                        "year": 1788,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1787",
                        "total_emissions": 2070000,
                        "year": 1787,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1786",
                        "total_emissions": 2040000,
                        "year": 1786,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1785",
                        "total_emissions": 2000000,
                        "year": 1785,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1784",
                        "total_emissions": 1940000,
                        "year": 1784,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1783",
                        "total_emissions": 1900000,
                        "year": 1783,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1782",
                        "total_emissions": 1870000,
                        "year": 1782,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1781",
                        "total_emissions": 1830000,
                        "year": 1781,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1780",
                        "total_emissions": 1790000,
                        "year": 1780,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1779",
                        "total_emissions": 1760000,
                        "year": 1779,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1778",
                        "total_emissions": 1730000,
                        "year": 1778,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1777",
                        "total_emissions": 1700000,
                        "year": 1777,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1776",
                        "total_emissions": 1670000,
                        "year": 1776,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1775",
                        "total_emissions": 1640000,
                        "year": 1775,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1774",
                        "total_emissions": 1600000,
                        "year": 1774,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1773",
                        "total_emissions": 1570000,
                        "year": 1773,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1772",
                        "total_emissions": 1540000,
                        "year": 1772,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1771",
                        "total_emissions": 1510000,
                        "year": 1771,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1770",
                        "total_emissions": 1480000,
                        "year": 1770,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1769",
                        "total_emissions": 1450000,
                        "year": 1769,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1768",
                        "total_emissions": 1420000,
                        "year": 1768,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1767",
                        "total_emissions": 1390000,
                        "year": 1767,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1766",
                        "total_emissions": 1360000,
                        "year": 1766,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1765",
                        "total_emissions": 1340000,
                        "year": 1765,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1764",
                        "total_emissions": 1310000,
                        "year": 1764,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1763",
                        "total_emissions": 1280000,
                        "year": 1763,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1762",
                        "total_emissions": 1250000,
                        "year": 1762,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1761",
                        "total_emissions": 1220000,
                        "year": 1761,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1760",
                        "total_emissions": 1190000,
                        "year": 1760,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1759",
                        "total_emissions": 1170000,
                        "year": 1759,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1758",
                        "total_emissions": 1140000,
                        "year": 1758,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1757",
                        "total_emissions": 1120000,
                        "year": 1757,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1756",
                        "total_emissions": 1090000,
                        "year": 1756,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1755",
                        "total_emissions": 1070000,
                        "year": 1755,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1754",
                        "total_emissions": 1040000,
                        "year": 1754,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1753",
                        "total_emissions": 1010000,
                        "year": 1753,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1752",
                        "total_emissions": 988000,
                        "year": 1752,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1751",
                        "total_emissions": 962000,
                        "year": 1751,
                        "tags": []
                    },
                    {
                        "emissions_id": "PRIMAP-hist_v2.4_ne:CA:1750",
                        "total_emissions": 936000,
                        "year": 1750,
                        "tags": []
                    }
                ]
            },
            "EDGARv7.0:ghg": {
                "datasource_id": "EDGARv7.0:ghg",
                "name": "Emissions Database for Global Atmospheric Research version 7.0",
                "publisher": "JRC",
                "published": "2022-01-01T00:00:00.000Z",
                "URL": "https://edgar.jrc.ec.europa.eu/dataset_ghg70",
                "tags": [
                    {
                        "tag_id": "GHGs_included_fossil_CO2_CH4_N2O_F_gases",
                        "tag_name": "GHGs included: Fossil CO2, CH4, N2O, and F-gases",
                        "created": "2023-03-29T23:33:30.904Z",
                        "last_updated": "2023-03-29T23:33:30.904Z"
                    },
                    {
                        "tag_id": "GWP_100_AR4",
                        "tag_name": "Uses GWP100 from IPCC AR6",
                        "created": "2023-03-29T23:33:30.905Z",
                        "last_updated": "2023-05-31T16:48:24.050Z"
                    },
                    {
                        "tag_id": "Sectors_included_in_EDGARv7",
                        "tag_name": "Sectors: power, buildings, transport, industrial combustion, industrial process emissions, agricultural soils, and waste",
                        "created": "2023-03-29T23:33:30.906Z",
                        "last_updated": "2023-03-29T23:33:30.906Z"
                    },
                    {
                        "tag_id": "excludes_LULUCF_and_biomass_burning",
                        "tag_name": "Large scale biomass burning and LULUCF are excluded",
                        "created": "2023-03-29T23:33:30.907Z",
                        "last_updated": "2023-03-29T23:33:30.907Z"
                    },
                    {
                        "tag_id": "activity_data_and_other_sources",
                        "tag_name": "Emissions derived from activity data and other datasets",
                        "created": "2023-02-10T20:57:10.367Z",
                        "last_updated": "2023-02-10T20:57:10.367Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2021",
                        "total_emissions": 713928593,
                        "year": 2021,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2020",
                        "total_emissions": 698802693,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2019",
                        "total_emissions": 758118023,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2018",
                        "total_emissions": 759560772,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2017",
                        "total_emissions": 743890457,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2016",
                        "total_emissions": 733452613,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2015",
                        "total_emissions": 734809433,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2014",
                        "total_emissions": 735791840,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2013",
                        "total_emissions": 726389523,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2012",
                        "total_emissions": 713272028,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2011",
                        "total_emissions": 712019024,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2010",
                        "total_emissions": 697652798,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2009",
                        "total_emissions": 683013582,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2008",
                        "total_emissions": 720558958,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2007",
                        "total_emissions": 744872695,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2006",
                        "total_emissions": 712988077,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2005",
                        "total_emissions": 719596070,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2004",
                        "total_emissions": 709936545,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2003",
                        "total_emissions": 715181348,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2002",
                        "total_emissions": 695713166,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2001",
                        "total_emissions": 674884741,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:2000",
                        "total_emissions": 683332853,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1999",
                        "total_emissions": 660676627,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1998",
                        "total_emissions": 650066475,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1997",
                        "total_emissions": 647505324,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1996",
                        "total_emissions": 631865844,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1995",
                        "total_emissions": 612686643,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1994",
                        "total_emissions": 595167355,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1993",
                        "total_emissions": 571858842,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1992",
                        "total_emissions": 569578019,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1991",
                        "total_emissions": 554444595,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1990",
                        "total_emissions": 559761984,
                        "year": 1990,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1989",
                        "total_emissions": 591521598,
                        "year": 1989,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1988",
                        "total_emissions": 571407001,
                        "year": 1988,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1987",
                        "total_emissions": 538122686,
                        "year": 1987,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1986",
                        "total_emissions": 525028037,
                        "year": 1986,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1985",
                        "total_emissions": 539825723,
                        "year": 1985,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1984",
                        "total_emissions": 538766319,
                        "year": 1984,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1983",
                        "total_emissions": 515078062,
                        "year": 1983,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1982",
                        "total_emissions": 516887973,
                        "year": 1982,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1981",
                        "total_emissions": 540779769,
                        "year": 1981,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1980",
                        "total_emissions": 560523990,
                        "year": 1980,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1979",
                        "total_emissions": 555736639,
                        "year": 1979,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1978",
                        "total_emissions": 535709422,
                        "year": 1978,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1977",
                        "total_emissions": 531141824,
                        "year": 1977,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1976",
                        "total_emissions": 515427301,
                        "year": 1976,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1975",
                        "total_emissions": 502814377,
                        "year": 1975,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1974",
                        "total_emissions": 514397315,
                        "year": 1974,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1973",
                        "total_emissions": 506239492,
                        "year": 1973,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1972",
                        "total_emissions": 481173732,
                        "year": 1972,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1971",
                        "total_emissions": 457974374,
                        "year": 1971,
                        "tags": []
                    },
                    {
                        "emissions_id": "EDGARv7.0:ghg:CA:1970",
                        "total_emissions": 449059192,
                        "year": 1970,
                        "tags": []
                    }
                ]
            },
            "IEA:GHG_energy_highlights:2022": {
                "datasource_id": "IEA:GHG_energy_highlights:2022",
                "name": "Greenhouse Gas Emissions from Energy Highlights",
                "publisher": "IEA",
                "published": "2022-09-01T00:00:00.000Z",
                "URL": "https://www.iea.org/data-and-statistics/data-product/greenhouse-gas-emissions-from-energy-highlights",
                "tags": [
                    {
                        "tag_id": "energy_related_ghg",
                        "tag_name": "Energy related greenhouse gas emissions",
                        "created": "2023-04-04T09:14:59.146Z",
                        "last_updated": "2023-04-04T09:14:59.146Z"
                    },
                    {
                        "tag_id": "GHGs_included_CO2_CH4_N2O",
                        "tag_name": "GHGs included: CO2, CH4, and N2O",
                        "created": "2023-03-16T23:57:21.056Z",
                        "last_updated": "2023-03-16T23:57:21.056Z"
                    },
                    {
                        "tag_id": "includes_fugitive_emissions",
                        "tag_name": "Includes fugitive emissions",
                        "created": "2023-04-04T09:14:59.148Z",
                        "last_updated": "2023-04-04T09:14:59.148Z"
                    },
                    {
                        "tag_id": "GWP_100_AR4",
                        "tag_name": "Uses GWP100 from IPCC AR6",
                        "created": "2023-03-29T23:33:30.905Z",
                        "last_updated": "2023-05-31T16:48:24.050Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2021",
                        "total_emissions": 596799168,
                        "year": 2021,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2020",
                        "total_emissions": 573389332,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2019",
                        "total_emissions": 625540757,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2018",
                        "total_emissions": 639874886,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2017",
                        "total_emissions": 625533690,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2016",
                        "total_emissions": 611139714,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2015",
                        "total_emissions": 610496085,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2014",
                        "total_emissions": 613062818,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2013",
                        "total_emissions": 603963679,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2012",
                        "total_emissions": 591505980,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2011",
                        "total_emissions": 594541707,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2010",
                        "total_emissions": 580126419,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2009",
                        "total_emissions": 563365262,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2008",
                        "total_emissions": 592766276,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2007",
                        "total_emissions": 614554583,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2006",
                        "total_emissions": 582520310,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2005",
                        "total_emissions": 589185135,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2004",
                        "total_emissions": 576731763,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2003",
                        "total_emissions": 584215503,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2002",
                        "total_emissions": 563292142,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2001",
                        "total_emissions": 545006660,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:2000",
                        "total_emissions": 551809387,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1999",
                        "total_emissions": 530747767,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1998",
                        "total_emissions": 521385042,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1997",
                        "total_emissions": 512146348,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1996",
                        "total_emissions": 496348958,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1995",
                        "total_emissions": 481157380,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1994",
                        "total_emissions": 468788913,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1993",
                        "total_emissions": 453145799,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1992",
                        "total_emissions": 455922307,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1991",
                        "total_emissions": 441170776,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1990",
                        "total_emissions": 445355540,
                        "year": 1990,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1989",
                        "total_emissions": 477953334,
                        "year": 1989,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1988",
                        "total_emissions": 462829328,
                        "year": 1988,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1987",
                        "total_emissions": 430685945,
                        "year": 1987,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1986",
                        "total_emissions": 418577479,
                        "year": 1986,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1985",
                        "total_emissions": 427176534,
                        "year": 1985,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1984",
                        "total_emissions": 425649888,
                        "year": 1984,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1983",
                        "total_emissions": 406930677,
                        "year": 1983,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1982",
                        "total_emissions": 413818041,
                        "year": 1982,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1981",
                        "total_emissions": 430877155,
                        "year": 1981,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1980",
                        "total_emissions": 451560606,
                        "year": 1980,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1979",
                        "total_emissions": 446090629,
                        "year": 1979,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1978",
                        "total_emissions": 429323135,
                        "year": 1978,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1977",
                        "total_emissions": 427658482,
                        "year": 1977,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1976",
                        "total_emissions": 414788401,
                        "year": 1976,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1975",
                        "total_emissions": 403576141,
                        "year": 1975,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1974",
                        "total_emissions": 412667571,
                        "year": 1974,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1973",
                        "total_emissions": 404161676,
                        "year": 1973,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1972",
                        "total_emissions": 385114115,
                        "year": 1972,
                        "tags": []
                    },
                    {
                        "emissions_id": "IEA_GHG_energy:CA:1971",
                        "total_emissions": 365923949,
                        "year": 1971,
                        "tags": []
                    }
                ]
            },
            "UNFCCC:GHG_ANNEX1:2019-11-08": {
                "datasource_id": "UNFCCC:GHG_ANNEX1:2019-11-08",
                "name": "UNFCCC GHG total without LULUCF, ANNEX I countries",
                "publisher": "UNFCCC",
                "published": "2019-11-08T00:00:00.000Z",
                "URL": "https://di.unfccc.int/time_series",
                "tags": [
                    {
                        "tag_id": "country_reported_data",
                        "tag_name": "Country-reported data",
                        "created": "2023-02-10T19:20:14.670Z",
                        "last_updated": "2023-02-10T19:20:14.670Z"
                    },
                    {
                        "tag_id": "3d_party_validated",
                        "tag_name": "Third party validated",
                        "created": "2023-02-10T20:57:05.415Z",
                        "last_updated": "2023-02-10T20:57:05.415Z"
                    },
                    {
                        "tag_id": "excludes_LULUCF",
                        "tag_name": "Excludes LULUCF",
                        "created": "2023-04-03T14:58:15.219Z",
                        "last_updated": "2023-04-03T14:58:15.219Z"
                    },
                    {
                        "tag_id": "GHGs_included_CO2_CH4_N2O_F_gases",
                        "tag_name": "GHGs included: CO2, CH4, N2O, and F-gases",
                        "created": "2023-04-03T14:52:41.151Z",
                        "last_updated": "2023-04-03T14:52:41.151Z"
                    },
                    {
                        "tag_id": "Sectors_energy_IPPU_agriculture_waste_other",
                        "tag_name": "Sectors: energy, IPPU, agriculture, waste, and other",
                        "created": "2023-04-03T14:59:22.644Z",
                        "last_updated": "2023-04-03T14:59:22.644Z"
                    },
                    {
                        "tag_id": "GWP_100_AR4",
                        "tag_name": "Uses GWP100 from IPCC AR6",
                        "created": "2023-03-29T23:33:30.905Z",
                        "last_updated": "2023-05-31T16:48:24.050Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2020",
                        "total_emissions": 672354021,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2019",
                        "total_emissions": 738283446,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2018",
                        "total_emissions": 740006269,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2017",
                        "total_emissions": 725015646,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2016",
                        "total_emissions": 715095857,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2015",
                        "total_emissions": 732536872,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2014",
                        "total_emissions": 729599783,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2013",
                        "total_emissions": 732162301,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2012",
                        "total_emissions": 725587101,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2011",
                        "total_emissions": 720820930,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2010",
                        "total_emissions": 709654060,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2009",
                        "total_emissions": 697734944,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2008",
                        "total_emissions": 739063151,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2007",
                        "total_emissions": 756833258,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2006",
                        "total_emissions": 734586990,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2005",
                        "total_emissions": 741182843,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2004",
                        "total_emissions": 745194047,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2003",
                        "total_emissions": 743286854,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2002",
                        "total_emissions": 724281129,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2001",
                        "total_emissions": 718320043,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:2000",
                        "total_emissions": 726987282,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1999",
                        "total_emissions": 701758711,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1998",
                        "total_emissions": 688613931,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1997",
                        "total_emissions": 682298998,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1996",
                        "total_emissions": 666701910,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1995",
                        "total_emissions": 645455296,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1994",
                        "total_emissions": 628145869,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1993",
                        "total_emissions": 607681076,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1992",
                        "total_emissions": 605290248,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1991",
                        "total_emissions": 587905793,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "UNFCCC-annex1-GHG:CA:1990",
                        "total_emissions": 594722243,
                        "year": 1990,
                        "tags": []
                    }
                ]
            },
            "GCB2022:national_fossil_emissions:v1.0": {
                "datasource_id": "GCB2022:national_fossil_emissions:v1.0",
                "name": "Data supplement to the Global Carbon Budget 2022: National Fossil Carbon Emissions 2022 v1.0",
                "publisher": "GCP",
                "published": "2022-11-04T00:00:00.000Z",
                "URL": "https://doi.org/10.18160/gcp-2022",
                "tags": [
                    {
                        "tag_id": "fossil_co2",
                        "tag_name": "Fossil CO2",
                        "created": "2023-02-10T19:34:07.233Z",
                        "last_updated": "2023-02-10T19:34:07.233Z"
                    },
                    {
                        "tag_id": "GHGs_included_fossil_co2",
                        "tag_name": "GHGs included: Fossil CO2",
                        "created": "2023-03-30T23:17:26.118Z",
                        "last_updated": "2023-03-30T23:17:26.118Z"
                    },
                    {
                        "tag_id": "territorial_emissions",
                        "tag_name": "Territorial emissions",
                        "created": "2023-03-30T23:17:26.119Z",
                        "last_updated": "2023-03-30T23:17:26.119Z"
                    },
                    {
                        "tag_id": "includes_ff_combustion_oxidation_cement",
                        "tag_name": "Include emissions from fossil fuel combustion and oxidation and cement production",
                        "created": "2023-03-30T23:17:26.120Z",
                        "last_updated": "2023-03-30T23:17:26.120Z"
                    },
                    {
                        "tag_id": "exlucded_bunker_fuels",
                        "tag_name": "Excludes emissions from bunker fuels",
                        "created": "2023-03-30T23:17:26.121Z",
                        "last_updated": "2023-03-30T23:17:26.121Z"
                    },
                    {
                        "tag_id": "disaggreation_emissions_GCB2022",
                        "tag_name": "The disaggregations of regions (e.g. the former Soviet Union prior to 1992) are based on the shares of emissions in the first year after the countries are disaggregated (e.g., 1992 for the Former Soviet Union)",
                        "created": "2023-03-30T23:17:26.122Z",
                        "last_updated": "2023-03-30T23:17:26.122Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "GCB2022:CA:2021",
                        "total_emissions": 545634517,
                        "year": 2021,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2020",
                        "total_emissions": 534863824,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2019",
                        "total_emissions": 584714183,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2018",
                        "total_emissions": 584369116,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2017",
                        "total_emissions": 571544619,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2016",
                        "total_emissions": 560525313,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2015",
                        "total_emissions": 574298190,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2014",
                        "total_emissions": 569839687,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2013",
                        "total_emissions": 572613310,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2012",
                        "total_emissions": 568223147,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2011",
                        "total_emissions": 567054132,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2010",
                        "total_emissions": 556560517,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2009",
                        "total_emissions": 543967589,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2008",
                        "total_emissions": 576558336,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2007",
                        "total_emissions": 593515763,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2006",
                        "total_emissions": 568450936,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2005",
                        "total_emissions": 574653628,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2004",
                        "total_emissions": 579592043,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2003",
                        "total_emissions": 581305319,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2002",
                        "total_emissions": 564050930,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2001",
                        "total_emissions": 558777507,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:2000",
                        "total_emissions": 566690446,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1999",
                        "total_emissions": 544063779,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1998",
                        "total_emissions": 529649542,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1997",
                        "total_emissions": 521839964,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1996",
                        "total_emissions": 507510733,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1995",
                        "total_emissions": 491386794,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1994",
                        "total_emissions": 478726313,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1993",
                        "total_emissions": 464311598,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1992",
                        "total_emissions": 463758640,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1991",
                        "total_emissions": 449959720,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1990",
                        "total_emissions": 458218335,
                        "year": 1990,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1989",
                        "total_emissions": 462885149,
                        "year": 1989,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1988",
                        "total_emissions": 455669110,
                        "year": 1988,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1987",
                        "total_emissions": 430982058,
                        "year": 1987,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1986",
                        "total_emissions": 404707949,
                        "year": 1986,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1985",
                        "total_emissions": 421718695,
                        "year": 1985,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1984",
                        "total_emissions": 425233330,
                        "year": 1984,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1983",
                        "total_emissions": 408338502,
                        "year": 1983,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1982",
                        "total_emissions": 414454925,
                        "year": 1982,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1981",
                        "total_emissions": 429629720,
                        "year": 1981,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1980",
                        "total_emissions": 442846873,
                        "year": 1980,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1979",
                        "total_emissions": 441676761,
                        "year": 1979,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1978",
                        "total_emissions": 415528652,
                        "year": 1978,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1977",
                        "total_emissions": 407790442,
                        "year": 1977,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1976",
                        "total_emissions": 398962262,
                        "year": 1976,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1975",
                        "total_emissions": 396786785,
                        "year": 1975,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1974",
                        "total_emissions": 389616915,
                        "year": 1974,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1973",
                        "total_emissions": 381273197,
                        "year": 1973,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1972",
                        "total_emissions": 380791685,
                        "year": 1972,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1971",
                        "total_emissions": 352287403,
                        "year": 1971,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1970",
                        "total_emissions": 341177214,
                        "year": 1970,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1969",
                        "total_emissions": 307119205,
                        "year": 1969,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1968",
                        "total_emissions": 303261339,
                        "year": 1968,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1967",
                        "total_emissions": 281637036,
                        "year": 1967,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1966",
                        "total_emissions": 259074370,
                        "year": 1966,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1965",
                        "total_emissions": 251916994,
                        "year": 1965,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1964",
                        "total_emissions": 237577733,
                        "year": 1964,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1963",
                        "total_emissions": 210910775,
                        "year": 1963,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1962",
                        "total_emissions": 206990771,
                        "year": 1962,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1961",
                        "total_emissions": 194000693,
                        "year": 1961,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1960",
                        "total_emissions": 192716174,
                        "year": 1960,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1959",
                        "total_emissions": 184481354,
                        "year": 1959,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1958",
                        "total_emissions": 182155189,
                        "year": 1958,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1957",
                        "total_emissions": 182811431,
                        "year": 1957,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1956",
                        "total_emissions": 189802424,
                        "year": 1956,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1955",
                        "total_emissions": 169473176,
                        "year": 1955,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1954",
                        "total_emissions": 162967665,
                        "year": 1954,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1953",
                        "total_emissions": 160608168,
                        "year": 1953,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1952",
                        "total_emissions": 159408753,
                        "year": 1952,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1951",
                        "total_emissions": 162678022,
                        "year": 1951,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1950",
                        "total_emissions": 154133752,
                        "year": 1950,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1949",
                        "total_emissions": 145021889,
                        "year": 1949,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1948",
                        "total_emissions": 158506568,
                        "year": 1948,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1947",
                        "total_emissions": 143547853,
                        "year": 1947,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1946",
                        "total_emissions": 138422155,
                        "year": 1946,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1945",
                        "total_emissions": 130520897,
                        "year": 1945,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1944",
                        "total_emissions": 140407201,
                        "year": 1944,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1943",
                        "total_emissions": 138062153,
                        "year": 1943,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1942",
                        "total_emissions": 131077409,
                        "year": 1942,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1941",
                        "total_emissions": 120151837,
                        "year": 1941,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1940",
                        "total_emissions": 108621764,
                        "year": 1940,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1939",
                        "total_emissions": 95003835,
                        "year": 1939,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1938",
                        "total_emissions": 85543535,
                        "year": 1938,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1937",
                        "total_emissions": 93483007,
                        "year": 1937,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1936",
                        "total_emissions": 86163108,
                        "year": 1936,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1935",
                        "total_emissions": 78795755,
                        "year": 1935,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1934",
                        "total_emissions": 79913275,
                        "year": 1934,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1933",
                        "total_emissions": 69482550,
                        "year": 1933,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1932",
                        "total_emissions": 70206596,
                        "year": 1932,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1931",
                        "total_emissions": 75849254,
                        "year": 1931,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1930",
                        "total_emissions": 94347750,
                        "year": 1930,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1929",
                        "total_emissions": 99030045,
                        "year": 1929,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1928",
                        "total_emissions": 93776641,
                        "year": 1928,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1927",
                        "total_emissions": 91999376,
                        "year": 1927,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1926",
                        "total_emissions": 84755648,
                        "year": 1926,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1925",
                        "total_emissions": 75247568,
                        "year": 1925,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1924",
                        "total_emissions": 77383680,
                        "year": 1924,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1923",
                        "total_emissions": 92981328,
                        "year": 1923,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1922",
                        "total_emissions": 69209296,
                        "year": 1922,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1921",
                        "total_emissions": 80483424,
                        "year": 1921,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1920",
                        "total_emissions": 84378256,
                        "year": 1920,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1919",
                        "total_emissions": 76090288,
                        "year": 1919,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1918",
                        "total_emissions": 89518848,
                        "year": 1918,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1917",
                        "total_emissions": 85242960,
                        "year": 1917,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1916",
                        "total_emissions": 76456688,
                        "year": 1916,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1915",
                        "total_emissions": 61115520,
                        "year": 1915,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1914",
                        "total_emissions": 68381232,
                        "year": 1914,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1913",
                        "total_emissions": 79281632,
                        "year": 1913,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1912",
                        "total_emissions": 67271040,
                        "year": 1912,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1911",
                        "total_emissions": 60269136,
                        "year": 1911,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1910",
                        "total_emissions": 51622096,
                        "year": 1910,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1909",
                        "total_emissions": 45385968,
                        "year": 1909,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1908",
                        "total_emissions": 47408496,
                        "year": 1908,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1907",
                        "total_emissions": 46990800,
                        "year": 1907,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1906",
                        "total_emissions": 37387456,
                        "year": 1906,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1905",
                        "total_emissions": 35386912,
                        "year": 1905,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1904",
                        "total_emissions": 33096912,
                        "year": 1904,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1903",
                        "total_emissions": 27959984,
                        "year": 1903,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1902",
                        "total_emissions": 25648000,
                        "year": 1902,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1901",
                        "total_emissions": 23845312,
                        "year": 1901,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1900",
                        "total_emissions": 20628320,
                        "year": 1900,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1899",
                        "total_emissions": 19170048,
                        "year": 1899,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1898",
                        "total_emissions": 15707568,
                        "year": 1898,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1897",
                        "total_emissions": 14798895,
                        "year": 1897,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1896",
                        "total_emissions": 14648672,
                        "year": 1896,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1895",
                        "total_emissions": 13531152,
                        "year": 1895,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1894",
                        "total_emissions": 14179680,
                        "year": 1894,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1893",
                        "total_emissions": 14853856,
                        "year": 1893,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1892",
                        "total_emissions": 13890224,
                        "year": 1892,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1891",
                        "total_emissions": 13941520,
                        "year": 1891,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1890",
                        "total_emissions": 12413632,
                        "year": 1890,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1889",
                        "total_emissions": 11292448,
                        "year": 1889,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1888",
                        "total_emissions": 13311312,
                        "year": 1888,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1887",
                        "total_emissions": 10149280,
                        "year": 1887,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1886",
                        "total_emissions": 8797264,
                        "year": 1886,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1885",
                        "total_emissions": 8244000,
                        "year": 1885,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1884",
                        "total_emissions": 8599408,
                        "year": 1884,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1883",
                        "total_emissions": 7430592,
                        "year": 1883,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1882",
                        "total_emissions": 6617184,
                        "year": 1882,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1881",
                        "total_emissions": 5591264,
                        "year": 1881,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1880",
                        "total_emissions": 5232192,
                        "year": 1880,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1879",
                        "total_emissions": 2183744,
                        "year": 1879,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1878",
                        "total_emissions": 1934592,
                        "year": 1878,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1877",
                        "total_emissions": 2022528,
                        "year": 1877,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1876",
                        "total_emissions": 1857648,
                        "year": 1876,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1875",
                        "total_emissions": 1875968,
                        "year": 1875,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1874",
                        "total_emissions": 1623152,
                        "year": 1874,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1873",
                        "total_emissions": 1608496,
                        "year": 1873,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1872",
                        "total_emissions": 1846656,
                        "year": 1872,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1871",
                        "total_emissions": 1780704,
                        "year": 1871,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1870",
                        "total_emissions": 1223776,
                        "year": 1870,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1869",
                        "total_emissions": 685168,
                        "year": 1869,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1868",
                        "total_emissions": 945312,
                        "year": 1868,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1867",
                        "total_emissions": 1593840,
                        "year": 1867,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1866",
                        "total_emissions": 1242096,
                        "year": 1866,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1865",
                        "total_emissions": 1018592,
                        "year": 1865,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1864",
                        "total_emissions": 842720,
                        "year": 1864,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1863",
                        "total_emissions": 703488,
                        "year": 1863,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1862",
                        "total_emissions": 560592,
                        "year": 1862,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1861",
                        "total_emissions": 458000,
                        "year": 1861,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1860",
                        "total_emissions": 381056,
                        "year": 1860,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1859",
                        "total_emissions": 315104,
                        "year": 1859,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1858",
                        "total_emissions": 263808,
                        "year": 1858,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1857",
                        "total_emissions": 216176,
                        "year": 1857,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1856",
                        "total_emissions": 179536,
                        "year": 1856,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1855",
                        "total_emissions": 150224,
                        "year": 1855,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1854",
                        "total_emissions": 124576,
                        "year": 1854,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1853",
                        "total_emissions": 102592,
                        "year": 1853,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1852",
                        "total_emissions": 84272,
                        "year": 1852,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1851",
                        "total_emissions": 69616,
                        "year": 1851,
                        "tags": []
                    },
                    {
                        "emissions_id": "GCB2022:CA:1850",
                        "total_emissions": 58624,
                        "year": 1850,
                        "tags": []
                    }
                ]
            },
            "climateTRACE:country_inventory": {
                "datasource_id": "climateTRACE:country_inventory",
                "name": "climate TRACE: country inventory",
                "publisher": "climate TRACE",
                "published": "2022-12-02T00:00:00.000Z",
                "URL": "https://climatetrace.org/inventory",
                "tags": [
                    {
                        "tag_id": "GHGs_included_CO2_CH4_N2O",
                        "tag_name": "GHGs included: CO2, CH4, and N2O",
                        "created": "2023-03-16T23:57:21.056Z",
                        "last_updated": "2023-03-16T23:57:21.056Z"
                    },
                    {
                        "tag_id": "GWP_100_AR6",
                        "tag_name": "Uses GWP100 from IPCC AR6",
                        "created": "2023-03-28T23:18:03.616Z",
                        "last_updated": "2023-03-28T23:18:03.616Z"
                    },
                    {
                        "tag_id": "Sectors_included_in_climateTrace",
                        "tag_name": "Sectors: agriculture, buildings, fluorinated-gases, fossil-fuel-operations, manufacturing, mineral-extraction, power, transportation, and waste",
                        "created": "2023-03-28T23:18:03.616Z",
                        "last_updated": "2023-03-28T23:18:03.616Z"
                    },
                    {
                        "tag_id": "estimates_from_satellite_remote_sensing_and_AI",
                        "tag_name": "Estimates derived using satellite retrievals, remote-sensing, and artificial intelligence",
                        "created": "2023-03-28T23:18:03.617Z",
                        "last_updated": "2023-03-28T23:18:03.617Z"
                    },
                    {
                        "tag_id": "EDGAR_data",
                        "tag_name": "Includes some data from the EDGAR database",
                        "created": "2023-03-28T23:18:03.617Z",
                        "last_updated": "2023-03-28T23:18:03.617Z"
                    },
                    {
                        "tag_id": "FAOSTAT_data",
                        "tag_name": "Includes some data from FAOSTAT",
                        "created": "2023-03-28T23:18:03.617Z",
                        "last_updated": "2023-03-28T23:18:03.617Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "climateTRACE:CA:2021",
                        "total_emissions": 984150746,
                        "year": 2021,
                        "tags": []
                    },
                    {
                        "emissions_id": "climateTRACE:CA:2020",
                        "total_emissions": 955610304,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "climateTRACE:CA:2019",
                        "total_emissions": 1021925004,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "climateTRACE:CA:2018",
                        "total_emissions": 1016670277,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "climateTRACE:CA:2017",
                        "total_emissions": 977832781,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "climateTRACE:CA:2016",
                        "total_emissions": 966406901,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "climateTRACE:CA:2015",
                        "total_emissions": 963767005,
                        "year": 2015,
                        "tags": []
                    }
                ]
            },
            "WRI:climate_watch_historical_ghg:2022": {
                "datasource_id": "WRI:climate_watch_historical_ghg:2022",
                "name": "Climate Watch Historical GHG Emissions",
                "publisher": "WRI",
                "published": "2022-01-01T00:00:00.000Z",
                "URL": "https://www.climatewatchdata.org/ghg-emissions",
                "tags": [
                    {
                        "tag_id": "collated",
                        "tag_name": "Collated emissions estimates",
                        "created": "2023-02-10T20:57:14.731Z",
                        "last_updated": "2023-02-10T20:57:14.731Z"
                    },
                    {
                        "tag_id": "GHGs_included_CO2_CH4_N2O_F_gases",
                        "tag_name": "GHGs included: CO2, CH4, N2O, and F-gases",
                        "created": "2023-04-03T14:52:41.151Z",
                        "last_updated": "2023-04-03T14:52:41.151Z"
                    },
                    {
                        "tag_id": "GWP_100_AR4",
                        "tag_name": "Uses GWP100 from IPCC AR6",
                        "created": "2023-03-29T23:33:30.905Z",
                        "last_updated": "2023-05-31T16:48:24.050Z"
                    },
                    {
                        "tag_id": "Sectors_energy_ag_industrial_processes_waste",
                        "tag_name": "Sectors: energy, agriculture, industrial processes, and waste",
                        "created": "2023-04-03T15:00:04.622Z",
                        "last_updated": "2023-04-03T15:00:04.622Z"
                    },
                    {
                        "tag_id": "includes_bunker_fuels",
                        "tag_name": "Includes emissions from bunker fuels",
                        "created": "2023-04-03T15:00:04.623Z",
                        "last_updated": "2023-04-03T15:00:04.623Z"
                    },
                    {
                        "tag_id": "excludes_LUCF",
                        "tag_name": "Excludes LUCF",
                        "created": "2023-04-03T15:00:04.624Z",
                        "last_updated": "2023-04-03T15:00:04.624Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "climate_watch_GHG:CA:2019",
                        "total_emissions": 736930000,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2018",
                        "total_emissions": 737990000,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2017",
                        "total_emissions": 721010000,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2016",
                        "total_emissions": 704750000,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2015",
                        "total_emissions": 704480000,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2014",
                        "total_emissions": 706320000,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2013",
                        "total_emissions": 698680000,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2012",
                        "total_emissions": 686650000,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2011",
                        "total_emissions": 686500000,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2010",
                        "total_emissions": 669980000,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2009",
                        "total_emissions": 653140000,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2008",
                        "total_emissions": 688190000,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2007",
                        "total_emissions": 712790000,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2006",
                        "total_emissions": 679220000,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2005",
                        "total_emissions": 690540000,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2004",
                        "total_emissions": 676030000,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2003",
                        "total_emissions": 679150000,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2002",
                        "total_emissions": 657760000,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2001",
                        "total_emissions": 636840000,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:2000",
                        "total_emissions": 644890000,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1999",
                        "total_emissions": 625310000,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1998",
                        "total_emissions": 620150000,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1997",
                        "total_emissions": 611930000,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1996",
                        "total_emissions": 597670000,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1995",
                        "total_emissions": 579710000,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1994",
                        "total_emissions": 564720000,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1993",
                        "total_emissions": 546630000,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1992",
                        "total_emissions": 550630000,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1991",
                        "total_emissions": 536289999,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "climate_watch_GHG:CA:1990",
                        "total_emissions": 540380000,
                        "year": 1990,
                        "tags": []
                    }
                ]
            },
            "minx_etal_2021:v6": {
                "datasource_id": "minx_etal_2021:v6",
                "name": "A comprehensive and synthetic dataset for global, regional and national greenhouse gas emissions by sector 1970-2018 with an extension to 2019",
                "publisher": "Minx et al. (2021)",
                "published": "2022-04-25T00:00:00.000Z",
                "URL": "https://doi.org/10.5281/zenodo.6483002",
                "tags": [
                    {
                        "tag_id": "GHGs_included_fossil_CO2_CH4_N2O_F_gases",
                        "tag_name": "GHGs included: Fossil CO2, CH4, N2O, and F-gases",
                        "created": "2023-03-29T23:33:30.904Z",
                        "last_updated": "2023-03-29T23:33:30.904Z"
                    },
                    {
                        "tag_id": "GWP_100_AR4",
                        "tag_name": "Uses GWP100 from IPCC AR6",
                        "created": "2023-03-29T23:33:30.905Z",
                        "last_updated": "2023-05-31T16:48:24.050Z"
                    },
                    {
                        "tag_id": "Sectors_buildings_energy_industry_transport_AFOLU",
                        "tag_name": "Sectors: buildings, energy systems, industry, transport, and AFOLU",
                        "created": "2023-04-20T18:57:22.416Z",
                        "last_updated": "2023-04-20T18:57:22.416Z"
                    },
                    {
                        "tag_id": "built_using_EDGARv6",
                        "tag_name": "Built using EDGARv6",
                        "created": "2023-04-20T18:57:22.417Z",
                        "last_updated": "2023-04-20T18:57:22.417Z"
                    },
                    {
                        "tag_id": "excludes_LULUCF",
                        "tag_name": "Excludes LULUCF",
                        "created": "2023-04-03T14:58:15.219Z",
                        "last_updated": "2023-04-03T14:58:15.219Z"
                    }
                ],
                "data": [
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2020",
                        "total_emissions": 542787421,
                        "year": 2020,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2019",
                        "total_emissions": 778324967,
                        "year": 2019,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2018",
                        "total_emissions": 776401899,
                        "year": 2018,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2017",
                        "total_emissions": 766672734,
                        "year": 2017,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2016",
                        "total_emissions": 768077873,
                        "year": 2016,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2015",
                        "total_emissions": 777456436,
                        "year": 2015,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2014",
                        "total_emissions": 773231917,
                        "year": 2014,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2013",
                        "total_emissions": 761108269,
                        "year": 2013,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2012",
                        "total_emissions": 746587467,
                        "year": 2012,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2011",
                        "total_emissions": 744678103,
                        "year": 2011,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2010",
                        "total_emissions": 729511441,
                        "year": 2010,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2009",
                        "total_emissions": 714645693,
                        "year": 2009,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2008",
                        "total_emissions": 753535120,
                        "year": 2008,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2007",
                        "total_emissions": 780437167,
                        "year": 2007,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2006",
                        "total_emissions": 745528102,
                        "year": 2006,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2005",
                        "total_emissions": 751827828,
                        "year": 2005,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2004",
                        "total_emissions": 742117434,
                        "year": 2004,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2003",
                        "total_emissions": 746738220,
                        "year": 2003,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2002",
                        "total_emissions": 729384884,
                        "year": 2002,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2001",
                        "total_emissions": 719790455,
                        "year": 2001,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:2000",
                        "total_emissions": 729278885,
                        "year": 2000,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1999",
                        "total_emissions": 705515297,
                        "year": 1999,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1998",
                        "total_emissions": 694328666,
                        "year": 1998,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1997",
                        "total_emissions": 690169508,
                        "year": 1997,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1996",
                        "total_emissions": 672752478,
                        "year": 1996,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1995",
                        "total_emissions": 653661302,
                        "year": 1995,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1994",
                        "total_emissions": 636362275,
                        "year": 1994,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1993",
                        "total_emissions": 612516755,
                        "year": 1993,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1992",
                        "total_emissions": 607651865,
                        "year": 1992,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1991",
                        "total_emissions": 593112552,
                        "year": 1991,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1990",
                        "total_emissions": 597927242,
                        "year": 1990,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1989",
                        "total_emissions": 616995127,
                        "year": 1989,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1988",
                        "total_emissions": 597039303,
                        "year": 1988,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1987",
                        "total_emissions": 563002379,
                        "year": 1987,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1986",
                        "total_emissions": 549840179,
                        "year": 1986,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1985",
                        "total_emissions": 564642284,
                        "year": 1985,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1984",
                        "total_emissions": 563437433,
                        "year": 1984,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1983",
                        "total_emissions": 538338245,
                        "year": 1983,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1982",
                        "total_emissions": 539891711,
                        "year": 1982,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1981",
                        "total_emissions": 564074345,
                        "year": 1981,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1980",
                        "total_emissions": 583256480,
                        "year": 1980,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1979",
                        "total_emissions": 576772638,
                        "year": 1979,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1978",
                        "total_emissions": 558014914,
                        "year": 1978,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1977",
                        "total_emissions": 552447833,
                        "year": 1977,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1976",
                        "total_emissions": 532701168,
                        "year": 1976,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1975",
                        "total_emissions": 522912335,
                        "year": 1975,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1974",
                        "total_emissions": 535509083,
                        "year": 1974,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1973",
                        "total_emissions": 526375775,
                        "year": 1973,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1972",
                        "total_emissions": 500055242,
                        "year": 1972,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1971",
                        "total_emissions": 476566027,
                        "year": 1971,
                        "tags": []
                    },
                    {
                        "emissions_id": "minx_etal_2021_v6:CA:1970",
                        "total_emissions": 466029615,
                        "year": 1970,
                        "tags": []
                    }
                ]
            }
        }
    }

    const emk = Object.keys(tdata.emissions)

    emk.forEach((key)=> {
        const emOb = tdata.emissions[key];
        const sd = emOb.data.sort((a, b)=> a.year - b.year);
        emOb.data = sd
    })

    const mk = Object.keys(tdata.emissions);

    mk.forEach((key:any)=> {
        const modk = key.slice(0, key.indexOf(':'));
        const fd = tdata.emissions[key].data.filter((item)=> item.year >= 1990)
        tdata.emissions[modk] = {
            data: fd,
            tags: tdata.emissions[key].tags
        }
        delete tdata.emissions[key]
    })

    console.log(tdata)

    const dt = {
        "emissions": tdata.emissions,
        "targets": [
                {
                    "target_id": "IGES_NDC:unconditional:CA",
                    "target_type": "Absolute emission reduction",
                    "baseline_year": 2005,
                    "baseline_value": null,
                    "target_year": 2030,
                    "target_value": "40",
                    "target_unit": "percent",
                    "is_net_zero": false,
                    "percent_achieved": 76.965773410381,
                    "percent_achieved_reason": {
                        "baseline": {
                            "year": 2005,
                            "value": 741182843,
                            "datasource": {
                                "datasource_id": "UNFCCC:GHG_ANNEX1:2019-11-08",
                                "name": "UNFCCC GHG total without LULUCF, ANNEX I countries",
                                "published": "2019-11-08T00:00:00.000Z",
                                "URL": "https://di.unfccc.int/time_series"
                            }
                        },
                        "current": {
                            "year": 2021,
                            "value": 513000000,
                            "datasource": {
                                "datasource_id": "PRIMAP:10.5281/zenodo.7179775:v2.4",
                                "name": "PRIMAP-hist CR v2.4",
                                "published": "2022-10-17T00:00:00.000Z",
                                "URL": "https://doi.org/10.5281/zenodo.7179775"
                            }
                        },
                        "target": {
                            "value": 444709705.8
                        }
                    },
                    "datasource_id": "IGES:NDC_db:10.57405/iges-5005",
                    "datasource": {
                        "datasource_id": "IGES:NDC_db:10.57405/iges-5005",
                        "name": "IGES NDC Database",
                        "publisher": "IGES",
                        "published": "2022-10-01T00:00:00.000Z",
                        "URL": "https://www.iges.or.jp/en/pub/iges-indc-ndc-database/en",
                        "created": "2023-02-10T19:34:22.337Z",
                        "last_updated": "2023-02-10T19:34:22.337Z"
                    },
                    "initiative": {
                        "initiative_id": "paris",
                        "name": "Paris Agreement",
                        "description": "The Paris Agreement is a legally binding international treaty on climate change. It was adopted by 196 Parties at COP 21 in Paris, on 12 December 2015 and entered into force on 4 November 2016. Its goal is to limit global warming to well below 2, preferably to 1.5 degrees Celsius, compared to pre-industrial levels. To achieve this long-term temperature goal, countries aim to reach global peaking of greenhouse gas emissions as soon as possible to achieve a climate neutral world by mid-century. The Paris Agreement is a landmark in the multilateral climate change process because, for the first time, a binding agreement brings all nations into a common cause to undertake ambitious efforts to combat climate change and adapt to its effects.",
                        "URL": "https://unfccc.int/ndc-information/nationally-determined-contributions-ndcs"
                    }
                },
                {
                    "target_id": "IGES_NDC:unconditional:CA",
                    "target_type": "Absolute emission reduction",
                    "baseline_year": 2005,
                    "baseline_value": null,
                    "target_year": 2050,
                    "target_value": "50",
                    "target_unit": "percent",
                    "is_net_zero": false,
                    "percent_achieved": 76.965773410381,
                    "percent_achieved_reason": {
                        "baseline": {
                            "year": 2005,
                            "value": 741182843,
                            "datasource": {
                                "datasource_id": "UNFCCC:GHG_ANNEX1:2019-11-08",
                                "name": "UNFCCC GHG total without LULUCF, ANNEX I countries",
                                "published": "2019-11-08T00:00:00.000Z",
                                "URL": "https://di.unfccc.int/time_series"
                            }
                        },
                        "current": {
                            "year": 2021,
                            "value": 513000000,
                            "datasource": {
                                "datasource_id": "PRIMAP:10.5281/zenodo.7179775:v2.4",
                                "name": "PRIMAP-hist CR v2.4",
                                "published": "2022-10-17T00:00:00.000Z",
                                "URL": "https://doi.org/10.5281/zenodo.7179775"
                            }
                        },
                        "target": {
                            "value": 444709705.8
                        }
                    },
                    "datasource_id": "IGES:NDC_db:10.57405/iges-5005",
                    "datasource": {
                        "datasource_id": "IGES:NDC_db:10.57405/iges-5005",
                        "name": "IGES NDC Database",
                        "publisher": "IGES",
                        "published": "2022-10-01T00:00:00.000Z",
                        "URL": "https://www.iges.or.jp/en/pub/iges-indc-ndc-database/en",
                        "created": "2023-02-10T19:34:22.337Z",
                        "last_updated": "2023-02-10T19:34:22.337Z"
                    },
                    "initiative": {
                        "initiative_id": "paris",
                        "name": "Paris Agreement",
                        "description": "The Paris Agreement is a legally binding international treaty on climate change. It was adopted by 196 Parties at COP 21 in Paris, on 12 December 2015 and entered into force on 4 November 2016. Its goal is to limit global warming to well below 2, preferably to 1.5 degrees Celsius, compared to pre-industrial levels. To achieve this long-term temperature goal, countries aim to reach global peaking of greenhouse gas emissions as soon as possible to achieve a climate neutral world by mid-century. The Paris Agreement is a landmark in the multilateral climate change process because, for the first time, a binding agreement brings all nations into a common cause to undertake ambitious efforts to combat climate change and adapt to its effects.",
                        "URL": "https://unfccc.int/ndc-information/nationally-determined-contributions-ndcs"
                    }
                }
        ]
    }
    
    const data = [];

    const {emissions, targets} = dt

    for (const sourceKey in emissions) {
        if (emissions.hasOwnProperty(sourceKey)) {            
            const sourceData = emissions[sourceKey].data;
            const tags = emissions[sourceKey].tags
   
          // Iterate over the data points for each source
            sourceData.forEach((dataPoint) => {
                const { year, total_emissions } = dataPoint;
        
                // Check if there is an entry for the year in the main data array
                const yearEntry = data.find((entry) => entry.year === year);
        
                // If the year entry exists, add the emissions value for the source
                
                if (yearEntry) {
                    yearEntry.emissions[sourceKey] = {
                        total_emissions,
                        tags
                    }
                }
                // Otherwise, create a new entry for the year and add the emissions value
                else {
                const newEntry = {
                    year: year,
                    emissions: {
                    [sourceKey]: {
                        total_emissions,
                        tags
                    }
        
                    },
                };
                
                data.push(newEntry);
                }
          });
        }
      }

    

    targets.forEach((target) => {
        const year = target.target_year;
        const yearEntry = data.find((entry) => entry.year === year);
        
        if (yearEntry) {
            const baselineValue = target.percent_achieved_reason.baseline.value;
            const targetValue = baselineValue * (target.target_value / 100);
            yearEntry.target = targetValue;
        } else {
            const newEntry = {
            year: year,
            emissions: {},
            target: target.percent_achieved_reason.baseline.value * (target.target_value / 100),
            };
            data.push(newEntry);
        }
    });
    
    console.log(data)

    const sources = Object.keys(data[0].emissions);

    const [selectedSources, setSelectedSources] = useState(sources);
    
    const handleSourceToggle = (source) => {
        const updatedSources = selectedSources.includes(source)
          ? selectedSources.filter((selectedSource) => selectedSource !== source)
          : [...selectedSources, source];
        setSelectedSources(updatedSources);
    };

    const handleResetSelection = () => {
        setSelectedSources(sources)
    }

    const lines = selectedSources.map((source) => (
        <Line 
            type="monotone" 
            dataKey={`emissions.${source}.total_emissions`} 
            key={source}
            fill="#fa7200" 
            stroke="#fa7200"
            unit="Mt"
       />
    ));

    const targetLine = (
        <Line
          type="monotone"
          dataKey="target"
          stroke="#ffffff"
          strokeWidth={0}
          dot={TrendDot}
          isAnimationActive={true}
        />
    );

    interface TooltipProps {
        active: boolean
        payload: []
        label: string
    }

    const ToolTipContent:FC<TooltipProps> = ({active, payload, label}) => {
        if(active && payload && payload.length){
            const tooltipData = data.find((entry) => entry.year === label);
            const tooltipSources = Object.keys(tooltipData);
            const filteredSources = sources.filter((source) => {
                const dataKey = `emissions.${source}`;
                return payload.some((entry) => entry.dataKey === dataKey);
              });
            console.log(payload);
            let src = payload[0].dataKey.split(".")
            src = src[1]
            
            const tags = payload[0].payload.emissions[src].tags
          return(
            <div className={style.tooltip}>
                <div className={style.tooltipHeader}>
                    <h3>{label}</h3>
                </div>
                <div className={style.tooltipBody}>
                    <div className={style.emissionsData}>
                        <p className={style.ttlEmsValue}>{readableEmissions(payload[0].value)}</p>
                        <p className={style.ttlEmsText}>Total emissions in GtCO2eq</p>
                    </div>
                    <div className={style.sourceData}>
                        <p key={src} className={style.ttlSrcValue}>{src}</p>
                        <p className={style.ttlSrcText}>Source</p>
                    </div>
                    <div className={style.methodologies}>
                        {
                            tags && (tags.map((tag:any)=> <div key={tag.tag_id} className={style.tag}>{tag.tag_name}</div>))
                        }                  
                    </div>
                    <div>
                        <p className={style.methodologiesText}>Methodologies Used</p>
                    </div>
                </div>
            </div>
            
          )
        }
      
        return null;
    }

    return(
        <div className={style.root}>
            <div className={style.container}>
                <div className={style.header}>
                    <div className={style.headerRightColumn}>
                        <h1 className={style.title}>Trends</h1>
                        <p className={style.dateUpdated}>Last updated in 2019</p>
                    </div>
                    <div className={style.headerLeftColumn}>
                        <button className={style.downloadBtn}>
                            <MdOutlineFileDownload size={24}/>
                        </button>
                    </div>
                </div>
                <div className={style.body}>
                    <div className={style.filterWrapper}>
                        <button onClick={handleFrilterDropdown} className={style.filterButton}>
                            <MdFilterList className={style.filterIcon} size={24}/>
                            <span className={style.sourcesText}>Sources</span>
                            <span className={style.badge}>{sources.length}</span>
                            <MdArrowDropDown className={style.dropdownIcon} size={16}/>
                        </button>
                        {
                            openFilterDropdown && (
                                <>
                                    <div className={style.filterDropdown}>
                                        <div className={style.sourceListWrapper}>
                                            <FormGroup>
                                                {
                                                    sources.map((source) => {
                                                        return(
                                                            <div key={source} className={style.sourceItem}>
                                                                <FormControlLabel control={<Checkbox checked={selectedSources.includes(source)} defaultChecked />} onChange={()=>handleSourceToggle(source)} label={source} />
                                                                <MdOpenInNew size={16}/>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </FormGroup>
                                        </div>
                                        <div className={style.footer}>
                                            <div className={style.footerWrapper}>
                                                <button
                                                    onClick={handleResetSelection}                            
                                                    className={style.resetBtn}>Reset</button>
                                                <button 
                                                    onClick={handleFrilterDropdown}
                                                    className={style.applyBtn}>Apply</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className={style.chartArea}>
                        <div className={style.chartTitle}>
                            <div className={style.histTitle}>
                                Historical Emissions
                            </div>
                            <div className={style.targetTitle}>
                                Emissions Targets
                            </div>
                        </div>
                        <LineChart height={400} width={1200} data={data}>
                            <CartesianGrid stroke="#E6E7FF" height={1}/>
                            <XAxis dataKey="year" capHeight={30}/>
                            
                            <YAxis widths={10} stroke="E6E7FF" />
                            <Tooltip content={<ToolTipContent />} isAnimationActive={true} shared={false}/>
                            <Legend content={<LegendContent />}/>
                            {lines}
                            {targetLine}
                        </LineChart>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default TrendsWidget;

export const LegendContent:FC = () => {
    return(
        <div className={style.legend}>
            <p className={style.legendTitle}>Types of emissions and pledges</p>
            <div className={style.legendContent}>
                <div className={style.legendItem}>
                    <div className={style.emissionsIndicator}/>
                    <span>GHG Emissions</span>
                </div>
                <div className={style.legendItem2}>
                    <MdArrowDropDown className={style.legendDropdownIcon} size={36}/>
                    <span>Absolute emissions reduction</span>
                </div>
            </div>
        </div>
    );
}

function TrendDot(props) {
    const { cx=0, cy=0, value, trend="increase" } = props;
    const triangleSize = 30; // Adjust this as needed
  
    return (
      <g>
        {/* <circle cx={cx} cy={cy} r={3} fill="green" /> */}
        <path
          d={
            trend === 'increase'
              ? `M${cx} ${cy} L${cx - 15} ${cy - 15} L${cx + 15} ${cy - 15} Z`
              : `M${cx - triangleSize / 2} ${cy + triangleSize} h ${triangleSize} l ${-triangleSize / 2} ${triangleSize} z`
          }
          fill={trend === 'increase' ? '#24be00' : 'red'}
        />
      </g>
    );
  }
  
