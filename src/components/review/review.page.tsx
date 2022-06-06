import React, { FunctionComponent } from 'react'
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
import {HiOutlineSearch} from 'react-icons/hi'

interface IStateProps  {
    loading: boolean,
    dashboardEntityType: FilterTypes | null,
    selectedEntities: Array<ITrackedEntity>,
    reviewFilters: Array<IReviewFilter>
}

interface IDispatchProps {
    selectFilter: (filterType: FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) => void,
    deselectFilter: (filterType: FilterTypes) => void,
    showModal: (type: string) => void
}

interface IProps extends IStateProps, IDispatchProps {
}

const ReviewPage: FunctionComponent<IProps> = (props) => {

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
                                    {dashboardEntity.countryCode ?
                                        <CircleFlag countryCode={dashboardEntity.countryCode} height="35" />
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


                            <Dashboard selectedEntity={dashboardEntity} showModal={showModal} /> 
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