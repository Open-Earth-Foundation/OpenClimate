const sendAdminMessage = require("./transport");
const logger = require("../logger").child({ module: __filename });

// Generate operations and requests to be sent to the Cloud Agent Adminstration API

// Set the Agent's public DID
const setPublicDID = async (did) => {
  try {
    logger.debug("Setting Public DID");

    const response = await sendAdminMessage(
      "post",
      `/wallet/did/public`,
      { did },
      {}
    );

    return response.result;
  } catch (error) {
    logger.error("Public DID Setting Error");
    throw error;
  }
};

// Fetch the set public DID message to be sent to the Cloud Agent Adminstration API
const fetchPublicDID = async () => {
  try {
    logger.debug("Fetching Public DID from AdminAPI");

    const publicDID = await sendAdminMessage(
      "get",
      `/wallet/did/public`,
      {},
      {}
    );

    return publicDID.result;
  } catch (error) {
    logger.error("Public DID Fetching Error");
    throw error;
  }
};

// Create a DID message to be sent to the Cloud Agent Adminstration API
const createDID = async () => {
  try {
    logger.debug("Creating DID");

    const did = await sendAdminMessage("post", `/wallet/did/create`, {}, {});

    return did.result;
  } catch (error) {
    logger.error("Error Creating DID");
    throw error;
  }
};

export = {
  createDID,
  fetchPublicDID,
  setPublicDID,
};
