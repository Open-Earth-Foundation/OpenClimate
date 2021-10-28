import React, { FunctionComponent } from 'react'
import { DropdownOption } from '../../../../interfaces/dropdown/dropdown-option';
import ISite from '../../../../../api/models/DTO/Site/ISite';
import { ClimateActionScopes } from '../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import EmissionsScope1Form from './emissions-scope1-form/emissions-scope1-form';
import IClimateAction from '../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import EmissionsScope2Form from './emissions-scope2-form/emissions-scope2-form';
import EmissionsScope3Form from './emissions-scope3-form/emissions-scope3-form';


interface Props {
    scopeOptions: Array<DropdownOption>,
    typeOptions: Array<DropdownOption>,
    sites: Array<ISite>,
    defaultScope?: ClimateActionScopes,
    saveClimateAction: (action?: IClimateAction) => void,
    typeChangedHandler: (name: string, value: string) => void,
    scopeChangedHandler: (value: string) => void,
    onModalHide: () => void
}

const EmissionsForm: FunctionComponent<Props> = (props) => {

    const { defaultScope } = props;

    let form = <></>;
    switch (defaultScope) {
        case ClimateActionScopes.Scope1:
            form = <EmissionsScope1Form {...props} /> 
            break;
        case ClimateActionScopes.Scope2:
            form = <EmissionsScope2Form {...props} /> 
            break;
        case ClimateActionScopes.Scope3:
            form = <EmissionsScope3Form {...props} /> 
            break;
    }

    return (
        <>
            {form}
        </>
    );
}


export default EmissionsForm;
