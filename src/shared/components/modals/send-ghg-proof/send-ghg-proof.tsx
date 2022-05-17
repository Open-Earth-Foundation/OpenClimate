import React, { FunctionComponent, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import Button from '../../form-elements/button/button';
import './send-ghg-proof.modal.scss';
import Dropdown from '../../form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { useForm, Controller } from "react-hook-form";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
    useNotification
  } from '../../../../UI/NotificationProvider';
import { IUser } from '../../../../api/models/User/IUser';
import IWallet from '../../../../api/models/DTO/Wallet/IWallet';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components'

import { HeaderText, InfoText, SuccessText } from '../../../../../src/UI/CommonStyles';
import { Chip, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { useHistory } from 'react-router-dom';


interface Props {
    onModalHide: () => void,
    onModalShow: (entityType: string, parameters?: object) => void,
    scope1: any,
    user: IUser,
    wallet: any,
    wallets: Array<IWallet>
}

const theme = createTheme({
    palette: {
      primary: {
        main: '#818385',
      },
      secondary: {
        main: '#F1A638'
      },
      success: {
        main: '#03AA6F',
      }
    },
  });

const StepInfoText = styled(InfoText)`
    color: black;
    padding-left: 12px;
`

const StepLabelText = styled(InfoText)`
    color: black;
    font-size: 10px;
    padding-left: 12px;
`

const SendGHGCredModal: FunctionComponent<Props> = (props) => {

    const { onModalHide, onModalShow, scope1, user, wallet, wallets} = props;
    const [userEmail, setUserEmail] = useState<string>('');
    const [activeStep, setActiveStep] = useState<number>(0);
    const [userWallet, setUserWallet] = useState<string>('');
    const [requestedInvitation, setRequestedInvitation] = useState(false)
    const setNotification = useNotification()
    const [connectionLink, setConnectionLink] = useState<string>('');

    const history = useHistory();

    const onRegisterWalletClick = () => {
        history.push('/register-wallet');
        onModalHide();
    }

    useEffect(() => {
        if(userWallet && activeStep !== 1){
            setActiveStep(1);
        } else if (!userWallet && activeStep !== 0) {
            setActiveStep(0);
        }

    },[userWallet, setUserWallet])

    const steps = [
        {
          label: activeStep === 0 ? 'In progress' : 'Done',
          description: "Choose the wallet from where you want to import data."
        },
        {
          label: activeStep === 0 && 'Not started' || activeStep === 1 && 'In progress' || 'Done',
          description: "Send proof request to the selected wallet"
        },
        {
          label: activeStep <= 1 && 'Not started' || activeStep === 2 && 'In progress' || 'Done',
          description: "Approve proof request on the selected wallet"
        },
      ];
    
    async function requestWalletInvitation() {
        if (!requestedInvitation) {
            console.log("User", user)
            props.sendRequest('INVITATIONS', 'CREATE_WALLET_INVITATION', {userID: user.id})
            setRequestedInvitation(true)
          }
    }

    

    console.log("Wallets", wallets)
   

    async function pushPresentationRequestHandler() {
        props.sendRequest('EMISSION_PRESENTATION', 'PUSH', {did: userWallet})
        setNotification(
            `Presentation request sent`,
            'notice'
          )
          setActiveStep(2);
    }

    const { formState, register,  handleSubmit, setValue, control } = useForm();
    
    if (props.scope1) {
        console.log("Scope 1", props.scope1)
        onModalShow('accept-ghg-proof', { scope1: props.scope1 })
      }

    const fakeWallets = [ { id: 20, did: '123fds8a90f8saasdf', organization_id: 30}]

    return (
        <div className="add-ghg-cred__content">
            <div className="add-ghg-cred__content_row">
                <div className="add-ghg-cred__btn_row_left">
                    <div className="add-ghg-cred__dropdown">
                    <Dropdown
                        withSearch={false}
                        options={fakeWallets.map(w=> {return {name: w.did, value: w.did} as DropdownOption})}
                        title=""
                        emptyPlaceholder="* Business Wallet"
                        onSelect={(option: DropdownOption) => setUserWallet(option.value)}
                        onDeSelect={() => setUserWallet('')}
                        register={register}
                        label="select_wallet_did"
                        required={true}
                        setValue={setValue}
                    /> 
                    </div>
                    <div className="modal__row login-credential-form__qr-content">
                    <a onClick={async () => onModalShow('bw-invitation')}
                        className="modal__link modal__link_primary"
                        >
                            <div className="login-credential-form__copy-link">
                                <ContentCopyIcon className={"login-credential-form__info-icon"} />Request invitation to connect
                            </div>
                    </a>
                    <div className="login-credential-form__eye-info" onClick={onRegisterWalletClick}>
                                <RemoveRedEyeIcon fontSize="inherit" className="login-credential-form__eye-icon"/>Connect new wallet
                    </div>
                    </div>
                    <div style={{marginTop: 25}}>
                        <Button 
                                click={() => pushPresentationRequestHandler()}
                                color="primary"
                                text="Send proof request to wallet"
                                type="button"
                        />
                    </div>
                  

                </div>
                <div className="add-ghg-cred__btn_row_middle"></div>
                <div className="add-ghg-cred__btn_row_right">
                    <HeaderText>Steps to connect data</HeaderText>
                    <InfoText className="add-ghg-cred__info_text">Here's what you can expect from this process of verification</InfoText>
                      <ThemeProvider theme={theme}>
                        <Stepper 
                          activeStep={0} 
                          orientation="vertical"
                          sx={{
                                  '& .MuiStepConnector-root .MuiStepConnector-line': {
                                    borderColor: '#007567',
                                  },
                                }}
                          className="add-ghg-cred__stepper"
                          >
                            {steps.map((step) => (
                              <Step 
                                key={step.description} 
                                active
                                sx={{
                                  '& .MuiStepLabel-root .Mui-active': {
                                    color: '#007567',
                                  },
                                  '& .MuiStepContent-root': {
                                    borderLeft: '1px solid #007567'
                                  },
                                }}>
                                    <StepLabel>
                                      <StepLabelText className="add-ghg-cred__step_label">
                                        <Chip
                                          label={step.label}
                                          size="small"
                                          variant="outlined"
                                          color={step.label === "Done" && "success" || step.label === "In progress" && "secondary" || "primary"}
                                        />
                                      </StepLabelText>
                                    </StepLabel>
                                    <StepContent>
                                      <StepInfoText>
                                        {step.description}
                                      </StepInfoText>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                      </ThemeProvider>
                </div>
            </div>
        </div>

    );
}


export default SendGHGCredModal;
