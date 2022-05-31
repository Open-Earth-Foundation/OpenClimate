import countryCodesJson from "../../api/data/review/data/country-codes";
import ICountry from "../../api/models/review/country";
import { regions }  from "../../api/data/review/data/regions"

const GetCountryCodes = () => {
    let countryParsed = <any[]>JSON.parse(countryCodesJson);
    const countries:ICountry[] = countryParsed.map(c => {
        return {
            name: c.name,
            codeAlpha2: c["alpha-2"],
            codeAlpha3: c["alpha-3"]
        }
    });

    return countries;
}

const GetContryOptions = () => {
    const countryCodes = GetCountryCodes();

    const countryCodeOptions = countryCodes.map(cc => {
        return {
            name: cc.name,
            value: cc.codeAlpha3
        }
    });

    return countryCodeOptions;
}

const GetSubnationalsByCountryCode = (countryCode: string) => {

    const filteredSubnationals =  regions.filter(sn => sn.country_code === countryCode?.toUpperCase());

    const options = filteredSubnationals.map(sn => {
        return {
            name: sn.name,
            value: `${sn.country_code}-${sn.state_code}`
        }
    });

    return options;
}

const GetCountryAlpha2 = (alpha3: string) => {
    let countryParsed: Array<any> = <any[]>JSON.parse(countryCodesJson);
    return  countryParsed.find(c => c["alpha-3"] === alpha3)['alpha-2'];
}

const GetCountryAlpha3 = (alpha2: string) => {
    let countryParsed: Array<any> = <any[]>JSON.parse(countryCodesJson);
    return  countryParsed.find(c => c["alpha-2"] === alpha2)['alpha-3'];
}

const GetCountryNameByAlpha3 = (alpha2: string) => {
    let countryParsed: Array<any> = <any[]>JSON.parse(countryCodesJson);
    return  countryParsed.find(c => c["alpha-3"] === alpha2)['name'];
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
    GetContryOptions,
    GetSubnationalsByCountryCode,
    GetCountryNameByAlpha3,
    GetCountryAlpha2,
    GetCountryAlpha3
};
