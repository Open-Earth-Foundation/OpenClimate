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

async function LoadEmissionsCountry(countryId: number, entity: ITrackedEntity)
{
    // const emissionResponse = await climateWatchService.fetchEmissionsCountry(countryCode);
    let emissionResponse = await fetch(`/api/country/2019/${countryId}`, {
        method: 'GET'
    });
    let data = await emissionResponse.json()
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
            
            await ReviewHelper.LoadEmissionsSubnational(option.value, trackedEntity);
            await ReviewHelper.LoadPledgesSubnational(option.name, trackedEntity);

            if(previousSelectedEntity)
            {
                if(previousSelectedEntity.countryCode)
                    await ReviewHelper.LoadTreatiesCountry(previousSelectedEntity.countryCode, trackedEntity);
                if(previousSelectedEntity.countryName) {
                    trackedEntity.sites = await siteService.allSitesByJurisdtiction(previousSelectedEntity.countryName, option.name)
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

    let dropdownItems:Array<DropdownOption> = [];

    const dropdowns = selectedEntity.sites?.map((site: ISite) => {
            const item = {
                name: site.organization_name ?? "",
                value: site.organization_id ?? "",
                id: site.organization_id ?? "",
                flag: ""
            }
    });

    return dropdowns;
}
let entity = [
    {
        "id": 34,
        "title": "Canada",
        "flagCode": "ca",
        "type": 0,
        "countryName": "Canada",
        "countryCode": "CAN",
        "aggregatedEmission": {
            "facility_ghg_total_gross_co2e": 733000,
            "facility_ghg_total_sinks_co2e": 0,
            "facility_ghg_total_net_co2e": 733000,
            "facility_ghg_date_updated": "2021-09-21",
            "facility_ghg_year": 2019,
            "facility_ghg_methodologies": [
                {
                    "tag_id": 1,
                    "tag_name": "Combined datasets",
                    "created_at": "2022-06-28T08:56:49.971Z",
                    "updated_at": "2022-06-28T08:56:49.971Z",
                    "methodology_to_tag": {
                        "meth": 1,
                        "tag_": 1
                    }
                },
                {
                    "tag_id": 2,
                    "tag_name": "Country-reported data or third party",
                    "created_at": "2022-06-28T08:56:49.971Z",
                    "updated_at": "2022-06-28T08:56:49.971Z",
                    "methodology_to_tag": {
                        "meth": 1,
                        "tag_": 2
                    }
                },
                {
                    "tag_id": 3,
                    "tag_name": "Year gaps numerically extrapolated",
                    "created_at": "2022-06-28T08:56:49.971Z",
                    "updated_at": "2022-06-28T08:56:49.971Z",
                    "methodology_to_tag": {
                        "meth": 1,
                        "tag_": 3
                    }
                },
                {
                    "tag_id": 4,
                    "tag_name": "Peer reviewed",
                    "created_at": "2022-06-28T08:56:49.971Z",
                    "updated_at": "2022-06-28T08:56:49.971Z",
                    "methodology_to_tag": {
                        "meth": 1,
                        "tag_": 4
                    }
                }
            ],
            "providerToEmissions": {
                "PRIMAP": {
                    "actorType": "country",
                    "totalGhg": 733000,
                    "year": 2019,
                    "landSinks": 0,
                    "otherGases": 0,
                    "methodologyType": "",
                    "methodologyTags": [
                        "Combined datasets",
                        "Country-reported data or third party",
                        "Year gaps numerically extrapolated",
                        "Peer reviewed"
                    ]
                },
                "UNFCCC Annex I": {
                    "actorType": "country",
                    "totalGhg": 730240000,
                    "year": 2019,
                    "landSinks": 9880000,
                    "otherGases": null,
                    "methodologyType": "",
                    "methodologyTags": [
                        "Country-reported data",
                        "Third party validated"
                    ]
                }
            }
        },
        "sites": [
            {
                "id": 1,
                "facility_name": "Test Site1",
                "facility_type": "Solar",
                "signature_name": "pavelkrolevets@gmail.com",
                "credential_type": "Facility Information",
                "facility_bounds": "",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "53.0716470504505, -125.47146420672287",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1654147743173,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "",
                "facility_sector_ipcc_activity": "",
                "facility_sector_ipcc_category": ""
            },
            {
                "id": 2,
                "facility_name": "Alberta Oil Test",
                "facility_type": "Oil",
                "signature_name": "joaquin@openearth.org",
                "credential_type": "Facility Information",
                "facility_bounds": "55.26603602205677, -115.90679303997007;55.26547974114782, -115.90478674781781;55.264575003911396, -115.90529100306463;55.26533302840115, -115.90741531240232",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "55.26521685550108, -115.90640680926197",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1654205831661,
                "facility_jurisdiction": "Alberta",
                "facility_sector_naics": "Oil and Gas",
                "facility_sector_ipcc_activity": "Refinery",
                "facility_sector_ipcc_category": "Oil and Gas"
            },
            {
                "id": 3,
                "facility_name": "Alberta Oil Admin Test",
                "facility_type": "Oil",
                "signature_name": "j.vanpeborgh@gmail.com",
                "credential_type": "Facility Information",
                "facility_bounds": "55.24409391937757, -115.6597617865023;55.24392877865496, -115.65919315818591;55.2433599553598, -115.65948283676217;55.24353121484259, -115.66036260132718",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "55.24367800809781, -115.65979397301076",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1654206210380,
                "facility_jurisdiction": "Alberta",
                "facility_sector_naics": "Oil",
                "facility_sector_ipcc_activity": "Refinery",
                "facility_sector_ipcc_category": "OIL"
            },
            {
                "id": 5,
                "facility_name": "Gold Mine HQ",
                "facility_type": "Mining",
                "signature_name": "joakovp@gmail.com",
                "credential_type": "Facility Information",
                "facility_bounds": "54.95553287629569, -115.71635452698857;54.955040023165296, -115.71562496612977;54.95446091301323, -115.71690169763262;54.955514394412376, -115.71794239474",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "54.95501542433184, -115.7164939872362",
                "organization_name": "Gold Mine",
                "credential_category": "Facility",
                "credential_issue_date": 1654268291436,
                "facility_jurisdiction": "Alberta",
                "facility_sector_naics": "Mining",
                "facility_sector_ipcc_activity": "Gold Mining",
                "facility_sector_ipcc_category": "Mining"
            },
            {
                "id": 6,
                "facility_name": "asdasd",
                "facility_type": "Mining",
                "signature_name": "greta@openearth.org",
                "credential_type": "Facility Information",
                "facility_bounds": "55.77940070222493, -115.65175121917191",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "55.77940070222493, -115.65175121917191",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1654513753493,
                "facility_jurisdiction": "Alberta",
                "facility_sector_naics": "",
                "facility_sector_ipcc_activity": "",
                "facility_sector_ipcc_category": ""
            },
            {
                "id": 8,
                "facility_name": "Gold Mine HQ",
                "facility_type": "Mining",
                "signature_name": "martin@openearth.org",
                "credential_type": "Facility Information",
                "facility_bounds": "55.78145208123018, -115.65183703256687;55.77981096933409, -115.64969126555913;55.77836287202695, -115.65179411722671;55.780341924863926, -115.65471236035727",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "55.77940070222493, -115.65175121917191",
                "organization_name": "CopperMountain",
                "credential_category": "Facility",
                "credential_issue_date": 1654773399794,
                "facility_jurisdiction": "Alberta",
                "facility_sector_naics": "Mining",
                "facility_sector_ipcc_activity": "Gold Mining",
                "facility_sector_ipcc_category": "Mining"
            },
            {
                "id": 10,
                "facility_name": "Test Site 2 ",
                "facility_type": "Solar",
                "signature_name": "greta@openearth.org",
                "credential_type": "Facility Information",
                "facility_bounds": "54.93211894172486, -120.6126597173949; 54.93212135337093, -120.61261914178158; 54.93210768737462, -120.6126751081448; 54.932108491256884, -120.6126387300087",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "54.93212939219014, -120.61264432664504",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1655109959904,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "Energy",
                "facility_sector_ipcc_activity": "Energy",
                "facility_sector_ipcc_category": "Energy"
            },
            {
                "id": 11,
                "facility_name": "Evan Factory",
                "facility_type": "Buildings",
                "signature_name": "admin@client.com",
                "credential_type": "Facility Information",
                "facility_bounds": "45.5,-73.2",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "Burnaby",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1655403438981,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "21",
                "facility_sector_ipcc_activity": "32",
                "facility_sector_ipcc_category": "1"
            },
            {
                "id": 12,
                "facility_name": "Evan's Better Factory",
                "facility_type": "Wind",
                "signature_name": "admin@client.com",
                "credential_type": "Facility Information",
                "facility_bounds": "12.1,11.3",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "Burnaby",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1655403591776,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "5",
                "facility_sector_ipcc_activity": "4",
                "facility_sector_ipcc_category": "3"
            }
        ],
        "transfers": []
    },
    {
        "id": 34,
        "title": "British Columbia",
        "type": 1,
        "countryName": "Canada",
        "countryCode": "CAN",
        "jurisdictionName": "British Columbia",
        "jurisdictionCode": 5,
        "sites": [
            {
                "id": 1,
                "organization_id": 1,
                "facility_name": "Test Site1",
                "facility_type": "Solar",
                "signature_name": "pavelkrolevets@gmail.com",
                "credential_type": "Facility Information",
                "facility_bounds": "",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "53.0716470504505, -125.47146420672287",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1654147743173,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "",
                "facility_sector_ipcc_activity": "",
                "facility_sector_ipcc_category": ""
            },
            {
                "id": 10,
                "organization_id": 1,
                "facility_name": "Test Site 2 ",
                "facility_type": "Solar",
                "signature_name": "greta@openearth.org",
                "credential_type": "Facility Information",
                "facility_bounds": "54.93211894172486, -120.6126597173949; 54.93212135337093, -120.61261914178158; 54.93210768737462, -120.6126751081448; 54.932108491256884, -120.6126387300087",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "54.93212939219014, -120.61264432664504",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1655109959904,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "Energy",
                "facility_sector_ipcc_activity": "Energy",
                "facility_sector_ipcc_category": "Energy"
            },
            {
                "id": 11,
                "organization_id": 1,
                "facility_name": "Evan Factory",
                "facility_type": "Buildings",
                "signature_name": "admin@client.com",
                "credential_type": "Facility Information",
                "facility_bounds": "45.5,-73.2",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "Burnaby",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1655403438981,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "21",
                "facility_sector_ipcc_activity": "32",
                "facility_sector_ipcc_category": "1"
            },
            {
                "id": 12,
                "organization_id": 1,
                "facility_name": "Evan's Better Factory",
                "facility_type": "Wind",
                "signature_name": "admin@client.com",
                "credential_type": "Facility Information",
                "facility_bounds": "12.1,11.3",
                "facility_country": "Canada",
                "credential_issuer": "OpenClimate",
                "facility_location": "Burnaby",
                "organization_name": "OpenClimate",
                "credential_category": "Facility",
                "credential_issue_date": 1655403591776,
                "facility_jurisdiction": "British Columbia",
                "facility_sector_naics": "5",
                "facility_sector_ipcc_activity": "4",
                "facility_sector_ipcc_category": "3"
            }
        ],
        "transfers": []
    }
]
GetOrganizations(entity)

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
            options = await CountryCodesHelper.GetCitiesBySubnationalId(entityId)
            break;
        case FilterTypes.Organization:
            options = [{
                name: 'OpenClimate',
                value: 1,
                flag: 'CAN',
                id: 1
            }]
            // if(selectedEntity) 
            //     options = await GetOrganizations(selectedEntity);             
                
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
