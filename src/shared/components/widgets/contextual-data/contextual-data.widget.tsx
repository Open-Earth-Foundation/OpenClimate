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

    const items = [{
        value: 95,
        label: 'Population',
        color: '#D9D9D9'
    },
    {
        value: 5,
        label: 'Population',
        color: '#2351DC'
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

                    <span className="contextual-widget__updated">Last updated in 2018</span>

                </div>
                <div className="contextual-widget__content">
                    <div className="contextual-widget__left-container">
                        <DonutChart items={items} size={50} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                        <div className="contextual-widget__left-info-box">
                            <div className="contextual-widget__left-header-text">
                                10%
                                <Tooltip classes={{
                                                tooltip: classes.customTooltip,
                                                arrow: classes.customArrow
                                              }}
                                                title= {
                                                    <div className = "tooltip">
                                                    <div>Source: CDP</div>
                                                    <div>Year: 2005</div>
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
                                    1425.8
                                    <div className="contextual-widget__grey-text">M</div>
                                    <Tooltip classes={{
                                                    tooltip: classes.customTooltip,
                                                    arrow: classes.customArrow
                                                  }}
                                                    title= {
                                                        <div className = "tooltip">
                                                        <div>Source: CDP</div>
                                                        <div>Year: 2005</div>
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
                                    9.7M
                                    <div className="contextual-widget__grey-text">Km2</div>
                                    <Tooltip classes={{
                                                    tooltip: classes.customTooltip,
                                                    arrow: classes.customArrow
                                                  }}
                                                    title= {
                                                        <div className = "tooltip">
                                                        <div>Source: CDP</div>
                                                        <div>Year: 2005</div>
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
                                    19.485T
                                    <div className="contextual-widget__grey-text">USD</div>
                                    <Tooltip classes={{
                                                    tooltip: classes.customTooltip,
                                                    arrow: classes.customArrow
                                                  }}
                                                    title= {
                                                        <div className = "tooltip">
                                                        <div>Source: CDP</div>
                                                        <div>Year: 2005</div>
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