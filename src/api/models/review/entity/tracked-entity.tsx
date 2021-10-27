import IAggregatedEmission from "../../DTO/AggregatedEmission/IAggregatedEmission";
import IPledge from "../../DTO/Pledge/IPledge";
import ITransfer from "../../DTO/Transfer/ITransfer";
import ITreaties from "../../DTO/Treaties/ITreaties";
import { FilterTypes } from "../dashboard/filterTypes";
import RetiredUnits from "./retired-units";

export default interface ITrackedEntity {
    //id: string,
    type?: FilterTypes,
    title: string,
    countryCode?: string,
    //icon: string,
    aggregatedEmission?: IAggregatedEmission,
    retiredUnits?: Array<RetiredUnits>
    pledges?: Array<IPledge>,
    transfers?: Array<ITransfer>
    agreement?: boolean,
    treaties?: ITreaties,
    countryCode3?:string
}