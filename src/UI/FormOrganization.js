import React, { useRef } from 'react'

import {
  StyledPopup,
  InputBox,
  Modal,
  ModalHeader,
  ModalContentWrapper,
  ModalContent,
  CloseBtn,
  Actions,
  CancelBtn,
  SubmitBtnModal,
  ModalLabel,
  InputFieldModal,
  TextItem,
} from './CommonStylesForms'

function FormOrganization(props) {
  const credentialForm = useRef(null)
  const dateValidated = new Date()
  console.log(props.schemas)
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(credentialForm.current)

    let attributes = [
      {
        name: 'organization_name',
        value: form.get('organization_name'),
      },
      {
        name: 'organization_category',
        value: form.get('organization_category'),
      },
      {
        name: 'organization_type',
        value: form.get('organization_type'),
      },
      {
        name: 'organization_country',
        value: form.get('organization_country'),
      },
      {
        name: 'organization_jurisdiction',
        value: form.get('organization_jurisdiction'),
      }
    ]
console.log(props.schemas)
    let schema = props.schemas.SCHEMA_CLIMATE_ORGANIZATION
    let schemaParts = schema.split(':')

    let newCredential = {
      connectionID: props.contactSelected.Connections[0].connection_id,
      schemaID: schema,
      schemaVersion: schemaParts[3],
      schemaName: schemaParts[2],
      schemaIssuerDID: schemaParts[0],
      comment: 'Climate Organization',
      attributes: attributes,
    }

    props.submitCredential(newCredential, e)
    props.closeCredentialModal()
  }

  function closeModal() {
    props.closeCredentialModal()
  }

  return (
    <StyledPopup
      open={props.credentialModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="agent-modal">
        <ModalHeader>Issue Climate Organization</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form onSubmit={handleSubmit} ref={credentialForm}>
              <InputBox>
                <ModalLabel htmlFor="organization_name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="organization_name"
                  id="organization_name"
                  placeholder="example"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="organization_type">Type</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="organization_type"
                  id="organization_type"
                  placeholder=""
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="organization_category">Category</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="organization_category"
                  id="organization_category"
                  placeholder=""
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="organization_country">Country</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="organization_country"
                  id="organization_country"
                  placeholder="United States"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="organization_jurisdiction">Jurisdiction</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="organization_jurisdiction"
                  id="organization_jurisdiction"
                  placeholder="California"
                />
              </InputBox>
              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtnModal type="submit">Submit</SubmitBtnModal>
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  )
}

export default FormOrganization
