import React, { FunctionComponent, useState, useEffect } from 'react'
import Button from '../../form-elements/button/button';
import './accept-ghg-proof.modal.scss';
import { ClimateActionTypes } from './../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionScopes } from './../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import Dropdown from '../../form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { useForm, Controller } from "react-hook-form";
import ISite from '../../../../api/models/DTO/Site/ISite';
import IClimateAction from '../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { IUser } from '../../../../api/models/User/IUser';
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import { climateActionService } from '../../../services/climate-action';
import { proofsService } from '../../../services/proofs.service';
import { toast } from 'react-toastify';
import {
    useNotification
  } from '../../../../UI/NotificationProvider';

interface Props {
    user: IUser | null,
    onModalHide: () => void,
    onModalShow: (entityType: string, parameters?: object) => void,
    type?: ClimateActionTypes,
    scope: ClimateActionScopes,
    scope1: any,
    sites?: Array<ISite>,
    climateActions: Array<IClimateAction>,
    addClimateAction: (climateAction: IClimateAction) => void,
    addAggregatedEmission: (aggregatedEmission: IAggregatedEmission) => void,
    setScope1: (scope1: any) => void,
}

const AcceptGHGProofModal: FunctionComponent<Props> = (props) => {

    const { onModalHide, scope, sites, type, onModalShow, scope1, setScope1, user } = props;
    const [userSite, setUserSite] = useState<string>('');
    const { formState, register,  handleSubmit, setValue, control } = useForm();
    const setNotification = useNotification()

    useEffect(() => {
        console.log(sites)
    },[userSite])
    
    const saveClimateAction = async () => {      
        
        const foundSite=  sites.find(f => f.facility_name === userSite);
        
        if (!foundSite) {
            setNotification(
                `Site from presentation doesnt match`,
                'error'
              )
            return;
        }

        if(!user || !user.company.organization_id){
            return;
        }
        
        const climateAction: IClimateAction = {}

        climateAction.credential_issue_date = Date.now();
        climateAction.credential_category = "Climate Action";
        climateAction.credential_type = "Emissions";
        climateAction.credential_issuer = scope1.credential_issuer.raw;
        climateAction.organization_name = user.company?.organization_name;
        climateAction.signature_name = `${user.email}`;

        climateAction.facility_country = foundSite.facility_country;
        climateAction.facility_jurisdiction = foundSite.facility_jurisdiction;
        climateAction.facility_location = foundSite.facility_location;
        climateAction.facility_sector_ipcc_activity = foundSite.facility_sector_ipcc_activity;
        climateAction.facility_sector_ipcc_category = foundSite.facility_sector_ipcc_category;
        climateAction.facility_sector_naics = foundSite.facility_sector_naics;
        climateAction.facility_type = foundSite.facility_type;
        climateAction.facility_name = foundSite.facility_name;

        climateAction.credential_reporting_date_start ='';
        climateAction.verification_result = 'Verified';
        climateAction.verification_body = scope1.credential_issuer_name.raw;
        climateAction.credential_issue_date = scope1.credential_reporting_date_start.raw;
        climateAction.credential_reporting_date_end =scope1.credential_reporting_date_end.raw;
        climateAction.verification_credential_id = scope1.credential_issuer.raw;
        
        climateAction.facility_emissions_co2e = scope1.facility_emissions_scope1_co2e.raw;
        climateAction.climate_action_scope = 'Scope1';
        climateAction.facility_sector_naics ='';
        climateAction.facility_emissions_ch4 ='';
        climateAction.facility_emissions_hfc ='';
        climateAction.facility_emissions_n2o ='';
        climateAction.facility_emissions_pfc ='';
        climateAction.facility_emissions_sf6 ='';
        climateAction.facility_emissions_fvpwt_ch4 ='';
        climateAction.facility_emissions_fvpwt_hfc ='';
        climateAction.facility_emissions_fvpwt_n2o ='';
        climateAction.facility_emissions_fvpwt_pfc ='';
        climateAction.facility_emissions_fvpwt_sf6 ='';
        climateAction.facility_emissions_co2_fossil ='';
        climateAction.facility_emissions_fvpwt_co2e ='';
        climateAction.facility_sector_ipcc_activity ='';
        climateAction.facility_sector_ipcc_category ='';
        climateAction.facility_emissions_co2_biomass ='';
        climateAction.facility_emissions_combustion_ch4 ='';
        climateAction.facility_emissions_combustion_n2o ='';
        climateAction.facility_emissions_combustion_co2e ='';
        climateAction.facility_emissions_fvpwt_co2_fossil ='';
        climateAction.facility_emissions_fvpwt_co2_biomass = '';
        climateAction.facility_emissions_combustion_co2_fossil ='';
        climateAction.facility_emissions_combustion_co2_biomass ='';

        const userCompanyId = user.company.organization_id;
        const proof = await proofsService.readProofCredDef(user.id, scope1.cred_def_id.raw)
        
        // Disable check for incoming Scope1 proof already exists

        // if (proof) {
        //     toast.error("This credentials were already accepted");
        //     return;
        // }
        
        await proofsService.saveProofCredDef(user.id, scope1.cred_def_id.raw)

        await climateActionService.saveClimateAction(userCompanyId, climateAction).then(ca => {
            onModalHide();
            toast("The data was succesfully imported");
        });
        
        return;
    }

    const reject = ()=> {
        onModalHide();
        toast.error("The data was rejected");
        setScope1(null)
    }

    return (
        <div className="accept-ghg-proof__content">
            <div className="accept-ghg-proof__content_column">
                <div className="accept-ghg-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(scope1).map(function(value, idx) {
                            return <tr key={idx}>
                                <td>{value}</td>
                                <td>{scope1[value].raw}</td>
                            </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="accept-ghg-proof__btn_row">
                    <Dropdown
                        withSearch={false}
                        options={sites.map(s=> {return {name: s.facility_name, value: s.facility_name} as DropdownOption})}
                        title=""
                        emptyPlaceholder="Assign a site"
                        onSelect={(option: DropdownOption) => setUserSite(option.value)}
                        register={register}
                        label="select_site"
                        required={true}
                        setValue={setValue}
                    />
                </div>
                <div className="accept-ghg-proof__btn_row">
                    <div style={{margin: 25, width: 100}}>
                        <Button 
                                click={() => reject()}
                                color="primary"
                                text="Reject"
                                type="button"
                        />
                    </div>
                    <div style={{margin: 25, width: 100}}>
                        <Button 
                                click={() => saveClimateAction()}
                                color="primary"
                                text="Approve"
                                type="button"
                        />
                    </div>
                </div>
            </div>
        </div>

    );
}


export default AcceptGHGProofModal;
