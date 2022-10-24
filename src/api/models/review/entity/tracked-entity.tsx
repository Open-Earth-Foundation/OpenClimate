import { IEmissionsData } from "../../../../components/review/review.page";
import IAggregatedEmission from "../../DTO/AggregatedEmission/IAggregatedEmission";
import IPledge from "../../DTO/Pledge/IPledge";
import ISite from "../../DTO/Site/ISite";
import ITransfer from "../../DTO/Transfer/ITransfer";
import ITreaties from "../../DTO/Treaties/ITreaties";
import { FilterTypes } from "../dashboard/filterTypes";
import RetiredUnits from "./retired-units";

export default interface ITrackedEntity {
    id: number,
    type?: FilterTypes,
    title: string,
    countryName?: string,
    flagCode?: string,
    countryCode?: string,
    countryId?: string,
    jurisdictionName?: string,
    jurisdictionCode?: string,
    aggregatedEmission?: IAggregatedEmission,
    emissionInfo?: IEmissionsData,
    retiredUnits?: Array<RetiredUnits>
    pledges?: Array<IPledge>,
    transfers?: Array<ITransfer>
    agreement?: boolean,
    treaties?: ITreaties,
    sites?: Array<ISite>,
    cities?: Array<Object>,
    total_scope_emissions: number;
    total_scope_mitigations: number;
}