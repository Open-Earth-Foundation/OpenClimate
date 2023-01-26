const sendAdminMessage = require("./transport");
const logger = require("../logger").child({ module: __filename });

// Generate operations and requests to be sent to the Cloud Agent Adminstration API

// Create an invitation request message to be sent to the Cloud Agent Adminstration API
const createInvitation = async (
  alias = "Single-Use Invitation",
  autoAccept = false,
  multiUse = false,
  public_ = false
) => {
  try {
    logger.debug("Generating Invitation");

    const invitationMessage = await sendAdminMessage(
      "post",
      `/connections/create-invitation`,
      {
        alias,
        auto_accept: autoAccept,
        multi_use: multiUse,
        public_,
      },
      {}
    );

    return invitationMessage;
  } catch (error) {
    logger.error("Invitation Creation Error");
    throw error;
  }
};

const acceptInvitation = async (invitation) => {
  try {
    logger.debug("Accepting Invitation");

    let parsedInvitation = JSON.parse(invitation);

    const invitationMessage = await sendAdminMessage(
      "post",
      `/connections/receive-invitation`,
      {
        alias: parsedInvitation.label,
        auto_accept: true,
      },
      parsedInvitation
    );

    return invitationMessage;
  } catch (error) {
    logger.error("Invitation Acceptance Error");
    throw error;
  }
};

// Fetch a Connection request message to be sent to the Cloud Agent Adminstration API
const fetchConnection = async (connectionID) => {
  try {
    logger.debug(`Fetching a Connection with connectionID: ${connectionID}`);

    const connection = await sendAdminMessage(
      "get",
      `/connections/${connectionID}`,
      {},
      {}
    );

    return connection;
  } catch (error) {
    if (error.response.status === 404) {
      logger.debug("No Connection Found");

      return null;
    }

    logger.error("Error Fetching Connection");
    throw error;
  }
};

// Query Connection requests message to be sent to the Cloud Agent Adminstration API
const queryConnections = async (
  initiator = "self",
  state = "active",
  alias,
  invitationKey = null,
  myDID = null,
  theirDID = null,
  theirRole = null
) => {
  try {
    logger.debug(
      `Fetching Connections with the parameters:`,
      alias,
      initiator,
      invitationKey,
      myDID,
      state,
      theirDID,
      theirRole
    );

    const connections = await sendAdminMessage(
      "get",
      `/connections`,
      {
        alias: alias,
        initiator: initiator,
        invitation_key: invitationKey,
        my_did: myDID,
        state: state,
        their_did: theirDID,
        their_role: theirRole,
      },
      {}
    );

    return connections;
  } catch (error) {
    if (error.response.status === 404) {
      logger.debug("No Connections Found");

      return null;
    }

    logger.error("Error Fetching Connections");
    throw error;
  }
};

export = {
  createInvitation,
  acceptInvitation,
  fetchConnection,
  queryConnections,
};
