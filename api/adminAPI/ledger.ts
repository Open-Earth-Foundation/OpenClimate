const sendAdminMessage = require("./transport");
const logger = require("../logger").child({ module: __filename });

// Generate operations and requests to be sent to the Cloud Agent Adminstration API

// Fetch the Ledger TAA
const fetchTAA = async () => {
  try {
    logger.debug("Fetching Ledger TAA");

    const TAA = await sendAdminMessage("get", `/ledger/taa`, {}, {});

    return TAA.result;
  } catch (error) {
    logger.error("Ledger TAA Fetching Error");
    throw error;
  }
};

const acceptTAA = async (version, text, mechanism = "wallet_agreement") => {
  try {
    logger.debug("Accepting Ledger TAA");

    const response = await sendAdminMessage(
      "post",
      `/ledger/taa/accept`,
      {},
      { version, text, mechanism }
    );

    return response;
  } catch (error) {
    logger.error("Ledger TAA Acceptance Error");
    throw error;
  }
};

export = {
  acceptTAA,
  fetchTAA,
};
