import styled from "styled-components";
import Popup from "reactjs-popup";
import QRCode from "qrcode.react";

// Form styles
export const StyledPopup = styled(Popup)`
  &-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
`;

export const InputBox = styled.div`
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const FormBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const HintBox = styled.div`
  margin: 8px;
  margin-top: -12px;
  justify-content: center;
  font-size: 15px;
`;

export const HintBoxContent = styled.ul`
  text-align: left;
  display: inline;
  font-size: 11px;
  color: #999999;
`;

export const HintBoxHeading = styled.p`
  margin-bottom: 0px;
`;

export const Modal = styled.div`
  overflow: auto;
  margin: auto;
  padding: 5px;
  max-height: 90vh;
  width: 500px;
  font-size: 12px;
  border: 1px solid #d7d7d7;
  background: ${(props) => props.theme.background_primary};
`;

export const ModalHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid gray;
  font-size: 1.8em;
  text-align: center;
  padding: 5px;
`;

export const ModalContentWrapper = styled.div`
  overflow: hidden;
  height: auto;
  width: 100%;
`;

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
`;

export const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 5px;
  margin: auto;
  text-align: center;
`;

export const CancelBtn = styled.button`
  border: none;
  color: ${(props) => props.theme.text_light};
  background: ${(props) => props.theme.negative_color};
  padding: 5px;
  box-shadow: ${(props) => props.theme.drop_shadow};
  padding: 10px;
  width: 25%;
  font-size: 1.3em;
`;

export const SubmitBtnModal = styled.button`
  border: none;
  color: ${(props) => props.theme.text_light};
  background: ${(props) => props.theme.positive_color};
  padding: 5px;
  box-shadow: ${(props) => props.theme.drop_shadow};
  padding: 10px;
  width: 25%;
  font-size: 1.3em;

  :disabled {
    background: ${(props) => props.theme.neutral_color};
  }
`;

export const ModalLabel = styled.label`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  width: 30%;
  margin-right: 10px;
`;

export const InputFieldModal = styled.input`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  height: 30px;
  width: 50%;
  }
`;

export const Select = styled.select`
  padding: 3px;
  width: 90%;
  color: ${(props) => props.theme.text_color};
  font-size: 1.025em;
  border: 1px solid ${(props) => props.theme.text_color};
  background: #fff;
`;

export const CheckboxHolder = styled.div`
  color: ${(props) => props.theme.text_color};
  font-size 1.5em;
  width: 52%;
`;

export const Checkbox = styled.input``;

export const TextWrapper = styled.div`
  text-align: center;
`;

export const TextArea = styled.textarea`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  height: 30px;
  width: 50%;
`;

export const ModalContent = styled.div`
  height: 99%;
  width: 100%;
  padding: 10px 5px;
  overflow-y: auto;
  padding-right: 17px;
  /*box-sizing: content-box;*/
`;

export const QRModalContent = styled.div`
  width: 100%;
  padding: 10px 5px;
`;
export const QRHolder = styled.div`
  height: 300px;
`;

// Full-screen forms

export const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
export const FormContainer = styled.div`
  padding: 0 0 100px 0;
  min-width: 400px;
  width: ${(props) => (props.isQRStep ? "70%" : "100%")};
  text-align: center;
  background: ${(props) =>
    props.isQRStep
      ? props.theme.background_secondary
      : props.theme.background_primary};
`;

export const StepperContainer = styled.div`
  margin-top: 60px;
  padding: 0 40px 20px 30px;
  min-width: 200px;
  width: 30%;
  text-align: left;
  background: ${(props) => props.theme.background_primary};
`;
export const SubmitBtn = styled.button`
  margin: auto;
  margin-top: 15px;
  padding: 10px 20px;
  width: 95%;
  font-size: 1em;
  text-transform: uppercase;
  color: ${(props) => props.theme.text_light};
  border: none;
  border-radius: 4px;
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.primary_color};
  :hover {
    cursor: pointer;
  }
`;
export const LogoHolder = styled.div`
  padding: 20px 0 10px 0;
  width: 100%;
`;
export const Logo = styled.img`
  display: block;
  max-width: 150px;
  max-height: 100%;
  margin: auto;
  display: none;
`;
export const FormBoxHeading = styled.p`
  font-size: 28px;
  font-weight: 500;
  position: relative;
  top: 20px;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 414px;
  padding: 10px;
`;

export const Label = styled.label`
  margin-right: 10px;
  width: 100%;
  font-size: 0.875em;
  line-height: 1.7em;
  font-weight: 500;
  text-align: left;
  color: black;
`;
export const InputField = styled.input`
  margin: auto 12px auto 0px;
  width: 100%;
  height: 3em;
  padding-left: 1em;
  font-size: 0.875em;
  background: #e6e7e8;
  border-radius: 4px;
  color: ${(props) => props.theme.text_color};
`;
export const TextItem = styled.span`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  margin-left: 8px;
  height: 30px;
  width: 50%;
`;
export const ActionButton = styled.span`
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: block;
  height: 64px;
  width: 64px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  line-height: 64px;
  color: ${(props) => props.theme.text_light};
  border-radius: 32px;
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.primary_color};
  :hover {
    cursor: pointer;
  }
`;

export const QRBox = styled.div`
  border-radius: 4px;
  border: 1px solid rgba(162, 151, 151, 0.35);
  padding: 25px;
  margin-bottom: 16px;
  margin-top: 50px;
  width: 300px;
  height: 300px;
  background: ${(props) => props.theme.background_primary};
`;

export const StyledQR = styled(QRCode)`
  display: block;
  margin: auto;
  padding: 10px;
  width: 250px;
  height: 250px;
`;
