import React, { FunctionComponent, useEffect, useState } from 'react'
import { DispatchThunk, RootState } from '../../store/root-state';
import AccountMenu from './account-menu/account-menu';
import AccountDashboard from './subpages/account-dashboard/account-dashboard';
import {
    Switch,
    Route
} from "react-router-dom";
import ClimateActions from './subpages/account-climate-actions/account-climate-actions';
import AccountPledges from './subpages/account-pledges/account-pledges';
import AccountTransfers from './subpages/account-transfers/account-transfers';
import AccountSites from './subpages/account-sites/account-sites';
import { connect } from 'react-redux';
import { showModal } from '../../store/app/app.actions';
import './account.page.scss';
import { SitesPanel } from '../../api/models/shared/sites-panel';
import * as userSelectors from '../../store/user/user.selectors';
import * as accountSelectors from '../../store/account/account.selectors';
import * as accountActions from '../../store/account/account.actions';
import ISite from '../../api/models/DTO/Site/ISite';
import IAggregatedEmission from '../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import IClimateAction from '../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { IUser } from '../../api/models/User/IUser';


interface IStateProps  {
    user: IUser | null,
    pledges: Array<any>,
    transfers: Array<any>,
    sites: Array<ISite>,
    climateActions: Array<IClimateAction>,
    aggregatedEmissions: Array<IAggregatedEmission>,
    pledgesLoaded: boolean,
    transfersLoaded: boolean,
    sitesLoaded: boolean,
    climateActionsLoaded: boolean,
    aggregatedEmissionsLoaded: boolean
}

interface IDispatchProps {
    showModal: (type: string, parameters?: object) => void,
    loadPledges: (orgId: string) => void,
    loadTransfers: (orgId: string) => void,
    loadSites: (orgId: string) => void,
    loadClimateActions: (orgId: string) => void,
    loadAggregatedEmissions: (orgId: string) => void,
}

interface IProps extends IStateProps, IDispatchProps {
}

const AccountPage: FunctionComponent<IProps> = (props) => {

    const { user, pledges, transfers, sites, climateActions, pledgesLoaded, 
        transfersLoaded, sitesLoaded, climateActionsLoaded, aggregatedEmissions, aggregatedEmissionsLoaded,
        showModal, loadPledges, loadTransfers, loadSites, loadClimateActions, loadAggregatedEmissions } = props;

    useEffect(() => {

        if(user && user.company && user.company.id)
        {
            if(!pledgesLoaded)
                loadPledges(user.company.id);

            if(!transfersLoaded)
                loadTransfers(user.company.id);

            if(!sitesLoaded)
                loadSites(user.company.id);

            if(!climateActionsLoaded)
                loadClimateActions(user.company.id);

            if(!aggregatedEmissionsLoaded)
                loadAggregatedEmissions(user.company.id);
        }

    }, [user]);

    const getClimateActionsBySite = (sites: Array<ISite>) => {
        const sitesStr = sites.map(s => s.facility_name);
        return climateActions.filter(a => sitesStr.includes(a.facility_name));
    }

    return (
        <div className="account">
            <div className="account__wrapper content-wrapper">
                <AccountMenu />
                <div className="account__content">
                    <Switch>
                        <Route path="/account/climate-actions">
                            <ClimateActions 
                                climateActions={climateActions}
                                showModal={showModal} 
                            />
                        </Route>
                        <Route path="/account/pledges">
                            <AccountPledges 
                                showModal={showModal} 
                                pledges={pledges} 
                            />
                        </Route>
                        <Route path="/account/transfers">
                            <AccountTransfers 
                                showModal={showModal} 
                                transfers={transfers} 
                            />
                        </Route>
                        <Route path="/account/sites"
                             render = { props => <AccountSites 
                                            aggregatedEmissions={aggregatedEmissions}
                                            showModal={showModal} 
                                            sites={sites}
                                            getClimateActionsBySite={getClimateActionsBySite}
                                        />
                                      }>
                        </Route>
                        <Route exact path="/account">
                            <AccountDashboard 
                                pledges={pledges}
                                showModal={showModal}
                                sites={sites}
                                aggregatedEmissions={aggregatedEmissions}
                            />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return { 
        pledges: accountSelectors.getPledges(state),
        transfers: accountSelectors.getTransfers(state),
        sites: accountSelectors.getSites(state),
        climateActions: accountSelectors.getClimateActions(state),
        pledgesLoaded: accountSelectors.getPledgesLoaded(state),
        transfersLoaded: accountSelectors.getTransfersLoaded(state),
        sitesLoaded: accountSelectors.getSitesLoaded(state),
        climateActionsLoaded: accountSelectors.getClimateActionsLoaded(state),
        aggregatedEmissionsLoaded: accountSelectors.getAggregatedEmissionsLoaded(state),
        aggregatedEmissions: accountSelectors.getAggregatedEmissions(state)
    }
}
  
  const mapDispatchToProps = (dispatch: DispatchThunk) => {
    return {
      showModal: (type:string, parameters?: object) => {
        dispatch(showModal(type, parameters))
      },
      loadPledges: (orgId: string) => {
        dispatch(accountActions.doLoadPledges(orgId))
      },
      loadTransfers: (orgId: string) => {
        dispatch(accountActions.doLoadTransfers(orgId))
      },
      loadSites: (orgId: string) => {
        dispatch(accountActions.doLoadSites(orgId))
      },
      loadClimateActions: (orgId: string) => {
        dispatch(accountActions.doLoadClimateActions(orgId))
      },
      loadAggregatedEmissions: (orgId: string) => {
        dispatch(accountActions.doLoadAggregatedEmissions(orgId))
      }
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
