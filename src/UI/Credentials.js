import React from 'react'

// import { useNotification } from './NotificationProvider'
import PageHeader from './PageHeader'
import PageSection from './PageSection'

import { DataTable, DataRow, DataHeader, DataCell } from './CommonStylesTables'

function Credentials(props) {
  // Accessing notification context
  // const setNotification = useNotification()

  function openCredential(history, id) {
    if (history !== undefined) {
      history.push('/admin/credentials/' + id)
    }
  }

  const history = props.history

  const credentials = props.credentials

  const credentialRows = credentials.map((credential_record) => {
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
  })

  return (
    <>
      <div id="credentials">
        <PageHeader title={'Credentials'} />
        <PageSection>
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
      </div>
    </>
  )
}

export default Credentials
