import React, { useState, useRef, useEffect } from 'react'

import { useTheme } from 'styled-components'

import {
  Actions,
  CancelBtn,
  Checkbox,
  CheckboxHolder,
  CloseBtn,
  InputBox,
  InputFieldModal,
  Modal,
  ModalContentWrapper,
  ModalContent,
  ModalHeader,
  ModalLabel,
  Select,
  StyledPopup,
  SubmitBtnModal,
} from './CommonStylesForms'

import { IconHelp } from './CommonStylesTables'

import ReactTooltip from 'react-tooltip'

function FormUsers(props) {
  const roles = props.roles
  const organizations = props.organizations
  const error = props.error

  const userForm = useRef()
  const submitBtn = useRef()

  const [options, setOptions] = useState([])
  const [organizationState, setOrganizationState] = useState(1)

  useEffect(() => {
    if (error && submitBtn.current) {
      submitBtn.current.removeAttribute('disabled')
    }
  }, [error])

  // Disable button on submit
  const onBtnClick = (e) => {
    if (submitBtn.current) {
      submitBtn.current.setAttribute('disabled', 'disabled')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onBtnClick()

    const form = new FormData(userForm.current)
    const email = form.get('email')
    const first_name = form.get('first_name')
    const last_name = form.get('last_name')
    const organization_id = form.get('organization_id')

    const user = {
      organization_id: organization_id,
      email: email,
      first_name: first_name,
      last_name: last_name,
      roles: options,
    }

    props.sendRequest('USERS', 'CREATE', user)
    setOptions([])
  }

  function closeModal() {
    props.closeUserModal()
  }

  const handleSelectChange = (event) => {
    // console.log(event.target.value)
    setOrganizationState(event.target.value)
    // console.log("Handle Select")
  }

  const handleCheckboxChange = (event) => {
    let newArray = [...options, event.target.value]
    if (options.includes(event.target.value)) {
      newArray = newArray.filter((s) => s !== event.target.value)
    }
    setOptions(newArray)
  }

  let organizationOptions = ''
  
  if (organizations.length > 0) {
    organizationOptions = organizations.map((organization) => {
      return (
        <option key={organization.organization_id} value={organization.organization_id}>
          {organization.name}
        </option>
      )
    })
  }

  const rolesOptions = roles.map((role) => {
    return (
      <div key={role.role_id}>
        <Checkbox
          type="checkbox"
          value={role.role_id}
          id={role.role_id}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={role.role_id}>{role.role_name}</label>
      </div>
    )
  })

  return (
    <StyledPopup
      open={props.userModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="agent-modal">
        <ModalHeader>Create New User</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={userForm}>
              <InputBox>
                <ModalLabel htmlFor="organization_id">Organization</ModalLabel>
                <CheckboxHolder>
                  <Select name="organization_id" id="organization_id" defaultValue={organizationState} onChange={handleSelectChange}>
                    {organizationOptions}
                  </Select>
                </CheckboxHolder>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="first_name">First Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="John"
                  required
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="last_name">Last Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Doe"
                  required
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="email">Email</ModalLabel>
                <InputFieldModal
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@email.com"
                  required
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="roles">
                  Roles
                  <IconHelp
                    alt="Help"
                    data-tip
                    data-for="rolesTip"
                    data-delay-hide="250"
                  />
                </ModalLabel>
                <ReactTooltip
                  id="rolesTip"
                  effect="solid"
                  type="info"
                  backgroundColor={useTheme().primary_color}
                >
                  <span>
                    Select which roles the user
                    <br />
                    will have in the system
                  </span>
                </ReactTooltip>
                <CheckboxHolder>{rolesOptions}</CheckboxHolder>
              </InputBox>
              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtnModal type="submit" ref={submitBtn}>
                  Submit
                </SubmitBtnModal>
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  )
}

export default FormUsers
