import { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';

import './contextual-widget.widget.scss';
import { DonutChart } from 'react-circle-chart';
import { Boy, AspectRatio, InfoOutlined, MonetizationOnOutlined } from '@mui/icons-material'
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from '@mui/material/Tooltip';

interface Props {
    current: any,
    parent: any
}

const ContextualDataWidget: FunctionComponent<Props> = (props) => {

    const {current, parent} = props
    const lastUpdatedYear = null

    const latestPopulation = (current && current.population && current.population.length > 0) ? current.population[0] : null
    const latestGDP = (current && current.gdp && current.gdp.length > 0) ? current.gdp[0] : null
    const parentPopulation = (parent && parent.population && latestPopulation) ?
     parent.population
     .filter((p:any) => Math.abs(p.year - latestPopulation.year) < 5)
     .sort((p:any) => Math.abs(p.year - latestPopulation.year))
     .shift()
     : null
    const area = (current) ? current.area : null
    const populationSource = null
    const gdpSource = null
    const areaSource = null
    const areaYear = null

    const useStyles = makeStyles(() => ({
        customTooltip: {
          backgroundColor: "rgba(44, 44, 44, 1)",
          padding: "10px"
        },
        customArrow: {
          color: "rgba(44, 44, 44, 1)"
        }
      }));

    const classes = useStyles();

    const items =(latestPopulation && parentPopulation) ?
        [{
            value: 100 - Math.round((latestPopulation.population/parentPopulation.population)*100),
            label: 'Population',
            color: '#D9D9D9'
        },
        {
            value: Math.round((latestPopulation.population/parentPopulation.population)*100),
            label: 'Population',
            color: '#2351DC'
        }]
        :
        [{
            value: 100,
            label: 'N/A',
            color: '#D9D9D9'
        }]

    return (
        <div className="contextual-widget" >
            <div className="contextual-widget__wrapper" >
                <div className="contextual-widget__header">
                    <div className="contextual-widget__title-wrapper">
                        <h3 className="contextual-widget__title">
                            Contextual Data
                        </h3>
                    </div>

                    {   lastUpdatedYear &&
                            <span className="contextual-widget__updated">Last updated in ${lastUpdatedYear}</span>
                    }

                </div>
                <div className="contextual-widget__content">
                    <div className="contextual-widget__left-container">
                        <DonutChart items={items} size={50} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                        <div className="contextual-widget__left-info-box">
                            <div className="contextual-widget__left-header-text">
                                {
                                    (latestPopulation && parentPopulation) ? ((latestPopulation.population/parentPopulation.population)*100).toPrecision(5) : "N/A"
                                }
                                <Tooltip classes={{
                                                tooltip: classes.customTooltip,
                                                arrow: classes.customArrow
                                              }}
                                                title= {
                                                    <div className = "tooltip">
                                                    <div>Source: {(populationSource) ? populationSource : "N/A" }</div>
                                                    <div>Year: {(latestPopulation) ? latestPopulation.year : "N/A"}</div>
                                                </div>
                                            } arrow placement="right">
                                            <InfoOutlined sx={{color: '#A3A3A3', fontSize: 13 }} />
                                            </Tooltip>

                            </div>
                            <div className="contextual-widget__left-subtitle-text">
                                Of Global population
                            </div>
                        </div>
                    </div>
                    <div className={"contextual-widget__border"}></div>
                    <div className="contextual-widget__mid-section-container">
                        <div className="contextual-widget__mid-section">
                            <Boy sx={{color: '#7A7B9A', fontSize: 33 }}/>
                            <div className="contextual-widget__mid-text-box">
                                <div className="contextual-widget__mid-header-text">
                                    {
                                        (latestPopulation) ? ((latestPopulation.population/1000000.0).toPrecision(5)) : "N/A"
                                    }
                                    <div className="contextual-widget__grey-text">M</div>
                                    <Tooltip classes={{
                                                    tooltip: classes.customTooltip,
                                                    arrow: classes.customArrow
                                                  }}
                                                    title= {
                                                        <div className = "tooltip">
                                                        <div>Source: {(populationSource) ? populationSource : "N/A" }</div>
                                                        <div>Year: {(latestPopulation) ? latestPopulation.year : "N/A"}</div>
                                                    </div>
                                                } arrow placement="right">
                                                <InfoOutlined sx={{color: '#A3A3A3', fontSize: 13 }} />
                                                </Tooltip>

                                </div>
                                <div className="contextual-widget__normal-right-text">
                                    Total population
                                </div>
                            </div>
                        </div>
                        <div className="contextual-widget__right-area-section">
                            <div className="contextual-widget__icon-padding">
                                <AspectRatio sx={{color: '#7A7B9A', fontSize: 20 }}/>
                            </div>
                            <div className="contextual-widget__left-info-box">
                                <div className="contextual-widget__mid-header-text">
                                    {(area) ? area : "N/A"}
                                    <div className="contextual-widget__grey-text">Km2</div>
                                    <Tooltip classes={{
                                                    tooltip: classes.customTooltip,
                                                    arrow: classes.customArrow
                                                  }}
                                                    title= {
                                                        <div className = "tooltip">
                                                        <div>Source: {(areaSource) ? areaSource : "N/A"}</div>
                                                        <div>Year: {(areaYear) ? areaYear : "N/A"}</div>
                                                    </div>
                                                } arrow placement="right">

                                                <InfoOutlined sx={{color: '#A3A3A3', fontSize: 13 }} />
                                                </Tooltip>

                                </div>
                                <div className="contextual-widget__normal-right-text">
                                    Total area
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="contextual-widget__right-section">
                        <div className="contextual-widget__icon-padding">
                                <MonetizationOnOutlined sx={{color: '#7A7B9A', fontSize: 24 }}/>
                            </div>
                            <div className="contextual-widget__left-info-box">
                                <div className="contextual-widget__right-header-text">
                                   {(latestGDP) ? ((latestGDP.gdp/1000000000.0).toPrecision(5) + "B") : "N/A"}
                                    <div className="contextual-widget__grey-text">USD</div>
                                    <Tooltip classes={{
                                                    tooltip: classes.customTooltip,
                                                    arrow: classes.customArrow
                                                  }}
                                                    title= {
                                                        <div className = "tooltip">
                                                        <div>Source: {(gdpSource) ? gdpSource : "N/A"}</div>
                                                        <div>Year: {(latestGDP) ? latestGDP.year : "N/A"}</div>
                                                    </div>
                                                } arrow placement="right">

                                                <InfoOutlined sx={{color: '#A3A3A3', fontSize: 13 }} />
                                                </Tooltip>
                                                </div>

                                <div className="contextual-widget__normal-right-text">
                                    GDP
                                </div>

                            </div>
                        </div>
                </div>

            </div>
        </div>

    );
}


export default ContextualDataWidget;