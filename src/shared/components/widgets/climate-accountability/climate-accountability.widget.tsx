import React, { FunctionComponent } from 'react'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import './climate-accountability.widget.scss';
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';

interface Props {
    height: number,
    aggregatedEmission?: IAggregatedEmission
}

const ClimateAccountabilityWidget: FunctionComponent<Props> = (props) => {

    const { height, aggregatedEmission } = props;

    const reportDataOptions: ApexOptions = {
        colors:['#007568', '#03AA6F', '#E6E7E8'],
        fill: {
            colors:['#007568', '#03AA6F', '#E6E7E8'],
        },
        labels: ["Direct tracking & Verification", "Verified", "Self reported"],
        legend: {
            floating: false,
            horizontalAlign:'left',
            position: 'bottom',
            fontSize: '11px',
            width: 230,
            fontFamily: "Poppins",
            labels: {
                colors: ['#007568', '#03AA6F', '#E6E7E8']
            },
            markers: {
                fillColors: ['#007568', '#03AA6F', '#E6E7E8'],

                width: 8,
                height:8,
                radius: 8,
                offsetX: -4
            },
            itemMargin: {
                horizontal: 0,
                vertical: 0
            }
        },
        dataLabels: {
            offsetY: 50,
            textAnchor: "middle",
            style: {
                fontSize: "14px",
                fontWeight: "bold",
                fontFamily: "Poppins",
                colors: ['#007568', '#03AA6F', '#E6E7E8'],
              },
            dropShadow: {
                enabled: false
            },
            background: {
                borderRadius: 0.2,
                dropShadow: {}
            }
        },
        plotOptions: {
            pie: {
                offsetY: 5,
                dataLabels:{
                    offset: 42
                },
                donut: {
                    size: '60%'
                },
                customScale: 0.8
            },
            
        },
        tooltip: {
            fillSeriesColor: true,
            y: {
                formatter: value => (value.toFixed(2))
            }
        }
        
    }
     
    const tracking = aggregatedEmission?.verification_accountability_direct ?? 0;
    const indirect = aggregatedEmission?.verification_accountability_indirect ?? 0;
    const untrackable = aggregatedEmission?.verification_accountability_no_tracking ?? 0;
    
    return (
        <div className="widget" style={{ height: height}}>
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            Climate accountability
                        </h3> 
                    </div>

                    <span className="widget__updated">Last Updated June 2020</span>     

                </div>
                <div className="widget__content" style={{height: `calc(${height}px - 90px)`}}>
                        
                    <div className="widget__climate-accountability-content">
                        <div className="widget__content-title">
                                Traceability of climate actions 
                        </div>
                        <div className="widget__content-subtitle">
                            Through verifiable MRV methods and linked devices
                        </div>
                        <Chart  
                            options={reportDataOptions} 
                            series={[tracking, indirect, untrackable]} 
                            type="donut" width="380" />
                    </div>
                </div>
            </div>
        </div>

    );
}


export default ClimateAccountabilityWidget;
