import React, { useState } from 'react'

import styled from 'styled-components'

import FormQR from './FormQR'
import FormInvitationAccept from './FormInvitationAccept'
// import { useNotification } from './NotificationProvider'

import { CanUser } from './CanUser'

const DashboardRow = styled.div`
  display: flex;
  justify-content: space-between;
`

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

const DashboardPlaceholder = styled.div`
  width: 32%;
  min-width: 240px;
  height: 150px;
  margin-bottom: 30px;
  padding: 0 25px;
`

function Home(props) {
  const localUser = props.loggedInUserState

  // Accessing notification context
  // const setNotification = useNotification()

  const [scanModalIsOpen, setScanModalIsOpen] = useState(false)
  const [displayModalIsOpen, setDisplayModalIsOpen] = useState(false)

  const closeScanModal = () => setScanModalIsOpen(false)
  const closeDisplayModal = () => setDisplayModalIsOpen(false)

  const scanInvite = () => {
    setScanModalIsOpen((o) => !o)
  }

  const presentInvite = () => {
    setDisplayModalIsOpen((o) => !o)
    // props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {
    //   workflow: 'test_id',
    // })
    props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
  }

  return (
    <>
      <DashboardRow>
        <CanUser
          user={localUser}
          perform="contacts:create"
          yes={() => (
            <DashboardButton onClick={scanInvite}>Scan QR Code</DashboardButton>
          )}
        />
        <CanUser
          user={localUser}
          perform="contacts:create"
          yes={() => (
            <DashboardButton onClick={presentInvite}>
              Display QR Code
            </DashboardButton>
          )}
        />
        <DashboardPlaceholder></DashboardPlaceholder>
      </DashboardRow>
      <FormInvitationAccept
        contactModalIsOpen={scanModalIsOpen}
        closeContactModal={closeScanModal}
        sendRequest={props.sendRequest}
      />
      <FormQR
        contactModalIsOpen={displayModalIsOpen}
        closeContactModal={closeDisplayModal}
        QRCodeURL={props.QRCodeURL}
        sendRequest={props.sendRequest}
      />
    </>
  )
}

export default Home
