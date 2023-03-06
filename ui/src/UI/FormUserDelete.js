import React, { useRef, useEffect } from "react";

import {
  StyledPopup,
  Modal,
  ModalHeader,
  ModalContentWrapper,
  ModalContent,
  CloseBtn,
  Actions,
  CancelBtn,
  SubmitBtnModal,
} from "./CommonStylesForms";

function FormUserDelete(props) {
  const userID = props.userId;
  const success = props.successMessage;

  const error = props.error;

  const submitBtn = useRef();

  useEffect(() => {
    if (error && submitBtn.current) {
      submitBtn.current.removeAttribute("disabled");
    }
  }, [error]);

  // Disable button on submit
  const onBtnClick = (e) => {
    if (submitBtn.current) {
      submitBtn.current.setAttribute("disabled", "disabled");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onBtnClick();

    props.sendRequest("USERS", "DELETE", userID);
  };

  function closeModal() {
    props.closeDeleteModal();
  }

  return (
    <StyledPopup
      open={props.deleteUserModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="agent-modal">
        <ModalHeader>Are you sure you want to remove this user?</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit}>
              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtnModal type="submit" ref={submitBtn}>
                  Remove
                </SubmitBtnModal>
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  );
}

export default FormUserDelete;
