import Axios from 'axios'
import React, { useRef, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import { useNotification } from './NotificationProvider'
import { handleImageSrc } from './util'

// Envision imports
import { userService } from '../shared/services/user.service';
import { IUser } from '../api/models/User/IUser';

import {
  FormContainer,
  InputBox,
  LogoHolder,
  Logo,
  Form,
  Label,
  SubmitBtn,
  InputField,
} from './CommonStylesForms'

const QRHolder = styled.div`
  margin: 30px auto;
  width: 300px;
  height: 300px;
`

const QR = styled(QRCode)`
  display: block;
  margin: auto;
  padding: 10px;
  width: 300px;
`

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
      url: '/api/user/token/validate',
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
      url: '/api/logo',
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
        url: '/api/user/update',
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
    <FormContainer>
      <LogoHolder>
        {logo ? <Logo src={logo} alt="Logo" /> : <Logo />}
      </LogoHolder>
      {token ? (
        accountPasswordSet ? (
          props.accountCredentialIssued ? (
            <Redirect to={"/"} />
          ) : (
            props.QRCodeURL ? (
              <QRHolder>
                <p>
                  Please scan the QR code below to connect your mobile device,
                  receive an email credential,
                  and finalize your account.
                </p>
                <QR value={props.QRCodeURL} size={300} renderAs="svg" />
                </QRHolder>
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
  )
}

export default AccountSetup
