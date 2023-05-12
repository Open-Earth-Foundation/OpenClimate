import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import EmissionsWidget from "../review/emissions-widget/emissions-widget";

// Moch data

// Earth - Parent

const EARTH = {
    "actor_id": "EARTH",
    "name": "Earth",
    "type": "planet",
    "icon": null,
    "is_part_of": null,
    "territory": null,
    "emissions": {
    },
    "population": [
    ],
    "gdp": [
    ],
    "targets": [
    ]
}

// nullDataActor - Current

const NULLDATAACTOR = {
    actor_id: "CA",
    name: "Canada",
    type: "country",
    icon: null,
    is_part_of: "EARTH",
    area: null,
    lat: null,
    lng: null,
    territory: {
    area: null,
    lat: null,
    lng: null,
    datasource: {}
    },
    emissions: {},
    population: []
 }

 const CANADA = {
    actor_id: "CA",
    name: "Canada",
    type: "country",
    icon: null,
    is_part_of: "EARTH",
    area: 8965590,
    lat: 45.4247,
    lng: -75.6949,
    territory: {
    area: 8965590,
    lat: 45.4247,
    lng: -75.6949,
    datasource: {
    datasource_id: "world_bank:LandArea:v20220916",
    name: "Land Area (AG.LND.TOTL.K2)",
    published: "2022-09-16T00:00:00.000Z",
    URL: "https://data.worldbank.org/indicator/AG.LND.TOTL.K2"
    }
    },
    emissions: {
    "BP:statistical_review_june2022": {
            datasource_id: "BP:statistical_review_june2022",
            name: "Statistical Review of World Energy all data, 1965-2021",
            publisher: "BP",
            published: "2022-06-01T00:00:00.000Z",
            URL: "https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy",
            citation: "BP. (2022). Statistical Review of World Energy 2022 [Data set]. BP. https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy",
            tags: [
                {
                    tag_id: "CO2_and_CH4",
                    tag_name: "CO2 and CH4",
                    created: "2023-02-10T19:20:06.945Z",
                    last_updated: "2023-02-10T19:20:06.945Z"
                },
                {
                    tag_id: "primary_source",
                    tag_name: "Primary source: emissions derived from activity data",
                    created: "2023-02-10T19:20:06.946Z",
                    last_updated: "2023-02-10T19:20:06.946Z"
                },
                {
                    tag_id: "GHGs_included_CO2_and_CH4",
                    tag_name: "GHGs included: CO2 and CH4",
                    created: "2023-03-30T14:37:09.808Z",
                    last_updated: "2023-03-30T14:37:09.808Z"
                },
                {
                    tag_id: "production_consumption_emissions_energy_processing_and_flaring",
                    tag_name: "Production and consumption emissions from energy, process emissions, and flaring",
                    created: "2023-03-30T14:37:09.809Z",
                    last_updated: "2023-03-30T14:37:09.809Z"
                }
            ],
            data: [
                {
                    emissions_id: "BP_review_june2022:CA:2021",
                    total_emissions: 595422692,
                    year: 2021,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2020",
                    total_emissions: 582243625,
                    year: 2020,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2019",
                    total_emissions: 639321237,
                    year: 2019,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2018",
                    total_emissions: 642112663,
                    year: 2018,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2017",
                    total_emissions: 629367080,
                    year: 2017,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2016",
                    total_emissions: 609108153,
                    year: 2016,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2015",
                    total_emissions: 626195347,
                    year: 2015,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2014",
                    total_emissions: 625744460,
                    year: 2014,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2013",
                    total_emissions: 616126231,
                    year: 2013,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2012",
                    total_emissions: 600542562,
                    year: 2012,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2011",
                    total_emissions: 602910481,
                    year: 2011,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2010",
                    total_emissions: 596705399,
                    year: 2010,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2009",
                    total_emissions: 580033924,
                    year: 2009,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2008",
                    total_emissions: 611531537,
                    year: 2008,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2007",
                    total_emissions: 629267457,
                    year: 2007,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2006",
                    total_emissions: 602172651,
                    year: 2006,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2005",
                    total_emissions: 606716964,
                    year: 2005,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2004",
                    total_emissions: 606658226,
                    year: 2004,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2003",
                    total_emissions: 608419403,
                    year: 2003,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2002",
                    total_emissions: 598554929,
                    year: 2002,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2001",
                    total_emissions: 584936337,
                    year: 2001,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:2000",
                    total_emissions: 582356560,
                    year: 2000,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1999",
                    total_emissions: 561177526,
                    year: 1999,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1998",
                    total_emissions: 557345635,
                    year: 1998,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1997",
                    total_emissions: 539822962,
                    year: 1997,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1996",
                    total_emissions: 525159938,
                    year: 1996,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1995",
                    total_emissions: 515442120,
                    year: 1995,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1994",
                    total_emissions: 494227768,
                    year: 1994,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1993",
                    total_emissions: 477188333,
                    year: 1993,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1992",
                    total_emissions: 479595415,
                    year: 1992,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1991",
                    total_emissions: 463725716,
                    year: 1991,
                    tags: []
                },
                {
                    emissions_id: "BP_review_june2022:CA:1990",
                    total_emissions: 480394915,
                    year: 1990,
                    tags: []
                }
            ]
        },
    },
        population: [
            {
                population: 38454327,
                year: 2022,
                datasource_id: "UN_DESA_PD:WorldPopulation:v2022",
                datasource: {
                    datasource_id: "UN_DESA_PD:WorldPopulation:v2022",
                    name: "World Population Prospects",
                    published: "2022-07-11T00:00:00.000Z",
                    URL: "https://population.un.org/wpp/"
                }
            },
            {
                population: 38155012,
                year: 2021,
                datasource_id: "UN_DESA_PD:WorldPopulation:v2022",
                datasource: {
                    datasource_id: "UN_DESA_PD:WorldPopulation:v2022",
                    name: "World Population Prospects",
                    published: "2022-07-11T00:00:00.000Z",
                    URL: "https://population.un.org/wpp/"
                }
            },
            {
                population: 37888705,
                year: 2020,
                datasource_id: "UN_DESA_PD:WorldPopulation:v2022",
                datasource: {
                    datasource_id: "UN_DESA_PD:WorldPopulation:v2022",
                    name: "World Population Prospects",
                    published: "2022-07-11T00:00:00.000Z",
                    URL: "https://population.un.org/wpp/"
                }
            }
        ]
 }


describe('Emissions Widget with enissions data', () =>{
    beforeEach(()=>{
        render(<EmissionsWidget current={CANADA} parent={EARTH}/>)
    });
    afterEach(cleanup)

    it('Shows the correct title', () => {
        const title = screen.getByText('Total emissions');
        expect(title).toBeInTheDocument();
    })

    it('Shows the date updated correctly', () => {
        const date = screen.getByText('Last updated in 2021')
        expect(date).toBeInTheDocument()
    })

    it('Shows the emission\'s value', () => {
        const emissionsValue = screen.getByTestId('emissions-value');
        expect(emissionsValue.textContent).toMatch(/595\.42/i);
    })

    it('has per capita content shown', () => {
        const percapita = screen.getByTestId('percapita-value');
        expect(percapita).toHaveClass('emissions-widget__total-tonnes-pc');
        expect(percapita.textContent).toMatch(/15\.5/i)
    })

    it('has the emissions year the in select option', () => {
        const year = screen.getByRole('year-select');
        fireEvent.click(year);
        const selectItemYears = screen.getByText('2021')
        expect(selectItemYears).toBeInTheDocument()
    });

    it('has data source name in the select option', () => {
        const dataSrcDropdown = screen.getByRole('data-source-select');
        fireEvent.click(dataSrcDropdown);
        const selectItemYears = screen.getByText('BP')
        expect(selectItemYears).toBeInTheDocument()
    })

    it('has a clickable data download button', () => {
        const btn = screen.getByRole('icon-button');
        fireEvent.click(btn)
        const downloadMenu = screen.getByTestId('download-menu');
        expect(downloadMenu).toBeInTheDocument();
        expect(downloadMenu).toHaveTextContent('Download as CSV')
        expect(downloadMenu).toHaveTextContent('Download as JSON')
    })

    it('has methodologies title', () => {
        const methodologies = screen.getByRole('methodologies');
        expect(methodologies).toHaveTextContent('Methodologies used')
    });

    it('has methodologies', () => {
        const tags = ["Primary source: emissions derived from activity data", "CO2 and CH4","GHGs included: CO2 and CH4", "Production and consumption emissions from energy, process emissions, and flaring"]
        const methodologyTag = screen.queryAllByTestId('methodology-tag')
        methodologyTag.map((tagName, i)=> {
            expect(tagName).toHaveTextContent(tags[i])
        })
    })

    it('has a citation url', () => {
        const citationURL = screen.getByTestId('citation-url');
        expect(citationURL).toBeInTheDocument()
    }) 

    it('has citation test', () => {
        const citationText = screen.getByTestId('citation-text');
        expect(citationText).toBeInTheDocument
    })

    
});

describe('It shows a widget with empty state', () => {

    beforeEach(()=>{
        render(<EmissionsWidget current={NULLDATAACTOR} parent={EARTH}/>);
    });

    afterEach(cleanup)

    it('show N/A in the source select', () => {
        const selectYearText = screen.getByTestId('select-source');
        expect(selectYearText).toHaveTextContent('N/A')
    })

    it('show N/A in the year select', () => {
        const selectYearText = screen.getByTestId('select-year');
        expect(selectYearText).toHaveTextContent('N/A')
    })

    it('renders a collaborate message in the component', () => {
        const emissionsWidget = screen.getByTestId('emissions-widget');
        expect(emissionsWidget).toHaveTextContent("There's no data available, if you have any suggested data sources or you are a provider please");
    })

    it('show collaborate text in call to action', () => {
        const collabText = screen.getByTestId('collab-btn');
        expect(collabText).toHaveTextContent('COLLABORATE WITH DATA');
    })
})