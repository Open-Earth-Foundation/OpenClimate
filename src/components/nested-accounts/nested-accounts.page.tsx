import { FunctionComponent, useEffect, useState } from "react";
import { connect } from 'react-redux'
import { DispatchThunk, RootState } from "../../store/root-state";
import * as nestedAccountsSelectors from '../../store/nested-accounts/nested-accounts.selectors';
import * as nestedAccountsActions from '../../store/nested-accounts/nested-accounts.actions';
import NestedAccounts from "./nested-accounts";
import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import ISite from "../../api/models/DTO/Site/ISite";
import IGeoSubnational from "../../api/models/DTO/NestedAccounts/IGeoSubnational";
import Loader from "react-loader-spinner";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import { CommonHelper } from "../../shared/helpers/common.helper";
import { useLocation } from "react-router-dom";


interface IStateProps  {
    loading: boolean,
    sites: Array<ISite>,
    aggregatedEmissions: Array<IAggregatedEmission>,
    sitesLoaded: boolean,
    aggregatedEmissionsLoaded: boolean,
    geoSubnationals: Array<IGeoSubnational>,
    loadedClimateActions: Array<IClimateAction>
}

interface IDispatchProps {
    loadSites: () => void,
    loadAggregatedEmissions: () => void,
    doLoadGeoSubnational: (countryCode: string) => any,
    doLoadClimateActions: (siteId: string) => void,
    cleanData: () => void
}

interface IProps extends IStateProps, IDispatchProps {
}

const NestedAccountsPage: FunctionComponent<IProps> = (props) => {

    

    const { loading, sites, aggregatedEmissions, sitesLoaded, aggregatedEmissionsLoaded, geoSubnationals, loadedClimateActions,
        cleanData, loadSites, loadAggregatedEmissions, doLoadGeoSubnational, doLoadClimateActions } = props;

    console.log(props);

    const [groupedClimateActions, setGroupedClimateActions] = useState<any>();

    useEffect(() => {
        const groupedClimateActions = CommonHelper.GroupByKey(loadedClimateActions, "facility_name");
        setGroupedClimateActions(groupedClimateActions);
    }, [loadedClimateActions]);

    useEffect(() => {
        if(!sitesLoaded)
            loadSites();
        if(!aggregatedEmissionsLoaded)
            loadAggregatedEmissions();
    }, [sitesLoaded, aggregatedEmissionsLoaded])

    return (
        <div className="nested-accounts">
            <div className="nested-accounts__wrapper content-wrapper">
                    <NestedAccounts 
                        geoSubnationals={geoSubnationals}
                        sites={sites}
                        aggregatedEmissions={aggregatedEmissions}
                        groupedClimateActions={groupedClimateActions}
                        loadGeoSubnational={doLoadGeoSubnational}
                        loadClimateActions={doLoadClimateActions}
                        cleanData={cleanData}
                    />
            </div>
            { 
                loading ? 
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
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
      sites: nestedAccountsSelectors.getSites(state),
      aggregatedEmissions: nestedAccountsSelectors.getAggregatedEmissions(state),
      sitesLoaded: nestedAccountsSelectors.getSitesLoaded(state),
      aggregatedEmissionsLoaded: nestedAccountsSelectors.getAggregatedEmissionsLoaded(state),
      loading: nestedAccountsSelectors.getLoading(state),
      geoSubnationals: nestedAccountsSelectors.getGeoSubnationals(state),
      loadedClimateActions: nestedAccountsSelectors.loadedClimateActions(state)
    }
  }
  
  const mapDispatchToProps = (dispatch: DispatchThunk) => {
    return {
        loadSites: () => {
            dispatch(nestedAccountsActions.doLoadSites())
        },
        loadAggregatedEmissions: () => {
            dispatch(nestedAccountsActions.doLoadAggregatedEmissions())
        },
        doLoadGeoSubnational: (countryCode: string) => {
            dispatch(nestedAccountsActions.doLoadGeoSubnational(countryCode))
        },
        doLoadClimateActions: (siteName: string) => {
            dispatch(nestedAccountsActions.doLoadClimateActions(siteName));
        },
        cleanData: () => {
            dispatch(nestedAccountsActions.nestedAccountsClearState())
        }
        
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(NestedAccountsPage);
