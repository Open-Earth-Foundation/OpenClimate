import React, { useEffect, useState } from 'react'

import { CanUser } from './CanUser'
import FormQR from './FormQR'
import FormInvitationAccept from './FormInvitationAccept'
import PageHeader from './PageHeader'
import PageSection from './PageSection'
import { useNotification } from './NotificationProvider'

import { DataTable, DataRow, DataHeader, DataCell } from './CommonStylesTables'
import { ActionButton } from './CommonStylesForms'

function Contacts(props) {
  const localUser = props.loggedInUserState

  // Accessing notification context
  const setNotification = useNotification()

  const [scanModalIsOpen, setScanModalIsOpen] = useState(false)
  const [displayModalIsOpen, setDisplayModalIsOpen] = useState(false)

  const closeScanModal = () => setScanModalIsOpen(false)
  const closeDisplayModal = () => setDisplayModalIsOpen(false)

  const scanInvite = () => {
    setScanModalIsOpen((o) => !o)
  }

  const presentInvite = () => {
    setDisplayModalIsOpen((o) => !o)
    props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
  }

  const history = props.history

  const contacts = props.contacts

  function openContact(history, id) {
    if (history !== undefined) {
      history.push('/admin/contacts/' + id)
    }
  }

  const contactRows = contacts.map((contact) => {
    return (
      <DataRow
        key={contact.contact_id}
        onClick={() => {
          openContact(history, contact.contact_id, contact)
        }}
      >
        <DataCell>{contact.label}</DataCell>
        <DataCell>
          {contact.Demographic !== null && contact.Demographic !== undefined
            ? contact.Demographic.mpid || ''
            : ''}
        </DataCell>
        <DataCell>{contact.Connections[0].state}</DataCell>
        <DataCell>{new Date(contact.created_at).toLocaleString()}</DataCell>
      </DataRow>
    )
  })

  return (
    <>
      <div id="contacts">
        <PageHeader title={'Contacts'} />
        <PageSection>
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Contact Name</DataHeader>
                <DataHeader></DataHeader>
                <DataHeader>Connection Status</DataHeader>
                <DataHeader>Created At</DataHeader>
              </DataRow>
            </thead>
            <tbody>{contactRows}</tbody>
          </DataTable>
        </PageSection>
        <CanUser
          user={localUser}
          perform="contacts:create"
          yes={() => (
            <ActionButton title="Add a New Contact" onClick={scanInvite}>
              +
            </ActionButton>
          )}
        />
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
      </div>
    </>
  )
}

export default Contacts
