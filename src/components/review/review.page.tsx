import React, { FunctionComponent, useEffect } from 'react'
import { DispatchThunk, RootState } from '../../store/root-state';
import { connect } from 'react-redux';
import ReviewInfo from './review-info/review-info';
import ITrackedEntity from '../../api/models/review/entity/tracked-entity';
import Switcher from '../../shared/components/form-elements/switcher/switcher';
import ReviewFilters from './review-filters/review-filters';
import Dashboard from './review-dashboard/review-dashboard';
import ContextBars from './review-context-bars/context-bars';
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option';
import Loader from "react-loader-spinner";
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes';
import { IReviewFilter } from '../../api/models/review/dashboard/reviewFilter';
import { CircleFlag } from 'react-circle-flags';
import * as reviewSelectors from '../../store/review/review.selectors';
import * as reviewActions from '../../store/review/review.actions';
import * as appActions from '../../store/app/app.actions'; 
import './review.page.scss';
import '../explore/explore.page.scss'
import {HiOutlineSearch, HiSearch} from 'react-icons/hi'

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
    lastUpdated: string,
    landSinks: number,
    year: number,
    otherGases: string,
    methodologyTags: Array<string>
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
    const [dashboardEntity, setDashboardEntity] = React.useState<ITrackedEntity|null>(null)
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
    let collapceEntities: Array<ITrackedEntity> = [];

    // if(dashboardEntityType !== null)
    // {
    //     dashboardEntity = selectedEntities.find(se => se.type === dashboardEntityType) ?? null;
    //     collapceEntities = selectedEntities.filter(se => se.type !== dashboardEntityType);
    // }

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
        console.log(jsonData.data)
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

    useEffect(()=> {

        fetchProviderData();
    },[])

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
        setTghg(jsonData.data[0].Emissions[0].total_ghg_co2e)
        const providerToEmissionsData = ReviewHelper.createProviderEmissionsData(jsonData.data[0].Emissions)
        
        const data = {
            actor_name: jsonData.data[0].country_name,
            flag_icon: jsonData.data[0].flag_icon,
            providerToEmissions: providerToEmissionsData
        }

        const countryCode = jsonData.data[0].iso
        handleTreaties(countryCode);
        handlePledges(countryCode, 'country');
        setEmissionsData(data);
        setDashboardEntity({...dashboardEntity, countryCode: countryCode, countryId: id} as ITrackedEntity)
        
        setSbn(jsonData.data[0].Subnationals)
    }
    
    const fetchSubnationalData = async (id:any) => {
        const fetchCountryData = await fetch(`/api/subnationals/2019/${id}`);
        const jsonData = await fetchCountryData.json();
        const providerToEmissionsData = ReviewHelper.createProviderEmissionsData(jsonData.data[0].Emissions)
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

    const fetchProviderData = async () => {
        const providerData = await fetch('api/providers');
        const jsonData = await providerData.json();

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
        const providerToEmissionsData = ReviewHelper.createProviderEmissionsData(jsonData.data[0].Emissions)

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


    return (
        <div className="review">
            <div className="review__wrapper">

                {loading ? 
                <div className="loader">
                    <Loader
                    type="Oval"
                    color="#A3A3A3"
                    height={100}
                    width={100}
                    />  
                </div>
                : "" 
                }

                <div className="review__top-wrapper content-wrapper">
                    <p className='review__heading'>Earth Indicators</p>
                    <ContextBars 
                        entitySelected={dashboardEntity ? true : false}
                        collapceEntities={collapceEntities}
                        deselectFilter={deselectFilter}
                     />
                    {
                        dashboardEntity ? "" : 
                        <div className="review__info">
                            <ReviewInfo title="An open source and digitally integrated climate accounting system">
                            Use the filters to explore where emissions come from. We aggregate data from public sources so that you can study how each country, subnational actor and company contributes to global warming and their mitigation actions to reduce emissions.
                            </ReviewInfo>
                        </div>
                    }
                    <div className="review__filter-button-wrapper">
                        <a href='/explore'>
                            <button className="review__filter-button">
                                <HiOutlineSearch className='review__icon'/>
                                <span>Explore by actor</span>
                            </button>
                        </a>
                    </div>
                    <div className="review__filters-wrapper">
                        
                        <div className='review__filters'>
                            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown__title title-label">
                                    <label>Country</label>
                                </div>

                                <div 
                                    className={`${error ? 'field-error' : ''} dropdown__selected input-wrapper`} 
                                    // onClick={() => openHandler(!open)}
                                >
                                    <div className="dropdown__selected-text">
                                        <div className="selected-area">


                                            
                                                <input
                                                    autoComplete='off'
                                                    className='selected-area__option'
                                                    value={stateValue}
                                                    placeholder="Country"
                                                    onClick={handleDropNation}
                                                />

                                    {
                                        selectNation && (
                                            <div className='explore__dropdown'>
                                                <div  className='explore__filter-2'>
                                                    <HiSearch className='icon'/>
                                                    <input
                                                    onChange={handleFilter} type="text" placeholder="Search Country" className='explore__filter-input'/>
                                                </div>
                                                <ul role="menu" className='explore__select' aria-label='Countries'>
                                                    {
                                                        nations.map((item: INation) =>(
                                                            <button onClick={setStateValue} key={item.country_id} className='explore__btn-options' data-id={item.country_id} value={item.country_name}>{item.country_name}</button>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }
                                                

                                            {/* {selected ?

                                                <img
                                                    alt="close"
                                                    className="dropdown__close-icon"
                                                    src={DropdownClose}
                                                    onClick={(e) => }
                                                />
                                                : ""
                                            } */}
                                        </div>

                                    </div>
                                    <div className="dropdown__arrow">
                                        {">"}
                                    </div>
                                </div>

                                {/* {errors  && (
                                                    <span role="alert">
                                                    This field is required
                                                    </span>
                                                )}

                                {open ?
                                    <DropdownOpen
                                        searchPlaceholder={searchPlaceholder || ""}
                                        options={options}
                                        withSearch={withSearch}
                                        searchHandler={searchHandler}
                                        selectHandler={selectHandler}
                                    />
                                    :
                                    ""
                                } */}

                            </div>
                        </div>
                        <div className='review__filters'>
                            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown__title title-label">
                                    <label>Region</label>
                                </div>

                                <div 
                                    className={`${error ? 'field-error' : ''} dropdown__selected input-wrapper`} 
                                    // onClick={() => openHandler(!open)}
                                >
                                    <div className="dropdown__selected-text">
                                        <div className="selected-area">
                                                <input
                                                    autoComplete='off'
                                                    className='selected-area__option'
                                                    value={subValue}
                                                    placeholder="Region"
                                                    onClick={handleSub}
                                                />

                                    {
                                        selectSub && (
                                            <div className='explore__dropdown'>
                                                <div  className='explore__filter-2'>
                                                    <HiSearch className='icon'/>
                                                    <input
                                                    onChange={handleFilter} type="text" placeholder="Search Region" className='explore__filter-input'/>
                                                </div>
                                                <ul role="menu" className='explore__select' aria-label='Countries'>
                                                    {
                                                        subns?.map((item: ISubNation) =>{
                                                            console.log(item)
                                                            return <button onClick={setSubnationValue} data-id={item.subnational_id} className='explore__btn-options' value={item.subnational_name}>{item.subnational_name}</button>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }
                                                

                                            {/* {selected ?

                                                <img
                                                    alt="close"
                                                    className="dropdown__close-icon"
                                                    src={DropdownClose}
                                                    onClick={(e) => }
                                                />
                                                : ""
                                            } */}
                                        </div>

                                    </div>
                                    <div className="dropdown__arrow">
                                        {">"}
                                    </div>
                                </div>

                                {/* {errors  && (
                                                    <span role="alert">
                                                    This field is required
                                                    </span>
                                                )}

                                {open ?
                                    <DropdownOpen
                                        searchPlaceholder={searchPlaceholder || ""}
                                        options={options}
                                        withSearch={withSearch}
                                        searchHandler={searchHandler}
                                        selectHandler={selectHandler}
                                    />
                                    :
                                    ""
                                } */}

                            </div>
                        </div>
                        {/* <div className='review__filters'>
                            <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown__title title-label">
                                    <label>Entity Type</label>
                                </div>
                                <div className='dropdown__radio'>
                                    
                                        <input type="radio" id="city" value="city" name='entityType'/> 
                                        <label htmlFor='city'>City</label> <br/>

                                        <input type="radio" id="company" value="company" name='entityType'/> 
                                        <label htmlFor='company'>Company</label>
                                                               
                                </div>
                            </div>
                        </div> */}
                        { city && 
                            <div className='review__filters'>
                                <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="dropdown__title title-label">
                                        <label>City</label>
                                    </div>

                                    <div 
                                        className={`${error ? 'field-error' : ''} dropdown__selected input-wrapper`} 
                                        // onClick={() => openHandler(!open)}
                                    >
                                        <div className="dropdown__selected-text">
                                            <div className="selected-area">
                                                    <input
                                                        autoComplete='off'
                                                        className='selected-area__option'
                                                        value={cityValue}
                                                        placeholder="City"
                                                        onClick={handleDropCity}
                                                    />

                                        {
                                            selectCity && (
                                                <div className='explore__dropdown'>
                                                    <div  className='explore__filter-2'>
                                                        <HiSearch className='icon'/>
                                                        <input
                                                        onChange={handleFilter} type="text" placeholder="Search City" className='explore__filter-input'/>
                                                    </div>
                                                    <ul role="menu" className='explore_treaties && select' aria-label='Countries'>
                                                        {
                                                            city?.map((item: ICity) =>{
                                                                console.log(item)
                                                                return <button onClick={setCityValue} data-id={item.city_id} className='explore__btn-options' value={item.city_name}>{item.city_name}</button>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }


                                                {/* {selected ?

                                                    <img
                                                        alt="close"
                                                        className="dropdown__close-icon"
                                                        src={DropdownClose}
                                                        onClick={(e) => }
                                                    />
                                                    : ""
                                                } */}
                                            </div>

                                        </div>
                                        <div className="dropdown__arrow">
                                            {">"}
                                        </div>
                                    </div>

                                    {/* {errors  && (
                                                        <span role="alert">
                                                        This field is required
                                                        </span>
                                                    )}

                                    {open ?
                                        <DropdownOpen
                                            searchPlaceholder={searchPlaceholder || ""}
                                            options={options}
                                            withSearch={withSearch}
                                            searchHandler={searchHandler}
                                            selectHandler={selectHandler}
                                        />
                                        :
                                        ""
                                    } */}

                                </div>
                            </div>
                        }
                    </div>

                    

                    <div className="review_selected-entity">
                    {
                            emissionsData ? 
                            <div className="review__selected-entity">
                                <div>
                                    {emissionsData?
                                        <img className='review__flag' src={`https://flagcdn.com/${emissionsData.flag_icon}.svg`} alt={``}  width="35" height={35}/>
                                        : ""
                                    }
                                    <span className="review__entity-title">{emissionsData.actor_name}</span>
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
                        emissionsData ? 
                        <>
                            <Dashboard selectedEntity={dashboardEntity} emissionData={emissionsData} treatiesData={treatiesData} pledgesData={pledgesData} showModal={showModal} /> 
                        </>
                        : ''
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