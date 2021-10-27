import Axios from 'axios'
import React, { useRef, useEffect, useState } from 'react'
import jwt_decode from 'jwt-decode'

import { useNotification } from './NotificationProvider'
import { handleImageSrc } from './util'

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

function AccountSetup(props) {
  const token = window.location.hash.substring(1)

  const [id, setId] = useState({})

  useEffect(() => {
    // Kick the user off this page if trying to access without a token
    if (!token) {
      console.log('No token')
      return
    }

    const decoded = jwt_decode(token)
    // Check if the token is expired
    if (Date.now() >= decoded.exp * 1000) {
      console.log('The link has expired')
      setNotification("The user doesn't exist or the link has expired", 'error')
      props.history.push('/login')
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
        props.history.push('/login')
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
          username: form.get('username'),
          email: form.get('email'),
          password: form.get('password'),
          token: token,
          flag: 'set-up user',
        },
        url: '/api/user/update',
      }).then((res) => {
        if (res.data.status) {
          setNotification(res.data.status, 'notice')
          props.history.push('/')
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
      <Form id="form" onSubmit={handleSubmit} ref={accSetupForm}>
        <InputBox>
          <Label htmlFor="email">Email</Label>
          <InputField type="email" name="email" id="email" required />
        </InputBox>
        <InputBox>
          <Label htmlFor="Username">Username</Label>
          <InputField type="Username" name="username" id="username" required />
        </InputBox>
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
    </FormContainer>
  )
}

export default AccountSetup
