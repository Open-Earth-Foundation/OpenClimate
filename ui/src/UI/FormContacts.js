// import { useNotification } from './NotificationProvider'
import React, { useRef } from "react";

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
} from "./CommonStylesForms";

function FormContacts(props) {
  // Assigning contact values from props
  const contact_id = props.contactSelected
    ? JSON.parse(JSON.stringify(props.contactSelected.contact_id))
    : "";
  const email =
    props.contactSelected && props.contactSelected.Demographic
      ? JSON.parse(JSON.stringify(props.contactSelected.Demographic.email))
      : "";
  const phone =
    props.contactSelected && props.contactSelected.Demographic
      ? JSON.parse(JSON.stringify(props.contactSelected.Demographic.phone))
      : "";
  const address_1 =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.address_1)
        )
      : "";
  const address_2 =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.address_2)
        )
      : "";
  const city =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.city)
        )
      : "";
  const state =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.state)
        )
      : "";
  const zip_code =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.zip_code)
        )
      : "";
  const country =
    props.contactSelected &&
    props.contactSelected.Demographic &&
    props.contactSelected.Demographic.address
      ? JSON.parse(
          JSON.stringify(props.contactSelected.Demographic.address.country)
        )
      : "";

  const contactForm = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(contactForm.current);

    // Assembling contact JSON
    const contact = {};
    contact.contact_id = props.contactSelected.contact_id;
    contact.email = form.get("email");
    contact.phone = form.get("phone");
    contact.address = {};
    contact.address.address_1 = form.get("address_1");
    contact.address.address_2 = form.get("address_2");
    contact.address.city = form.get("city");
    contact.address.state = form.get("state");
    contact.address.zip_code = form.get("zip_code");
    contact.address.country = form.get("country");

    props.submitContact(contact, e);

    props.closeContactModal();
  };

  function closeModal() {
    props.closeContactModal();
  }

  return (
    <StyledPopup
      open={props.contactModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="agent-modal">
        <ModalHeader>Edit Contact</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={contactForm}>
              <InputBox>
                <ModalLabel htmlFor="email">Email</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="email"
                  defaultValue={email}
                  placeholder="name@email.com"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="phone">Phone</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="phone"
                  defaultValue={phone}
                  placeholder="123-456-7890"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="address_1">Address 1</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="address_1"
                  defaultValue={address_1}
                  placeholder="123 Main St"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="address_2">Address 2</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="address_2"
                  defaultValue={address_2}
                  placeholder="Apt. #382"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="city">City</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="city"
                  defaultValue={city}
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="state">State</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="state"
                  defaultValue={state}
                  maxLength="2"
                  placeholder="ID"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="zip_code">Zip Code</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="zip_code"
                  defaultValue={zip_code}
                  placeholder="83440"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="country">Country</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="country"
                  defaultValue={country}
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="contact_id"></ModalLabel>
                <InputFieldModal
                  type="hidden"
                  name="contact_id"
                  defaultValue={contact_id}
                ></InputFieldModal>
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
  );
}

export default FormContacts;
