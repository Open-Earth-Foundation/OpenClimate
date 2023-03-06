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
  TextItem,
} from "./CommonStylesForms";

import { useNotification } from "./NotificationProvider";

function FormOrganization(props) {
  const credentialForm = useRef(null);
  const dateValidated = new Date();

  const setNotification = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(credentialForm.current);

    let newOrganization = {
      name: form.get("name"),
      category: form.get("category"),
      type: form.get("type"),
      country: form.get("country"),
      jurisdiction: form.get("jurisdiction"),
    };

    // Submits the organization form and shows notification
    props.sendRequest("ORGANIZATIONS", "CREATE", newOrganization);
    setNotification("Organization was successfully added!", "notice");

    props.closeCredentialModal();
  };

  function closeModal() {
    props.closeCredentialModal();
  }

  return (
    <StyledPopup
      open={props.credentialModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="agent-modal">
        <ModalHeader>Create Climate Organization</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form onSubmit={handleSubmit} ref={credentialForm}>
              <InputBox>
                <ModalLabel htmlFor="name">Name</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Acme Co."
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="type">Type</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="type"
                  id="type"
                  placeholder="Industrial"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="category">Category</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Manufacturing"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="country">Country</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="country"
                  id="country"
                  placeholder="United States"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="jurisdiction">Jurisdiction</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="jurisdiction"
                  id="jurisdiction"
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
  );
}

export default FormOrganization;
