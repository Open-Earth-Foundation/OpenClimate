import React, { FunctionComponent, useEffect } from 'react'
import { DispatchThunk, RootState } from '../../store/root-state';
import { connect } from 'react-redux';
import ITrackedEntity from '../../api/models/review/entity/tracked-entity';
import ReviewFilters from './review-filters/review-filters';
import Dashboard from './review-dashboard/review-dashboard';
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
import { MdArrowUpward} from "react-icons/md";
import {DonutChart} from 'react-circle-chart'

import IPledge from '../../api/models/DTO/Pledge/IPledge';
import { ReviewHelper } from '../../shared/helpers/review.helper';
import Bg from './img/Earth_Background_Home_Gray.png';

interface IStateProps  {
    loading: boolean,
    dashboardEntityType: FilterTypes | null,
    selectedEntities: Array<ITrackedEntity>,
    reviewFilters: Array<IReviewFilter>
}

export interface IEmissionsData {
    sources: Array<string>,
    sourceToEmissions: Record<string, EmissionInfo>
}

export interface EmissionInfo {
    latestTotalEmissions: number;
    latestLandSinks: number;
    latestYear: number;
    latestMethodologies: Array<string>;
    yearToEmissions: Record<number, Emissions>
}

export interface Emissions {
    totalEmissions: number;
    landSink: number;
    methodologies: Array<string>;
}

interface IDispatchProps {
    selectFilter: (filterType: FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) => void,
    deselectFilter: (filterType: FilterTypes) => void,
    showModal: (type: string) => void
}

interface IProps extends IStateProps, IDispatchProps {
}

const ReviewPage: FunctionComponent<IProps> = (props) => {
    const [countryOptions, setCountryOptions] = React.useState<{}[]>([]);
    const [pledgesData, setPledgesData] = React.useState<Array<IPledge>>([]);
    const [subns, setSbn] = React.useState<[]>();

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

    const getAllcountries = async () => {
        const countries = await  fetch('/api/country', {

            method: 'GET',
        });
        const jsonData = await countries.json()
        setCountryOptions(jsonData.data)
    }

    React.useEffect(()=> {
        getAllcountries()
    },[])

    const addPledgesData = (newPledges: Array<IPledge>) => setPledgesData(pledgesData.concat(newPledges));

    const handlePledges = async (entityCode: string, type: string) => {

        let pledges;
        switch(type) {
            case 'country':
                pledges = await ReviewHelper.LoadPledgesCountry(entityCode);
                setPledgesData(pledges);
                break;
            case 'subnational':
                pledges = await ReviewHelper.LoadPledgesSubnational(entityCode);
                addPledgesData(pledges);
                break;
            default:
        }
    }

    useEffect(()=> {
        if(subns) {
            console.log(subns);
        }
    }, [subns])

    useEffect(()=> {
        if (dashboardEntity?.jurisdictionName) {
            dashboardEntity?.jurisdictionCode && handlePledges(dashboardEntity?.jurisdictionCode, 'subnational')
        } else {
            dashboardEntity?.countryCode && handlePledges(dashboardEntity.countryCode, 'country');
        }
    }, [dashboardEntity]);

    // Donut earth props items
    const items = [
        {
            value: 32,
            label: "Total",
            color: "#D9D9D9"
        },
        {
            value: 68,
            label: "Difference",
            color: "#FA7200"
        },
    ]

    return (
        <div className="review">
            <div className="review__wrapper" style={{backgroundImage: dashboardEntity ? `url(${Bg})`: ""}}>
                <div style={{backgroundColor : dashboardEntity ? "rgba(255,255,255, 0.8)": "", height: dashboardEntity ? "100%": "", paddingBottom: "50px"}} className="review__foreground">
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
                                        Visualize, report and add relevant data to an <span>aggregated, verified and interoperable</span> portal for climate actions and tracking.
                                    </div>
                                </div>
                            </>
                        }
                        <div className="review__earth-main">
                            <span className="review__actor-type">Global</span>
                            <div className="review__earth-card">
                                <div className="review__earth-card-head">
                                    <span>Earth</span>
                                </div>
                                <div className='review__earth-card-body'>
                                    <div className="review__earth-card-content">
                                        <div>
                                            <MdArrowUpward className="review__earth-card-item-icon"/>
                                            <span className="review__earth-card-item-large-text">49.8</span>
                                            <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                                        </div>
                                        <div className="review__earth-card-item-normal-text">in 2019</div>
                                    </div>
                                    <div className="review__earth-card-content donut-card">
                                        <div className='donut'>
                                            <DonutChart items={items} size={30} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                                        </div>
                                        <div className='right-column'>
                                            <div>
                                                <span className="review__earth-card-item-large-text">287.4</span>
                                                <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                                            </div>
                                            <div className="review__earth-card-item-normal-text target-text">Left based on 1.5 target</div>
                                        </div>
                                    </div>
                                    <div className="review__earth-card-content">
                                        <div>
                                            <MdArrowUpward className="review__earth-card-item-icon"/>
                                            <span className="review__earth-card-item-large-text">1.1 <sup>o</sup>C</span>
                                            <span className="review__earth-card-item-small-text"></span>
                                        </div>
                                        <div className="review__earth-card-item-normal-text">Temperature <br /> since  1880</div>
                                    </div>
                                    <div className="review__earth-card-content donut-card co2concentration">
                                        <div className=''>
                                            <div>
                                                <MdArrowUpward className="review__earth-card-item-icon"/>
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
                                <Dashboard entityType={dashboardEntityType} selectedEntity={dashboardEntityType !== FilterTypes.National ? dashboardEntity : selectedEntities[0]} treatiesData={treatiesData} pledgesData={pledgesData} showModal={showModal} />
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