import { emissionService } from "../services/emission.service";
import ITrackedEntity from '../../api/models/review/entity/tracked-entity'
import { pledgeService } from "../services/pledge.service";
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes";
import { DropdownOption } from "../interfaces/dropdown/dropdown-option";
import countryCodesJson from '../../api/data/review/data/country-codes'
import { climateWatchService } from "../services/climate-watch.service";
import IPledge from "../../api/models/DTO/Pledge/IPledge";
import ITreaties from "../../api/models/DTO/Treaties/ITreaties";
import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import { aggregatedEmissionService } from "../services/aggregated-emission.service";
import {AggregatedEmissionHelper} from "./aggregated-emission.helper";
import { transferService } from "../services/transfer.service";
import { CountryCodesHelper } from "./country-codes.helper";
import { organizationService } from "../services/organization.service";
import IOrganization from "../../api/models/DTO/Organization/IOrganization";
import ISite from "../../api/models/DTO/Site/ISite";
import { siteService } from "../services/site.service";
import { climateActionService } from "../services/climate-action";
import { ClimateActionHelper } from "./climate-action.helper";
import { ClimateActionScopes } from "../../api/models/DTO/ClimateAction/climate-action-scopes";
import { ClimateActionTypes } from "../../api/models/DTO/ClimateAction/climate-action-types";

async function LoadEmissionsCountry(countryId: number, entity: ITrackedEntity)
{
    let emissionResponse = await fetch(`https://dev.openclimate.network/api/country/2019/${countryId}`, {
        method: 'GET'
    });
    let data = await emissionResponse.json();
    let filteredEmissions = data.data[0].Emissions
    filteredEmissions = filteredEmissions.filter((f:any)=>f.DataProvider.data_provider_name === "PRIMAP");
    
    if(filteredEmissions.length) 
    {
        const sinks = filteredEmissions[0].land_sinks;
        const grossEmission = filteredEmissions[0]?.total_ghg_co2e;
        const netEmission = grossEmission - sinks;
        const date_updated = filteredEmissions[0].DataProvider.Methodology.date_update
        const year = filteredEmissions[0].year
        const methodologies = filteredEmissions[0].DataProvider.Methodology.Tags


        const emissionData: IAggregatedEmission = {
            facility_ghg_total_gross_co2e: grossEmission,
            facility_ghg_total_sinks_co2e: sinks,
            facility_ghg_total_net_co2e: netEmission,
            facility_ghg_date_updated: date_updated,
            facility_ghg_year: year,
            facility_ghg_methodologies: methodologies,
            providerToEmissions: createProviderEmissionsData(data.data[0].Emissions)
        }

        // Tracking selecting entity(country id)
        entity.id = data.data[0].country_id;
        entity.aggregatedEmission = emissionData;
    }
}

async function LoadEmissionsSubnational(subnational_Id: number, entity: ITrackedEntity)
{
    const emissionResponse = await emissionService.fetchEmissionsSubnational(subnational_Id);

    if(emissionResponse.data.length) 
    {
        const grossEmission = emissionResponse.data[0].Emissions[0].total_ghg_co2e
        const year = emissionResponse.data[0].Emissions[0].year
        const netEmission = 0
        const sinks = grossEmission - emissionResponse.data[0].Emissions[0].land_sinks;
        const date_updated = emissionResponse.data[0].Emissions[0].DataProvider.Methodology.date_update
        const methodologies = emissionResponse.data[0].Emissions[0].DataProvider.Methodology.Tags
      

        const emissionData: IAggregatedEmission = {
            facility_ghg_total_gross_co2e: grossEmission,
            facility_ghg_total_sinks_co2e: sinks,
            facility_ghg_total_net_co2e: netEmission,
            facility_ghg_date_updated: date_updated,
            facility_ghg_year: year,
            facility_ghg_methodologies: methodologies,
        }

        if(!isNaN(grossEmission) && !isNaN(netEmission))
            entity.aggregatedEmission = emissionData;
    }
}

async function LoadEmissionsCity(city_id: number, entity: ITrackedEntity)
{
    const emissionResponse = await emissionService.fetchEmissionsCity(city_id);
    if(emissionResponse.data.length) 
    {
        const grossEmission = emissionResponse.data[0].Emissions[0].total_ghg_co2e
        const year = emissionResponse.data[0].Emissions[0].year
        const netEmission = 0
        const sinks = grossEmission - emissionResponse.data[0].Emissions[0].land_sinks;
        const date_updated = emissionResponse.data[0].Emissions[0].DataProvider.Methodology.date_update
        const methodologies = emissionResponse.data[0].Emissions[0].DataProvider.Methodology.Tags
        const emissionData: IAggregatedEmission = {
            facility_ghg_total_gross_co2e: grossEmission,
            facility_ghg_total_sinks_co2e: sinks,
            facility_ghg_total_net_co2e: netEmission,
            facility_ghg_date_updated: date_updated,
            facility_ghg_year: year,
            facility_ghg_methodologies: methodologies,
        }

        if(!isNaN(grossEmission) && !isNaN(netEmission))
            entity.aggregatedEmission = emissionData;
    }
}

async function LoadPledgesSubnational(organization: string) 
{
    let pledges = [];
    const reductionStr = "Percentage reduction target";
    
    const pledgesResponse = await pledgeService.fetchPledgesSubnational(organization);
    if(pledgesResponse && pledgesResponse.length)
    {
        const rowNumbers = [1,3];

        for(let i = 0; i < rowNumbers.length; i++ )
        {        
            const baseYear = pledgesResponse.find((d:any) => (d["column_name"] === "Base year" && d["row_number"]==rowNumbers[i]))?.response_answer;
            const targetYear = pledgesResponse.find((d:any) => d["column_name"] === "Target year" && d["row_number"]==rowNumbers[i])?.response_answer;
            const reduction = pledgesResponse.find((d:any) => d["column_name"] === reductionStr && d["row_number"]==rowNumbers[i])?.response_answer;
            
            const pledge: IPledge = {
                credential_category:"Pledges",
                credential_type:"",
                pledge_base_year: baseYear,
                pledge_target_year: targetYear,
                pledge_emission_reduction: reduction
            }

            pledges.push(pledge);
        }
        
    }
    return pledges;
}

async function LoadPledgesCountry(country: string) 
{
    let pledges: Array<IPledge> = [];
    
    const pledgesResponse = await climateWatchService.fetchPledgesCountry(country);
        
    if(pledgesResponse && pledgesResponse.data && pledgesResponse.data.length)
    {
        const baseYear = pledgesResponse.data.find((d:any) => d["indicator_id"] === "pledge_base_year")?.value;
        const targetYear = pledgesResponse.data.find((d:any) => d["indicator_id"] === "M_TarYr")?.value;
        const reduction = pledgesResponse.data.find((d:any) => d["indicator_id"] === "M_TarA2")?.value;

        const reductionNumber =  Math.abs(Number(reduction?.replace('%', '')));

        const pledge: IPledge = {
            credential_category:"Pledges",
            credential_type:"",
            pledge_base_year: baseYear,
            pledge_target_year: targetYear,
            pledge_emission_reduction: isNaN(reductionNumber) ? 0 : reductionNumber
        }

        pledges = [pledge];
    }

    return pledges;
}

async function LoadTreatiesCountry(country: string)
{
    const treatiesResponse = await climateWatchService.fetchTreatiesCountry(country);
    

    if(treatiesResponse && treatiesResponse.data && treatiesResponse.data.length)
    {
        const submissionDateStr = "Latest submission date";
        const submissionDate = treatiesResponse.data.find((d:any) => d["indicator_name"] === submissionDateStr)?.value;
        const signed = !!treatiesResponse.data.find((d:any) => d["indicator_name"] === "Signed")?.value;
        const ratified = !!treatiesResponse.data.find((d:any) => d["indicator_name"] === "Ratified")?.value;

        const treaties: ITreaties = {
            overview_category:"UNFCCC Process",
            signed: signed,
            ratified: ratified,
            submission_date: new Date(submissionDate)
        };

        return treaties;
    }

    return {};
}

async function GetTrackedEntity(type:FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) {
    
    let trackedEntity: ITrackedEntity = {
        id: option.id,
        title: option.name,
        flagCode: option.flag,
        type: type
    }

    let previousSelectedEntity = null;
    if(selectedEntities.length)
        previousSelectedEntity = selectedEntities[selectedEntities.length-1];
        
    if(previousSelectedEntity)
    {
        trackedEntity.countryName = previousSelectedEntity.countryName;
        trackedEntity.flagCode = previousSelectedEntity.flagCode
        trackedEntity.countryCode = previousSelectedEntity.countryCode;
        trackedEntity.id = previousSelectedEntity.id
    }   else
    {
        let countryParsed: Array<any> = JSON.parse(countryCodesJson);

        const foundCountry = countryParsed.find(c => c.name === option.name);
        const countryCode =  foundCountry ? foundCountry["alpha-3"] : option.value;
        trackedEntity.countryName = option.name;
        trackedEntity.flagCode = option.flag;
        trackedEntity.countryCode = countryCode
        trackedEntity.id = option.value;
    }

        

    let sites;
    switch (type)
    {
        case FilterTypes.National:
            await ReviewHelper.LoadEmissionsCountry(option.value, trackedEntity);
            await ReviewHelper.LoadPledgesCountry(option.value, trackedEntity);
            await ReviewHelper.LoadTreatiesCountry(option.value, trackedEntity);
            trackedEntity.sites = await siteService.allSitesByCountry(option.name);
            trackedEntity.transfers = await transferService.allTransfersByCountry(option.name);

            break;
        case FilterTypes.SubNational:
            trackedEntity.jurisdictionName = option.name;
            trackedEntity.jurisdictionCode = option.value;
            trackedEntity.flagCode = option.flag
            trackedEntity.cities = await CountryCodesHelper.GetCitiesBySubnationalId(option.value)
            await ReviewHelper.LoadEmissionsSubnational(option.value, trackedEntity);
            await ReviewHelper.LoadPledgesSubnational(option.name, trackedEntity);

            if(previousSelectedEntity)
            {
                if(previousSelectedEntity.countryCode)
                    await ReviewHelper.LoadTreatiesCountry(previousSelectedEntity.countryCode, trackedEntity);
                if(previousSelectedEntity.countryName) {
                    trackedEntity.sites = await siteService.allSitesByJurisdtiction(previousSelectedEntity.countryName, option.name)
                    sites = trackedEntity.sites;
                    trackedEntity.transfers = await transferService.allTransfersByJurisdiction(previousSelectedEntity.countryName, option.name);
                }
            }
            break;
        case FilterTypes.City:
            trackedEntity.jurisdictionName = option.name;
            trackedEntity.jurisdictionCode = option.value;
            trackedEntity.flagCode = option.flag
           
            await ReviewHelper.LoadEmissionsCity(option.value, trackedEntity);
            await ReviewHelper.LoadPledgesSubnational(option.name, trackedEntity);

            if(previousSelectedEntity)
            {
                if(previousSelectedEntity.countryCode)
                    await ReviewHelper.LoadTreatiesCountry(previousSelectedEntity.countryCode, trackedEntity);
                if(previousSelectedEntity.countryName) {
                    trackedEntity.sites = previousSelectedEntity.sites;
                    trackedEntity.transfers = await transferService.allTransfersByJurisdiction(previousSelectedEntity.countryName, option.name);
                }
            }

            break;
        case FilterTypes.Organization:

            const country = previousSelectedEntity?.countryName;
            const jurisdiction = previousSelectedEntity?.jurisdictionName;

            //for nation state
            //const org = await organizationService.getById(option.value);
            const orgSites = await siteService.allSitesByOrg(option.value);
            
            //const orgJurisdiction = `${org.organization_country},${org.organization_jurisdiction}`;
            const sitesByLocation = orgSites.filter(s => s.facility_country === country && s.facility_jurisdiction === jurisdiction);
            trackedEntity.sites = sitesByLocation;

            const siteNames = sitesByLocation.map(s => s.facility_name);

            const aggrEmissions = await aggregatedEmissionService.allAggregatedEmissionsByOrg(option.value);
            const aggrEmissionsByLocation = aggrEmissions.filter(ae => siteNames.includes(ae.facility_name));
            
            trackedEntity.aggregatedEmission = AggregatedEmissionHelper.GetSummaryAggregatedEmissions(aggrEmissionsByLocation);
            
            const pledges = await pledgeService.allPledges(option.value);
            trackedEntity.pledges = pledges.slice(Math.max(pledges.length - 3, 0)).reverse();
            let climateActions = await climateActionService.allClimateAction(option.value)
            
            const scope1EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope1 , ClimateActionTypes.Emissions);
            const scope1EmsTotal = ClimateActionHelper.GetSumC02(scope1EmsActions, 'facility_emissions_co2e');

            const scope2EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope2 , ClimateActionTypes.Emissions);
            const scope2EmsTotal = ClimateActionHelper.GetSumC02(scope2EmsActions, 'facility_emissions_co2e');

            const scope1MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope1 , ClimateActionTypes.Mitigations);
            const scope1MtsTotal = ClimateActionHelper.GetSumC02(scope1MtsActions, 'facility_mitigations_co2e');

            const scope2MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope2 , ClimateActionTypes.Mitigations);
            const scope2MtsTotal = ClimateActionHelper.GetSumC02(scope2MtsActions, 'facility_mitigations_co2e');

            const totalScopeEmissions = scope1EmsTotal + scope2EmsTotal; 
            const totalScopeMitigations = scope1MtsTotal + scope2MtsTotal;

            trackedEntity.total_scope_emissions = totalScopeEmissions;
            trackedEntity.total_scope_mitigations = totalScopeMitigations;
            const orgTransfers = await transferService.allTransfers(option.value);
            trackedEntity.transfers = orgTransfers.filter(t => 
                (t.transfer_receiver_country === country && t.transfer_receiver_jurisdiction === jurisdiction) || 
                (t.facility_country === country && t.facility_jurisdiction === jurisdiction));

            if(previousSelectedEntity) 
            {
                trackedEntity.jurisdictionName = previousSelectedEntity.jurisdictionName;
                trackedEntity.jurisdictionCode = previousSelectedEntity.jurisdictionCode;
            }

            break;
    }


    return trackedEntity;
}

const GetOrganizations = async (selectedEntity: ITrackedEntity) => {

    let dropdownItems:Array<DropdownOption> = [];

    selectedEntity.sites?.filter(site => site.organization_name && site.organization_id).forEach((site: ISite) => {
        const item = {
            name: site.organization_name ?? "",
            value: site.organization_id ?? ""
        }

        const added = dropdownItems.some(i => i.value === item.value);
        if(!added)    
            dropdownItems.push(item);
    });

    return dropdownItems;
}

const getCities = (selectedEntity: ITrackedEntity) => {
    const cityOptions = selectedEntity?.cities?.map((cc:any) => {
        return {
            name: cc.name,
            value: cc.value
        }
    });
    return cityOptions;
}
const GetOptions = async (filterType: FilterTypes, entityId: number, selectedEntity?: ITrackedEntity) => {
    let options: Array<DropdownOption> = [];
    
    switch(filterType) {
        case FilterTypes.SubNational:
            options = await CountryCodesHelper.GetSubnationalsByCountryCode(entityId);
            break;
        case FilterTypes.EntityType:
            options = []
            break;
        case FilterTypes.City:
            if(selectedEntity)
                options = await getCities(selectedEntity);                
            break;
        case FilterTypes.Organization:
            if(selectedEntity) 
                options = await GetOrganizations(selectedEntity);               
            break;
    }
    return options;
}

const createProviderEmissionsData = (data: Array<any>) => {
    const providerToEmissions: Record<string, EmissionInfo> = {};
    data.forEach(emission => {
        const dataProviderName = emission.DataProvider?.data_provider_name;
        
        if (dataProviderName && !providerToEmissions[dataProviderName]) {
            const methodologyTags = emission.DataProvider.Methodology.Tags.map(tag => tag.tag_name);
            const emissionData: EmissionInfo = {
                actorType: emission.actor_type,
                totalGhg: emission.total_ghg_co2e,
                year: emission.year,
                landSinks: emission.land_sinks,
                otherGases: emission.other_gases,
                methodologyType: emission.DataProvider?.Methodology?.methodology_type ?? '',
                methodologyTags: methodologyTags
            }
            providerToEmissions[dataProviderName] = emissionData;
        }
        else if (providerToEmissions[dataProviderName].year === emission.year) {
            if (!providerToEmissions[dataProviderName].totalGhg && emission.total_ghg_co2e) {
                providerToEmissions[dataProviderName].totalGhg = emission.total_ghg_co2e;
            }
            if (!providerToEmissions[dataProviderName].landSinks && emission.land_sinks) {
                providerToEmissions[dataProviderName].landSinks = emission.land_sinks;
            }
        }
    })

    return providerToEmissions;
}

// This function will fetch emissions data based on a selected data source
export const getChangedEmissionData = async (dataProviderId:number, entityType:number, entity: ITrackedEntity) => {
    
    switch(entityType){
        case 0:
            let emissionResponse = await fetch(`/api/country/2019/${entity.id}`, {
                method: 'GET'
            });

            let data = await emissionResponse.json()
            let filteredEmissions = data.data[0].Emissions
            filteredEmissions = filteredEmissions.filter((f:any)=>f.DataProvider.data_provider_id === dataProviderId && f.total_ghg_co2e !== null);
            
            if(filteredEmissions.length) 
            {
                const sinks = filteredEmissions[0].land_sinks;
                const grossEmission = filteredEmissions[0]?.total_ghg_co2e;
                const netEmission = grossEmission - sinks;
                const date_updated = filteredEmissions[0].DataProvider.Methodology.date_update
                const year = filteredEmissions[0].year
                const methodologies = filteredEmissions[0].DataProvider.Methodology.Tags
                
                const emissionData: IAggregatedEmission = {
                    facility_ghg_total_gross_co2e: grossEmission,
                    facility_ghg_total_sinks_co2e: sinks,
                    facility_ghg_total_net_co2e: netEmission,
                    facility_ghg_date_updated: date_updated,
                    facility_ghg_year: year,
                    facility_ghg_methodologies: methodologies,
                }
                return emissionData;
            }
        break;
    }
}

export const ReviewHelper = {
    LoadEmissionsCountry,
    LoadEmissionsSubnational,
    LoadEmissionsCity,
    LoadPledgesSubnational,
    LoadPledgesCountry,
    LoadTreatiesCountry,
    GetOrganizations,
    GetTrackedEntity,
    GetOptions,
    createProviderEmissionsData
};
