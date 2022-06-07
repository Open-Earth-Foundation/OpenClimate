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
import DropdownOpen from '../../shared/components/form-elements/dropdown/dropdown-open/dropdown-open';



interface IStateProps  {
    loading: boolean,
    dashboardEntityType: FilterTypes | null,
    selectedEntities: Array<ITrackedEntity>,
    reviewFilters: Array<IReviewFilter>
}
interface IEmissionsData {
    actor_name: string,
    flag_icon: string,
    total_ghg: number,
    lastUpdated: string,
    year: number,
    dataProviderName: string,
    methodologyType: string
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
    const [emissionsData, setEmissionsData] = React.useState<IEmissionsData>();
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
        const val = e.target.value
        const country = countryOptions.filter(v => {
            console.log(v)
            return Object.values(v).join('').toLocaleLowerCase().includes(val)
        });
        setNations(country)
        console.log(country)
    }

    
    const setStateValue = async (e:any) =>{
        e.preventDefault();
        const nationalId:number = e.target.getAttribute("data-id");
        setStateV(e.target.value)
        setNationId(nationalId)
        setSelectNation((p)=>!p);
        console.log(nationId)

        // fetch data
        fetchData(nationalId);
        setSubV('');
        setCityV('')
            
    }
    
    const fetchData = async (id:any) => {
        const fetchCountryData = await fetch(`/api/country/${id}/2019/PRIMAP`);
        const jsonData = await fetchCountryData.json();
        console.log(jsonData);
        console.log(jsonData.data[0].Emissions[0].total_ghg_co2e);
        setTghg(jsonData.data[0].Emissions[0].total_ghg_co2e)
        console.log()
        const data = {
            actor_name: '',
            flag_icon: '',               
            total_ghg : 0,
            lastUpdated: '',
            year: 0,
            dataProviderName : '',
            methodologyType: ''
        }
        data['actor_name'] = jsonData.data[0].country_name
        data['flag_icon'] = jsonData.data[0].flag_icon
        data['total_ghg'] = jsonData.data[0].Emissions[0].total_ghg_co2e
        data['lastUpdated'] = jsonData.data[0].Emissions[0].year
        data['year'] = jsonData.data[0].Emissions[0].year
        data['dataProviderName'] = jsonData.data[0].Emissions[0].DataProvider.data_provider_name
        data['methodologyType'] = jsonData.data[0].Emissions[0].DataProvider.Methodology.methodology_type
        setEmissionsData(data)
        setSbn(jsonData.data[0].Subnationals)
    }
    
    const fetchSubnationalData = async (id:any) => {
        const fetchCountryData = await fetch(`http://localhost/api/subnationals/${id}`);
        const jsonData = await fetchCountryData.json();
        console.log(jsonData);
        console.log(jsonData.data[0].Emissions[0].total_ghg_co2e);
        setTghg(jsonData.data[0].Emissions[0].total_ghg_co2e)
        console.log()
        const data = {
            actor_name: '',
            flag_icon: '',               
            total_ghg : 0,
            lastUpdated: '',
            year: 0,
            dataProviderName : '',
            methodologyType: ''
        }
        data['actor_name'] = jsonData.data[0].subnational_name
        data['flag_icon'] = jsonData.data[0].flag_icon
        data['total_ghg'] = jsonData.data[0].Emissions[0].total_ghg_co2e
        data['lastUpdated'] = jsonData.data[0].Emissions[0].year
        data['year'] = jsonData.data[0].Emissions[0].year
        data['dataProviderName'] = jsonData.data[0].Emissions[0].DataProvider.data_provider_name
        data['methodologyType'] = jsonData.data[0].Emissions[0].DataProvider.Methodology.methodology_type
        setEmissionsData(data);
        setCity(jsonData.data[0].Cities);
    }
    useEffect(()=> {
        if(emissionsData) {
            
            console.log(emissionsData);
        }
    }, [emissionsData])

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
        const fetchCountryData = await fetch(`/api/city/${id}`);
        const jsonData = await fetchCountryData.json();
        console.log(jsonData);
        console.log(jsonData.data[0].Emissions[0].total_ghg_co2e);
        setTghg(jsonData.data[0].Emissions[0].total_ghg_co2e);
        console.log()
        const data = {
            actor_name: '',
            flag_icon: '',               
            total_ghg : 0,
            lastUpdated: '',
            year: 0,
            dataProviderName : '',
            methodologyType: ''
        }
        data['actor_name'] = jsonData.data[0].city_name
        data['flag_icon'] = jsonData.data[0].flag_icon
        data['total_ghg'] = jsonData.data[0].Emissions[0].total_ghg_co2e
        data['lastUpdated'] = jsonData.data[0].Emissions[0].year
        data['year'] = jsonData.data[0].Emissions[0].year
        data['dataProviderName'] = jsonData.data[0].Emissions[0].DataProvider.data_provider_name
        data['methodologyType'] = jsonData.data[0].Emissions[0].DataProvider.Methodology.methodology_type
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
    }

    const handleDropCity = () => {
        setSelectCity((p)=>!p);
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
                                    <label>Subnational</label>
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
                                                    placeholder="Subnational"
                                                    onClick={handleSub}
                                                />

                                    {
                                        selectSub && (
                                            <div className='explore__dropdown'>
                                                <div  className='explore__filter-2'>
                                                    <HiSearch className='icon'/>
                                                    <input
                                                    onChange={handleFilter} type="text" placeholder="Search Country" className='explore__filter-input'/>
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
                        <div className='review__filters'>
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
                        </div>
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
                                                    placeholder="Subnational"
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
                                                <ul role="menu" className='explore__select' aria-label='Countries'>
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
                            <Dashboard selectedEntity={dashboardEntity} emissionData={emissionsData} showModal={showModal} /> 
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