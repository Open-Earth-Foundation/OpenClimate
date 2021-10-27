import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import FormContacts from './FormContacts'
import FormTestID from './FormTestID'
import FormTestResult from './FormTestResult'
import { useNotification } from './NotificationProvider'
import PageHeader from './PageHeader.js'
import PageSection from './PageSection.js'

import { CanUser } from './CanUser'

import {
  DataTable,
  DataRow,
  DataHeader,
  DataCell,
  AttributeTable,
  AttributeRow,
} from './CommonStylesTables'

const EditContact = styled.button`
  float: right;
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.primary_color};
`

const IssueCredential = styled.button`
  float: right;
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.primary_color};
`

function Contact(props) {
  const localUser = props.loggedInUserState

  // Accessing notification context
  const setNotification = useNotification()

  const history = props.history
  const contactId = props.contactId

  let contactToSelect = ''

  for (let i = 0; i < props.contacts.length; i++) {
    if (props.contacts[i].contact_id == contactId) {
      contactToSelect = props.contacts[i]
      break
    }
  }

  useEffect(() => {
    setContactSelected(contactToSelect)
  }, [contactToSelect])

  function openCredential(history, id) {
    if (history !== undefined) {
      history.push('/admin/credentials/' + id)
    }
  }

  // Contact form customization (no contact search dropdown)
  // const [contactSearch, setContactSearch] = useState(false)

  // Modal state
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false)
  const [testIDModalIsOpen, setTestIDModalIsOpen] = useState(false)
  const [testResultModalIsOpen, setTestResultModalIsOpen] = useState(false)

  const closeContactModal = () => setContactModalIsOpen(false)
  const closeTestIDModal = () => setTestIDModalIsOpen(false)
  const closeTestResultModal = () => setTestResultModalIsOpen(false)

  const [contactSelected, setContactSelected] = useState(contactToSelect)

  let demographicData = ''
  let passportData = ''

  if (
    contactSelected.Passport !== null &&
    contactSelected.Passport !== undefined
  ) {
    let rawImage = contactSelected.Passport.photo

    const handleImageSrc = (rawImage) => {
      let bytes = new Uint8Array(rawImage)
      bytes = Buffer.from(rawImage).toString('base64')
      // Check the MIME type
      // let result = null
      // if (atob(bytes).charAt(0) === 'i')
      // result = `data:image/png;base64,${atob(bytes)}`
      // else if (atob(bytes).charAt(0) === '/')
      // result = `data:image/jpeg;base64,${atob(bytes)}`
      // else if (atob(bytes).charAt(0) === 'R')
      // result = `data:image/gif;base64,${atob(bytes)}`
      // else if (atob(bytes).charAt(0) === 'U')
      // result = `data:image/webp;base64,${atob(bytes)}`
      // else
      let result = atob(bytes)
      return result
    }

    let test = handleImageSrc(rawImage)
    passportData = (
      <div>
        <h2>Passport Information</h2>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Passport Number:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.passport_number || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Surname:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.surname || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Given Name(s):</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.given_names || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Sex:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.sex || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Date of Birth:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.date_of_birth || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Place of Birth:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.place_of_birth || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Nationality:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.nationality || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Date of Issue:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.date_of_issue || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Date of Expiration:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.date_of_expiration || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Type:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.type || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Code:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.code || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Authority:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.authority || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Photo:</th>
              <td></td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
        <img src={test} alt="Error" />
      </div>
    )
  }

  function updateContact(updatedDemographic, e) {
    e.preventDefault()
    const Demographic = {
      Demographic: { ...updatedDemographic },
    }

    props.sendRequest('DEMOGRAPHICS', 'UPDATE_OR_CREATE', updatedDemographic)

    setNotification('Contact was updated!', 'notice')

    setContactSelected({ ...contactSelected, ...Demographic })
  }

  // Submits the credential form and shows notification
  function submitNewCredential(newCredential, e) {
    e.preventDefault()

    props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)

    setNotification('Credential was successfully added!', 'notice')
  }

  const credentialRows = props.credentials.map((credential_record) => {
    if (
      contactSelected.Connections[0].connection_id ===
      credential_record.connection_id
    ) {
      const credential_id = credential_record.credential_exchange_id
      const credentialState = credential_record.state.replaceAll('_', ' ') || ''
      const dateCreated =
        new Date(credential_record.created_at).toLocaleString() || ''

      let credentialName = ''
      if (
        credential_record.credential_proposal_dict !== null &&
        credential_record.credential_proposal_dict !== undefined
      ) {
        credentialName = credential_record.credential_proposal_dict.schema_name.replaceAll(
          '_',
          ' '
        )
      }
      return (
        <DataRow
          key={credential_id}
          onClick={() => {
            openCredential(history, credential_id)
          }}
        >
          <DataCell>{credentialName}</DataCell>
          <DataCell className="title-case">{credentialState}</DataCell>
          <DataCell>{dateCreated}</DataCell>
        </DataRow>
      )
    }
  })

  return (
    <>
      <div id="contact">
        <PageHeader
          title={'Contact Details: ' + (contactSelected.label || '')}
        />
        <PageSection>
          <CanUser
            user={localUser}
            perform="contacts:update"
            yes={() => (
              <EditContact onClick={() => setContactModalIsOpen((o) => !o)}>
                Edit
              </EditContact>
            )}
          />
          <h2>General Information</h2>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Contact ID:</th>
                <td>{contactSelected.contact_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Connection Status:</th>
                <td>
                  {contactSelected.Connections !== undefined
                    ? contactSelected.Connections[0].state || ''
                    : ''}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>

          <h2>Demographic Information</h2>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Name:</th>
                <td>{contactSelected.label || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Email:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.email || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Phone:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.phone || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Address 1:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined &&
                  contactSelected.Demographic.address
                    ? contactSelected.Demographic.address.address_1 || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Address 2:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined &&
                  contactSelected.Demographic.address
                    ? contactSelected.Demographic.address.address_2 || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>City:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined &&
                  contactSelected.Demographic.address
                    ? contactSelected.Demographic.address.city || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>State:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined &&
                  contactSelected.Demographic.address
                    ? contactSelected.Demographic.address.state || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Zip Code:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined &&
                  contactSelected.Demographic.address
                    ? contactSelected.Demographic.address.zip_code || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Country:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined &&
                  contactSelected.Demographic.address
                    ? contactSelected.Demographic.address.country || ''
                    : ''}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
          {passportData}
        </PageSection>
        <PageSection>
          <CanUser
            user={localUser}
            perform="credentials:issue"
            yes={() => (
              <IssueCredential
                onClick={() => setTestResultModalIsOpen((o) => !o)}
              >
                Issue Test Result Credential
              </IssueCredential>
            )}
          />
          <CanUser
            user={localUser}
            perform="credentials:issue"
            yes={() => (
              <IssueCredential onClick={() => setTestIDModalIsOpen((o) => !o)}>
                Issue Test ID Credential
              </IssueCredential>
            )}
          />
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Credential</DataHeader>
                <DataHeader>Status</DataHeader>
                <DataHeader>Date Issued</DataHeader>
              </DataRow>
            </thead>
            <tbody>{credentialRows}</tbody>
          </DataTable>
        </PageSection>
        <FormContacts
          contactSelected={contactSelected}
          contactModalIsOpen={contactModalIsOpen}
          closeContactModal={closeContactModal}
          submitContact={updateContact}
        />
        <FormTestID
          contactSelected={contactSelected}
          credentialModalIsOpen={testIDModalIsOpen}
          closeCredentialModal={closeTestIDModal}
          submitCredential={submitNewCredential}
        />
        <FormTestResult
          contactSelected={contactSelected}
          credentialModalIsOpen={testResultModalIsOpen}
          closeCredentialModal={closeTestResultModal}
          submitCredential={submitNewCredential}
        />
      </div>
    </>
  )
}

export default Contact
