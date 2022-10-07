import React, { FunctionComponent, useEffect } from 'react'
import { DispatchThunk, RootState } from '../../store/root-state';
import { connect } from 'react-redux';
import ReviewInfo from './review-info/review-info';
import ITrackedEntity from '../../api/models/review/entity/tracked-entity';
import ReviewFilters from './review-filters/review-filters';
import Dashboard from './review-dashboard/review-dashboard';
import ContextBars from './review-context-bars/context-bars';
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option';
import {Oval} from "react-loader-spinner";
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes';
import { IReviewFilter } from '../../api/models/review/dashboard/reviewFilter';
import { CircleFlag } from 'react-circle-flags';
import * as reviewSelectors from '../../store/review/review.selectors';
import * as reviewActions from '../../store/review/review.actions';
import * as appActions from '../../store/app/app.actions';
import './review.page.scss';
import '../explore/explore.page.scss'
import {HiOutlineSearch} from 'react-icons/hi'
import {MdClear, MdArrowUpward, MdArrowDropDown} from "react-icons/md";
import {DonutChart} from 'react-circle-chart'

import ITreaties from '../../api/models/DTO/Treaties/ITreaties';
import IPledge from '../../api/models/DTO/Pledge/IPledge';
import { ReviewHelper } from '../../shared/helpers/review.helper';



interface IStateProps  {
    loading: boolean,
    dashboardEntityType: FilterTypes | null,
    selectedEntities: Array<ITrackedEntity>,
    reviewFilters: Array<IReviewFilter>
}
export interface IEmissionsData {
    actor_name: string,
    flag_icon: string,
    providerToEmissions: Record<string, EmissionInfo>
}

export interface EmissionInfo {
    actorType: string,
    totalGhg: number,
    // lastUpdated: string,
    landSinks: number,
    year: number,
    otherGases: number,
    methodologyType: string,
    methodologyTags: any
}

interface IProviderData {
    data_provider_id: number,
    data_provider_name: string,
    verified: boolean,
    data_provider_link: string
}

interface IDispatchProps {
    selectFilter: (filterType: FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) => void,
    deselectFilter: (filterType: FilterTypes) => void,
    showModal: (type: string) => void
}

interface IProps extends IStateProps, IDispatchProps {
}



const ReviewPage: FunctionComponent<IProps> = (props) => {
    const [selectNation, setSelectNation] = React.useState<boolean>(false);
    const [countryOptions, setCountryOptions] = React.useState<{}[]>([]);
    const [nations, setNations] = React.useState<any>(countryOptions);
    const [nationId, setNationId] = React.useState<number>();
    const [snationId, setsNationId] = React.useState<number>();
    const [stateValue, setStateV] = React.useState<string>();
    const [providersData, setProviders] = React.useState<Array<string>>();
    const [emissionsData, setEmissionsData] = React.useState<IEmissionsData>();
    const [treatiesData, setTreatiesData] = React.useState<ITreaties>({});
    const [pledgesData, setPledgesData] = React.useState<Array<IPledge>>([]);
    const [tgh, setTghg] = React.useState<number>();
    const [subns, setSbn] = React.useState<[]>();
    const [subValue, setSubV] = React.useState<string>();
    const [selectSub, setSelectSub] = React.useState<boolean>(false);
    const [selectCity, setSelectCity] = React.useState<boolean>(false);
    const [cityValue, setCityV] = React.useState<string>();
    const [city, setCity] = React.useState<[]>();



    const { loading, dashboardEntityType, selectedEntities, reviewFilters, selectFilter, deselectFilter, showModal  } = props;
    let dashboardEntity:ITrackedEntity|null = null;
    let collapceEntities: Array<ITrackedEntity> = [];

    if(dashboardEntityType !== null)
    {
        dashboardEntity = selectedEntities.find(se => se.type === dashboardEntityType) ?? null;
        collapceEntities = selectedEntities.filter(se => se.type !== dashboardEntityType);
    }

   const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        selectFilter(filterType, option, selectedEntities);
    }
    const error = '';

    const handleDropNation = () => {
        setSelectNation((p)=>!p);
        if(selectSub){
            setSelectSub(false)
        }
        if(selectCity){
            setSelectCity(false)
        }
    }

    const getAllcountries = async () => {
        const countries = await  fetch('/api/country', {

            method: 'GET',
        });
        const jsonData = await countries.json()
        // console.log(jsonData.data)
        setCountryOptions(jsonData.data)
    }

    React.useEffect(()=> {
        getAllcountries()
    },[])

    interface INation {
        country_id: number;
        country_name: string;
    }

    interface ISubNation {
        subnational_id: number,
        subnational_name: string
    }

    interface ICity {
        city_id: string,
        city_name: string
    }

    const handleFilter = (e:any) => {
        const val = e.target.value.toLocaleLowerCase();
        const country = countryOptions.filter(v => {
            return Object.values(v).join('').toLocaleLowerCase().includes(val)
        });
        setNations(country)
    }

    // useEffect(()=> {

    //     fetchProviderData();
    // },[])

    const handleTreaties = async (countryCode: string) => {
        const treaties = await ReviewHelper.LoadTreatiesCountry(countryCode);
        setTreatiesData(treaties);
    }

    const handlePledges = async (entityCode: string, type: string) => {
        let pledges;
        switch(type) {
            case 'country':
                pledges = await ReviewHelper.LoadPledgesCountry(entityCode);
                setPledgesData(pledges);
                break;
            case 'subnational':
                pledges = await ReviewHelper.LoadPledgesSubnational(entityCode);
                setPledgesData(pledges);
                break;
            default:
        }
    }

    const createProviderEmissionsData = (data: Array<any>) => {
        const providerToEmissions: Record<string, EmissionInfo> = {};
        data.forEach(emission => {
            const dataProviderName = emission.DataProvider?.data_provider_name;

            if (dataProviderName && !providerToEmissions[dataProviderName]) {
                const methodologyTags = emission.DataProvider.Methodology.Tags.map((tag:any) => tag.tag_name);
                const emissionData: EmissionInfo = {
                    actorType: emission.actor_type,
                    totalGhg: emission.total_ghg_co2e,
                    year: emission.year,
                    landSinks: emission.land_sinks,
                    otherGases: emission.other_gases,
                    methodologyType: emission.DataProvider?.Methodology?.methodology_type ?? '',
                    methodologyTags: methodologyTags
                }
                providerToEmissions[dataProviderName] = emissionData;
            }
            else if (providerToEmissions[dataProviderName].year === emission.year) {
                if (!providerToEmissions[dataProviderName].totalGhg && emission.total_ghg_co2e) {
                    providerToEmissions[dataProviderName].totalGhg = emission.total_ghg_co2e;
                }
                if (!providerToEmissions[dataProviderName].landSinks && emission.land_sinks) {
                    providerToEmissions[dataProviderName].landSinks = emission.land_sinks;
                }
            }
        })

        return providerToEmissions;
    }


    const setStateValue = async (e:any) =>{
        e.preventDefault();
        const nationalId:number = e.target.getAttribute("data-id");
        setStateV(e.target.value)
        console.log(e.target.value)
        setNationId(nationalId)
        setSelectNation((p)=>!p);
        console.log(nationId)

        // fetch data
        fetchData(nationalId);
        setSubV('');
        setCityV('')

    }

    const fetchData = async (id:any) => {

        const fetchCountryData = await fetch(`/api/country/2019/${id}`);

        const jsonData = await fetchCountryData.json();
        console.log(jsonData);
        setTghg(jsonData.data[0].Emissions[0].total_ghg_co2e)
        const providerToEmissionsData = createProviderEmissionsData(jsonData.data[0].Emissions)

        const data = {
            actor_name: jsonData.data[0].country_name,
            flag_icon: jsonData.data[0].flag_icon,
            providerToEmissions: providerToEmissionsData
        }

        const countryCode = jsonData.data[0].iso
        handleTreaties(countryCode);
        handlePledges(countryCode, 'country');
        setEmissionsData(data)

        setSbn(jsonData.data[0].Subnationals)
    }

    const fetchSubnationalData = async (id:any) => {
        const fetchCountryData = await fetch(`/api/subnationals/2019/${id}`);
        const jsonData = await fetchCountryData.json();
        console.log(jsonData);
        const providerToEmissionsData = createProviderEmissionsData(jsonData.data[0].Emissions)
        setTghg(jsonData.data[0].Emissions[0].total_ghg_co2e)

        const data = {
            actor_name: jsonData.data[0].subnational_name,
            flag_icon: jsonData.data[0].flag_icon,
            providerToEmissions: providerToEmissionsData
        }

        setEmissionsData(data);
        handlePledges(data.actor_name, 'subnational');

        setCity(jsonData.data[0].Cities);
    }

    useEffect(()=> {
        if(subns) {
            console.log(subns);
        }
    }, [subns])

    useEffect(()=> {

        if(city) {
            console.log(city);
        }
    }, [city]);

    const setSubnationValue = (e:any) =>{
        const sbnlId:number = e.target.getAttribute("data-id");
        setSubV(e.target.value)
        setsNationId(sbnlId)
        e.preventDefault();
        setSubV(e.target.value)
        setSelectSub((p)=>!p);
        console.log(sbnlId)
        fetchSubnationalData(sbnlId)
        setCityV('')
    }

    const fetchCityData = async (id:any) => {
        const fetchCountryData = await fetch(`/api/city/2019/${id}`);
        const jsonData = await fetchCountryData.json();

        setTghg(jsonData.data[0].Emissions[0].total_ghg_co2e);
        const providerToEmissionsData = createProviderEmissionsData(jsonData.data[0].Emissions)

        const data = {
            actor_name: jsonData.data[0].country_name,
            flag_icon: jsonData.data[0].flag_icon,
            providerToEmissions: providerToEmissionsData
        }
        setEmissionsData(data);
        setSbn(jsonData.data[0].Subnationals);
    }

    const setCityValue = (e:any) =>{
        const cityId:number = e.target.getAttribute("data-id");
        // setSubV(e.target.value)
        setsNationId(cityId)
        e.preventDefault();
        setCityV(e.target.value)
        setSelectCity((p)=>!p);
        console.log(cityId)
        fetchCityData(cityId)
    }
    const handleSub = () => {
        setSelectSub((p)=>!p);
        if(selectCity){
            setSelectCity(false)
        }
        if(selectNation){
            setSelectNation(false)
        }
    }

    const handleDropCity = () => {
        setSelectCity((p)=>!p);
        if(selectNation){
            setSelectNation(false)
        }
        if(selectSub){
            setSelectSub(false)
        }
    }

    console.log(dashboardEntity)

    // Donut earth props items
    const items = [
        {
            value: 75,
            label: "Difference",
            color: "#D9D9D9"
        },
        {
            value: 25,
            label: "Total",
            color: "#24BE00"
        },
       
    ]
    const amtsItems = [
        {
            value: 53,
            label: "Difference",
            color: "#D9D9D9"
        },
        {
            value: 47,
            label: "Total",
            color: "#F23D33"
        },
    ]


    return (
        <div className="review">
            <div className="review__wrapper">
                <div style={{backgroundColor : dashboardEntity ? "rgba(255,255,255, 0.7)": "", height: dashboardEntity ? "100vh": ""}} className="review__foreground">
                    {
                        dashboardEntity ? '': 
                        <div className='review__background-content'>
                            <div className='review__background-content-left'></div>
                        </div>
                    }

                    {loading ?
                        <div className="loader">
                            <Oval
                            color="#A3A3A3"
                            height={100}
                            width={100}
                            />
                        </div>
                    : ""
                    }

                    <div className="review__top-wrapper content-wrapper">
                        {
                            dashboardEntity ? '':
                            <>
                                <p className='review__heading'>Earth Indicators</p>
                                <div className="review__info">
                                    <div className="review-info__title">
                                        <p>Be part of the future of <span>Climate Data</span> </p>
                                    </div>
                                    <div className="review-info__content">
                                        Visualize, report and add relevant data to an <span>aggregatted, verified and interoperable</span> portal for climate actions and tracking.
                                    </div>
                                </div>
                            </>
                        }
                        <div className="review__earth-main">
                            <span className="review__actor-type">Global</span>
                            <div className="review__earth-card">
                                <div className="review__earth-card-head">
                                    <span>Earth <MdArrowDropDown className="head-icon"/></span> 
                                    <span>
                                        <MdClear className='review__earth-icon'/>
                                    </span> 
                                </div>
                                <div className='review__earth-card-body'>
                                    <div className="review__earth-card-content">
                                        <div>
                                            <MdArrowUpward className="review__earth-card-item-icon"/>
                                            <span className="review__earth-card-item-large-text">+49.8</span>
                                            <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                                        </div>
                                        <div className="review__earth-card-item-normal-text">in 2019</div>
                                    </div>
                                    <div className="review__earth-card-content donut-card">
                                        <div>
                                            <DonutChart items={items} size={50} showTotal={false} trackColor="#D9D9D9"/>
                                        </div>
                                        <div className='right-column'>
                                            <div>
                                                <span className="review__earth-card-item-large-text">550</span>
                                                <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                                            </div>
                                            <div className="review__earth-card-item-normal-text">Left based on 1.5 target</div>
                                        </div>
                                    </div>
                                    <div className="review__earth-card-content">
                                        <div>
                                            <MdArrowUpward className="review__earth-card-item-icon"/>
                                            <span className="review__earth-card-item-large-text">+1.1 <sup>o</sup>C</span>
                                            <span className="review__earth-card-item-small-text"></span>
                                        </div>
                                        <div className="review__earth-card-item-normal-text">Temperature <br /> since  1980</div>
                                    </div>
                                    <div className="review__earth-card-content donut-card">
                                        <div>
                                            <DonutChart items={amtsItems} size={50} showTotal={false} trackColor="#D9D9D9"/>
                                        </div>
                                        <div className='right-column'>
                                            <div>
                                                <span className="review__earth-card-item-large-text">415.3</span>
                                                <span className="review__earth-card-item-small-text">ppm</span>
                                            </div>
                                            <div className="review__earth-card-item-normal-text">atmospheric CO<sub>2 </sub>concentration</div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        
                        <div className="review__filter-button-wrapper">
                            <a href='/explore'>
                                <button className="review__filter-button">
                                    <HiOutlineSearch className='review__icon'/>
                                    <span>Explore by actor</span>
                                </button>
                            </a>
                        </div>
                        <div className="review__filters-wrapper">
                        <ReviewFilters
                            nationState={true}
                            selectFilter={selectFilterHandler}
                            deselectFilter={deselectFilter}
                            filters={reviewFilters}
                        />
                        </div>

                        <div className="review_selected-entity">
                        {
                                dashboardEntity ?
                                <div className="review__selected-entity">
                                    <div>
                                        {dashboardEntity.flagCode ?
                                            // <img className='review__flag' src={`https://flagcdn.com/${emissionsData?.flag_icon}.svg`} alt={``}  width="35" height={35}/>
                                            <CircleFlag countryCode={dashboardEntity.flagCode} height="35" />
                                            : ""
                                        }
                                        <span className="review__entity-title">{dashboardEntity.title}</span>
                                    </div>
                                    <div className="review__explore-link">
                                        <a href="#" onClick={() => showModal('information-summary')}>Explore State Data</a>
                                    </div>
                                </div>
                                :
                                ""
                            }
                        </div>

                    </div>

                    <div className="review__content content-wrapper">
                        {
                            dashboardEntity ?
                            <>
                                <Dashboard entityType={dashboardEntityType} selectedEntity={dashboardEntity} treatiesData={treatiesData} pledgesData={pledgesData} showModal={showModal} />
                            </>
                            : ''
                        }
                    </div>


                    {
                        dashboardEntity ? "" :
                        <div className="contact__block">
                            <div className="contact__title">Looking where to add your data?</div>
                            <div className="contact__subtitle">Contact us and start now!</div>
                            <a href='mailto:climatedata@openearth.org'><button className="contact__button" >Contact us</button></a>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = (state: RootState, ownProps: any) => {

    const entities = reviewSelectors.getSelectedEntities(state.review);

    return {
        selectedEntities: entities,
        loading: reviewSelectors.getLoading(state.review),
        dashboardEntityType: reviewSelectors.getDashboardType(state.review),
        reviewFilters: reviewSelectors.getReviewFilters(state.review)
    }
}

const mapDispatchToProps = (dispatch: DispatchThunk) => {
    return {
        selectFilter: (filterType: FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) =>
            dispatch(reviewActions.doSelectFilter(filterType, option, selectedEntities)),
        deselectFilter: (filterType: FilterTypes) => dispatch(reviewActions.deselectFilter(filterType)),
        showModal: (type:string) => {
            dispatch(appActions.showModal(type))
          }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);