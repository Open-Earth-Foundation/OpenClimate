import React, { FunctionComponent, useEffect, useState } from 'react'
import { EmissionItems } from '../../../../api/data/shared/emission-items';
import { ClimateActionScopes } from '../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import { ClimateActionTypes } from '../../../../api/models/DTO/ClimateAction/climate-action-types';
import IClimateAction from '../../../../api/models/DTO/ClimateAction/IClimateAction';
import { ScopeType } from '../../../../api/models/shared/emission/scope-filters';
import SiteFilter from '../../../../shared/components/widgets/sites-filters/site-filter/site-filter';
import { ClimateActionHelper } from '../../../../shared/helpers/climate-action.helper';
import ScopeTileItem from '../account-climate-actions/climate-actions-summary/scope/scope-tile/scope-tile-item/scope-tile-item';
import './emission-filters.scss';


interface IProps  {
    climateActions: Array<IClimateAction>
}

const EmissionFilters: FunctionComponent<IProps> = (props) => {

    const {climateActions} = props;

    const [showDetails, setShowDetails] = useState(true);
    //const [scopeFilters, setScopeFilters] = useState([ScopeType.All]);

    const [scope1Actions, setScope1Actions] = useState<Array<IClimateAction>>([]);
    const [scope2Actions, setScope2Actions] = useState<Array<IClimateAction>>([]);
    const [scope3Actions, setScope3Actions] = useState<Array<IClimateAction>>([]);

    const [showScope, setShowScope] = useState<ClimateActionScopes | null>(null);


    const [scopeFilters, setScopeFilters] = useState<any>([]);
    const [displayItems, setDisplayItems] = useState<IClimateAction[]>([]);

    const detailsBtnText = showDetails ? "Hide details" : "Show details";


    useEffect(() => {
        
        const sc1 = climateActions.filter(a => a.climate_action_scope?.toString() === ClimateActionScopes[ClimateActionScopes.Scope1]);
        const sc2 = climateActions.filter(a => a.climate_action_scope?.toString() === ClimateActionScopes[ClimateActionScopes.Scope2]);
        const sc3 = climateActions.filter(a => a.climate_action_scope?.toString() === ClimateActionScopes[ClimateActionScopes.Scope3]);

        const scFilters = [
            { name: `All`, actions: climateActions, selected: true },
            { name: `Scope1`, actions: sc1, selected: false },
            { name: `Scope2`, actions: sc2, selected: false },
            { name: `Scope3`, actions: sc3, selected: false },
        ];

        setScopeFilters(scFilters);
        setDisplayItems(climateActions);
    }, [climateActions]);

    const emissionItems = scopeFilters.includes(ScopeType.All) ? EmissionItems : 
        EmissionItems.filter(ei => scopeFilters.includes(ei.scope));
/*
    const displayEmissions = emissionItems.map((ei,index) => (
        <ScopeTileItem scope={ei.scope} amount={ei.amount} signedBy={ei.signedBy} key={index} />
    ));*/

   /* const filterClickHandler = (selected:boolean, scopeFilter: ScopeType) => {
        let currentFilters = [...scopeFilters];
        
        if(selected)
            currentFilters.push(scopeFilter);
        else
            currentFilters = currentFilters.filter(cf => cf !== scopeFilter);

        setScopeFilters(currentFilters);
    }*/

    const onFilterSelect = (name: string) => {
        const updatedFilters = [...scopeFilters];

        updatedFilters.map(filter => filter.selected = false);
        const selectedFilter = updatedFilters.find(filter => filter.name === name);
        selectedFilter.selected = true;

        setScopeFilters(updatedFilters);
        setDisplayItems(selectedFilter.actions);
    }

    return (
        <div className="emission-filters">
            <div className="emission-filters__title">Climate actions</div>
            <div className="emission-filters__header">
                <div className="emission-filters__header-wrapper">
                    
                    {showDetails ?
                    <table className="emission-filters__header-table">
                        <tr>
                            <td className="emission-filters__header-table_name">Credential type:</td>
                            <td className="emission-filters__header-table_value">Name of type</td>
                        </tr>
                        <tr>
                            <td className="emission-filters__header-table_name">Issuer:</td>
                            <td className="emission-filters__header-table_value">British Columbia</td>
                        </tr>
                        <tr>
                            <td className="emission-filters__header-table_name">Organizations:</td>
                            <td className="emission-filters__header-table_value">Organization name</td>
                        </tr>
                        <tr>
                            <td className="emission-filters__header-table_name">Attributes</td>
                            <td className="emission-filters__header-table_value">Attribute name</td>
                        </tr>
                        <tr>
                            <td className="emission-filters__header-table_name">Credential Date:</td>
                            <td className="emission-filters__header-table_value">-</td>
                        </tr>
                    </table>
                    : ""
                    }

                    <a className="emission-filters__details" onClick={() => setShowDetails(!showDetails)}>{detailsBtnText}</a>
                </div>
            </div>
            <div className="emission-filters__content">
                <div className="emission-filters__content-wrapper">
                    <div className="emission-filters__filters">
                        {
                         scopeFilters.map((scf: any) => {
                             return (
                                <SiteFilter name={scf.name} onClick={() => onFilterSelect(scf.name)} selected={scf.selected}/>

                             )
                         })
/*
<>
                         <SiteFilter name="All" onClick={() => onFilterSelect('All')} selected={true}/>
                         <SiteFilter name="Scope1" onClick={() => onFilterSelect('Scope1')} selected={false}/>
                         <SiteFilter name="Scope2" onClick={() => onFilterSelect('Scope2')} selected={false}/>
                         <SiteFilter name="Scope3" onClick={() => onFilterSelect('Scope3')} selected={false}/>
                         </>*/
                       // <SiteFilter name="Scope1" onClick={(selected:boolean) => filterClickHandler(selected, ScopeType.Scope1)} />
                       // <SiteFilter name="Scope2" onClick={(selected:boolean) => filterClickHandler(selected, ScopeType.Scope2)} />
                       // <SiteFilter name="Scope3" onClick={(selected:boolean) => filterClickHandler(selected, ScopeType.Scope3)} />
                        }
                    </div>
                    <div className="emission-filters__emissions-list">
                        {
                            displayItems.map(di => {

                                const scope = di.climate_action_scope ? Number(ClimateActionScopes[di.climate_action_scope])  : ClimateActionScopes.Scope1;

                                return (
                                    <ScopeTileItem 
                                        climateAction={di}
                                        scope={scope}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmissionFilters;
 
/*
<SiteFilter name="All" onClick={(selected:boolean) => filterClickHandler(selected, ScopeType.All)} defaultSelected={true} />
                        <SiteFilter name="Scope1" onClick={(selected:boolean) => filterClickHandler(selected, ScopeType.Scope1)} />
                        <SiteFilter name="Scope2" onClick={(selected:boolean) => filterClickHandler(selected, ScopeType.Scope2)} />
                        <SiteFilter name="Scope3" onClick={(selected:boolean) => filterClickHandler(selected, ScopeType.Scope3)} />
*/

//{displayEmissions}
//<ScopeTileItem scope={1} amount={350} signedBy="British Columbia" fontSize={48} titleAmount="MtCO2e/year" />