import React, { FunctionComponent, useEffect } from 'react'
import { NavLink } from 'react-router-dom';

import './emission.widget.scss';
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import { EmissionInfo } from '../../../../components/review/review.page';
import { NativeSelect } from '@mui/material';
import { getCityProviders, getEmissionProviders, getSubnationalProviders } from '../../../helpers/get-emission-providers.helper';
import ArrowUpRed from '../../../img/widgets/arrow_up_red.svg';
import ArrowDownGreen from '../../../img/widgets/arrow_down_green.svg';
import ITrackedEntity from '../../../../api/models/review/entity/tracked-entity';
import { getChangedEmissionData } from '../../../helpers/review.helper';
import { FilterTypes } from '../../../../api/models/review/dashboard/filterTypes';

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
    aggregatedEmission?: IAggregatedEmission | null,
    selectedEntity?: ITrackedEntity | null,
    entityType?: FilterTypes | null,
    providers?: Array<string>,
    detailsClick?: () => void
}

const EmissionWidget: FunctionComponent<Props> = (props) => {
    const [provider, setProviders] = React.useState<Object []>([])
    const [etype, setEtype] = React.useState<FilterTypes | null>()
    let [src, setSrc] = React.useState<Object>()

    const { title, className, entityType, width, height, detailsLink, selectedEntity, totalGhg, isVisible,  detailsClick, landSinks } = props;
    // Will enable us to re-asign emission data when source is changes
    let {aggregatedEmission} = props
    const providerToEmissions = aggregatedEmission?.providerToEmissions;

    const [providerList, setProviderList] = React.useState<Array<string>>([])
    const [currentProvider, setProvider] = React.useState<number>(0);
    const [currentEmissions, setEmissions] = React.useState<EmissionInfo>({} as EmissionInfo);
    const methtags = aggregatedEmission?.facility_ghg_methodologies

    let tags = methtags?.map((tag:any)=>tag.tag_name);

    useEffect(()=> {
        setEtype(entityType)
    }, [entityType])


    useEffect(()=> {
        providers(etype)
    },[etype])

    // Setting provider by entity to state
    // This enables us to track the providers for each entity dynamically
    const providers = async (type:FilterTypes | null | undefined) => {
        switch(type){
            case 0:
                const nationalEmissionProvider = await getEmissionProviders()
                setProviders(nationalEmissionProvider)
                break;
            case 1:
                const  subnationalEmissionProvider = await getSubnationalProviders()
                setProviders(subnationalEmissionProvider)
                break;
            case 2:
                const cityEmissionProvider = await getCityProviders()
                setProviders(cityEmissionProvider)
                break;
            default:
                return null;
        }
    }
    useEffect(()=> {
    }, [provider])

    // This function handles the onChange select event and tracks the value - DataProviderId
    // It accepts three params dataproviderId, entityType (enum number value) tracked from redux state and the selected entity (country, city ...)
    const changeDataSource = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dataProviderId = e.target.value
        const source = await getChangedEmissionData(parseInt(dataProviderId), entityType, selectedEntity)
        setSrc(source)
    }

    const calculateDecimal = (number: number) => {
        return number/1000000.0
    }

    if(!isVisible)
        return null;

    let showDetails = false;
    if(aggregatedEmission)
        showDetails = aggregatedEmission.facility_ghg_total_gross_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_sinks_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_net_co2e !== 0;
    let em = aggregatedEmission

    // Switching emission data between different data provider sources
    // This is being done using the tracked entity from redux
    // The case numbers or values represent the enum value of the entity type
    // When provider is changed in the dropdown select menu, this will update the aggregatedEmissions object
    // This also keeps track of the methodologies

    switch(entityType){
        case 0:
            if(aggregatedEmission && !src){
                aggregatedEmission = em
            }
            else{
                aggregatedEmission = src
                tags = aggregatedEmission?.facility_ghg_methodologies?.map((tag:any)=>tag.tag_name);
            }
            break
        case 1:
            if(aggregatedEmission && !src){
                aggregatedEmission = em
            }
            else{
                aggregatedEmission = em
                tags = em?.facility_ghg_methodologies?.map((tag:any)=>tag.tag_name);
            }
            break
        default:
            aggregatedEmission = aggregatedEmission
    }

    // checks enum entity type and swiched between them
    return entityType == 3 ? (
        <div className="widget" style={{width: width, height: height}}>
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            {title}
                        </h3>
                        {
                            showDetails ?
                            <>
                            {detailsLink ?
                                <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                                :
                                <a href="#" className="widget__link" onClick={detailsClick}>Details</a>
                            }
                            </>
                            : ''
                        }

                    </div>

                    <span className="widget__updated">Last Updated June 2020</span>

                </div>
                <div className="widget__content" style={{height: `calc(${height}px - 90px)`}}>
                    {
                    selectedEntity ?
                    <div className={`widget__emission-content ${className}`}>
                        <div className="widget__emission-numbers">
                            <div className="widget__content-column">
                                <div className="widget__emission-data red text-top">
                                    <img src={ArrowUpRed} alt="up" className="widget__emission-arrow"/>
                                    {(selectedEntity.total_scope_emissions)/1000000.0}
                                </div>
                                <div className="widget__emission-data-description">
                                    Total GHG Emissions Mmt CO2e/year
                                </div>
                                        </div>
                                        <div className="widget__content-column widget__content-column_center">-</div>
                                        <div className="widget__content-column text-top">
                                            <div className="widget__emission-data green">
                                                <img src={ArrowDownGreen} alt="down" className="widget__emission-arrow" />
                                                {(selectedEntity.total_scope_mitigations)/1000000.0}
                                            </div>
                                            <div className="widget__emission-data-description">Land Use Sinks
                        Mt CO2e/year</div>
                                        </div>
                                        <div className="widget__content-column widget__content-column_center">=</div>
                                        <div className="widget__content-column text-top red">
                                            <div className="widget__emission-data">{(selectedEntity.total_scope_emissions - selectedEntity.total_scope_mitigations)/1000000.0}</div>
                                            <div className="widget__emission-data-description">Net GHG Emissions
                        Mt CO2e/year</div>
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
    ) : (
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

                        <span className="widget__updated">Last Updated {aggregatedEmission?.facility_ghg_date_updated} | Data shown refers to {aggregatedEmission?.facility_ghg_year}</span>

                    </div>
                    <div className="widget__content" style={{height: `auto`}}>
                        {
                        aggregatedEmission?.facility_ghg_total_gross_co2e ?
                        <div className={`widget__emission-content ${className}`}>
                                <div className={'widget__emission-block'}>
                                    <div className="widget__emission-data red">
                                        {calculateDecimal(aggregatedEmission?.facility_ghg_total_gross_co2e)}

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
                                          defaultValue={provider[0]}
                                          onChange={(event) => changeDataSource(event)}
                                          sx={{
                                              fontSize: '10px',
                                              fontFamily: 'Lato',
                                              textDecoration: 'none',
                                              fontWeight: '700'
                                          }}
                                        >
                                            {provider?.map((p:any) => <option value={p.providerId}>{p.providerName}</option>)     }

                                        </NativeSelect>
                                    </div>
                                    <div className='widget__meta-text-right'>
                                        <span className='widget__meta-source-head'>Methodology</span>
                                        <div className='widget__methodology-tags'>
                                        { tags &&
                                            tags.slice(0,2).map(tag =>
                                            <span className='widget__meta-source-m'>{tag}</span>) }
                                            {
                                                tags && tags?.length > 2 &&
                                                <span className='widget__meta-source-m'>{ `+${tags?.length - 2}`}</span>
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