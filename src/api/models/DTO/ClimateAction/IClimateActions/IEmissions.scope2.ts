import IEmissions from "./IEmissions";

export default interface IEmissionsScope2 extends IEmissions {
    facility_energy_grid_operator_name?: string,
    facility_energy_consumption?: number,
    facility_emissions_market_based_co2e?: number,
    facility_emissions_location_based_co2e?: number,
    facility_energy_grid_operator_co2_rate?: number,
    facility_energy_grid_operator_ch4_rate?: number,
    facility_energy_grid_operator_n2o_rate?: number,
    facility_emissions_location_based_co2?: number,
    facility_emissions_location_based_ch4?: number,
    facility_emissions_location_based_n2o?: number
}

