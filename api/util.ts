// Utilities:
// Encode and decode Base64

const logger = require("./logger").child({ module: __filename });

const decodeBase64 = (encodedMessage) => {
  logger.debug("Decoding encoded Base64 message");
  return Buffer.from(encodedMessage, "base64").toString("ascii");
};

const encodeBase64 = (message) => {
  logger.debug("Encoding message to Base64");
  return Buffer.from(message).toString("base64");
};

// Regular expressions

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // Regular x@x.xx email
  return re.test(String(email).toLowerCase());
}

function validateAlphaNumeric(username) {
  const re = /^[a-zA-Z0-9\.].{2,}$/; // Alphanumeric, at least 3 characters
  logger.debug(re.test(username));
  return re.test(String(username));
}

function validatePassword(password) {
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // At least 1 digit, 1 lowercase, 1 uppercase, 1 special characters, 8 characters
  return re.test(String(password));
}

export const Utils = {
  decodeBase64,
  encodeBase64,
  validateEmail,
  validateAlphaNumeric,
  validatePassword,
};
