import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import ISite from "../../api/models/DTO/Site/ISite";
import IGeoSubnational from "../../api/models/DTO/NestedAccounts/IGeoSubnational";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";

export interface NestedAccountsState {
  loading: boolean;
  sites: Array<ISite>;
  aggregatedEmissions: Array<IAggregatedEmission>;
  sitesLoaded: boolean;
  aggregatedEmissionsLoaded: boolean;
  geoSubnationals: Array<IGeoSubnational>;
  loadedClimateActions: Array<IClimateAction>;
}
