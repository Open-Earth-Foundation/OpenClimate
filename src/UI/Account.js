import React, { useState } from 'react'
import styled from 'styled-components'

import PageHeader from './PageHeader'
import PageSection from './PageSection'
import FormQR from './FormQR'

import {
  DataTable,
  DataRow,
  DataHeader,
} from './CommonStylesTables'

const DashboardButton = styled.div`
  width: 32%;
  min-width: 240px;
  height: 150px;
  margin-bottom: 30px;
  padding: 0 25px;
  font-size: calc(12px + 1.5vw);
  line-height: 150px;
  vertical-align: center;
  text-transform: uppercase;
  background: ${(props) => props.theme.primary_color};
  color: ${(props) => props.theme.text_light};
  box-shadow: ${(props) => props.theme.drop_shadow};
  text-align: center;
  :hover {
    cursor: pointer;
    background: ${(props) => props.theme.background_primary};
    color: ${(props) => props.theme.text_color};
  }
`

function Account(props) {
  const [displayModalIsOpen, setDisplayModalIsOpen] = useState(false)

  const closeDisplayModal = () => setDisplayModalIsOpen(false)

  const presentInvite = () => {
    setDisplayModalIsOpen((o) => !o)

    props.sendRequest('INVITATIONS', 'CREATE_ACCOUNT_INVITATION', {userID: props.userID})
  }
  console.log(props.userID)
  return (
    <>
      <div id="profile">
        <PageHeader title={'Profile'} />
        <PageSection>
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Login</DataHeader>
                <DataHeader>Email</DataHeader>
                <DataHeader>Roles</DataHeader>
                <DataHeader>Password</DataHeader>
                <DataHeader>Reset ID</DataHeader>
                <DataHeader></DataHeader>
              </DataRow>
            </thead>
          </DataTable>
        </PageSection>
        <DashboardButton onClick={presentInvite}>
           Connect
        </DashboardButton>
        <FormQR
        contactModalIsOpen={displayModalIsOpen}
        closeContactModal={closeDisplayModal}
        QRCodeURL={props.QRCodeURL}
        sendRequest={props.sendRequest}
        />
      </div>
    </>
  )
}

export default Account