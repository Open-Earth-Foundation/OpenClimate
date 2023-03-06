const axios = require("axios");
const logger = require("../logger").child({ module: __filename });

// Function to send a request to the Cloud Agent Administration API
const sendAdminMessage = async (method, path, params = {}, data = {}) => {
  try {
    logger.debug("Sending Admin API Message", params);
    const response = await axios({
      method: method,
      url: `${process.env.AGENTADDRESS || "localhost:8150"}${path}`,
      params: params,
      data: data,
    });

    return response.data;
  } catch (error) {
    logger.error("Admin API Request Error");
    throw error;
  }
};

export = sendAdminMessage;
