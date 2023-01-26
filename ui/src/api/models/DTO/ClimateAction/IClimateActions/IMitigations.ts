import IClimateAction from "./IClimateAction";

export default interface IMitigations extends IClimateAction {
  facility_mitigations_co2e?: number;
}
