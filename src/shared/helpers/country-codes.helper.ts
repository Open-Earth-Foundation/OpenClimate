import countryCodesJson from "../../api/data/review/data/country-codes";
import ICountry from "../../api/models/review/country";
import { regions }  from "../../api/data/review/data/regions"

const GetCountryCodes = async () => {
    let countryParsed =  await fetch('https://dev.openclimate.network/api/country/2019', {
        method: 'GET',
    });
    const jsonData = await countryParsed.json()
    const countries:ICountry[] = jsonData.data.map((c:any) => {
        return {
            countryId: c.country_id,
            name: c.country_name,
            codeAlpha2: c.iso,
            codeAlpha3: c.flag_icon,
            sn: c.Subnationals
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

const GetSubnationalsByCountryCode = async (countryId: number) => {

    // const filteredSubnationals =  regions.filter(sn => sn.country_code === countryCode?.toUpperCase());

    const res = await GetCountryOptions();

    const options = res.map(sn => {
        return sn?.sn.filter((s:any) => s.countries_to_subnationals.country_id == countryId )
    });
   
    const data = options.filter(e=>e.length)
  

    const subnationals = data[0]?.map((sn:any)=>{
        return {
            name: sn.subnational_name,
            value: sn.subnational_id,
            countryId: sn.countries_to_subnationals,
            cities: sn.Cities
        }
    });
   
    return subnationals;
}

const GetCitiesBySubnationalId = async (entity_id:number) => {
    const res = await GetCountryCodes();
    const options = res.map(sn => {
        return sn?.sn.filter((s:any) => s.countries_to_subnationals.subnational_id == entity_id )
    });
   
    const data = options.filter(e=>e.length)
    const cities = data.map(sn => {
        return sn[0]?.Cities.filter((s:any) => s.subnationals_to_cities.subnational_id == entity_id )
    });

    const cityOptions = cities[0].map((cc:any) => {
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
