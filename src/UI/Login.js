import Axios from 'axios'
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import Cookies from 'universal-cookie'

import QR from 'qrcode.react'
import './Login.css'

import { useNotification } from './NotificationProvider'
import { handleImageSrc } from './util'

import {
  FormContainer,
  InputBox,
  LogoHolder,
  Logo,
  Form,
  Label,
  QRHolder,
  SubmitBtn,
  InputField,
} from './CommonStylesForms'

const ForgotPasswordLink = styled.a`
  margin-top: 30px;
  font-size: 1.2em;
  :hover {
    cursor: pointer;
  }
`

function Login(props) {
  const [logo, setLogo] = useState(null)

  const cookies = new Cookies()

  // Accessing notification context
  const setNotification = useNotification()

  const [waitingForInvitation, setWaitingForInvitation] = useState(false)
  const [waitingForConnection, setWaitingForConnection] = useState(false)
  const [connected, setConnected] = useState(false)

  if (!waitingForInvitation) {
    props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
    setWaitingForInvitation(true)
  }

  useEffect(() => {
    if (props.QRCodeURL !== '') {
      setWaitingForConnection(true)
    }
    if (props.contacts.length > 0 && waitingForConnection) {
      setConnected(true)
    }
  }, [props.QRCodeURL, props.contacts, waitingForConnection])

  useEffect(() => {
    // Fetching the logo
    Axios({
      method: 'GET',
      url: '/api/logo',
    }).then((res) => {
      if (res.data.error) {
        setNotification(res.data.error, 'error')
      } else {
        setLogo(handleImageSrc(res.data[0].image.data))
      }
    })
  }, [setNotification])

  const loginForm = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(loginForm.current)

    Axios({
      method: 'POST',
      data: {
        username: form.get('user'),
        password: form.get('password'),
      },
      url: '/api/user/log-in',
    }).then((res) => {
      if (res.data.error) setNotification(res.data.error, 'error')
      else {
        props.setLoggedIn(true)

        props.setUpUser(res.data.id, res.data.username, res.data.roles)
      }
    })
  }

  const handlePasswordlessSubmit = () => {
    Axios({
      method: 'POST',
      data: {
        email: props.verifiedCredential
      },
      url: '/api/user/passwordless-log-in',
    }).then((res) => {

      if (res.data.error) {
        setNotification(res.data.error, 'error')
      } else {
        // Setting a session cookie this way doesn't seem to be the best way
        cookies.set('sessionId', res.data.session, { path: '/', expires: res.data.session.expires, httpOnly: res.data.session.httpOnly, originalMaxAge: res.data.session.originalMaxAge })

        props.setLoggedIn(true)
        props.setUpUser(res.data.id, res.data.username, res.data.roles)

        setWaitingForInvitation(false)
        setWaitingForConnection(false)
        setConnected(false)
      }
    })
  }

  const handleForgot = (e) => {
    e.preventDefault()
    props.history.push('/forgot-password')
  }

  return (
    <>
      <div className="landing-container-fluid">
        <div className="landing-row">
          <div className="home landing-col s12">
            <div className="landing-col upper-fold">
              <div className="landing-container">
                <div className="landing-row">
                  <div className="avatar-container left-fold landing-col-6">
                    <FormContainer>
                      <LogoHolder>
                        {logo ? <Logo src={logo} alt="Logo" /> : <Logo />}
                      </LogoHolder>
                      <Form id="form" onSubmit={handleSubmit} ref={loginForm}>
                        <InputBox>
                          <Label htmlFor="user">User Name</Label>
                          <InputField
                            type="text"
                            name="user"
                            id="user"
                            required
                          />
                        </InputBox>
                        <InputBox>
                          <Label htmlFor="password">Password</Label>
                          <InputField
                            type="password"
                            name="password"
                            id="password"
                            required
                          />
                        </InputBox>
                        <SubmitBtn type="submit">Log In</SubmitBtn>
                      </Form>
                      <ForgotPasswordLink onClick={handleForgot}>
                        Forgot password?
                      </ForgotPasswordLink>
                    </FormContainer>
                  </div>
                  {connected ? (
                    props.verificationStatus !== undefined ? (
                      props.verificationStatus ? (
                        props.verifiedCredential ? (
                          <div className="right-fold landing-col-6">
                            <h1 className="header">Credentials Verified!</h1>
                            <p className="para">
                              Email: {props.verifiedCredential}
                            </p>
                            {handlePasswordlessSubmit()}
                          </div>
                        ) : (
                          <div className="right-fold landing-col-6">
                            <h1 className="header">Credentials Verified!</h1>
                            <p className="para">
                              No Credential Data Was Passed
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="right-fold landing-col-6">
                          <h1 className="header">Verification Failed</h1>
                          <p className="para">
                            There was a problem verifying your credential.
                            Please try again or contact support.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="right-fold landing-col-6">
                        <h1 className="header">
                          Verify your email credentials
                        </h1>
                        <p className="para">
                          You will now receive a request on your mobile app to
                          send your credential to us for verification
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="right-fold landing-col-6">
                      <h1 className="header">Verify your email credentials</h1>
                      <p className="para">
                        Simply scan the following QR code to begin the
                        verification process:
                      </p>
                      {props.QRCodeURL ? (
                        <div className="qr">
                          <p>
                            <QR
                              value={props.QRCodeURL}
                              size={256}
                              renderAs="svg"
                            />
                          </p>
                        </div>
                      ) : (
                        <p>
                          <span>Loading...</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login
