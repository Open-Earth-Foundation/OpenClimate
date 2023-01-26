import IClimateAction from "./IClimateAction";

export default interface IEmissions extends IClimateAction {
  facility_emissions_co2e?: number;
}
