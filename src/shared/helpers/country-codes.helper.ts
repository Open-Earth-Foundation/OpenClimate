import countryCodesJson from "../../api/data/review/data/country-codes";
import organizations from "../../api/data/review/data/subnationals";
import IOrganization from "../../api/models/DTO/Organization/IOrganization";
import ICountry from "../../api/models/review/country";
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes";
import { DropdownOption } from "../interfaces/dropdown/dropdown-option";
import { organizationService } from "../services/organization.service";

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

const GetSubnationalsByCountry = (selectedCountryAlpha2: string) => {
    let subnationalsParsed = <any[]>JSON.parse(organizations);

    let countryParsed: Array<any> = <any[]>JSON.parse(countryCodesJson);
    const countryName =  countryParsed.find(c => c["alpha-3"] === selectedCountryAlpha2)?.name;

    const filteredSubnationals =  subnationalsParsed.filter(sn => sn.country === countryName);

    const options = filteredSubnationals.map(sn => {
        return {
            name: sn.organization,
            value: `${countryName},${sn.organization}`
        }
    });

    return options;
}

export const CountryCodesHelper = {
    GetCountryCodes,
    GetContryOptions,
    GetSubnationalsByCountry
};
