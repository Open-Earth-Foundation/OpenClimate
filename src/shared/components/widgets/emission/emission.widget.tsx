
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

    
    const { title, className, width, height, detailsLink, aggregatedEmission, totalGhg, isVisible,  detailsClick, landSinks, providerToEmissions } = props;

    const [providerList, setProviderList] = React.useState<Array<string>>([])
    const [currentProvider, setProvider] = React.useState<number>(0);
    const [currentEmissions, setEmissions] = React.useState<EmissionInfo>({} as EmissionInfo);


    React.useEffect(()=> {
        if (providerToEmissions) {
            setProviderList(Object.keys(providerToEmissions))
        }
    },[providerToEmissions])

    React.useEffect(()=> {
        providerToEmissions && setEmissions(providerToEmissions[providerList[currentProvider]])
    },[providerList, providerToEmissions])

    React.useEffect(()=> {
        providerToEmissions && setEmissions(providerToEmissions[providerList[currentProvider]])
    },[currentProvider, providerToEmissions])


    const calculateDecimal = (number: number) => {
        switch(providerList[currentProvider]){
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
                    currentEmissions?.totalGhg ? 
                    <div className={`widget__emission-content ${className}`}>
                            <div className={'widget__emission-block'}>
                                <div className="widget__emission-data red">
                                    {calculateDecimal(currentEmissions?.totalGhg)}
                                    
                                </div>
                                <div className="widget__emission-data-description">Total GHG Emissions
                                </div>
                                <div className="widget__emission-data-description">Mt CO2e/year</div>
                            </div>
                            { !!currentEmissions?.landSinks && 
                                <div className={`widget__emission-numbers widget__emission-block`}>
                                    <div className="widget__emission-data-small green">
                                        {calculateDecimal(currentEmissions?.landSinks)}
                                    </div>
                                    <div className="widget__emission-data-description">Land Use Sinks Mt CO2e/year</div>
                                </div>
                            }
                            <div className='widget__meta-data'>
                                <div className='widget__meta-text-left'>
                                    <span className='widget__meta-source-head'>Source</span>
                                    <NativeSelect
                                      defaultValue={providerList?.[currentProvider] || ''}
                                      onChange={(event) => setProvider(parseInt(event.target.value))}
                                      sx={{
                                          fontSize: '10px',
                                          fontFamily: 'Lato',
                                          textDecoration: 'none',
                                          fontWeight: '700'
                                      }}
                                    >
                                        {providerList?.map((provider, index) => 
                                            <option value={index}>{provider}</option>)}
                                    
                                    </NativeSelect>
                                </div>
                                <div className='widget__meta-text-right'>
                                    <span className='widget__meta-source-head'>Methodology</span>
                                    <div className='widget__methodology-tags'>
                                    { currentEmissions?.methodologyTags && 
                                        currentEmissions?.methodologyTags.slice(0,2).map(tag => 
                                        <span className='widget__meta-source-m'>{tag}</span>) }
                                        {
                                            currentEmissions?.methodologyTags.length > 2 && 
                                            <span className='widget__meta-source-m'>{ `+${currentEmissions?.methodologyTags.length - 2}`}</span>
                                        }
                                    </div>
                                </div>
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
