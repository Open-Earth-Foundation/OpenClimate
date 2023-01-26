import IEmissions from "./IEmissions";

export default interface IEmissionsScope1 extends IEmissions {
  facility_emissions_co2_fossil?: number;
  facility_emissions_co2_biomass?: number;
  facility_emissions_ch4?: number;
  facility_emissions_n2o?: number;
  facility_emissions_hfc?: number;
  facility_emissions_pfc?: number;
  facility_emissions_sf6?: number;
  facility_emissions_combustion_co2e?: number;
  facility_emissions_combustion_co2_fossil?: number;
  facility_emissions_combustion_co2_biomass?: number;
  facility_emissions_combustion_ch4?: number;
  facility_emissions_combustion_n2o?: number;
  facility_emissions_fvpwt_co2e?: number;
  facility_emissions_fvpwt_co2_fossil?: number;
  facility_emissions_fvpwt_co2_biomass?: number;
  facility_emissions_fvpwt_ch4?: number;
  facility_emissions_fvpwt_n2o?: number;
  facility_emissions_fvpwt_hfc?: number;
  facility_emissions_fvpwt_pfc?: number;
  facility_emissions_fvpwt_sf6?: number;
}
