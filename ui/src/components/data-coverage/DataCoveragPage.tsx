import React, { FC, useEffect, useState } from 'react';
import style from './DataCoveragePage.module.scss';
import Container from './Container/Container';
import { MdArrowForward } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { ServerUrls } from '../../shared/environments/server.environments';
import { CircularProgress } from '@mui/material';

interface DataCoveragePageProps{
    actor: any
}

interface CoverageData {
      number_of_data_sources: number,
      number_of_countries: number,
      number_of_regions: number,
      number_of_cities: number,
      number_of_companies: number,
      number_of_facilities: number,
      number_of_emissions_records: number,
      number_of_target_records: number,
      number_of_contextual_records: number,
      number_of_countries_with_emissions: number,
      number_of_countries_with_targets: number,
      number_of_regions_with_emissions: number,
      number_of_regions_with_targets: number,
      number_of_cities_with_emissions: number,
      number_of_cities_with_targets: number,
}

interface CoverageDiagramEntry {
    name: string,
    Emissions: number,
    Pledges: number,
}

const DataCoveragePage:FC<DataCoveragePageProps> = ({
    actor
}) => {
    const [isLoading, setLoading] = useState(true);
    const [coverageData, setCoverageData] = useState<CoverageData>();
    const [diagramData, setDiagramData] = useState<CoverageDiagramEntry[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const result = await fetch(
                  `${ServerUrls.api}/v1/coverage/stats`,
                );
                const data = await result.json();

                const calc = (value:number, sum_of_actors:number) => {
                    return Math.round((value/sum_of_actors)*100)
                }

                let countryData = {
                    emissions: 0,
                    pledges: 0
                }

                let regionalData = {
                    emissions: 0,
                    pledges: 0
                }

                let cityData = {
                    emissions: 0,
                    pledges: 0
                }
                
                if(!isLoading && coverageData){
                    countryData = {
                        emissions: calc(data.number_of_countries_with_emissions, coverageData?.number_of_countries),
                        pledges: calc(data.number_of_countries_with_targets, coverageData?.number_of_countries)
                    }

                    regionalData = {
                        emissions: calc(data.number_of_regions_with_emissions , coverageData?.number_of_regions),
                        pledges: calc(data.number_of_regions_with_targets, coverageData?.number_of_regions)
                    }

                    cityData = {
                        emissions: calc(data.number_of_cities_with_emissions , coverageData?.number_of_cities),
                        pledges: calc(data.number_of_cities_with_targets, coverageData?.number_of_cities)
                    }
                }

                setCoverageData(data);
                setLoading(false);

                setDiagramData([
                    {
                        name: 'Countries',
                        Emissions: countryData.emissions,
                        Pledges: countryData.pledges,
                    }, {
                        name: 'Regions',
                        Emissions: regionalData.emissions,
                        Pledges: regionalData.pledges,
                    }, {
                        name: 'Cities',
                        Emissions: cityData.emissions,
                        Pledges: cityData.pledges,
                    },
                ]);
            } catch(err) {
                console.log('Failed to load coverage data!', err);
                setLoading(false);
            }
        }

        fetchData();
    }, [coverageData, isLoading]);

    const customEmissionsLabel = (props:any) => {
        const {value, x, y, width} = props
        const radius = 10
        return(
            <g>
                <text x={x + width / 2} y={y - radius} fill="#E9750A" style={{fontWeight: 'bold'}} textAnchor="middle" dominantBaseline="middle">
                    {value}%
                </text>
            </g>
        )
    }

    const customPledgesLabel = (props:any) => {
        const {value, x, y, width} = props
        const radius = 10
        return(
            <g>
                <text x={x + width / 2} y={y - radius} fill="#24BE00" style={{fontWeight: 'bold'}} textAnchor="middle" dominantBaseline="middle">
                    {value}%
                </text>
            </g>
        )
    }

    const shortenNumber = (num: number) => {
        if(num>1000){
            const units = ["K", "M"]
            const unit = Math.floor(Math.log10(num) / 3);
            const shortened = (num / Math.pow(1000, unit)).toFixed(1);
            return shortened + units[unit - 1];
        }

        return num.toString();
    }

    return(
        <div className={style.root}>
            <section className={style.heroSection} style={{
                background: 'url("/images/earth_bg.png") no-repeat',
                backgroundPosition: "right",
            }}>
                <Container>
                    <div className={style.heroText}>
                        <div>
                            <h1 className={style.h1Black}>Welcome to the </h1>
                            <h1 className={style.h1Green}>Data Visualization Dashboard</h1>
                        </div>
                        <p>
                            This is where to find emissions and pledges data 
                            we have on Open Climate and the data we still need.
                            <br /> 
                            You are welcome to collaborate with data for actors 
                            with no emissions and pledges data
                        </p>
                        <a href="https://github.com/Open-Earth-Foundation/OpenClimate/blob/develop/CONTRIBUTING_DATA.md">
                            <button>
                                <span>CONTRIBUTION&nbsp;GUIDELINES</span>
                                <MdArrowForward size={24}/>
                            </button>
                        </a>
                    </div>
                </Container>
            </section>
            <section className={style.dataRecordsSection}>
                <Container>
                    <div className={style.dataRecordsContent}>
                        <div className={style.dataRecordsLeftContent}>
                            <h2>Data Records <span className={style.h1GreenB}>Available</span></h2>
                            <p>
                                View the current status of the data records available, <br />
                                the percentage of actors with emissions and pledges data at <br />
                                Open Climate and emissions and pledges records breakdown into <br /> 
                                countries, regions, cities and companies.
                            </p>
                            <a href="https://github.com/Open-Earth-Foundation/OpenClimate">
                                <button>
                                    <span>
                                        READ&nbsp;THE&nbsp;DOCS
                                    </span>
                                    <MdArrowForward size={24}/>
                                </button>
                            </a>
                        </div>
                        <div className={style.dataRecordsRightContent}>
                            {isLoading && <CircularProgress />}
                            {!isLoading && coverageData && (
                                <>
                                    <div>
                                        <p>{coverageData.number_of_data_sources}</p>
                                        <span>Data Sources</span>
                                    </div>
                                    <div>
                                        <p>{coverageData.number_of_countries}</p>
                                        <span>Countries</span>
                                    </div>
                                    <div>
                                        <p>{shortenNumber(coverageData.number_of_regions)}</p>
                                        <span>Regions</span>
                                    </div>
                                    <div>
                                        <p>{shortenNumber(coverageData.number_of_cities)}</p>
                                        <span>Cities</span>
                                    </div>
                                    <div>
                                        <p>{shortenNumber(coverageData.number_of_facilities)}</p>
                                        <span>Company Facilities</span>
                                    </div>
                                    <div>
                                        <p>{shortenNumber(coverageData.number_of_emissions_records)}</p>
                                        <span>Emissions records</span>
                                    </div>
                                    <div>
                                        <p>{shortenNumber(coverageData.number_of_target_records)}</p>
                                        <span>Pledges records</span>
                                    </div>
                                    <div>
                                        <p>{shortenNumber(coverageData.number_of_contextual_records)}</p>
                                        <span>Contextual data records</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </section>
            <section className={style.chartSection}>
                <Container>
                    <div className={style.chartContent}>
                        <div className={style.heading}>
                            <h2 className={style.title}>Explore the Available Data by Actors</h2>
                            <p  className={style.subtitle}>
                                Provides an overview of the percentages of emissions and 
                                pledges data available at OpenClimate for countries, regions, 
                                cities and companies
                            </p>
                        </div>
                        <div className={style.chartwrapper}>
                            <div className={style.chart}>
                                <p className={style.chartDescription}>Percentage of Actors with Emissions and Pledges Data</p>
                                <ResponsiveContainer className={style.cr}>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={diagramData}
                                        margin={{
                                            top: 30,
                                            right: 50,
                                            left: 0,
                                            bottom:0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E6E7FF" height={1}/>
                                        <XAxis dataKey="name" capHeight={30} />
                                        <YAxis tick={(props)=>(
                                                <text {...props} className={style.tickText}>
                                                    {props.payload.value} %
                                                </text>)} stroke='eeffee'/>
                                        <Legend content={<LegendContent  />}/>
                                        <Bar barSize={100} style={{marginRight: "10px"}} dataKey="Emissions" fill="#FA7200">
                                            <LabelList
                                                dataKey="Emissions"
                                                position="top"
                                                dy={0}
                                                dx={50}
                                                content={customEmissionsLabel} // Render the value on top of the bar
                                            />
                                        </Bar>
                                        <Bar barSize={100} dataKey="Pledges" fill="#24BE00">
                                            <LabelList
                                                dataKey="Pledges"
                                                position="top"
                                                dy={0}
                                                content={customPledgesLabel} // Render the value on top of the bar
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <section className={style.circleBg}
                style={{
                    background: 'url("/images/oc_curve_bg.png") no-repeat center',
                    backgroundSize: 'cover',
                    width: "100%",
                    height: "380px"
                }}
            />
            <section className={style.collaborateSection}>
                <Container>
                    <div className={style.collaborateContent}>
                        <div>
                            <h2>
                                Have Climate Data to Share? Join Us and Collaborate Today
                            </h2>
                        </div>
                        <button className={style.collaborate}>
                            I WANT TO COLLABORATE
                        </button>
                    </div>
                </Container>
            </section>
        </div>
    )
}

export default DataCoveragePage;

const LegendContent = () => {
    return (
        <div className={style.legendContent}>
            <div className={style.lgdEms}>
                <div className={style.orangeBar}/>
                <span>Emissions</span>
            </div>
            <div className={style.lgdPlgs}>
                <div className={style.greenBar}/>
                <span>Pledges</span>
            </div>
        </div>
    )
}
