
import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';

import './emission.widget.scss';
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { EmissionInfo } from '../../../../components/review/review.page';
import { NativeSelect } from '@mui/material';

interface Props {
    isVisible: boolean
    title?: string,
    height?: number,
    width?: number,
    className?: string,
    detailsLink?: string,
    totalGhg?: number,
    landSinks?: number,
    year?: number,
    lastupdated?: string,
    source?: string,
    methodology?: string,
    providerToEmissions: Record<string, EmissionInfo>
    aggregatedEmission?: IAggregatedEmission | null,
    providers?: Array<string>,
    detailsClick?: () => void

}

const EmissionWidget: FunctionComponent<Props> = (props) => {

    const { title, className, width, height, detailsLink, aggregatedEmission,totalGhg, isVisible,  detailsClick, landSinks } = props;

    // const providers = Object.keys(providerToEmissions);
    const providerToEmissions: string[] = ["UNFCCC Annex I", "PRIMAP"];
    const providers: string[] = ["UNFCCC Annex I", "PRIMAP"];

    const [currentProvider, setProvider] = React.useState<string>(providers[0]);
    const [currentEmissions, setEmissions] = React.useState<EmissionInfo>(providerToEmissions[currentProvider]);

    React.useEffect(()=> {
        setEmissions(providerToEmissions[currentProvider])
    },[currentProvider])

    const calculateDecimal = (number: number) => {
        switch(currentProvider){
            case 'UNFCCC Annex I':
                return number / 1000000;
            case 'PRIMAP':
                return number / 1000;
            default:
                return number;
        }
    }

    if(!isVisible)
        return null;


    let showDetails = false;

    console.log(aggregatedEmission);

    if(aggregatedEmission)
        showDetails = aggregatedEmission.facility_ghg_total_gross_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_sinks_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_net_co2e !== 0;

    return (
        <div className="widget" >
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            {title}
                        </h3> 
                        {
                            showDetails || detailsClick ?
                            <>
                            {detailsLink ?
                                <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                                :
                                <a href="#" className="widget__link" onClick={detailsClick}>See details</a>         
                            }
                            </>
                            : ''
                        }

                    </div>

                    <span className="widget__updated">Last Updated June {props.lastupdated} | Data shown refers to {props.year}</span>     

                </div>
                <div className="widget__content" style={{height: `auto`}}>
                    {
                    // currentEmissions.totalGhg ? 
                    aggregatedEmission?
                    <div className={`widget__emission-content ${className}`}>
                            <div className={'widget__emission-block'}>
                                <div className="widget__emission-data red">
                                    {/* {calculateDecimal(currentEmissions.totalGhg)} */}
                                    {aggregatedEmission.facility_ghg_total_net_co2e}
                                    
                                </div>
                                <div className="widget__emission-data-description">Total GHG Emissions
                                </div>
                                <div className="widget__emission-data-description">Mt CO2e/year</div>
                            </div>
                            {/* { !!currentEmissions.landSinks && 
                                <div className={`widget__emission-numbers widget__emission-block`}>
                                    <div className="widget__emission-data-small green">
                                        {calculateDecimal(currentEmissions.landSinks)}
                                    </div>
                                    <div className="widget__emission-data-description">Land Use Sinks Mt CO2e/year</div>
                                </div>
                            } */}
                            <div className='widget__meta-data'>
                                <div className='widget__meta-text-left'>
                                    <span className='widget__meta-source-head'>Source</span>
                                    <NativeSelect
                                      defaultValue={providers[0]}
                                      onChange={(event) => setProvider(event.target.value)}
                                      sx={{
                                          fontSize: '10px',
                                          fontFamily: 'Lato',
                                          textDecoration: 'none',
                                          fontWeight: '700'
                                      }}
                                    >
                                        {providers?.map(provider => 
                                            <option value={provider}>{provider}</option>)}
                                    
                                    </NativeSelect>
                                </div>
                                {/* <div className='widget__meta-text-right'>
                                    <span className='widget__meta-source-head'>Methodology</span>
                                    <div className='widget__methodology-tags'>
                                    { currentEmissions.methodologyTags && 
                                        currentEmissions.methodologyTags.slice(0,2).map((tag:any) => 
                                        <span className='widget__meta-source-m'>{tag}</span>) }
                                        {
                                            currentEmissions.methodologyTags.length > 2 && 
                                            <span className='widget__meta-source-m'>{ `+${currentEmissions.methodologyTags.length - 2}`}</span>
                                        }
                                    </div>
                                </div> */}
                            </div>
                    </div>
                    : 
                    <div className="widget__no-data">
                        No data sourced yet. Have any suggestions, contact ux@openearth.org!
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}


export default EmissionWidget;
