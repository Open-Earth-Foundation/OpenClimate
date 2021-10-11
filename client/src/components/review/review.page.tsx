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

interface IStateProps  {
    loading: boolean,
    earthInfo: ITrackedEntity | null,
    dashboardEntityType: FilterTypes | null,
    selectedEntities: Array<ITrackedEntity>,
    reviewFilters: Array<IReviewFilter>
}

interface IDispatchProps {
    selectFilter: (filterType: FilterTypes, option: DropdownOption, selectedNation: ITrackedEntity | null) => void,
    deselectFilter: (filterType: FilterTypes) => void,
    showModal: (type: string) => void
}

interface IProps extends IStateProps, IDispatchProps {
}

const ReviewPage: FunctionComponent<IProps> = (props) => {

    const { loading, earthInfo, dashboardEntityType, selectedEntities, reviewFilters, selectFilter, deselectFilter, showModal  } = props;
    //const collapceEntities = selectedEntities.filter((e,index) => index !== selectedEntities.length-1);

    //const countryCodes:ICountry[] = reviewService.GetCountryCodes();

    //const dashboardEntity = dashboardEntityType !== null ? selectedEntities.find(se => se.type == dashboardEntityType) : null;
    //const flag = dashboardEntityType !== null ? reviewFilters.find(f => f.type === dashboardEntityType)?.selectedValue : ""; 

    let dashboardEntity:ITrackedEntity|null = null;
    //let flagCode = "";
    let collapceEntities: Array<ITrackedEntity> = [];
    if(dashboardEntityType !== null)
    {
        dashboardEntity = selectedEntities.find(se => se.type == dashboardEntityType) ?? null;

        collapceEntities = selectedEntities.filter(se => se.type !== dashboardEntityType);
/*
        const selectedFilter = reviewFilters.find(f => f.type === dashboardEntityType);
        if(selectedFilter)
            flagCode = selectedFilter.selectedValue.toLocaleLowerCase();
*/
    }

   const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
       let selectedNational:ITrackedEntity | null = null;
       if(filterType == FilterTypes.SubNational)
            selectedNational = selectedEntities.find(se => se.type === FilterTypes.National) ?? null;
        selectFilter(filterType, option, selectedNational);
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
                    <ContextBars 
                        entitySelected={dashboardEntity ? true : false}
                        earthInfo={earthInfo}
                        collapceEntities={collapceEntities}
                     />
                    {
                        dashboardEntity ? "" : 
                        <div className="review__info">
                            <ReviewInfo title="Landing text title">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porta nunc id nunc eleifend vestibulum. Cras luctus risus nisi, non dignissim nisi sodales ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia...
                            </ReviewInfo>
                        </div>
                    }

                    <div className="review__filters-wrapper">
                        <div className="review__switcher">
                            <Switcher 
                                leftOptionChosen={true}
                                className = "input-wrapper"
                                title = "State Option"
                                leftOption="Nation State"
                                rightOption = "Multinationals (MNC)" />
                        </div>
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
                        dashboardEntity ? <Dashboard selectedEntity={dashboardEntity} showModal={showModal} /> : ""
                    }
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = (state: RootState, ownProps: any) => {

    const entities = reviewSelectors.getSelectedEntities(state.review);
    /*const dasboardEntity = entities ? entities[entities.length-1] : undefined;

    const filterSelected = reviewSelectors.getFilterSelected(state.review);
    const dashboardEntityType = reviewSelectors.getDashboardType(state.review);
    
    let dashboardEntity = null;
    if(dashboardEntityType == FilterTypes.National)
        dashboardEntity = filterSelected.national;
    else if(dashboardEntityType == FilterTypes.SubNational)
        dashboardEntity = filterSelected.national;
    else if(dashboardEntityType == FilterTypes.Organization)
        dashboardEntity = filterSelected.organization;
*/
    
    return {
        selectedEntities: entities,
        loading: reviewSelectors.getLoading(state.review),
        dashboardEntityType: reviewSelectors.getDashboardType(state.review),


        earthInfo: reviewSelectors.getEarthInfo(state.review),
        reviewFilters: reviewSelectors.getReviewFilters(state.review)
    }
}

const mapDispatchToProps = (dispatch: DispatchThunk) => {
    return {
        selectFilter: (filterType: FilterTypes, option: DropdownOption, selectedNation: ITrackedEntity | null) => 
            dispatch(reviewActions.doSelectFilter(filterType, option, selectedNation)),
        deselectFilter: (filterType: FilterTypes) => dispatch(reviewActions.deselectFilter(filterType)),
        showModal: (type:string) => {
            dispatch(appActions.showModal(type))
          }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewPage);
 