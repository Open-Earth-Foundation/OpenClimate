import React, { FunctionComponent, useEffect, useState } from 'react'
import { DispatchThunk, RootState } from '../../store/root-state';
import AccountMenu from './account-menu/account-menu';
import AccountDashboard from './subpages/account-dashboard/account-dashboard';
import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
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
import IClimateAction from '../../api/models/DTO/ClimateAction/IClimateAction';




interface IStateProps  {
    pledges: Array<any>,
    transfers: Array<any>,
    sites: Array<ISite>,
    climateActions: Array<IClimateAction>,
    pledgesLoaded: boolean,
    transfersLoaded: boolean,
    sitesLoaded: boolean,
    climateActionsLoaded: boolean
}

interface IDispatchProps {
    showModal: (type: string, parameters?: object) => void,
    loadPledges: () => void,
    loadTransfers: () => void,
    loadSites: () => void,
    loadClimateActions: () => void
}

interface IProps extends IStateProps, IDispatchProps {
}

const AccountPage: FunctionComponent<IProps> = (props) => {

    const { pledges, transfers, sites, climateActions, pledgesLoaded, transfersLoaded, sitesLoaded, climateActionsLoaded,
        showModal, loadPledges, loadTransfers, loadSites, loadClimateActions } = props;

    useEffect(() => {
        if(!pledgesLoaded)
            loadPledges();

        if(!transfersLoaded)
            loadTransfers();

        if(!sitesLoaded)
            loadSites();

        if(!climateActionsLoaded)
            loadClimateActions();
    }, []);

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
                            <AccountPledges showModal={showModal} pledges={pledges} />
                        </Route>
                        <Route path="/account/transfers">
                            <AccountTransfers showModal={showModal} transfers={transfers} />
                        </Route>
                        <Route exact path="/account/sites/climate-actions" render=
                            {props => <AccountSites 
                                            showModal={showModal}
                                            panel={SitesPanel.ClimateActions} 
                                            
                                            />}>
                        </Route>
                        <Route path="/account/sites"
                             render=
                            {props => <AccountSites 
                                showModal={showModal} 
                                sites={sites}
                            />}>
                        </Route>
                        <Route exact path="/account">
                            <AccountDashboard 
                                pledges={pledges}
                                showModal={showModal}
                                sites={sites}
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
        climateActionsLoaded: accountSelectors.getClimateActionsLoaded(state)
    }
}
  
  const mapDispatchToProps = (dispatch: DispatchThunk) => {
    return {
      showModal: (type:string, parameters?: object) => {
        dispatch(showModal(type, parameters))
      },
      loadPledges: () => {
        dispatch(accountActions.doLoadPledges())
      },
      loadTransfers: () => {
        dispatch(accountActions.doLoadTransfers())
      },
      loadSites: () => {
        dispatch(accountActions.doLoadSites())
      },
      loadClimateActions: () => {
        dispatch(accountActions.doLoadClimateActions())
      }
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
 /*
                         <Route exact path="/account/sites/climate-actions" render=
                            {props => <CustomerContainer dni={props.match.params.dni} />>
                            <AccountSites match={useRouteMatch} panel={SitesPanel.ClimateActions} />
                        </Route>
                        <Route path="/account/sites">
                            <AccountSites />
                        </Route> */