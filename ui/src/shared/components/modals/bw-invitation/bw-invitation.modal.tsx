import React, { FunctionComponent, useState, useEffect } from 'react'
import Button from '../../form-elements/button/button'
import { useTheme } from 'styled-components'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Modal from '../modal/modal'
// import CredentialPic from '../../../img/modals/credential-qrcode.png';
import QR from 'qrcode.react'
import './bw-invitation.modal.scss'
import InputText from '../../form-elements/input-text/input.text'
import { IUser } from '../../../../api/models/User/IUser'
import { useNotification } from '../../../../UI/NotificationProvider'

interface Props {
  onModalShow: (modalType: string) => void
  hideModal: () => void
  user: IUser
}

const BWInvitationModal: FunctionComponent<Props> = (props) => {
  const [requestedInvitation, setRequestedInvitation] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')

  const setNotification = useNotification()
  const { onModalShow, hideModal, user } = props

  useEffect(() => {
    if (!requestedInvitation) {
      console.log('User', user)
      console.log('Requesting wallet invitation')
      props.sendRequest('INVITATIONS', 'CREATE_WALLET_INVITATION', {
        userID: user.id,
      })
      setRequestedInvitation(true)
    }
  }, [requestedInvitation])

  return (
    <form action="/" className="login-credential-form">
      <div className="modal__content login-credential-form__qr-content">
        <div className="modal__row modal__row_content-center login-credential-form__qr-content login-credential-form__subheader">
          Scan this QR with your digital wallet to login. You will have to
          complete the request for proof of credentials
        </div>

        <div className="modal__row modal__row_content-center login-credential-form__tutorial-link">
          <a href="#" className="modal__link modal__link_blue">
            <InfoOutlinedIcon
              className={'login-credential-form__info-icon'}
              fontSize="inherit"
            />
            How does this work?
          </a>
        </div>

        <div className="modal__row modal__row_content-center">
          {/* <img src={CredentialPic} alt="QRcode" /> */}
          {props.QRCodeURL ? (
            <div className="login-credential-form__qrcode">
              <QR value={props.QRCodeURL} size={250} renderAs="svg" />
            </div>
          ) : (
            <p>
              <span>Loading...</span>
            </p>
          )}
        </div>

        <div className="modal__row modal__row_content-center login-credential-form__qr-content">
          <a
            onClick={() => {
              navigator.clipboard.writeText(props.QRCodeURL)
              alert('Link copied to clipboard!')
            }}
            className="modal__link modal__link_primary"
          >
            <div className="login-credential-form__copy-link">
              <ContentCopyIcon className={'login-credential-form__info-icon'} />
              Copy link
            </div>
          </a>
        </div>
        <div className="modal__row modal__row_btn">
          <Button
            color="white"
            click={() => onModalShow('send-ghg-proof')}
            text="Done"
            type="button"
          />
        </div>
      </div>
    </form>
  )
}

export default BWInvitationModal
