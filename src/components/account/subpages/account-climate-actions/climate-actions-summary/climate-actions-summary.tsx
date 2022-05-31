import { FunctionComponent, useEffect, useState } from 'react'
import { ScopeType } from '../../../../../api/models/shared/emission/scope-filters';
import { EmissionIcon } from '../../../../../api/models/shared/emission/emission-icon';
import { ClimateActionHelper } from '../../../../../shared/helpers/climate-action.helper';
import { ClimateActionTypes } from '../../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionScopes } from '../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import ScopeHeader from './scope/scope-header/scopre-header';
import ScopeTile from './scope/scope-tile/scope-tile';
import ScopeTileCentered from './scope/scope-tile-centered/scope-tile-centered';
import ClimateActionTile from '../../../../../api/models/DTO/ClimateAction/IClimateActionTile';
import IClimateAction from '../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { IUser } from '../../../../../api/models/User/IUser';
import './climate-actions-summary.scss';
import ISite from '../../../../../api/models/DTO/Site/ISite';
import IWallet from '../../../../../api/models/DTO/Wallet/IWallet';

interface IProps  {
    user: IUser,
    climateActions: Array<IClimateAction>,
    showModal: (modalType: string, parameters?: object) => void,
    sites?: Array<ISite>,
    wallets: Array<IWallet>,
}

const ClimateActionsSummary: FunctionComponent<IProps> = (props) => {

    const { climateActions, user, sites, showModal, wallets} = props;

    const [tiles, setTiles] = useState<ClimateActionTile[]>([]);

    const [emissionsTotal, setEmissionsTotal] = useState<number>(0);
    const [mitigationsTotal, setMitigationsTotal] = useState<number>(0);
    
    useEffect(() => {

        const scope1EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope1 , ClimateActionTypes.Emissions);
        const scope1EmsTotal = ClimateActionHelper.GetSumC02(scope1EmsActions, 'facility_emissions_co2e');

        const scope2EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope2 , ClimateActionTypes.Emissions);
        const scope2EmsTotal = ClimateActionHelper.GetSumC02(scope2EmsActions, 'facility_emissions_co2e');

        const scope3EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope3 , ClimateActionTypes.Emissions);
        const scope3EmsTotal = ClimateActionHelper.GetSumC02(scope3EmsActions, 'facility_emissions_co2e');

        const scope1MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope1 , ClimateActionTypes.Mitigations);
        const scope1MtsTotal = ClimateActionHelper.GetSumC02(scope1MtsActions, 'facility_mitigations_co2e');

        const scope2MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope2 , ClimateActionTypes.Mitigations);
        const scope2MtsTotal = ClimateActionHelper.GetSumC02(scope2MtsActions, 'facility_mitigations_co2e');

        const scope3MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope3 , ClimateActionTypes.Mitigations);
        const scope3MtsTotal = ClimateActionHelper.GetSumC02(scope3MtsActions, 'facility_mitigations_co2e');

        const scope1SummaryTotal = scope1EmsTotal - scope1MtsTotal;
        const scope2SummaryTotal = scope2EmsTotal - scope2MtsTotal;
        const scope3SummaryTotal = scope3EmsTotal - scope3MtsTotal;

        const defaultCLimateAction: IClimateAction = {
            credential_category: 'ClimateAction',
            signature_name: 'OpenClimate',
            verification_result: 'Verified',
            verification_body: 'PwC',
            credential_issue_date: Date.now()
        }

        setTiles([
            { scope: ClimateActionScopes.Scope1, type: ClimateActionTypes.Emissions, total: scope1EmsTotal, climateActions: scope1EmsActions},
            { scope: ClimateActionScopes.Scope2, type: ClimateActionTypes.Emissions, total: scope2EmsTotal, climateActions: scope2EmsActions},
            { scope: ClimateActionScopes.Scope3, type: ClimateActionTypes.Emissions, total: scope3EmsTotal, climateActions: scope3EmsActions},
            { scope: ClimateActionScopes.Scope1, type: ClimateActionTypes.Mitigations, total: scope1MtsTotal, climateActions: scope1MtsActions},
            { scope: ClimateActionScopes.Scope2, type: ClimateActionTypes.Mitigations, total: scope2MtsTotal, climateActions: scope2MtsActions},
            { scope: ClimateActionScopes.Scope3, type: ClimateActionTypes.Mitigations, total: scope3MtsTotal, climateActions: scope3MtsActions},
            { scope: ClimateActionScopes.Scope1, type: ClimateActionTypes.Summary, total: scope1SummaryTotal, climateActions: [defaultCLimateAction]},
            { scope: ClimateActionScopes.Scope2, type: ClimateActionTypes.Summary, total: scope2SummaryTotal, climateActions: [defaultCLimateAction]},
            { scope: ClimateActionScopes.Scope3, type: ClimateActionTypes.Summary, total: scope3SummaryTotal, climateActions: [defaultCLimateAction]}
        ]);

        setEmissionsTotal(scope1EmsTotal + scope2EmsTotal + scope3EmsTotal);
        setMitigationsTotal(scope1MtsTotal + scope2MtsTotal + scope3MtsTotal);

    },[climateActions]);

    return (
        <div className="account__climate-actions-summary">
            <table className="account__climate-actions-table">
                <thead>
                    <tr>
                        <th></th>
                        <th align="center">                    
                            <ScopeHeader 
                            scopeType={ScopeType.Scope1}
                            title="Scope 1"
                            description="Fuel combustion, company vehicles, fugitive emissions"
                            />
                        </th>
                        <th align="center">                    
                            <ScopeHeader 
                                scopeType={ScopeType.Scope2}
                                title="Scope 2"
                                description="Purchased electricity, heat and steam"
                            />
                        </th>
                        <th align="center">                    
                            <ScopeHeader 
                                scopeType={ScopeType.Scope3}
                                title="Scope 3"
                                description="Purchased goods and services, business travel, commuting, etc."
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="account__scope-row_red">
                        <td>
                            <ScopeTileCentered 
                                iconType={EmissionIcon.Up}
                                title="Emissions"
                                amount={emissionsTotal} 
                                description="MtCO2e/year"
                                onClick={()=> showModal('emission-filters', { Type: ClimateActionTypes.Emissions})}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope1 && t.type == ClimateActionTypes.Emissions)}
                                scope={ClimateActionScopes.Scope1}
                                type={ClimateActionTypes.Emissions}
                                addOffset={!user.demo}
                                showModal={showModal}
                                sites={sites}
                                wallets={wallets}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                            climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope2 && t.type == ClimateActionTypes.Emissions)}
                                scope={ClimateActionScopes.Scope2}
                                type={ClimateActionTypes.Emissions}
                                addOffset={!user.demo}
                                showModal={showModal}
                                wallets={wallets}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope3 && t.type == ClimateActionTypes.Emissions)}
                                scope={ClimateActionScopes.Scope3}
                                type={ClimateActionTypes.Emissions}
                                addOffset={!user.demo}
                                showModal={showModal}
                                wallets={wallets} 
                            />
                        </td>
                    </tr>
                    <tr className="account__scope-row_primary">
                        <td>
                            <ScopeTileCentered 
                                iconType={EmissionIcon.Down}
                                title="Mitigations"
                                amount={mitigationsTotal} 
                                description="MtCO2e/year"
                                onClick={()=> showModal('emission-filters', { Type: ClimateActionTypes.Mitigations})}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope1 && t.type == ClimateActionTypes.Mitigations)}
                                scope={ClimateActionScopes.Scope1}
                                type={ClimateActionTypes.Mitigations}
                                addOffset={!user.demo}
                                showModal={showModal}
                                wallets={wallets}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope2 && t.type == ClimateActionTypes.Mitigations)}
                                scope={ClimateActionScopes.Scope2}
                                type={ClimateActionTypes.Mitigations}
                                addOffset={!user.demo}
                                showModal={showModal}
                                wallets={wallets}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope3 && t.type == ClimateActionTypes.Mitigations)}
                                scope={ClimateActionScopes.Scope3}
                                type={ClimateActionTypes.Mitigations}
                                addOffset={!user.demo}
                                showModal={showModal}
                                wallets={wallets}
                            />
                        </td>
                    </tr>
                    <tr className="account__scope-row_black">
                        <td>
                            <ScopeTileCentered 
                                iconType={EmissionIcon.Equal}
                                title="Net Emissions"
                                amount={emissionsTotal - mitigationsTotal} 
                                description="MtCO2e/year"
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope1 && t.type == ClimateActionTypes.Summary)}
                                scope={ClimateActionScopes.Scope1}
                                showModal={showModal}
                                wallets={wallets}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope2 && t.type == ClimateActionTypes.Summary)}
                                scope={ClimateActionScopes.Scope2}
                                showModal={showModal}
                                wallets={wallets}
                            />
                        </td>
                        <td>
                            <ScopeTile 
                                climateActionTile={tiles.find(t => t.scope == ClimateActionScopes.Scope3 && t.type == ClimateActionTypes.Summary)}
                                scope={ClimateActionScopes.Scope3}
                                showModal={showModal}
                                wallets={wallets}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ClimateActionsSummary;
 