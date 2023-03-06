import { Chip, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import React, { FunctionComponent, useRef, useState } from "react";

import CheckIcon from "@mui/icons-material/Done";

import styled from "styled-components";

import { toast } from "react-toastify";

import {
  ContentCopy,
  QrCode,
  InfoOutlined,
  CopyAll,
} from "@mui/icons-material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IUser } from "../api/models/User/IUser";
import {
  Clickable,
  CopyText,
  InfoText,
  InlineClickable,
  SuccessText,
} from "./CommonStyles";

import {
  FormContainer,
  InputBox,
  PageContainer,
  QRBox,
  StyledQR,
} from "./CommonStylesForms";
import { Theme } from "../App";

interface RegisterProps {
  user: IUser;
  QRCodeURL: string;
  sendRequest: (channel: string, command: string, body: object) => void;
}

const LoginContainer = styled.div`
  padding: 100px 30px 0px 30px;
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;
const HeaderInfoText = styled(InfoText)`
  padding: 16px 0 42px;
`;

const StepInfoText = styled(InfoText)`
  color: black;
  padding-left: 12px;
`;

export const HeaderText = styled.div`
  font-weight: 500;
  font-size: 24px;
  line-height: 21px;
  color: #007568;
`;

const theme = createTheme({
  palette: {
    primary: {
      main: "#818385",
    },
    secondary: {
      main: "#F1A638",
    },
    success: {
      main: "#03AA6F",
    },
  },
});

const HeadingSubtext = styled.div`
  padding: 20px;
  width: 50%;
`;

const ActionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 50%;
`;

const CopyURLLink = styled.div`
  color: #007568;
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const InfoTxt = styled.div`
  width: 70%;
`;

const DemoAccessButn = styled.button`
  width: 70%;
  border: 2px solid #007568;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  margin-top: 10px;
  font-weight: 500;
`;
const NetworkStatusContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #0674da;
  padding: 20px;
  height: 88px;
`;

const StepperContainer = styled.div`
  background: ${(props) => props.theme.background_primary};
  width: 30%;
`;

const StepperWrapper = styled.div`
  margin-top: 60px;
  padding: 0 40px 20px 30px;
  text-align: left;
`;

const NetInfoText = styled.div`
  color: white;
  font-size: 11px;
  width: 50%;
  display: flex;
  align-items: flex-start;
  height: 70px;
  margin: 5px;
`;

const LoginWithWallet: FunctionComponent<RegisterProps> = (props) => {
  const [activeStep, setStep] = useState(0);
  const [isQRPage, setQRPage] = useState(false);
  const [requestedInvitation, setRequestedInvitation] = useState(false);
  const { user, sendRequest, QRCodeURL } = props;

  const walletCredentials = useRef();

  if (!requestedInvitation) {
    sendRequest("INVITATIONS", "CREATE_WALLET_INVITATION", { userID: 1 });
    setRequestedInvitation(true);
  }

  const nextStep = () => {
    setStep(activeStep + 1);
  };

  const steps = [
    {
      label:
        (activeStep === 0 && "Not started") ||
        (activeStep === 1 && "In progress") ||
        "Done",
      description: "Scan QR",
    },
    {
      label:
        (activeStep === 0 && "Not started") ||
        (activeStep === 1 && "In progress") ||
        "Done",
      description: "Accept the connection in your business wallet",
    },
    {
      label:
        (activeStep <= 1 && "Not started") ||
        (activeStep === 2 && "In progress") ||
        "Done",
      description: "Accept verified email request",
    },
    {
      label:
        (activeStep <= 1 && "Not started") ||
        (activeStep === 2 && "In progress") ||
        "Done",
      description: "Accept verified employee request",
    },
    {
      label:
        (activeStep <= 2 && "Not started") ||
        (activeStep === 3 && "In progress") ||
        "Done",
      description: "You’re done! You will be logged in automatically",
    },
  ];

  return (
    <PageContainer>
      <FormContainer isQRStep>
        <LoginContainer isQRPage={isQRPage}>
          <HeaderText>Login with your digital wallet</HeaderText>
          <HeadingSubtext>
            Scan this QR with your digital wallet to login. You will have to
            complete the request for proof of credentials
          </HeadingSubtext>
          <QRBox>
            <StyledQR value={QRCodeURL} size={300} renderAs="svg" />
          </QRBox>
          <ActionContainer>
            <CopyURLLink>
              <span>
                <CopyAll />
              </span>
              <span>Copy URL</span>
            </CopyURLLink>
            <InfoTxt>
              or you can use the Demo Access if you don’t have a verified
              credential yet.{" "}
            </InfoTxt>
            <DemoAccessButn>Use Demo Access</DemoAccessButn>
          </ActionContainer>
        </LoginContainer>
      </FormContainer>
      <ThemeProvider theme={theme}>
        <StepperContainer>
          <NetworkStatusContainer>
            <NetInfoText>
              Make sure your wallet is set up to the correct network before
              interacting with this invitation or request.
            </NetInfoText>
            <NetInfoText>
              <p>
                Network:<b>&nbsp; &nbsp;Bcovrin Test Network</b>
              </p>
            </NetInfoText>
          </NetworkStatusContainer>
          <StepperWrapper>
            <HeaderText>Steps to complete login</HeaderText>
            <HeaderInfoText>
              Here's what you can expect from this login process.
            </HeaderInfoText>
            <Stepper
              activeStep={0}
              orientation="vertical"
              sx={{
                "& .MuiStepConnector-root .MuiStepConnector-line": {
                  borderColor: "#007567",
                },
              }}
            >
              {steps.map((step) => (
                <Step
                  key={step.description}
                  active
                  sx={{
                    "& .MuiStepLabel-root .Mui-active": {
                      color: "#007567",
                    },
                    "& .MuiStepContent-root": {
                      borderLeft: "1px solid #007567",
                    },
                  }}
                >
                  <StepLabel>
                    <StepInfoText>
                      <Chip
                        label={step.label}
                        size="small"
                        variant="outlined"
                        color={
                          (step.label === "Done" && "success") ||
                          (step.label === "In progress" && "secondary") ||
                          "primary"
                        }
                      />
                    </StepInfoText>
                  </StepLabel>
                  <StepContent>
                    <InfoText>{step.description}</InfoText>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </StepperWrapper>
        </StepperContainer>
      </ThemeProvider>
    </PageContainer>
  );
};

export default LoginWithWallet;
