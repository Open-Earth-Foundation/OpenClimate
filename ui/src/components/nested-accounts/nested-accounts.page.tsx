import { FunctionComponent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { DispatchThunk, RootState } from "../../store/root-state";
import * as nestedAccountsSelectors from "../../store/nested-accounts/nested-accounts.selectors";
import * as nestedAccountsActions from "../../store/nested-accounts/nested-accounts.actions";
import {
  getLatestEntity,
  getReviewFilters,
} from "../../store/review/review.selectors";
import NestedAccounts from "./nested-accounts";
import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import ISite from "../../api/models/DTO/Site/ISite";
import IGeoSubnational from "../../api/models/DTO/NestedAccounts/IGeoSubnational";
import { Oval } from "react-loader-spinner";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import { CommonHelper } from "../../shared/helpers/common.helper";
import { useLocation } from "react-router-dom";
import ITrackedEntity from "../../api/models/review/entity/tracked-entity";
import { doSelectFilter } from "../../store/review/review.actions";
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes";
import { DropdownOption } from "../../shared/interfaces/dropdown/dropdown-option";
import { IReviewFilter } from "../../api/models/review/dashboard/reviewFilter";

interface IStateProps {
  loading: boolean;
  sites: Array<ISite>;
  aggregatedEmissions: Array<IAggregatedEmission>;
  sitesLoaded: boolean;
  entity: ITrackedEntity;
  aggregatedEmissionsLoaded: boolean;
  geoSubnationals: Array<IGeoSubnational>;
  filters: Array<IReviewFilter>;
  loadedClimateActions: Array<IClimateAction>;
}

interface IDispatchProps {
  loadSites: () => void;
  loadAggregatedEmissions: () => void;
  doLoadGeoSubnational: (countryCode: string) => any;

  doLoadClimateActions: (siteId: string) => void;
  cleanData: () => void;
  selectFilter: (
    filterType: FilterTypes,
    option: DropdownOption,
    selectedEntities: Array<ITrackedEntity>
  ) => void;
}

interface IProps extends IStateProps, IDispatchProps {}

const NestedAccountsPage: FunctionComponent<IProps> = (props) => {
  const {
    loading,
    sites,
    aggregatedEmissions,
    sitesLoaded,
    aggregatedEmissionsLoaded,
    geoSubnationals,
    loadedClimateActions,
    cleanData,
    loadSites,
    loadAggregatedEmissions,
    doLoadGeoSubnational,
    doLoadClimateActions,
    entity,
    selectFilter,
    filters,
  } = props;

  const [groupedClimateActions, setGroupedClimateActions] = useState<any>();

  useEffect(() => {
    const groupedClimateActions = CommonHelper.GroupByKey(
      loadedClimateActions,
      "facility_name"
    );
    console.log(filters[0].options);
    setGroupedClimateActions(groupedClimateActions);
  }, [loadedClimateActions]);

  useEffect(() => {
    if (!sitesLoaded) loadSites();
    if (!aggregatedEmissionsLoaded) loadAggregatedEmissions();
  }, [sitesLoaded, aggregatedEmissionsLoaded]);

  return (
    <div className="nested-accounts">
      <div className="nested-accounts__wrapper content-wrapper">
        <NestedAccounts
          geoSubnationals={geoSubnationals}
          sites={sites}
          aggregatedEmissions={aggregatedEmissions}
          entityEmission={entity?.aggregatedEmission}
          entityTitle={entity?.type ? entity?.title : ""}
          selectFilter={selectFilter}
          filterOptions={filters[0].options}
          groupedClimateActions={groupedClimateActions}
          loadGeoSubnational={doLoadGeoSubnational}
          loadClimateActions={doLoadClimateActions}
          cleanData={cleanData}
        />
      </div>
      {loading ? (
        <div className="loader">
          <Oval color="#A3A3A3" height={100} width={100} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const entity = getLatestEntity(state.review);
  const filters = getReviewFilters(state.review);
  return {
    filters: filters,
    entity: entity,
    sites: nestedAccountsSelectors.getSites(state),
    aggregatedEmissions: nestedAccountsSelectors.getAggregatedEmissions(state),
    sitesLoaded: nestedAccountsSelectors.getSitesLoaded(state),
    aggregatedEmissionsLoaded:
      nestedAccountsSelectors.getAggregatedEmissionsLoaded(state),
    loading: nestedAccountsSelectors.getLoading(state),
    geoSubnationals: nestedAccountsSelectors.getGeoSubnationals(state),
    loadedClimateActions: nestedAccountsSelectors.loadedClimateActions(state),
  };
};

const mapDispatchToProps = (dispatch: DispatchThunk) => {
  return {
    loadSites: () => {
      dispatch(nestedAccountsActions.doLoadSites());
    },
    loadAggregatedEmissions: () => {
      dispatch(nestedAccountsActions.doLoadAggregatedEmissions());
    },
    selectFilter: (
      filterType: FilterTypes,
      option: DropdownOption,
      selectedEntities: Array<ITrackedEntity>
    ) => dispatch(doSelectFilter(filterType, option, selectedEntities)),
    doLoadGeoSubnational: (countryCode: string) => {
      dispatch(nestedAccountsActions.doLoadGeoSubnational(countryCode));
    },
    doLoadClimateActions: (siteName: string) => {
      dispatch(nestedAccountsActions.doLoadClimateActions(siteName));
    },
    cleanData: () => {
      dispatch(nestedAccountsActions.nestedAccountsClearState());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NestedAccountsPage);
