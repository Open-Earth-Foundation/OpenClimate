import React from 'react'

import PageHeader from './PageHeader.js'
import PageSection from './PageSection.js'

import { AttributeTable, AttributeRow } from './CommonStylesTables'

function Credential(props) {
  const history = props.history
  const credential = props.credential
  const credentials = props.credentials

  let credentialSelected = ''

  for (let i = 0; i < credentials.length; i++) {
    if (credentials[i].credential_exchange_id == credential) {
      credentialSelected = credentials[i]
      break
    }
  }

  // Initialize variables to blank (to prevent errors during loading)
  let showCredential = {
    name: '',
    credential_exchange_id: '',
    state: '',
    date_created: '',
  }

  // Attributes of this kind of credential
  let showAttributes = {}
  let attributesSection = ''

  // Now set the values if we have a credential
  if (credentialSelected !== '') {
    showCredential.name =
      credentialSelected.credential_proposal_dict.schema_name.replaceAll(
        '_',
        ' '
      ) || ''
    showCredential.credential_exchange_id =
      credentialSelected.credential_exchange_id || ''
    showCredential.state = credentialSelected.state.replaceAll('_', ' ')
    showCredential.created_at =
      new Date(credentialSelected.created_at).toLocaleString() || ''

    // Values that depend on the credential being issued
    if (
      credentialSelected.credential !== null &&
      credentialSelected.credential !== undefined &&
      credentialSelected.credential.values !== null &&
      credentialSelected.credential.values !== undefined
    ) {
      const values = credentialSelected.credential.values

      if (showCredential.name === 'Test ID') {
        showAttributes.ordering_facility_name =
          values.ordering_facility_name.raw || ''
        showAttributes.ordering_facility_address =
          values.ordering_facility_address.raw || ''
        showAttributes.visit_location = values.visit_location.raw || ''
        showAttributes.lab_order_id = values.lab_order_id.raw || ''
        showAttributes.lab_code = values.lab_code.raw || ''
        showAttributes.lab_coding_qualifier =
          values.lab_coding_qualifier.raw || ''
        showAttributes.lab_description = values.lab_description.raw || ''
        showAttributes.lab_specimen_collected_date =
          values.lab_specimen_collected_date.raw || ''
        showAttributes.mpid = values.mpid.raw || ''
        showAttributes.patient_local_id = values.patient_local_id.raw || ''
        showAttributes.patient_name =
          values.patient_first_name.raw + ' ' + values.patient_last_name.raw
        showAttributes.patient_first_name = values.patient_first_name.raw || ''
        showAttributes.patient_last_name = values.patient_last_name.raw || ''
        showAttributes.patient_date_of_birth =
          values.patient_date_of_birth.raw || ''
        showAttributes.patient_gender_legal =
          values.patient_gender_legal.raw || ''
        showAttributes.patient_phone = values.patient_phone.raw || ''
        showAttributes.patient_street_address =
          values.patient_street_address.raw || ''
        showAttributes.patient_city = values.patient_city.raw || ''
        showAttributes.patient_state = values.patient_state.raw || ''
        showAttributes.patient_postalcode = values.patient_postalcode.raw || ''
        showAttributes.patient_country = values.patient_country.raw || ''
        attributesSection = (
          <div>
            <h2>Test Information</h2>
            <AttributeTable>
              <tbody>
                <AttributeRow>
                  <th>Visit Location:</th>
                  <td>{showAttributes.visit_location}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Lab Specimen Collected Date:</th>
                  <td>{showAttributes.lab_specimen_collected_date}</td>
                </AttributeRow>
                {/* <AttributeRow>
                  <th>Lab Coding Qualifier:</th>
                  <td>{showAttributes.lab_coding_qualifier}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Lab Code:</th>
                  <td>{showAttributes.lab_code}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Lab Description:</th>
                  <td>{showAttributes.lab_description}</td>
                </AttributeRow> */}
                <AttributeRow>
                  <th>Lab Order ID:</th>
                  <td>{showAttributes.lab_order_id}</td>
                </AttributeRow>
                {/* <AttributeRow>
                  <th>Ordering Facility Address:</th>
                  <td>{showAttributes.ordering_facility_address}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Ordering Facility Name:</th>
                  <td>{showAttributes.ordering_facility_name}</td>
                </AttributeRow> */}
              </tbody>
            </AttributeTable>
            <h2>Patient Information</h2>
            <AttributeTable>
              <tbody>
                {/* <AttributeRow>
                  <th>MPID:</th>
                  <td>{showAttributes.mpid}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Local ID:</th>
                  <td>{showAttributes.patient_local_id}</td>
                </AttributeRow> */}
                <AttributeRow>
                  <th>Last Name:</th>
                  <td>{showAttributes.patient_last_name}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>First Name:</th>
                  <td>{showAttributes.patient_first_name}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Date of Birth:</th>
                  <td>{showAttributes.patient_date_of_birth}</td>
                </AttributeRow>
                {/* <AttributeRow>
                  <th>Legal Gender:</th>
                  <td>{showAttributes.patient_gender_legal}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Street Address:</th>
                  <td>{showAttributes.patient_street_address}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>City:</th>
                  <td>{showAttributes.patient_city}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>State:</th>
                  <td>{showAttributes.patient_state}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Postal Code:</th>
                  <td>{showAttributes.patient_postalcode}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Country:</th>
                  <td>{showAttributes.patient_country}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Phone Number:</th>
                  <td>{showAttributes.patient_phone}</td>
                </AttributeRow> */}
              </tbody>
            </AttributeTable>
          </div>
        )
      } else if (showCredential.name === 'Covid 19 Lab Result') {
        showAttributes.result = values.result.raw || ''
        showAttributes.normality = values.normality.raw || ''
        showAttributes.result_status = values.result_status.raw || ''
        showAttributes.date_time_of_message =
          values.date_time_of_message.raw || ''
        showAttributes.sending_facility = values.sending_facility.raw || ''
        showAttributes.ordering_facility_name =
          values.ordering_facility_name.raw || ''
        showAttributes.ordering_facility_address =
          values.ordering_facility_address.raw || ''
        showAttributes.visit_location = values.visit_location.raw || ''
        showAttributes.lab_order_id = values.lab_order_id.raw || ''
        showAttributes.lab_code = values.lab_code.raw || ''
        showAttributes.lab_coding_qualifier =
          values.lab_coding_qualifier.raw || ''
        showAttributes.lab_description = values.lab_description.raw || ''
        showAttributes.lab_specimen_collected_date =
          values.lab_specimen_collected_date.raw || ''
        showAttributes.observation_date_time =
          values.observation_date_time.raw || ''
        // showAttributes.performing_lab = values.performing_lab.raw || ''
        // showAttributes.comment = values.comment.raw || ''
        showAttributes.mpid = values.mpid.raw || ''
        showAttributes.patient_local_id = values.patient_local_id.raw || ''
        showAttributes.patient_name =
          values.patient_first_name.raw + ' ' + values.patient_last_name.raw
        showAttributes.patient_first_name = values.patient_first_name.raw || ''
        showAttributes.patient_last_name = values.patient_last_name.raw || ''
        showAttributes.patient_date_of_birth =
          values.patient_date_of_birth.raw || ''
        showAttributes.patient_gender_legal =
          values.patient_gender_legal.raw || ''
        showAttributes.patient_phone = values.patient_phone.raw || ''
        showAttributes.patient_street_address =
          values.patient_street_address.raw || ''
        showAttributes.patient_city = values.patient_city.raw || ''
        showAttributes.patient_state = values.patient_state.raw || ''
        showAttributes.patient_postalcode = values.patient_postalcode.raw || ''
        showAttributes.patient_country = values.patient_country.raw || ''
        attributesSection = (
          <div>
            <h2>Test Information</h2>
            <AttributeTable>
              <tbody>
                <AttributeRow>
                  <th>Sending Facility:</th>
                  <td>{showAttributes.sending_facility}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Visit Location:</th>
                  <td>{showAttributes.visit_location}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Lab Specimen Collected Date:</th>
                  <td>{showAttributes.lab_specimen_collected_date}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Observation Date Time:</th>
                  <td>{showAttributes.observation_date_time}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Result Status:</th>
                  <td>{showAttributes.result_status}</td>
                </AttributeRow>
                {/* <AttributeRow>
                  <th>Lab Coding Qualifier:</th>
                  <td>{showAttributes.lab_coding_qualifier}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Lab Code:</th>
                  <td>{showAttributes.lab_code}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Lab Description:</th>
                  <td>{showAttributes.lab_description}</td>
                </AttributeRow> */}
                <AttributeRow>
                  <th>Lab Order ID:</th>
                  <td>{showAttributes.lab_order_id}</td>
                </AttributeRow>
                {/* <AttributeRow>
                  <th>Ordering Facility Address:</th>
                  <td>{showAttributes.ordering_facility_address}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Ordering Facility Name:</th>
                  <td>{showAttributes.ordering_facility_name}</td>
                </AttributeRow> */}
                <AttributeRow>
                  <th>Date/Time of Message:</th>
                  <td>{showAttributes.date_time_of_message}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Normality:</th>
                  <td>{showAttributes.normality}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Result:</th>
                  <td>{showAttributes.result}</td>
                </AttributeRow>
                {/* <AttributeRow>
                <th>Comment:</th>
                <td>{showAttributes.comment}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Performing Lab:</th>
                <td>{showAttributes.performing_lab}</td>
              </AttributeRow> */}
              </tbody>
            </AttributeTable>
            <h2>Patient Information</h2>
            <AttributeTable>
              <tbody>
                {/* <AttributeRow>
                  <th>MPID:</th>
                  <td>{showAttributes.mpid}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Local ID:</th>
                  <td>{showAttributes.patient_local_id}</td>
                </AttributeRow> */}
                <AttributeRow>
                  <th>Last Name:</th>
                  <td>{showAttributes.patient_last_name}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>First Name:</th>
                  <td>{showAttributes.patient_first_name}</td>
                </AttributeRow>
                <AttributeRow>
                  <th>Date of Birth:</th>
                  <td>{showAttributes.patient_date_of_birth}</td>
                </AttributeRow>
                {/* <AttributeRow>
                  <th>Legal Gender:</th>
                  <td>{showAttributes.patient_gender_legal}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Street Address:</th>
                  <td>{showAttributes.patient_street_address}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>City:</th>
                  <td>{showAttributes.patient_city}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>State:</th>
                  <td>{showAttributes.patient_state}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Postal Code:</th>
                  <td>{showAttributes.patient_postalcode}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Country:</th>
                  <td>{showAttributes.patient_country}</td>
                </AttributeRow> */}
                {/* <AttributeRow>
                  <th>Phone Number:</th>
                  <td>{showAttributes.patient_phone}</td>
                </AttributeRow> */}
              </tbody>
            </AttributeTable>
          </div>
        )
      }
    }
  }

  return (
    <div id="contact">
      <PageHeader
        title={showCredential.name + ' for ' + showAttributes.patient_name}
      />
      <PageSection>
        <h2>General Information</h2>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Credential Name:</th>
              <td>{showCredential.name}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Credential ID:</th>
              <td>{showCredential.credential_exchange_id}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Credential State:</th>
              <td>{showCredential.state}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Date Created:</th>
              <td>{showCredential.created_at}</td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
        {attributesSection}
      </PageSection>
    </div>
  )
}

export default Credential
