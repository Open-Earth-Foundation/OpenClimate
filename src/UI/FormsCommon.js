import styled from 'styled-components'
import Popup from 'reactjs-popup'

export const StyledPopup = styled(Popup)`
  &-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
`

export const InputBox = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`

export const Modal = styled.div`
  font-size: 12px;
  margin: auto;
  background: ${(props) => props.theme.background_primary};
  width: 500px;
  padding: 5px;
  border: 1px solid #d7d7d7;
`

export const ModalHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid gray;
  font-size: 1.8em;
  text-align: center;
  padding: 5px;
`

export const ModalContentWrapper = styled.div`
  overflow: hidden;
  height: auto;
  width: 100%;
`

export const CloseBtn = styled.button`
  cursor: pointer;
  outline: inherit;
  position: absolute;
  display: block;
  padding: 2px 5px;
  line-height: 20px;
  right: -10px;
  top: -10px;
  font-size: 24px;
  background: ${(props) => props.theme.negative_color};
  border-radius: 18px;
  border: 1px solid ${(props) => props.theme.negative_color};
  &:focus {
    box-shadow: 0 0 1pt 1pt #000;
  }
`

export const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 5px;
  margin: auto;
  text-align: center;
`

export const CancelBtn = styled.button`
  border: none;
  color: ${(props) => props.theme.text_light};
  background: ${(props) => props.theme.negative_color};
  padding: 5px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
  padding: 10px;
  width: 25%;
  font-size: 1.3em;
`

export const SubmitBtn = styled.button`
  border: none;
  color: ${(props) => props.theme.text_light};
  background: ${(props) => props.theme.positive_color};
  padding: 5px;
  box-shadow: ${(props) => props.theme.drop_shadow};
  padding: 10px;
  width: 25%;
  font-size: 1.3em;
`

export const ModalLabel = styled.label`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  width: 30%;
  margin-right: 10px;
`

export const InputField = styled.input`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  height: 30px;
  width: 50%;
  }
`

export const Select = styled.select`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  width: 50%;
`

export const TextArea = styled.textarea`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  height: 30px;
  width: 50%;
`

export const ModalContent = styled.div`
  height: 99%;
  width: 100%;
  padding: 10px 5px;
  overflow-y: scroll;
  padding-right: 17px;
  box-sizing: content-box;
`

export const QRModalContent = styled.div`
  width: 100%;
  padding: 10px 5px;
`
export const QRHolder = styled.div`
  height: 300px;
`
