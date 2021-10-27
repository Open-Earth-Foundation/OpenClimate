import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { handleImageSrc } from './util'

import styled from 'styled-components'
import { Logo, LogoHolder } from './CommonStylesForms'

import AppMenu from './AppMenu.js'

const Header = styled.header`
  flex: 3;
  min-width: 240px;
  max-width: 240px;
  min-height: 100vh;
  background: ${(props) => props.theme.background_primary};
`

const LogoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  width: 100%;
`

const OrganizationName = styled.h3`
  margin: 10px 0;
  color: ${(props) => props.theme.secondary_color};
  text-align: center;
  text-transform: uppercase;
`

const UserName = styled.h4`
  color: ${(props) => props.theme.primary_color};
  margin: 0;

  text-transform: uppercase;

  // &:hover {
  //   text-decoration: underline;
  //   cursor: pointer;
  // }
`

const Logout = styled.button`
  margin: 5px 12px 0 12px;
  border: none;
  background: none;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

function AppHeader(props) {
  const [src, setSrc] = useState(null)
  const logo = props.logo
  const organizationName = props.organizationName

  useEffect(() => {
    if (logo && logo.image) {
      setSrc(handleImageSrc(logo.image.data))
    }
  }, [logo])

  const handleLogout = () => {
    // Log out
    Axios({
      method: 'POST',
      url: '/api/user/log-out',
    }).then((res) => {})

    props.handleLogout(props.history)
  }

  const handleUserProfile = (e) => {
    e.preventDefault()
  }

  return (
    <Header id="app-header">
      <LogoHolder>
        <Logo src={src} alt="Logo" />
      </LogoHolder>
      <OrganizationName>{organizationName}</OrganizationName>
      <LogoutWrapper>
        <UserName onClick={handleUserProfile}>
          {props.loggedInUsername}
        </UserName>
        <Logout onClick={handleLogout}>Log Out</Logout>
      </LogoutWrapper>
      <AppMenu match={props.match} userRole={props.userRole} />
    </Header>
  )
}

export default AppHeader
