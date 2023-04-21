import EmissionsWidget from '../../components/review/emissions-widget/emissions-widget';

export default {
    title: 'Components / Widgets / EmissionsWidget',
    component: EmissionsWidget,
    parameters: {
        componentSubtitle: "Display a component / widget that shows emissions"
    }
}

const actorData = {
    "actor_id": "CA",
    "name": "Canada",
    "type": "country",
    "is_part_of": "EARTH",
    "area": 8965590,
    "lat": 45.4247,
    "lng": -75.6949,
    "emissions": {
      "PRIMAP:10.5281/zenodo.7179775:v2.4": {
        "datasource_id": "PRIMAP:10.5281/zenodo.7179775:v2.4",
        "name": "PRIMAP-hist_v2.4_no_extrap (scenario=HISTCR)",
        "publisher": "PRIMAP",
        "published": "2022-10-17T00:00:00.000Z",
        "citation": "Günther, A.; Pflüger, M. (2021): The PRIMAP-hist national historical emissions time series (1750-2019). v2.3.1. zenodo.",
        "URL": "https://zenodo.org/record/7179775",
        "tags": [
          {
            "tag_id": "combined_datasets",
            "tag_name": "Combined datasets",
            "created": "2023-03-08T14:27:11.721Z",
            "last_updated": "2023-03-08T14:27:11.721Z"
          },
          {
            "tag_id": "country_or_3rd_party",
            "tag_name": "Country-reported data or third party",
            "created": "2023-03-08T14:27:11.721Z",
            "last_updated": "2023-03-08T14:27:11.721Z"
          },
          {
            "tag_id": "peer_reviewed",
            "tag_name": "Peer reviewed",
            "created": "2023-03-08T14:27:11.722Z",
            "last_updated": "2023-03-08T14:27:11.722Z"
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
        ]
      }
    },
    "population": [
      {
        "population": 38454327,
        "year": 2022,
        "datasource_id": "UN_DESA_PD:WorldPopulation:v2022",
        "datasource": {
          "datasource_id": "UN_DESA_PD:WorldPopulation:v2022",
          "name": "World Population Prospects",
          "published": "2022-07-11T00:00:00.000Z",
          "URL": "https://population.un.org/wpp/"
        }
      }
    ],
  }

const Template = (args) => <EmissionsWidget {...args}/>

export const Mobile = Template.bind({});


Mobile.args = {
    isMobile: true,
    titleText: "Total GHG emissions",
    subtitleText: "Last updated in 2021",
    hasDownload: true,
    hasFilter: true,
    current: actorData
};
