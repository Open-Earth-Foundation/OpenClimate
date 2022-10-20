import countryCodesJson from "../../api/data/review/data/country-codes";
import ICountry from "../../api/models/review/country";
import { regions }  from "../../api/data/review/data/regions"

const GetCountryCodes = async () => {
    let countryParsed =  await fetch('/api/v1/actor/EARTH/parts', {
        method: 'GET',
    });
    const jsonData = await countryParsed.json()
    const countries:ICountry[] = jsonData.data.map((c:any) => {
        return {
            countryId: c.actor_id,
            name: c.name,
            codeAlpha2: c.name,
            codeAlpha3: c.name,
        }
    });

    return countries;
}

const GetCountryOptions = async () => {
    const countryCodes = await GetCountryCodes();
    
    const countryCodeOptions = countryCodes.map(cc => {
        return {
            countryId: cc.countryId,
            name: cc.name,
            value: cc.countryId,
            flag:cc.codeAlpha3,
            sn: cc.sn
        }
    });
    

    return countryCodeOptions;
}

const GetCountryOptionsForSite = async () => {
    const countryCodes = await GetCountryCodes();
    const countryCodeOptions = countryCodes.map(cc => {
        return {
            name: cc.name,
            value: cc.codeAlpha2,

        }
    });

    return countryCodeOptions;
}

const GetSubnationalsByCountryCode = async (actor_id: number) => {

    const res = await fetch(`/api/v1/actor/${actor_id}/parts`, {
        method: 'GET'
    });

    const subnationalData = await res.json();

    const subnationals = subnationalData?.data.map((sn:any)=>{
        return {
            value: sn.actor_id,
            name: sn.name,
        }
    });
   
    return subnationals;
}

const GetCitiesBySubnationalId = async (entity_id:number) => {
    const res = await GetCountryCodes();
    const options = res?.map(sn => {
        return [];
    });
   
    const data = options.filter(e=>e.length)
    const cities = data?.map(sn => {
        return sn[0]?.Cities.filter((s:any) => s.subnationals_to_cities.subnational_id == entity_id )
    });

    const cityOptions = cities[0]?.map((cc:any) => {
        return {
            name: cc.city_name,
            value: cc.city_id
        }
    });
    
    return cityOptions;
}


const GetCountryAlpha2 = (alpha3: string) => {
    let countryParsed: Array<any> = <any[]>JSON.parse(countryCodesJson);
    return countryParsed ? countryParsed.find(c => c["alpha-3"] === alpha3)['alpha-2'] : null;
}

const GetCountryAlpha3 = (alpha2: string) => {
    let countryParsed: Array<any> = <any[]>JSON.parse(countryCodesJson);
    return countryParsed ? countryParsed.find(c => c["alpha-2"] === alpha2)['alpha-3'] : null;
}

const GetCountryNameByAlpha3 = (alpha2: string) => {
    let countryParsed: Array<any> = <any[]>JSON.parse(countryCodesJson);
    return countryParsed ? countryParsed.find(c => c["alpha-3"] === alpha2)['name'] : null;
}

const GetRegionNameByCode = (jurisdictionCode: string) => {
    const splittedJurisdiction = jurisdictionCode.split('-');
    const jurisdictionNode =  regions.find(sn => 
        sn.country_code === splittedJurisdiction[0]?.toUpperCase() && 
        sn.state_code === splittedJurisdiction[1]?.toUpperCase());

    return jurisdictionNode ? jurisdictionNode.name : '';
}

export const CountryCodesHelper = {
    GetRegionNameByCode,
    GetCountryCodes,
    GetCountryOptions,
    GetCountryOptionsForSite,
    GetSubnationalsByCountryCode,
    GetCitiesBySubnationalId,
    GetCountryNameByAlpha3,
    GetCountryAlpha2,
    GetCountryAlpha3
};
