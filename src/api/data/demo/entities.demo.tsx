import IOrganization from '../../models/DTO/Organization/IOrganization'
import IPledge from '../../models/DTO/Pledge/IPledge'
import ISite from '../../models/DTO/Site/ISite'
import { IUser } from '../../models/User/IUser'

const DemoUser: IUser = {
    firstName: 'Demo',
    lastName: 'Account',
    password: '12345',
    email: 'demo.account@d.a',
    //company
}

const DemoOrganization: IOrganization = {
    organization_name: 'Demo organization',
    organization_country: 'Canada',
    organization_jurisdiction: 'British Columbia',
    organization_credential_id: '777'
}

const DemoSite: ISite = {
    facility_name: 'Demo Site 1',
    facility_country: 'Canada',
    facility_jurisdiction: 'British Columbia',
    credential_type: 'Solar',
    facility_location: '56.41749173976232, -125.62465728009398'
}

const DemoPledge: IPledge = {
    organization_category: 'Pledges',
    credential_type: 'Target emission',
    credential_issuer: 'OpenClimate',
    pledge_target_year: 2040,
    pledge_emission_target: 50
}


export const DemoData = {
    DemoUser,
    DemoOrganization,
    DemoSite,
    DemoPledge
}