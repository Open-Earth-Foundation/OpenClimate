import PledgesWidget from "../../components/review/pledges-widget/pledges-widget";

export default {
    title: 'Components / Widgets / PledgesWidget',
    component: PledgesWidget,
    parameters: {
        componentSubtitle: "Display a widget that shows pledges data with progress bar"
    }
}

const actorData = {
		"actor_id": "CA",
		"name": "Canada",
		"type": "country",
		"icon": null,
		"is_part_of": "EARTH",
		"area": 8965590,
		"lat": 45.4247,
		"lng": -75.6949,
		"territory": {
			"area": 8965590,
			"lat": 45.4247,
			"lng": -75.6949,
			"datasource": {
				"datasource_id": "world_bank:LandArea:v20220916",
				"name": "Land Area (AG.LND.TOTL.K2)",
				"published": "2022-09-16T00:00:00.000Z",
				"URL": "https://data.worldbank.org/indicator/AG.LND.TOTL.K2"
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
							"name": "PRIMAP-hist_v2.4_no_extrap (scenario=HISTCR)",
							"published": "2022-10-17T00:00:00.000Z",
							"URL": "https://zenodo.org/record/7179775"
						}
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
				"target_id": "net_zero_tracker:CA:2030",
				"target_type": "Absolute emission reduction",
				"baseline_year": 2005,
				"baseline_value": null,
				"target_year": 2030,
				"target_value": "45",
				"target_unit": "percent",
				"is_net_zero": false,
				"percent_achieved": 68.41402080922757,
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
							"name": "PRIMAP-hist_v2.4_no_extrap (scenario=HISTCR)",
							"published": "2022-10-17T00:00:00.000Z",
							"URL": "https://zenodo.org/record/7179775"
						}
					}
				},
				"datasource_id": "net_zero_tracker",
				"datasource": {
					"datasource_id": "net_zero_tracker",
					"name": "Net Zero Tracker",
					"publisher": "net_zero_tracker",
					"published": "2022-01-01T00:00:00.000Z",
					"URL": "https://zerotracker.net/",
					"created": "2023-02-10T20:57:16.377Z",
					"last_updated": "2023-02-10T20:57:16.377Z"
				}
			},
			{
				"target_id": "net_zero_tracker:CA:2050",
				"target_type": "Net zero",
				"baseline_year": null,
				"baseline_value": null,
				"target_year": 2050,
				"target_value": null,
				"target_unit": null,
				"is_net_zero": true,
				"percent_achieved": null,
				"percent_achieved_reason": null,
				"datasource_id": "net_zero_tracker",
				"datasource": {
					"datasource_id": "net_zero_tracker",
					"name": "Net Zero Tracker",
					"publisher": "net_zero_tracker",
					"published": "2022-01-01T00:00:00.000Z",
					"URL": "https://zerotracker.net/",
					"created": "2023-02-10T20:57:16.377Z",
					"last_updated": "2023-02-10T20:57:16.377Z"
				}
			}
		]
}

const Template = (args) => <PledgesWidget {...args}/>

export const Mobile = Template.bind({});


Mobile.args = {
    isMobile: true,
    current: actorData
};
