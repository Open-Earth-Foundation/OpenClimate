import React, { useRef, useState, useEffect } from "react";

import styled, { useTheme } from "styled-components";

import { useNotification } from "./NotificationProvider";
import PageHeader from "./PageHeader";
import PageSection from "./PageSection";

import ReactTooltip from "react-tooltip";

import { IconHelp } from "./CommonStylesTables";

const SettingsHeader = styled.h2`
  display: inline;
  margin-right: 10px;
`;

const PrimaryColorTest = styled.input`
  background: ${(props) => props.theme.primary_color};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const SecondaryColorTest = styled.input`
  background: ${(props) => props.theme.secondary_color};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const NeutralColorTest = styled.input`
  background: ${(props) => props.theme.neutral_color};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const NegativeColorTest = styled.input`
  background: ${(props) => props.theme.negative_color};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const WarningColorTest = styled.input`
  background: ${(props) => props.theme.warning_color};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const PositiveColorTest = styled.input`
  background: ${(props) => props.theme.positive_color};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const TextColorTest = styled.input`
  background: ${(props) => props.theme.text_color};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const TextLightTest = styled.input`
  background: ${(props) => props.theme.text_light};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const BorderTest = styled.input`
  background: ${(props) => props.theme.secondary_color};
  border: ${(props) => props.theme.border};
  margin-left: 50px;
  width: 17px;
`;
const DropShadowTest = styled.input`
  background: ${(props) => props.theme.neutral_color};
  border: none;
  margin-left: 50px;
  width: 17px;
  box-shadow: ${(props) => props.theme.drop_shadow};
`;
const PrimaryBackgroundTest = styled.input`
  background: ${(props) => props.theme.background_primary};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const SecondaryBackgroundTest = styled.input`
  background: ${(props) => props.theme.background_secondary};
  border: none;
  margin-left: 50px;
  width: 17px;
`;
const UndoStyle = styled.button`
  width: 60px;
  background: ${(props) => props.theme.warning_color};
  padding: 5px;
  color: ${(props) => props.theme.text_light};
  border: none;
  margin-left: 20px;
  box-shadow: ${(props) => props.theme.drop_shadow};
  display: none;

  &.active {
    display: inline-block;
  }
`;

const SaveBtn = styled.button`
  width: 80px;
  background: ${(props) => props.theme.primary_color};
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  float: right;
  box-shadow: ${(props) => props.theme.drop_shadow};
`;

const SubmitFormBtn = styled.button``;
const SMTPInput = styled.input`
  display: block;
  margin-bottom: 15px;
`;
const ColorInput = styled.input``;
const FileInput = styled.input``;
const SMTPForm = styled.form``;
const OrganizationNameForm = styled.form``;
const Form = styled.form`
  margin-bottom: 15px;
  height: 72px;
`;

function Settings(props) {
  // Accessing notification context
  const setNotification = useNotification();

  const error = props.errorMessage;
  const success = props.successMessage;
  // const messageEventCounter = props.messageEventCounter

  useEffect(() => {
    if (success) {
      // console.log('SUCCESS RAN')
      setNotification(success, "notice");
      props.clearResponseState();
    } else if (error) {
      // console.log('ERROR RAN')
      setNotification(error, "error");
      props.clearResponseState();
    }
  }, [error, success, props, setNotification]);

  // File state
  const [selectedFile, setSelectedFile] = useState("");
  const [fileName, setFileName] = useState("Choose file");

  // Color input references
  const primaryColorInput = useRef(null);
  const secondaryColorInput = useRef(null);
  const neutralColorInput = useRef(null);
  const negativeColorInput = useRef(null);
  const warningColorInput = useRef(null);
  const positiveColorInput = useRef(null);
  const textColorInput = useRef(null);
  const textLightInput = useRef(null);
  const borderInput = useRef(null);
  const dropShadowInput = useRef(null);
  const primaryBackgroundInput = useRef(null);
  const secondaryBackgroundInput = useRef(null);

  // SMTP input references
  const smtpForm = useRef(null);
  const host = useRef(null);
  const userEmail = useRef(null);
  const userPassword = useRef(null);

  // Organization input references
  const organizationForm = useRef(null);
  const organizationName = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  // Theme style attribute change
  const changeThemeStyles = (key, value) => {
    if (value) {
      props.updateTheme({ [`${key}`]: value });
      props.addStylesToArray(key);
    }
  };

  // Setting the style to the default value
  const undoStyle = (key) => {
    props.undoStyle(key);
    props.removeStylesFromArray(key);
  };

  // Save style settings
  function saveStyle() {
    props.saveTheme();
  }

  // Save SMTP settings
  const handleSMTP = (e) => {
    e.preventDefault();

    const form = new FormData(smtpForm.current);

    const smtpConfigs = {
      host: form.get("host"),
      auth: {
        user: form.get("email"),
        pass: form.get("password"),
      },
    };
    props.sendRequest("SETTINGS", "SET_SMTP", smtpConfigs);

    smtpForm.current.reset();
  };

  // Save organization name
  const handleOrganizationName = (e) => {
    e.preventDefault();
    const form = new FormData(organizationForm.current);
    const name = {
      companyName: form.get("organizationName"),
    };
    props.sendRequest("SETTINGS", "SET_ORGANIZATION_NAME", name);
    organizationForm.current.reset();
  };

  // File upload

  // Setting up file and file name
  let fileSelectHandler = (event) => {
    const file = event.target.files[0];

    // The image is over 0.67Mb size. It will grow 33% (1mb) as it's converted to base64
    if (file && file.size > 670000) {
      setNotification("The image is over 1Mb.", "error");
      return;
    }

    if (file) {
      // Converting the image to base64
      const reader = new FileReader();
      reader.onloadend = function () {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);

      setFileName(event.target.files[0].name);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const image = {
        name: fileName,
        type: "logo",
        image: selectedFile,
      };

      props.sendRequest("IMAGES", "SET_LOGO", image);
    } else {
      setNotification("The image is not selected.", "error");
    }
  };

  return (
    <div id="settings">
      <PageHeader title={"Settings"} />
      <PageSection>
        <SettingsHeader>Organization name</SettingsHeader>
        <IconHelp
          data-tip
          data-for="organizationTip"
          data-delay-hide="250"
          data-multiline="true"
          alt="Help"
        />
        <ReactTooltip
          id="organizationTip"
          effect="solid"
          type="info"
          backgroundColor={useTheme().primary_color}
        >
          <span>
            Organization name is used in
            <br />
            the UI and email messages
          </span>
        </ReactTooltip>
        <OrganizationNameForm onSubmit={handleSubmit} ref={organizationForm}>
          <SMTPInput
            name="organizationName"
            placeholder="organization name"
            ref={organizationName}
            style={{ display: "inline-block" }}
          />
          <SaveBtn onClick={handleOrganizationName}>Save</SaveBtn>
        </OrganizationNameForm>
      </PageSection>
      <PageSection>
        <SettingsHeader>Change logo</SettingsHeader>
        <IconHelp
          data-tip
          data-for="logoTip"
          data-delay-hide="250"
          data-multiline="true"
          alt="Help"
        />
        <ReactTooltip
          id="logoTip"
          effect="solid"
          type="info"
          backgroundColor={useTheme().primary_color}
        >
          <span>
            Organization logo is used in
            <br />
            the UI and email messages
          </span>
        </ReactTooltip>
        <Form onSubmit={handleFileSubmit}>
          <FileInput
            type="file"
            accept=".jpeg, .jpg, .png, .gif, .webp"
            onChange={fileSelectHandler}
          ></FileInput>
          <SubmitFormBtn type="submit">Upload</SubmitFormBtn>
        </Form>
      </PageSection>
      <PageSection>
        <SettingsHeader>Change SMTP configurations</SettingsHeader>
        <IconHelp
          data-tip
          data-for="smtpTip"
          data-delay-hide="250"
          data-multiline="true"
          alt="Help"
        />
        <ReactTooltip
          id="smtpTip"
          effect="solid"
          type="info"
          backgroundColor={useTheme().primary_color}
        >
          <span>
            The SMTP configuration is used for sending
            <br />
            new user and password reset emails
          </span>
        </ReactTooltip>
        <SMTPForm onSubmit={handleSubmit} ref={smtpForm}>
          <SMTPInput name="host" placeholder="host" ref={host} />
          <SMTPInput name="email" placeholder="user email" ref={userEmail} />
          <SMTPInput
            type="password"
            name="password"
            placeholder="user password"
            ref={userPassword}
            style={{ display: "inline-block" }}
          />
          <SaveBtn onClick={handleSMTP}>Save</SaveBtn>
        </SMTPForm>
      </PageSection>
      <PageSection>
        <SettingsHeader>Theme Settings</SettingsHeader>
        <IconHelp
          data-tip
          data-for="themeTip"
          data-delay-hide="250"
          data-multiline="true"
          alt="Help"
        />
        <ReactTooltip
          id="themeTip"
          effect="solid"
          type="info"
          backgroundColor={useTheme().primary_color}
        >
          <span>
            Use these settings to
            <br />
            update the UI appearance
          </span>
        </ReactTooltip>
        <Form onSubmit={handleSubmit}>
          <h3>Change primary color</h3>
          <ColorInput placeholder="hex or string" ref={primaryColorInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "primary_color",
                primaryColorInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <PrimaryColorTest disabled></PrimaryColorTest>
          <UndoStyle
            className={
              props.stylesArray.includes("primary_color") ? "active" : ""
            }
            onClick={() => undoStyle("primary_color")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change secondary color</h3>
          <ColorInput placeholder="hex or string" ref={secondaryColorInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "secondary_color",
                secondaryColorInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <SecondaryColorTest disabled></SecondaryColorTest>
          <UndoStyle
            className={
              props.stylesArray.includes("secondary_color") ? "active" : ""
            }
            onClick={() => undoStyle("secondary_color")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change neutral color</h3>
          <ColorInput placeholder="hex or string" ref={neutralColorInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "neutral_color",
                neutralColorInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <NeutralColorTest disabled></NeutralColorTest>
          <UndoStyle
            className={
              props.stylesArray.includes("neutral_color") ? "active" : ""
            }
            onClick={() => undoStyle("neutral_color")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change negative color</h3>
          <ColorInput placeholder="hex or string" ref={negativeColorInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "negative_color",
                negativeColorInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <NegativeColorTest disabled></NegativeColorTest>
          <UndoStyle
            className={
              props.stylesArray.includes("negative_color") ? "active" : ""
            }
            onClick={() => undoStyle("negative_color")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change warning color</h3>
          <ColorInput placeholder="hex or string" ref={warningColorInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "warning_color",
                warningColorInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <WarningColorTest disabled></WarningColorTest>
          <UndoStyle
            className={
              props.stylesArray.includes("warning_color") ? "active" : ""
            }
            onClick={() => undoStyle("warning_color")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change positive color</h3>
          <ColorInput placeholder="hex or string" ref={positiveColorInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "positive_color",
                positiveColorInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <PositiveColorTest disabled></PositiveColorTest>
          <UndoStyle
            className={
              props.stylesArray.includes("positive_color") ? "active" : ""
            }
            onClick={() => undoStyle("positive_color")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change text color</h3>
          <ColorInput placeholder="hex or string" ref={textColorInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles("text_color", textColorInput.current.value)
            }
          >
            Change
          </SubmitFormBtn>
          <TextColorTest disabled></TextColorTest>
          <UndoStyle
            className={props.stylesArray.includes("text_color") ? "active" : ""}
            onClick={() => undoStyle("text_color")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change text light</h3>
          <ColorInput placeholder="hex or string" ref={textLightInput} />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles("text_light", textLightInput.current.value)
            }
          >
            Change
          </SubmitFormBtn>
          <TextLightTest disabled></TextLightTest>
          <UndoStyle
            className={props.stylesArray.includes("text_light") ? "active" : ""}
            onClick={() => undoStyle("text_light")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change border</h3>
          <ColorInput
            placeholder="5px solid #ff0000 or string"
            ref={borderInput}
          />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles("border", borderInput.current.value)
            }
          >
            Change
          </SubmitFormBtn>
          <BorderTest disabled></BorderTest>
          <UndoStyle
            className={props.stylesArray.includes("border") ? "active" : ""}
            onClick={() => undoStyle("border")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change drop shadow</h3>
          <ColorInput
            placeholder="3px 3px 3px rgba(0, 0, 0, 0.3)"
            ref={dropShadowInput}
          />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles("drop_shadow", dropShadowInput.current.value)
            }
          >
            Change
          </SubmitFormBtn>
          <DropShadowTest disabled></DropShadowTest>
          <UndoStyle
            className={
              props.stylesArray.includes("drop_shadow") ? "active" : ""
            }
            onClick={() => undoStyle("drop_shadow")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change primary background</h3>
          <ColorInput
            placeholder="hex or string"
            ref={primaryBackgroundInput}
          />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "background_primary",
                primaryBackgroundInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <PrimaryBackgroundTest disabled></PrimaryBackgroundTest>
          <UndoStyle
            className={
              props.stylesArray.includes("background_primary") ? "active" : ""
            }
            onClick={() => undoStyle("background_primary")}
          >
            Undo
          </UndoStyle>
        </Form>
        <Form onSubmit={handleSubmit}>
          <h3>Change secondary background</h3>
          <ColorInput
            placeholder="hex or string"
            ref={secondaryBackgroundInput}
          />
          <SubmitFormBtn
            type="submit"
            onClick={() =>
              changeThemeStyles(
                "background_secondary",
                secondaryBackgroundInput.current.value
              )
            }
          >
            Change
          </SubmitFormBtn>
          <SecondaryBackgroundTest disabled></SecondaryBackgroundTest>
          <UndoStyle
            className={
              props.stylesArray.includes("background_secondary") ? "active" : ""
            }
            onClick={() => undoStyle("background_secondary")}
          >
            Undo
          </UndoStyle>
          <SaveBtn onClick={saveStyle}>Save all</SaveBtn>
        </Form>
      </PageSection>
    </div>
  );
}

export default Settings;
