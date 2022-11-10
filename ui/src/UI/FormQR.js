import React, { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'
import QRCode from 'qrcode.react'

import {
  StyledPopup,
  Modal,
  ModalHeader,
  QRModalContent,
  CloseBtn,
  QRHolder,
} from './CommonStylesForms'

const QR = styled(QRCode)`
  display: block;
  margin: auto;
  padding: 10px;
  width: 300px;
`

function FormQR(props) {
  const { closeContactModal } = props
  const closeModal = useCallback(() => {
    closeContactModal()
  }, [closeContactModal])

  const [waitingForConnection, setWaitingForConnection] = useState(false)

  useEffect(() => {
    if (props.QRCodeURL !== '' && waitingForConnection === false) {
      setWaitingForConnection(true)
    } else if (props.QRCodeURL === '' && waitingForConnection === true) {
      setWaitingForConnection(false)
      closeModal()
    }
  }, [props.QRCodeURL, closeModal, waitingForConnection])

  return (
    <StyledPopup
      open={props.contactModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="agent-modal">
        <ModalHeader>Add New Contact</ModalHeader>
        <QRModalContent>
          <QRHolder>
            {props.QRCodeURL ? (
              <QR value={props.QRCodeURL} size={256} renderAs="svg" />
            ) : (
              <p>Loading...</p>
            )}
          </QRHolder>
        </QRModalContent>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  )
}

export default FormQR
