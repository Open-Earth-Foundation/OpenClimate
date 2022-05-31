import React, { useState, useEffect } from 'react'

import { CanUser } from './CanUser'

import FormOrganization from './FormOrganization'
// import FormOrganizationDelete from './FormOrganizationDelete'
// import FormOrganizationEdit from './FormOrganizationEdit'
import { useNotification } from './NotificationProvider'
import PageHeader from './PageHeader'
import PageSection from './PageSection'

import { TextAlignCenter } from './CommonStyles'

import {
  DataTable,
  DataRow,
  DataHeader,
  DataCell,
  IconCell,
  IconRemove,
  IconEdit,
  IconEmail,
} from './CommonStylesTables'

import { ActionButton } from './CommonStylesForms'

function Organizations(props) {
  const error = props.errorMessage
  const success = props.successMessage

  const [index, setIndex] = useState(false)

  // Accessing notification context
  const setNotification = useNotification()

  useEffect(() => {
    if (success) {
      setNotification(success, 'notice')
      props.clearResponseState()

      // (Simon): Temporary solution. Closing all/any modals on success
      closeOrganizationModal()
      closeOrganizationEditModal()
      closeDeleteModal()
    } else if (error) {
      setNotification(error, 'error')
      props.clearResponseState()
      setIndex(index + 1)
    }
  }, [error, success, setNotification, props])

  const [organizationModalIsOpen, setOrganizationModalIsOpen] = useState(false)
  const [organizationEditModalIsOpen, setOrganizationEditModalIsOpen] = useState(false)
  const [deleteOrganizationModalIsOpen, setDeleteOrganizationModalIsOpen] = useState(false)

  const [buttonDisabled, setButtonDisabled] = useState(false)

  const loggedInUserState = props.loggedInUserState

  const organizations = props.organizations

  const closeOrganizationModal = () => setOrganizationModalIsOpen(false)
  const closeOrganizationEditModal = () => setOrganizationEditModalIsOpen(false)
  const closeDeleteModal = () => setDeleteOrganizationModalIsOpen(false)

  const addOrganization = () => {
    setOrganizationModalIsOpen(true)
  }

  const editOrganization = () => {
    setOrganizationEditModalIsOpen(true)
  }

  const deleteOrganization = () => {
    setDeleteOrganizationModalIsOpen(true)
  }

  let organizationRows = ''

  if (organizations) {
    organizationRows = organizations.map((organization) => {
      let organizationId = ''
      let organizationName = ''
      let organizationCategory = ''
      let organizationType = ''
      let organizationCountry = ''
      let organizationJurisdiction = ''

      if (organization) {
        if (organization.organization_id) {
          organizationId = organization.organization_id
        }
        if (organization.name) {
          organizationName = organization.name
        }
        if (organization.category) {
          organizationCategory = organization.category
        }
        if (organization.type) {
          organizationType = organization.type
        }
        if (organization.country) {
          organizationCountry = organization.country
        }
        if (organization.jurisdiction) {
          organizationJurisdiction = organization.jurisdiction
        }
      }

      return (
        <DataRow key={organization.organization_id}>
          <DataCell>{organizationName}</DataCell>
          <DataCell>{organizationCategory}</DataCell>
          <DataCell>{organizationType}</DataCell>
          <DataCell>{organizationCountry}</DataCell>
          <DataCell>{organizationJurisdiction}</DataCell>

          {/* <CanUser
            user={loggedInUserState}
            perform="organizations:update"
            yes={() => (
              <IconCell
                onClick={() => {
                  editOrganization()
                }}
              >
                <IconEdit alt="Edit" />
              </IconCell>
            )}
          />
          
          <CanUser
            user={loggedInUserState}
            perform="organizations:delete"
            yes={() => (
              <IconCell
                onClick={() => {
                  deleteOrganization()
                }}
              >
                <IconRemove alt="Remove" />
              </IconCell>
            )}
            no={() => (
              <IconCell></IconCell>  
            )}
          /> */}
        </DataRow>
      )
    })
  }

  return (
    <>
      <div id="organizations">
        <PageHeader title={'Organizations'} />
        <PageSection>
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Name</DataHeader>
                <DataHeader>Category</DataHeader>
                <DataHeader>Type</DataHeader>
                <DataHeader>Country</DataHeader>
                <DataHeader>Jurisdiction</DataHeader>
                {/* <CanUser
                  user={loggedInUserState}
                  perform="organizations:update"
                  yes={() => (
                    <DataHeader>
                      <TextAlignCenter>Edit</TextAlignCenter>
                    </DataHeader>
                  )}
                /> */}
                {/* <CanUser
                  user={loggedInUserState}
                  perform="organizations:delete"
                  yes={() => (
                    <DataHeader>
                      <TextAlignCenter>Remove</TextAlignCenter>
                    </DataHeader>
                  )}
                /> */}
              </DataRow>
            </thead>
            <tbody>{organizationRows ? organizationRows : ''}</tbody>
          </DataTable>
        </PageSection>
        <ActionButton title="Add a New Organization" onClick={addOrganization}>
          +
        </ActionButton>
        <FormOrganization
          sendRequest={props.sendRequest}
          error={index}
          credentialModalIsOpen={organizationModalIsOpen}
          closeCredentialModal={closeOrganizationModal}
        />
        {/* <FormOrganizationEdit
          sendRequest={props.sendRequest}
          error={index}
          organizations={organizations}
          loggedInUserState={loggedInUserState}
          organizationEditModalIsOpen={organizationEditModalIsOpen}
          closeOrganizationEditModal={closeOrganizationEditModal}
        /> */}
        {/* <FormOrganizationsDelete
          sendRequest={props.sendRequest}
          error={index}
          organizationId={organizationId}
          deleteOrganizationModalIsOpen={deleteOrganizationModalIsOpen}
          closeDeleteModal={closeDeleteModal}
        /> */}
      </div>
    </>
  )
}

export default Organizations
