import React, { FunctionComponent, useEffect, useState } from 'react'
import { useStore } from 'react-redux';
import { ClimateActionScopes } from '../../../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import IClimateAction from '../../../../../../../api/models/DTO/ClimateAction/IClimateAction';
import { ClimateActionHelper } from '../../../../../../../shared/helpers/climate-action.helper';
import ScopeTileItem from './scope-tile-item/scope-tile-item';
import IClimateActionTile from '../../../../../../../api/models/DTO/ClimateAction/IClimateActionTile';


import './scope-tile.scss';
import { ClimateActionTypes } from '../../../../../../../api/models/DTO/ClimateAction/climate-action-types';

interface IProps  {
    climateActionTile?: IClimateActionTile,
    type?: ClimateActionTypes,
    scope: ClimateActionScopes,
    addOffset?: boolean,
    centered? : boolean,
    showModal: (entityType: string, parameters?: object) => void
}

const ScopeTile: FunctionComponent<IProps> = (props) => {

    const { climateActionTile, scope, type, addOffset, showModal } = props;

    const showEmptyTile = !climateActionTile?.climateActions.length && climateActionTile?.type !== ClimateActionTypes.Summary; 
    const hideTile = !climateActionTile?.total && climateActionTile?.type === ClimateActionTypes.Summary;

    const centeredClass = (showEmptyTile || climateActionTile?.type == ClimateActionTypes.Summary) ? 'scope-tile_centered' : '';

    const visibleTiles = climateActionTile?.climateActions.slice(-2);
    
    let hiddenTilesCount = 0;
    if(climateActionTile?.climateActions && climateActionTile?.climateActions.length > 2)
        hiddenTilesCount = climateActionTile?.climateActions.length - 2;

    return (
        <div className={`scope-tile ${centeredClass}`}>
            {   
                hideTile? '' :
                showEmptyTile ?
                    <div className="scope-tile__add-offset_centered">
                        <button className="scope-tile__add-offset-btn scope-item-btn" onClick={() => showModal('add-climate-action', { Scope: scope, Type: type })}>Add offset</button>
                    </div>
                :
                <React.Fragment>
                    <div className="scope-tile__title">
                            <div className="scope-tile__amount">{climateActionTile?.total}</div>
                            <div className="scope-tile__header scope-item-header">MtCO2e/year</div>
                            <div className="scope-tile__add-offset_right">
                                {addOffset ?
                                    <button className="scope-tile__add-offset-btn scope-item-btn" onClick={() => showModal('add-climate-action', { Scope: scope, Type: type })}>Add</button>
                                    : ""
                                }
                            </div>
                    </div>
                    <div className="scope-title__content">
                        {
                            visibleTiles?.reverse().map(c => {
                                return (
                                    <ScopeTileItem
                                        climateAction={c}
                                        scope={scope}
                                     />
                                )
                            })
                        }

                        {
                            hiddenTilesCount ? 
                            <>
                                <a href='#' onClick={()=> showModal('emission-filters')} className='scope-tile__see-more-link'>+ See {hiddenTilesCount} more</a>
                            </>
                            : ''
                        }
                    </div>
                </React.Fragment>
            }
        </div>
    );
}

export default ScopeTile;
 