import { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';

import './contextual-widget.widget.scss';
import { DonutChart } from 'react-circle-chart';
import { Boy, AspectRatio, InfoOutlined, MonetizationOnOutlined } from '@mui/icons-material'
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from '@mui/material/Tooltip';



const ContextualDataWidget: FunctionComponent = () => {

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
        <div className="widget" style={{width: '578px', height: '250px'}}> 
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            Contextual Data
                        </h3>
                    </div>

                    <span className="widget__updated">Last updated in 2018</span>     

                </div>
                <div className="widget__content">
                    <div className="widget__context-content">
                        <div className="widget__donut-section">
                            <DonutChart items={items} size={50} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                            <div className="widget__donut-text-box">
                                <div className="widget__big-text">
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
                                <div className="widget__normal-text">
                                    Of Global population
                                </div>

                            </div>
                        </div>
                        <div className={"widget__border"}></div>
                        <div className="mid-section">
                            <div className="widget__right-section">
                                <Boy sx={{color: '#7A7B9A', fontSize: 33 }}/>
                                <div className="widget__total-text-box">
                                    <div className="widget__big-right-text">
                                        1425.8
                                        <div className="widget__grey-text">M</div> 
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
                                    <div className="widget__normal-right-text">
                                        Total population
                                    </div>

                                </div>
                            </div>
                            <div className="widget__right-area-section">
                                <div className="icon-padding"><AspectRatio sx={{color: '#7A7B9A', fontSize: 20 }}/></div>
                                <div className="widget__donut-text-box">
                                    <div className="widget__big-right-text">
                                        9.7M
                                        <div className="widget__grey-text">Km2</div> 
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
                                    <div className="widget__normal-right-text">
                                        Total area
                                    </div>
                                                
                                </div>
                            </div>
                        </div>
                        <div className="widget__right-GDP-section">
                            <div className="icon-padding"><MonetizationOnOutlined sx={{color: '#7A7B9A', fontSize: 24 }}/></div>
                                <div className="widget__donut-text-box">
                                    <div className="widget__big-GDP-text">
                                        19.485T
                                        <div className="widget__grey-text">USD</div> 
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
                                                
                                    <div className="widget__normal-right-text">
                                        GDP
                                    </div>
                                                
                                </div>
                            </div>
                    </div>
                </div>

            </div>
        </div>

    );
}


export default ContextualDataWidget;