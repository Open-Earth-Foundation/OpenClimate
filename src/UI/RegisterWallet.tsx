import { Chip, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import React, { FunctionComponent, useRef, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';

import styled from 'styled-components'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IUser } from '../api/models/User/IUser';
import { HeaderText, InfoText, SuccessText } from './CommonStyles';

import {
    FormContainer,
    InputBox,
    PageContainer,
    StepperContainer,
  } from './CommonStylesForms'
import { Theme } from '../App';

interface RegisterProps {
    user: IUser
}

const RegisterContainer = styled.div`
  padding: 200px 30px 0px 30px;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const CredentialText = styled(InfoText)`
  padding: 28px 0 28px;
  width: 650px;
  
`

const HeaderInfoText = styled(InfoText)`
  padding: 16px 0 42px;
`

const StepInfoText = styled(InfoText)`
  color: black;
  padding-left: 12px;
`

const AdditionalText = styled(InfoText)`
  margin-top: 80px;
`

const RegisterForm = styled.form`
  width: 425px;
  border-radius: 20px;
  height: 40px;
  background-color: ${(props: { theme: Theme }) => props.theme.background_primary};
  `

const RegisterInput = styled.input`
  width: 90%;
  font-size: 14px;
  font-family: Lato;
  font-weight: 400;
`

const SubmitContainer = styled.div`
  margin: 40px 0px 30px;
`

const RegisterSubmit = styled.button`
  width: 186px;
  height: 28px;
  color: ${(props: { theme: Theme })  => props.theme.background_primary};
  background: ${(props: { theme: Theme })  => props.theme.primary_color};
  font-size: 13px;
  line-height: 25px;
`

const ScanText = styled(InfoText)`
  text-decoration: underline;
  margin-top: 30px;
  color: #03AA6F;
  cursor: pointer;
`

const SentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${(props: { theme: Theme })  => props.theme.primary_color};
`

const InvitationText = styled(SuccessText)`
  padding-left: 5px;
`

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




const RegisterWalletPage: FunctionComponent<RegisterProps> = (props) => {

  const [activeStep, setStep] = useState(0);
  const walletCredentials = useRef();

  const nextStep = () => {
    setStep(activeStep + 1);
  }

  console.log(walletCredentials);
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    nextStep();
  }

  const steps = [
      {
        label: activeStep === 0 ? 'Not started' : 'Done',
        description: "Enter the Decentralized Identifier (DID) of your organization’s business wallet, and click button to send the connection invitation."
      },
      {
        label: activeStep === 0 && 'Not started' || activeStep === 1 && 'In progress' || 'Done',
        description: "Accept the connection invitation you received in the business wallet."
      },
      {
        label: activeStep <= 1 && 'Not started' || activeStep === 2 && 'In progress' || 'Done',
        description: "After the business wallet is connected with us, send the corresponding proof in response to the proof request you received in the business wallet."
      },
      {
        label: activeStep <= 2 && 'Not started' || activeStep === 3 && 'In progress' || 'Done',
        description: "After the proof of verified, the business wallet will be registered successfully, and you will be ready to submit verified data."
      },
    ];
  
  return (
      <PageContainer>
          <FormContainer isQRStep>
              <RegisterContainer>
                  <HeaderText>Register business wallet</HeaderText>
                  <CredentialText>If your organization holds verifiable credentials in a business wallet, you can register it with us to submit verified data.</CredentialText>
                  <RegisterForm onSubmit={handleSubmit}>
                    <InputBox>
                      <RegisterInput
                        type="credentials"
                        name="credentials"
                        id="credentials"
                        ref={walletCredentials}
                        placeholder="Your organization’s DID. i.e: did:sov:ewoiruwefh"
                        required
                      />
                    </InputBox>
                    <SubmitContainer>
                    { 
                      activeStep === 0 ? 
                        <RegisterSubmit type="submit">Send invitation</RegisterSubmit>
                        :
                        <SentContainer><CheckIcon/><InvitationText>Invitation sent</InvitationText></SentContainer>
                    }
                    </SubmitContainer>
                  </RegisterForm>
                  <AdditionalText>- or -</AdditionalText>
                  <ScanText onClick={nextStep}>Click here to scan QR Code</ScanText>
              </RegisterContainer>
          </FormContainer>
          <ThemeProvider theme={theme}>
          <StepperContainer>
              <HeaderText>Steps to complete verification</HeaderText>
              <HeaderInfoText>Here's what you can expect from this process of verification</HeaderInfoText>
              <Stepper 
                activeStep={0} 
                orientation="vertical"
                sx={{
                        '& .MuiStepConnector-root .MuiStepConnector-line': {
                          borderColor: '#007567',
                        },
                      }}
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
                            <StepInfoText>
                            <Chip
                              label={step.label}
                              size="small"
                              variant="outlined"
                              color={step.label === "Done" && "success" || step.label === "In progress" && "secondary" || "primary"}
                            />
                            </StepInfoText>
                          </StepLabel>
                          <StepContent>
                              {step.description}
                          </StepContent>
                      </Step>
                  ))}
              </Stepper>
          </StepperContainer>
          </ThemeProvider>
      </PageContainer>
  )
}

export default RegisterWalletPage;
