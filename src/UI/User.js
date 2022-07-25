import React, { useState } from 'react'
// import styled from 'styled-components'

// import FormUserEdit from './FormUserEdit'
// import { useNotification } from './NotificationProvider'
import PageHeader from './PageHeader'
import PageSection from './PageSection'

import {
  DataTable,
  DataRow,
  // DataRowHover,
  DataHeader,
  // DataCell,
  // AttributeTable,
  // AttributeRow,
} from './CommonStylesTables'

// const EditCell = styled.td`
//   color: ${(props) => props.theme.primary_color};
//   box-shadow: none;
//   text-align: center;
//   font-size: 1.2em;
//   :hover {
//     cursor: pointer;
//   }
// `

function User(props) {
  // Accessing notification context
  // const setNotification = useNotification()

  const [userEditModalIsOpen, setUserEditModalIsOpen] = useState(false)

  const closeUserEditModal = () => setUserEditModalIsOpen(false)

  // const editUser = (email) => {
  //   setUserEditModalIsOpen(true)
  // }

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
        {/* <FormUserEdit
          userEditModalIsOpen={userEditModalIsOpen}
          closeUserEditModal={closeUserEditModal}
        /> */}
      </div>
    </>
  )
}

export default User
