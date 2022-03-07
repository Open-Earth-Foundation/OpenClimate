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

async function LoadEmissionsCountry(countryCode: string, entity: ITrackedEntity)
{
    const emissionResponse = await climateWatchService.fetchEmissionsCountry(countryCode);

    if(emissionResponse.data.length) 
    {
        const skins = Math.abs(emissionResponse.data[0].emissions[0].value);
        const grossEmission = Math.abs(emissionResponse.data[1].emissions[0].value);
        const netEmission = grossEmission - skins;

        const emissionData: IAggregatedEmission = {
            facility_ghg_total_gross_co2e: grossEmission,
            facility_ghg_total_sinks_co2e: skins,
            facility_ghg_total_net_co2e: netEmission
        }

        entity.aggregatedEmission = emissionData;
    }
}

async function LoadEmissionsSubnational(countryCode: string, entity: ITrackedEntity)
{
    const emissionResponse = await emissionService.fetchEmissionsSubnational(countryCode);

    if(emissionResponse.length) 
    {
        const grossEmission = Math.abs(emissionResponse[0].response_answer / 1000000);
        const netEmission = Math.abs(emissionResponse[1].response_answer / 1000000)
        const skins = grossEmission - netEmission;

        const emissionData: IAggregatedEmission = {
            facility_ghg_total_gross_co2e: grossEmission,
            facility_ghg_total_sinks_co2e: skins,
            facility_ghg_total_net_co2e: netEmission
        }

        if(!isNaN(grossEmission) && !isNaN(netEmission))
            entity.aggregatedEmission = emissionData;
    }
}

async function LoadPledgesSubnational(organization: string, entity: ITrackedEntity) 
{
    entity.pledges = [];
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

            entity.pledges.push(pledge);
        }

    }
}

async function LoadPledgesCountry(country: string, entity: ITrackedEntity) 
{
    entity.pledges = [];
    
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

        entity.pledges = [pledge];
    }
}

async function LoadTreatiesCountry(country: string, entity: ITrackedEntity)
{
    const treatiesResponse = await climateWatchService.fetchTreatiesCountry(country);

    if(treatiesResponse && treatiesResponse.data && treatiesResponse.data.length)
    {
        const submissionDateStr = "Latest submission date";
        //todo
        const submissionDate = treatiesResponse.data.find((d:any) => d["indicator_name"] === submissionDateStr)?.value;
        const signed = !!treatiesResponse.data.find((d:any) => d["indicator_name"] === "Signed")?.value;
        const ratified = !!treatiesResponse.data.find((d:any) => d["indicator_name"] === "Ratified")?.value;

        const treaties: ITreaties = {
            overview_category:"UNFCCC Process",
            signed: signed,
            ratified: ratified,
            submission_date: new Date(submissionDate)
        }

        entity.treaties = treaties;
    }
}

async function GetTrackedEntity(type:FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) {

    let trackedEntity: ITrackedEntity = {
        title: option.name, 
        type: type
    }

    let previousSelectedEntity = null;
    if(selectedEntities.length)
        previousSelectedEntity = selectedEntities[selectedEntities.length-1];

    if(previousSelectedEntity)
    {
        trackedEntity.countryName = previousSelectedEntity.countryName;
        trackedEntity.countryCode3 = previousSelectedEntity.countryCode3;
        trackedEntity.countryCode = previousSelectedEntity.countryCode;
    }
    else
    {
        let countryParsed: Array<any> = JSON.parse(countryCodesJson);
        const foundCountry = countryParsed.find(c => c["alpha-3"] === option.value);
        const countryCode =  foundCountry ? foundCountry["alpha-2"] : option.value ;
        trackedEntity.countryName = option.name;
        trackedEntity.countryCode = countryCode.toLowerCase();
        trackedEntity.countryCode3 = option.value;
    }

    

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

            await ReviewHelper.LoadEmissionsSubnational(option.name, trackedEntity);
            await ReviewHelper.LoadPledgesSubnational(option.name, trackedEntity);

            if(previousSelectedEntity)
            {
                if(previousSelectedEntity.countryCode3)
                    await ReviewHelper.LoadTreatiesCountry(previousSelectedEntity.countryCode3, trackedEntity);
                if(previousSelectedEntity.countryName) {
                    trackedEntity.sites = await siteService.allSitesByJurisdtiction(previousSelectedEntity.countryName, option.name)
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

    const dropdownItems:Array<DropdownOption> = [];

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

const GetOptions = async (filterType: FilterTypes, countryCode: string, selectedEntity?: ITrackedEntity) => {
    let options: Array<DropdownOption> = [];

    switch(filterType) {
        case FilterTypes.SubNational:
            options = await CountryCodesHelper.GetSubnationalsByCountryCode(countryCode);
            break;
        case FilterTypes.Organization:
            if(selectedEntity)
                options = await GetOrganizations(selectedEntity);
            break;
    }

    return options;
}

export const ReviewHelper = {
    LoadEmissionsCountry,
    LoadEmissionsSubnational,
    LoadPledgesSubnational,
    LoadPledgesCountry,
    LoadTreatiesCountry,
    GetTrackedEntity,
    GetOptions
};
