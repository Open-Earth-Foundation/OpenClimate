import Axios from 'axios'
import jwt_decode from 'jwt-decode'
import React, { useRef, useEffect, useState } from 'react'

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

function PasswordReset(props) {
  const token = window.location.hash.substring(1)

  const [id, setId] = useState(undefined)

  useEffect(() => {
    // Kick the user off this page if trying to access without a token
    if (!token) {
      console.log('no token')
      return
    }

    const decoded = jwt_decode(token)
    // Check if the token is expired
    if (Date.now() >= decoded.exp * 1000) {
      console.log('The link has expired')
      setNotification("The user doesn't exist or the link has expired", 'error')
      props.history.push('/')
      return
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
      }
    })
  }, [])

  const [logo, setLogo] = useState(null)

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
  }, [])

  // Accessing notification context
  const setNotification = useNotification()

  const resetForm = useRef()
  const pass1 = useRef()
  const pass2 = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(resetForm.current)

    // Check the password match
    if (pass1.current.value != pass2.current.value) {
      console.log("Passwords don't match")
      setNotification('Passwords must match. Try again', 'error')
    } else {
      // Update the DB, show the notification and redirect to the login view
      Axios({
        method: 'POST',
        data: {
          id: id,
          password: form.get('newPass'),
          token: token,
        },
        url: '/api/user/password/update',
      }).then((res) => {
        if (res.data.status) {
          setNotification(res.data.status, 'notice')
          props.history.push('/')
        } else if (res.data.error) setNotification(res.data.error, 'error')
        else {
          setNotification("Password couldn't be reset. Try again.", 'error')
        }
      })
    }
  }

  return (
    <FormContainer>
      <LogoHolder>
        {logo ? <Logo src={logo} alt="Logo" /> : <Logo />}
      </LogoHolder>
      <Form id="form" onSubmit={handleSubmit} ref={resetForm}>
        <InputBox>
          <Label htmlFor="newPass">New Password</Label>
          <InputField
            type="password"
            name="newPass"
            id="newPass"
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
export default PasswordReset
