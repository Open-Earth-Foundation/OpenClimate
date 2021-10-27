import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateAction";
import IPledge from "../../api/models/DTO/Pledge/IPledge";
import ISite from "../../api/models/DTO/Site/ISite";
import ITransfer from "../../api/models/DTO/Transfer/ITransfer";

export interface AccountState {
    loading: boolean,
    sites: Array<ISite>,
    pledges: Array<IPledge>,
    transfers: Array<ITransfer>,
    climateActions: Array<IClimateAction>,
    pledgesLoaded: boolean,
    transfersLoaded: boolean,
    sitesLoaded: boolean,
    climateActionsLoaded: boolean,
    aggregatedEmissions: Array<IAggregatedEmission>,
    aggregatedEmissionsLoaded: boolean
}