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

function FormTestResult(props) {
  const credentialForm = useRef(null)

  const surname =
    props.contactSelected && props.contactSelected.Passport
      ? JSON.parse(JSON.stringify(props.contactSelected.Passport.surname))
      : ''
  const given_names =
    props.contactSelected && props.contactSelected.Passport
      ? JSON.parse(JSON.stringify(props.contactSelected.Passport.given_names))
      : ''
  const date_of_birth =
    props.contactSelected && props.contactSelected.Passport
      ? JSON.parse(JSON.stringify(props.contactSelected.Passport.date_of_birth))
      : ''
  const sex =
    props.contactSelected && props.contactSelected.Passport
      ? JSON.parse(JSON.stringify(props.contactSelected.Passport.sex))
      : ''
  const address_1 =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.address_1)
        )
      : ''
  const address_2 =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.address_2)
        )
      : ''
  const address_null = address_2 === null ? '' : address_2
  const city =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.city)
        )
      : ''
  const state =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.state)
        )
      : ''
  const zip_code =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.zip_code)
        )
      : ''
  const country =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.country)
        )
      : ''
  const phone =
    props.contactSelected && props.contactSelected.Demographic
      ? JSON.parse(JSON.stringify(props.contactSelected.Demographic.phone))
      : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(credentialForm.current)

    let attributes = {}
    if (
      props.contactSelected &&
      props.contactSelected.Demographic &&
      props.contactSelected.Passport
    ) {
      const demographics = props.contactSelected.Demographic
      const passport = props.contactSelected.Passport

      attributes = [
        {
          name: 'mpid',
          value: form.get('mpid') || '',
        },
        {
          name: 'patient_local_id',
          value: form.get('patient_local_id') || '',
        },
        {
          name: 'patient_last_name',
          value: passport.surname || '',
        },
        {
          name: 'patient_first_name',
          value: passport.given_names || '',
        },
        {
          name: 'patient_date_of_birth',
          value: passport.date_of_birth || '',
        },
        {
          name: 'patient_gender_legal',
          value: passport.sex || '',
        },
        {
          name: 'patient_street_address',
          value:
            demographics.address.address_1 +
              ' ' +
              demographics.address.address_2 || '',
        },
        {
          name: 'patient_city',
          value: demographics.address.city || '',
        },
        {
          name: 'patient_state',
          value: demographics.address.state || '',
        },
        {
          name: 'patient_postalcode',
          value: demographics.address.zip_code || '',
        },
        {
          name: 'patient_country',
          value: demographics.address.country || '',
        },
        {
          name: 'patient_phone',
          value: demographics.phone || '',
        },
        {
          name: 'sending_facility',
          value: form.get('sending_facility') || 'Horacio Oduber Hospital Lab',
        },
        {
          name: 'visit_location',
          value: form.get('visit_location') || 'Horacio Oduber Hospital Lab',
        },
        {
          name: 'observation_date_time',
          value: form.get('observation_date_time') || '',
        },
        {
          name: 'lab_specimen_collected_date',
          value: form.get('lab_specimen_collected_date') || '',
        },
        {
          name: 'result_status',
          value: form.get('result_status') || '',
        },
        {
          name: 'lab_coding_qualifier',
          value: form.get('lab_coding_qualifier') || '',
        },
        {
          name: 'lab_code',
          value: form.get('lab_code') || '',
        },
        {
          name: 'lab_description',
          value: form.get('lab_description') || 'COVID-19 PCR Test',
        },
        {
          name: 'lab_order_id',
          value: form.get('lab_order_id') || '',
        },
        {
          name: 'ordering_facility_address',
          value: form.get('ordering_facility_address') || '',
        },
        {
          name: 'ordering_facility_name',
          value: form.get('ordering_facility_name') || '',
        },
        {
          name: 'date_time_of_message',
          value: form.get('date_time_of_message') || '',
        },
        {
          name: 'normality',
          value: form.get('normality') || '',
        },
        {
          name: 'result',
          value: form.get('result') || '',
        },
        {
          name: 'comment',
          value: form.get('comment') || '',
        },
        {
          name: 'performing_lab',
          value: form.get('performing_lab') || '',
        },
      ]
    }
    let newCredential = {
      connectionID: props.contactSelected.Connections[0].connection_id,
      schemaID: 'X2JpGAqC7ZFY4hwKG6kLw9:2:Covid_19_Lab_Result:1.5',
      schemaVersion: '1.5',
      schemaName: 'Covid_19_Lab_Result',
      schemaIssuerDID: 'X2JpGAqC7ZFY4hwKG6kLw9',
      comment: form.get('comment'),
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
        <ModalHeader>Issue Test Result</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form onSubmit={handleSubmit} ref={credentialForm}>
              {/* <InputBox>
                <ModalLabel htmlFor="mpid">MPID</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="mpid"
                  id="mpid"
                  placeholder="12345"
                />
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="patient_local_id">
                  Patient Local ID
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="patient_local_id"
                  id="patient_local_id"
                  placeholder="685744"
                />
              </InputBox> */}
              <InputBox>
                <ModalLabel htmlFor="patient_last_name">
                  Patient Last Name
                </ModalLabel>
                <TextItem
                  type="text"
                  name="patient_last_name"
                  id="patient_last_name"
                >
                  {surname}
                </TextItem>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="patient_first_name">
                  Patient First Name
                </ModalLabel>
                <TextItem
                  type="text"
                  name="patient_first_name"
                  id="patient_first_name"
                >
                  {given_names}
                </TextItem>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="patient_date_of_birth">
                  Patient Date of Birth
                </ModalLabel>
                <TextItem
                  type="date"
                  name="patient_date_of_birth"
                  id="patient_date_of_birth"
                >
                  {date_of_birth}
                </TextItem>
              </InputBox>
              {/* <InputBox>
                <ModalLabel htmlFor="patient_gender_legal">
                  Patient Legal Gender
                </ModalLabel>
                <TextItem
                  type="text"
                  name="patient_gender_legal"
                  id="patient_gender_legal"
                >
                  {sex}
                </TextItem>
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="patient_street_address">
                  Patient Street Address
                </ModalLabel>
                <TextItem
                  type="text"
                  name="patient_street_address"
                  id="patient_street_address"
                >
                  {address_1 + ' ' + address_null}
                </TextItem>
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="patient_city">Patient City</ModalLabel>
                <TextItem type="text" name="patient_city" id="patient_city">
                  {city}
                </TextItem>
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="patient_state">Patient State </ModalLabel>
                <TextItem type="text" name="patient_state" id="patient_state">
                  {state}
                </TextItem>
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="patient_postalcode">
                  Patient Postal Code{' '}
                </ModalLabel>
                <TextItem
                  type="text"
                  name="patient_postalcode"
                  id="patient_postalcode"
                >
                  {zip_code}
                </TextItem>
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="patient_country">
                  Patient Country{' '}
                </ModalLabel>
                <TextItem
                  type="text"
                  name="patient_country"
                  id="patient_country"
                >
                  {country}
                </TextItem>
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="patient_phone">Patient Phone </ModalLabel>
                <TextItem
                  type="numeric"
                  name="patient_phone"
                  id="patient_phone"
                >
                  {phone}
                </TextItem>
              </InputBox> */}
              {/*<InputBox>
                <ModalLabel htmlFor="sending_facility">
                  Sending Facility
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="sending_facility"
                  id="sending_facility"
                  placeholder="Horacio Oduber Hospital Lab"
                  defaultValue="Horacio Oduber Hospital Lab"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="visit_location">Visit Location</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="visit_location"
                  id="visit_location"
                  placeholder="Horacio Oduber Hospital Lab"
                  defaultValue="Horacio Oduber Hospital Lab"
                />
              </InputBox>*/}
              <InputBox>
                <ModalLabel htmlFor="lab_specimen_collected_date">
                  Lab Specimen Collected Date
                </ModalLabel>
                <InputFieldModal
                  type="date"
                  name="lab_specimen_collected_date"
                  id="lab_specimen_collected_date"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="observation_date_time">
                  Observation Date Time
                </ModalLabel>
                <InputFieldModal
                  type="date"
                  name="observation_date_time"
                  id="observation_date_time"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="result_status">Result Status</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="result_status"
                  id="result_status"
                  placeholder="F"
                />
              </InputBox>
              {/* <InputBox>
                <ModalLabel htmlFor="lab_coding_qualifier">
                  Lab Coding Qualifier
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="lab_coding_qualifier"
                  id="lab_coding_qualifier"
                  placeholder="PRC"
                />
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="lab_code">Lab Code</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="lab_code"
                  id="lab_code"
                  placeholder="67890"
                />
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="lab_description">
                  Lab Description
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="lab_description"
                  id="lab_description"
                  placeholder="Covid-19 swab test"
                />
              </InputBox> */}
              <InputBox>
                <ModalLabel htmlFor="lab_order_id">Lab Order ID</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="lab_order_id"
                  id="lab_order_id"
                  placeholder="12345"
                />
              </InputBox>
              {/* <InputBox>
                <ModalLabel htmlFor="ordering_facility_address">
                  Ordering Facility Address
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="ordering_facility_address"
                  id="ordering_facility_address"
                  placeholder="1234 St."
                />
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="ordering_facility_name">
                  Ordering Facility Name
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="ordering_facility_name"
                  id="ordering_facility_name"
                  placeholder="Health Facility"
                />
              </InputBox> */}
              <InputBox>
                <ModalLabel htmlFor="date_time_of_message">
                  Date Time of Message
                </ModalLabel>
                <InputFieldModal
                  type="date"
                  name="date_time_of_message"
                  id="date_time_of_message"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="normality">Normality</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="normality"
                  id="normality"
                  placeholder="Normal"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="result">Result</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="result"
                  id="result"
                  placeholder="Negative"
                />
              </InputBox>
              {/* Future !!! -Megan O */}
              {/* <InputBox>
                <ModalLabel htmlFor="comment">Comment</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="comment"
                  id="comment"
                  placeholder=""
                />
              </InputBox> */}
              {/* <InputBox>
                <ModalLabel htmlFor="performing_lab">Performing Lab</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="performing_lab"
                  id="performing_lab"
                  placeholder=""
                />
              </InputBox> */}
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

export default FormTestResult
