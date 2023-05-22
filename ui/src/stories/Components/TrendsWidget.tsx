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

    const dt = {
        "emissions": {
            "EDGAR":{
                data: [
                    {
                        emissions_id: "EDGARv7.0:ghg:CA:2021",
                        total_emissions: 713928593,
                        year: 2021,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2020",
                        total_emissions: 698802693,
                        year: 2020,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2019",
                        total_emissions: 758118023,
                        year: 2019,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2018",
                        total_emissions: 759560772,
                        year: 2018,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2017",
                        total_emissions: 743890457,
                        year: 2017,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2016",
                        total_emissions: 733452613,
                        year: 2016,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2015",
                        total_emissions: 734809433,
                        year: 2015,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2014",
                        total_emissions: 735791840,
                        year: 2014,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2013",
                        total_emissions: 726389523,
                        year: 2013,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2012",
                        total_emissions: 713272028,
                        year: 2012,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2011",
                        total_emissions: 712019024,
                        year: 2011,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2010",
                        total_emissions: 697652798,
                        year: 2010,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2009",
                        total_emissions: 683013582,
                        year: 2009,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2008",
                        total_emissions: 720558958,
                        year: 2008,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2007",
                        total_emissions: 744872695,
                        year: 2007,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2006",
                        total_emissions: 712988077,
                        year: 2006,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2005",
                        total_emissions: 719596070,
                        year: 2005,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2004",
                        total_emissions: 709936545,
                        year: 2004,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2003",
                        total_emissions: 715181348,
                        year: 2003,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2002",
                        total_emissions: 695713166,
                        year: 2002,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2001",
                        total_emissions: 674884741,
                        year: 2001,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:2000",
                        total_emissions: 683332853,
                        year: 2000,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1999",
                        total_emissions: 660676627,
                        year: 1999,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1998",
                        total_emissions: 650066475,
                        year: 1998,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1997",
                        total_emissions: 647505324,
                        year: 1997,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1996",
                        total_emissions: 631865844,
                        year: 1996,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1995",
                        total_emissions: 612686643,
                        year: 1995,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1994",
                        total_emissions: 595167355,
                        year: 1994,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1993",
                        total_emissions: 571858842,
                        year: 1993,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1992",
                        total_emissions: 569578019,
                        year: 1992,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1991",
                        total_emissions: 554444595,
                        year: 1991,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1990",
                        total_emissions: 559761984,
                        year: 1990,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1989",
                        total_emissions: 591521598,
                        year: 1989,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1988",
                        total_emissions: 571407001,
                        year: 1988,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1987",
                        total_emissions: 538122686,
                        year: 1987,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1986",
                        total_emissions: 525028037,
                        year: 1986,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1985",
                        total_emissions: 539825723,
                        year: 1985,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1984",
                        total_emissions: 538766319,
                        year: 1984,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1983",
                        total_emissions: 515078062,
                        year: 1983,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1982",
                        total_emissions: 516887973,
                        year: 1982,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1981",
                        total_emissions: 540779769,
                        year: 1981,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1980",
                        total_emissions: 560523990,
                        year: 1980,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1979",
                        total_emissions: 555736639,
                        year: 1979,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1978",
                        total_emissions: 535709422,
                        year: 1978,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1977",
                        total_emissions: 531141824,
                        year: 1977,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1976",
                        total_emissions: 515427301,
                        year: 1976,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1975",
                        total_emissions: 502814377,
                        year: 1975,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1974",
                        total_emissions: 514397315,
                        year: 1974,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1973",
                        total_emissions: 506239492,
                        year: 1973,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1972",
                        total_emissions: 481173732,
                        year: 1972,
                        tags: [ ]
                        },
                        {
                        emissions_id: "EDGARv7.0:ghg:CA:1971",
                        total_emissions: 457974374,
                        year: 1971,
                        tags: [ ]
    },
    {
    emissions_id: "EDGARv7.0:ghg:CA:1970",
    total_emissions: 449059192,
    year: 1970,
    tags: [ ]
    }
                ]
            },
            "BP": {
                 data: [
                        {
                        emissions_id: "BP_review_june2022:CA:2021",
                        total_emissions: 595422692,
                        year: 2021,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2020",
                        total_emissions: 582243625,
                        year: 2020,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2019",
                        total_emissions: 639321237,
                        year: 2019,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2018",
                        total_emissions: 642112663,
                        year: 2018,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2017",
                        total_emissions: 629367080,
                        year: 2017,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2016",
                        total_emissions: 609108153,
                        year: 2016,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2015",
                        total_emissions: 626195347,
                        year: 2015,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2014",
                        total_emissions: 625744460,
                        year: 2014,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2013",
                        total_emissions: 616126231,
                        year: 2013,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2012",
                        total_emissions: 600542562,
                        year: 2012,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2011",
                        total_emissions: 602910481,
                        year: 2011,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2010",
                        total_emissions: 596705399,
                        year: 2010,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2009",
                        total_emissions: 580033924,
                        year: 2009,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2008",
                        total_emissions: 611531537,
                        year: 2008,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2007",
                        total_emissions: 629267457,
                        year: 2007,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2006",
                        total_emissions: 602172651,
                        year: 2006,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2005",
                        total_emissions: 606716964,
                        year: 2005,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2004",
                        total_emissions: 606658226,
                        year: 2004,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2003",
                        total_emissions: 608419403,
                        year: 2003,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2002",
                        total_emissions: 598554929,
                        year: 2002,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2001",
                        total_emissions: 584936337,
                        year: 2001,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:2000",
                        total_emissions: 582356560,
                        year: 2000,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1999",
                        total_emissions: 561177526,
                        year: 1999,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1998",
                        total_emissions: 557345635,
                        year: 1998,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1997",
                        total_emissions: 539822962,
                        year: 1997,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1996",
                        total_emissions: 525159938,
                        year: 1996,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1995",
                        total_emissions: 515442120,
                        year: 1995,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1994",
                        total_emissions: 494227768,
                        year: 1994,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1993",
                        total_emissions: 477188333,
                        year: 1993,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1992",
                        total_emissions: 479595415,
                        year: 1992,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1991",
                        total_emissions: 463725716,
                        year: 1991,
                        tags: [ ]
                        },
                        {
                        emissions_id: "BP_review_june2022:CA:1990",
                        total_emissions: 480394915,
                        year: 1990,
                        tags: [ ]
                        }
                ]
            },
            "PRIMAP": {
                "data": [
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2021",
                    total_emissions: 513000000,
                    year: 2021,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2020",
                    total_emissions: 672000000,
                    year: 2020,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2019",
                    total_emissions: 738000000,
                    year: 2019,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2018",
                    total_emissions: 743000000,
                    year: 2018,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2017",
                    total_emissions: 728000000,
                    year: 2017,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2016",
                    total_emissions: 718000000,
                    year: 2016,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2015",
                    total_emissions: 736000000,
                    year: 2015,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2014",
                    total_emissions: 733000000,
                    year: 2014,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2013",
                    total_emissions: 736000000,
                    year: 2013,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2012",
                    total_emissions: 730000000,
                    year: 2012,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2011",
                    total_emissions: 724000000,
                    year: 2011,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2010",
                    total_emissions: 714000000,
                    year: 2010,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2009",
                    total_emissions: 701000000,
                    year: 2009,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2008",
                    total_emissions: 743000000,
                    year: 2008,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2007",
                    total_emissions: 761000000,
                    year: 2007,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2006",
                    total_emissions: 739000000,
                    year: 2006,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2005",
                    total_emissions: 745000000,
                    year: 2005,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2004",
                    total_emissions: 749000000,
                    year: 2004,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2003",
                    total_emissions: 747000000,
                    year: 2003,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2002",
                    total_emissions: 728000000,
                    year: 2002,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2001",
                    total_emissions: 722000000,
                    year: 2001,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:2000",
                    total_emissions: 731000000,
                    year: 2000,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1999",
                    total_emissions: 706000000,
                    year: 1999,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1998",
                    total_emissions: 693000000,
                    year: 1998,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1997",
                    total_emissions: 686000000,
                    year: 1997,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1996",
                    total_emissions: 670000000,
                    year: 1996,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1995",
                    total_emissions: 649000000,
                    year: 1995,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1994",
                    total_emissions: 632000000,
                    year: 1994,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1993",
                    total_emissions: 611000000,
                    year: 1993,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1992",
                    total_emissions: 609000000,
                    year: 1992,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1991",
                    total_emissions: 592000000,
                    year: 1991,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1990",
                    total_emissions: 599000000,
                    year: 1990,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1989",
                    total_emissions: 582000000,
                    year: 1989,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1988",
                    total_emissions: 571000000,
                    year: 1988,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1987",
                    total_emissions: 547000000,
                    year: 1987,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1986",
                    total_emissions: 520000000,
                    year: 1986,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1985",
                    total_emissions: 541000000,
                    year: 1985,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1984",
                    total_emissions: 543000000,
                    year: 1984,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1983",
                    total_emissions: 519000000,
                    year: 1983,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1982",
                    total_emissions: 521000000,
                    year: 1982,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1981",
                    total_emissions: 542000000,
                    year: 1981,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1980",
                    total_emissions: 553000000,
                    year: 1980,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1979",
                    total_emissions: 554000000,
                    year: 1979,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1978",
                    total_emissions: 526000000,
                    year: 1978,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1977",
                    total_emissions: 517000000,
                    year: 1977,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1976",
                    total_emissions: 504000000,
                    year: 1976,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1975",
                    total_emissions: 506000000,
                    year: 1975,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1974",
                    total_emissions: 505000000,
                    year: 1974,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1973",
                    total_emissions: 500000000,
                    year: 1973,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1972",
                    total_emissions: 491000000,
                    year: 1972,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1971",
                    total_emissions: 461000000,
                    year: 1971,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1970",
                    total_emissions: 451000000,
                    year: 1970,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1969",
                    total_emissions: 422000000,
                    year: 1969,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1968",
                    total_emissions: 417000000,
                    year: 1968,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1967",
                    total_emissions: 391000000,
                    year: 1967,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1966",
                    total_emissions: 364000000,
                    year: 1966,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1965",
                    total_emissions: 356000000,
                    year: 1965,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1964",
                    total_emissions: 337000000,
                    year: 1964,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1963",
                    total_emissions: 305000000,
                    year: 1963,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1962",
                    total_emissions: 298000000,
                    year: 1962,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1961",
                    total_emissions: 282000000,
                    year: 1961,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1960",
                    total_emissions: 281000000,
                    year: 1960,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1959",
                    total_emissions: 271000000,
                    year: 1959,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1958",
                    total_emissions: 265000000,
                    year: 1958,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1957",
                    total_emissions: 264000000,
                    year: 1957,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1956",
                    total_emissions: 272000000,
                    year: 1956,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1955",
                    total_emissions: 248000000,
                    year: 1955,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1954",
                    total_emissions: 242000000,
                    year: 1954,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1953",
                    total_emissions: 235000000,
                    year: 1953,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1952",
                    total_emissions: 234000000,
                    year: 1952,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1951",
                    total_emissions: 235000000,
                    year: 1951,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1950",
                    total_emissions: 223000000,
                    year: 1950,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1949",
                    total_emissions: 212000000,
                    year: 1949,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1948",
                    total_emissions: 225000000,
                    year: 1948,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1947",
                    total_emissions: 205000000,
                    year: 1947,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1946",
                    total_emissions: 197000000,
                    year: 1946,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1945",
                    total_emissions: 185000000,
                    year: 1945,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1944",
                    total_emissions: 193000000,
                    year: 1944,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1943",
                    total_emissions: 189000000,
                    year: 1943,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1942",
                    total_emissions: 180000000,
                    year: 1942,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1941",
                    total_emissions: 167000000,
                    year: 1941,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1940",
                    total_emissions: 154000000,
                    year: 1940,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1939",
                    total_emissions: 139000000,
                    year: 1939,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1938",
                    total_emissions: 128000000,
                    year: 1938,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1937",
                    total_emissions: 136000000,
                    year: 1937,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1936",
                    total_emissions: 128000000,
                    year: 1936,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1935",
                    total_emissions: 120000000,
                    year: 1935,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1934",
                    total_emissions: 121000000,
                    year: 1934,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1933",
                    total_emissions: 109000000,
                    year: 1933,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1932",
                    total_emissions: 110000000,
                    year: 1932,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1931",
                    total_emissions: 116000000,
                    year: 1931,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1930",
                    total_emissions: 136000000,
                    year: 1930,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1929",
                    total_emissions: 140000000,
                    year: 1929,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1928",
                    total_emissions: 134000000,
                    year: 1928,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1927",
                    total_emissions: 132000000,
                    year: 1927,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1926",
                    total_emissions: 123000000,
                    year: 1926,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1925",
                    total_emissions: 113000000,
                    year: 1925,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1924",
                    total_emissions: 115000000,
                    year: 1924,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1923",
                    total_emissions: 131000000,
                    year: 1923,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1922",
                    total_emissions: 105000000,
                    year: 1922,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1921",
                    total_emissions: 117000000,
                    year: 1921,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1920",
                    total_emissions: 121000000,
                    year: 1920,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1919",
                    total_emissions: 111000000,
                    year: 1919,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1918",
                    total_emissions: 125000000,
                    year: 1918,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1917",
                    total_emissions: 121000000,
                    year: 1917,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1916",
                    total_emissions: 111000000,
                    year: 1916,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1915",
                    total_emissions: 94500000,
                    year: 1915,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1914",
                    total_emissions: 102000000,
                    year: 1914,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1913",
                    total_emissions: 113000000,
                    year: 1913,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1912",
                    total_emissions: 99900000,
                    year: 1912,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1911",
                    total_emissions: 92000000,
                    year: 1911,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1910",
                    total_emissions: 82300000,
                    year: 1910,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1909",
                    total_emissions: 75100000,
                    year: 1909,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1908",
                    total_emissions: 76800000,
                    year: 1908,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1907",
                    total_emissions: 75800000,
                    year: 1907,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1906",
                    total_emissions: 64700000,
                    year: 1906,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1905",
                    total_emissions: 62200000,
                    year: 1905,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1904",
                    total_emissions: 59200000,
                    year: 1904,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1903",
                    total_emissions: 53100000,
                    year: 1903,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1902",
                    total_emissions: 50100000,
                    year: 1902,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1901",
                    total_emissions: 47700000,
                    year: 1901,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1900",
                    total_emissions: 43900000,
                    year: 1900,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1899",
                    total_emissions: 42100000,
                    year: 1899,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1898",
                    total_emissions: 38200000,
                    year: 1898,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1897",
                    total_emissions: 37100000,
                    year: 1897,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1896",
                    total_emissions: 36700000,
                    year: 1896,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1895",
                    total_emissions: 35400000,
                    year: 1895,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1894",
                    total_emissions: 35900000,
                    year: 1894,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1893",
                    total_emissions: 36500000,
                    year: 1893,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1892",
                    total_emissions: 35300000,
                    year: 1892,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1891",
                    total_emissions: 35200000,
                    year: 1891,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1890",
                    total_emissions: 33400000,
                    year: 1890,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1889",
                    total_emissions: 31900000,
                    year: 1889,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1888",
                    total_emissions: 33900000,
                    year: 1888,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1887",
                    total_emissions: 30400000,
                    year: 1887,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1886",
                    total_emissions: 28800000,
                    year: 1886,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1885",
                    total_emissions: 28100000,
                    year: 1885,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1884",
                    total_emissions: 28300000,
                    year: 1884,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1883",
                    total_emissions: 26900000,
                    year: 1883,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1882",
                    total_emissions: 25900000,
                    year: 1882,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1881",
                    total_emissions: 24600000,
                    year: 1881,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1880",
                    total_emissions: 24000000,
                    year: 1880,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1879",
                    total_emissions: 20500000,
                    year: 1879,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1878",
                    total_emissions: 20000000,
                    year: 1878,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1877",
                    total_emissions: 19800000,
                    year: 1877,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1876",
                    total_emissions: 19300000,
                    year: 1876,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1875",
                    total_emissions: 19000000,
                    year: 1875,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1874",
                    total_emissions: 18400000,
                    year: 1874,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1873",
                    total_emissions: 18100000,
                    year: 1873,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1872",
                    total_emissions: 18000000,
                    year: 1872,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1871",
                    total_emissions: 17700000,
                    year: 1871,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1870",
                    total_emissions: 17000000,
                    year: 1870,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1869",
                    total_emissions: 15900000,
                    year: 1869,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1868",
                    total_emissions: 16100000,
                    year: 1868,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1867",
                    total_emissions: 16600000,
                    year: 1867,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1866",
                    total_emissions: 17400000,
                    year: 1866,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1865",
                    total_emissions: 15800000,
                    year: 1865,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1864",
                    total_emissions: 15500000,
                    year: 1864,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1863",
                    total_emissions: 15200000,
                    year: 1863,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1862",
                    total_emissions: 14900000,
                    year: 1862,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1861",
                    total_emissions: 14700000,
                    year: 1861,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1860",
                    total_emissions: 14900000,
                    year: 1860,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1859",
                    total_emissions: 14400000,
                    year: 1859,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1858",
                    total_emissions: 14000000,
                    year: 1858,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1857",
                    total_emissions: 13500000,
                    year: 1857,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1856",
                    total_emissions: 13100000,
                    year: 1856,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1855",
                    total_emissions: 12700000,
                    year: 1855,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1854",
                    total_emissions: 12300000,
                    year: 1854,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1853",
                    total_emissions: 11900000,
                    year: 1853,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1852",
                    total_emissions: 11600000,
                    year: 1852,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1851",
                    total_emissions: 11300000,
                    year: 1851,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1850",
                    total_emissions: 11300000,
                    year: 1850,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1849",
                    total_emissions: 10200000,
                    year: 1849,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1848",
                    total_emissions: 9870000,
                    year: 1848,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1847",
                    total_emissions: 9540000,
                    year: 1847,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1846",
                    total_emissions: 9210000,
                    year: 1846,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1845",
                    total_emissions: 8770000,
                    year: 1845,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1844",
                    total_emissions: 8490000,
                    year: 1844,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1843",
                    total_emissions: 8210000,
                    year: 1843,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1842",
                    total_emissions: 7940000,
                    year: 1842,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1841",
                    total_emissions: 7660000,
                    year: 1841,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1840",
                    total_emissions: 7380000,
                    year: 1840,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1839",
                    total_emissions: 7190000,
                    year: 1839,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1838",
                    total_emissions: 7000000,
                    year: 1838,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1837",
                    total_emissions: 6810000,
                    year: 1837,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1836",
                    total_emissions: 6620000,
                    year: 1836,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1835",
                    total_emissions: 6430000,
                    year: 1835,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1834",
                    total_emissions: 6240000,
                    year: 1834,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1833",
                    total_emissions: 6050000,
                    year: 1833,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1832",
                    total_emissions: 5850000,
                    year: 1832,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1831",
                    total_emissions: 5660000,
                    year: 1831,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1830",
                    total_emissions: 5470000,
                    year: 1830,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1829",
                    total_emissions: 5330000,
                    year: 1829,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1828",
                    total_emissions: 5190000,
                    year: 1828,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1827",
                    total_emissions: 5050000,
                    year: 1827,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1826",
                    total_emissions: 4910000,
                    year: 1826,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1825",
                    total_emissions: 4780000,
                    year: 1825,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1824",
                    total_emissions: 4640000,
                    year: 1824,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1823",
                    total_emissions: 4500000,
                    year: 1823,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1822",
                    total_emissions: 4360000,
                    year: 1822,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1821",
                    total_emissions: 4220000,
                    year: 1821,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1820",
                    total_emissions: 4080000,
                    year: 1820,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1819",
                    total_emissions: 3980000,
                    year: 1819,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1818",
                    total_emissions: 3870000,
                    year: 1818,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1817",
                    total_emissions: 3770000,
                    year: 1817,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1816",
                    total_emissions: 3670000,
                    year: 1816,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1815",
                    total_emissions: 3570000,
                    year: 1815,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1814",
                    total_emissions: 3460000,
                    year: 1814,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1813",
                    total_emissions: 3360000,
                    year: 1813,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1812",
                    total_emissions: 3260000,
                    year: 1812,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1811",
                    total_emissions: 3150000,
                    year: 1811,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1810",
                    total_emissions: 3050000,
                    year: 1810,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1809",
                    total_emissions: 3010000,
                    year: 1809,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1808",
                    total_emissions: 2960000,
                    year: 1808,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1807",
                    total_emissions: 2910000,
                    year: 1807,
                    tags: [ ]
                    },
                    {
                    emissions_id: "PRIMAP-hist_v2.4_ne:CA:1806",
                    total_emissions: 2870000,
                    year: 1806,
                    tags: [ ]
                    },                    
                ]
            }
        },
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

        // sort data by the year
             
          // Iterate over the data points for each source
          sourceData.forEach((dataPoint) => {
            const { year, total_emissions } = dataPoint;
      
            // Check if there is an entry for the year in the main data array
            const yearEntry = data.find((entry) => entry.year === year);
      
            // If the year entry exists, add the emissions value for the source
            if (yearEntry) {
              yearEntry.emissions[sourceKey] = total_emissions;
            }
            // Otherwise, create a new entry for the year and add the emissions value
            else {
              const newEntry = {
                year: year,
                emissions: {
                  [sourceKey]: total_emissions,
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



    const sources = Object.keys(data[0].emissions);

    const [selectedSources, setSelectedSources] = useState(sources);
    

    const handleSourceToggle = (source) => {
        const updatedSources = selectedSources.includes(source)
          ? selectedSources.filter((selectedSource) => selectedSource !== source)
          : [...selectedSources, source];
        setSelectedSources(updatedSources);
    };

    const lines = selectedSources.map((source) => (
        <Line 
            type="monotone" 
            dataKey={`emissions.${source}`} 
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
                    {filteredSources.map((source) => (
                        <p key={source} className={style.ttlSrcValue}>{`${source}`}</p>
                    ))}
                        <p className={style.ttlSrcText}>Source</p>
                    </div>
                    <div className={style.methodologies}>
                        <p className={style.methodologyTag}>Remote sensing</p>
                        <p className={style.methodologyTag}>Machine Learning</p>
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
                                                <button className={style.resetBtn}>Reset</button>
                                                <button className={style.applyBtn}>Apply</button>
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
                <div className={style.footer}>

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
  
