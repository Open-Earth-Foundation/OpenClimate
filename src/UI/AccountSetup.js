import Axios from 'axios'
import React, { useRef, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'


import { useNotification } from './NotificationProvider'
import { handleImageSrc } from './util'

// Envision imports
import { userService } from '../shared/services/user.service'
import { IUser } from '../api/models/User/IUser'

import { 
  HeaderText,
  CopyText,
  InfoText,
  Clickable,
  ItalicText,
  PrimaryColor
} from './CommonStyles'

import {
  FormContainer,
  PageContainer,
  StepperContainer,
  InputBox,
  LogoHolder,
  Logo,
  Form,
  Label,
  SubmitBtn,
  InputField,
} from './CommonStylesForms'



const QRContainer = styled.div`
  padding: 150px 30px 0px 30px;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
`
const QRHolder = styled.div`
  border-radius: 4px;
  border: 1px solid rgba(162, 151, 151, 0.35);
  padding: 25px;
  margin-bottom: 16px;
  margin-top: 50px;
  width: 300px;
  height: 300px;
  background: ${(props) => props.theme.background_primary}
`

const QR = styled(QRCode)`
  display: block;
  margin: auto;
  padding: 10px;
  width: 250px;
  height: 250px;
`

const SubContainer = styled.div`
  display: flex;
  padding-bottom: 24px;
`

const CopyIcon = styled(ContentCopyIcon)`
  margin-right: 4px;
`

const InfoIcon = styled(InfoOutlinedIcon)`
margin-right: 4px;
`

const InlineClickable = styled.a`
  padding: 0 4px;
  text-decoration: underline;
  cursor: pointer;
  font-family: Lato;
  font-size: 16px;
  color: ${(props) => props.theme.primary_color};
`

const HeaderInfoText = styled(InfoText)`
  padding: 16px 0px 40px;
`

const StepInfoText = styled(InfoText)`
  color: black;
  padding-left: 12px;
`

const steps = [
  {
    label: <>Scan the QR code with a digital wallet. <ItalicText>We recommend using Trinsic.</ItalicText></>
  },
  {
    label: 'You will get an invite in the app. You need to accept the invitation from our site.'
  },
  {
    label: 'On the home page, within “Connections” you will see your credential offers.'
  },
  {
    label: 'You will have to accept the Climate Organization credential offer.'
  },
  {
    label: 'You will have to accept the Validated Email credential offer.'
  },
  {
    label: <><PrimaryColor>You’re done!</PrimaryColor>Now you can login using your digital wallet credential.</>
  },
];

function AccountSetup(props) {
  const [accountPasswordSet, setAccountPasswordSet] = useState(false)
  const token = window.location.hash.substring(1)

  const [id, setId] = useState({})

  useEffect(() => {
    // Check if the token is expired
    const decoded = jwt_decode(token)
    if (Date.now() >= decoded.exp * 1000) {
      console.log('The link has expired')
      setNotification("The user doesn't exist or the link has expired", 'error')
      props.history.push('/')
    } else {
      console.log('The token is valid')
      setId(decoded.id)
    }

    // Check the token on the back end
    Axios({
      method: 'POST',
      data: {
        token: token,
      },
      url: `${process.env.REACT_APP_CONTROLLER}/api/user/token/validate`,
    }).then((res) => {
      if (res.data.error) {
        setNotification(res.data.error, 'error')
        props.history.push('/')
      } else {
        props.sendRequest('INVITATIONS', 'CREATE_ACCOUNT_INVITATION', {token: token})
      }
    })
  }, [])

  const [logo, setLogo] = useState(null)

  useEffect(() => {
    // Fetch the logo
    Axios({
      method: 'GET',
      url: `${process.env.REACT_APP_CONTROLLER}/api/logo`,
    }).then((res) => {
      if (res.data.error) {
        setNotification(res.data.error, 'error')
      } else {
        setLogo(handleImageSrc(res.data[0].image.data))
      }
    })
  }, [])

  // Access the notification context
  const setNotification = useNotification()

  const accSetupForm = useRef()
  const pass1 = useRef()
  const pass2 = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(accSetupForm.current)

    // Check the password match
    if (pass1.current.value != pass2.current.value) {
      console.log("Passwords don't match")
      setNotification('Passwords do not match. Please try again', 'error')
    } else {
      // Update the user, redirect to login and setup notification
      Axios({
        method: 'POST',
        data: {
          id: id,
          password: form.get('password'),
          token: token,
          flag: 'set-up user',
        },
        url: `${process.env.REACT_APP_CONTROLLER}/api/user/update`,
      }).then((res) => {
        console.log(res)
        // Envision user creation
        const newUser: IUser = {
          firstName: res.data.user.first_name,
          lastName: res.data.user.last_name,
          email: res.data.user.email,
          password: res.data.user.password,
          organizationId: res.data.user.organization_id,
        }
        userService.register(newUser)

        if (res.data.status) {
          setNotification(res.data.status, 'notice')
          setAccountPasswordSet(true)
        } else if (res.data.error) {
          setNotification(res.data.error, 'error')
        } else {
          setNotification(
            "User couldn't be updated. Please try again.",
            'error'
          )
        }
      })
    }
  }

  return (
    <PageContainer>
    <FormContainer isQRStep={accountPasswordSet}>
      <LogoHolder>
        {logo && !accountPasswordSet ? <Logo src={logo} alt="Logo" /> : <Logo />}
      </LogoHolder>
      {token ? (
        accountPasswordSet ? (
          props.accountCredentialIssued ? (
            <Redirect to={"/"} />
          ) : (
            props.QRCodeURL ? (
              <QRContainer>
                <HeaderText>Please scan this QR with your digital wallet</HeaderText>
                <QRHolder>
                  <QR value={props.QRCodeURL} size={300} renderAs="svg" />
                </QRHolder>
                  <Clickable onClick={() => { navigator.clipboard.writeText(props.QRCodeURL); alert("Link copied to clipboard!");}} >
                      <SubContainer>
                          <CopyIcon />
                          <CopyText>Copy link</CopyText>
                      </SubContainer>
                  </Clickable>
                  <SubContainer>
                    <InfoIcon />
                    <>
                      <InfoText>We recommend using
                      <InlineClickable href="https://apps.apple.com/us/app/trinsic-wallet/id1475160728">Trinsic</InlineClickable> 
                      but you can use any digital wallet you currently use.</InfoText>
                    </>
                  </SubContainer>
              </QRContainer>
            ) : (
              <QRHolder><p>Loading...</p></QRHolder>
            )
          )
        ) : (
          <>
            <p>Please set an account password below:</p>
            <Form id="form" onSubmit={handleSubmit} ref={accSetupForm}>
              <InputBox>
                <Label htmlFor="password">Password</Label>
                <InputField
                  type="password"
                  name="password"
                  id="password"
                  ref={pass1}
                  required
                />
              </InputBox>
              <InputBox>
                <Label htmlFor="confirmedPass">Confirm Password</Label>
                <InputField
                  type="password"
                  name="confirmedPass"
                  id="confirmedPass"
                  ref={pass2}
                  required
                />
              </InputBox>
              <SubmitBtn type="submit">Submit</SubmitBtn>
            </Form>
          </>
        )
      ) : (
        <p>There was a problem with your invitation. Please request a new one.</p>
      )}
    </FormContainer>
      { accountPasswordSet &&
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
                key={step.label} 
                active
                sx={{
                  '& .MuiStepLabel-root .Mui-active': {
                    color: '#007567',
                  },
                }}>
                <StepLabel>
                  <StepInfoText>
                    {step.label}
                  </StepInfoText>
                </StepLabel>
                </Step>
            ))}
          </Stepper>
        </StepperContainer>
         }
    </PageContainer>
  )
}

export default AccountSetup
