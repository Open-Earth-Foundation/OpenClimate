const AdminAPI = require("../adminAPI");
const logger = require("../logger").child({ module: __filename });

// Perform Agent Business Logic

// Set the public DID
const setPublicDID = async (did) => {
  try {
    const response = await AdminAPI.DIDs.setPublicDID(did);
    logger.debug(response);

    return;
  } catch (error) {
    logger.error("Error Setting Public DID");
    throw error;
  }
};

// Fetch current public DID. (JamesKEbert)Note:Discuss possibilities around db caching of this public did
const fetchPublicDID = async () => {
  try {
    const publicDID = await AdminAPI.DIDs.fetchPublicDID();
    logger.debug(publicDID);

    return publicDID;
  } catch (error) {
    logger.error("Error Fetching Public DID");
    throw error;
  }
};

// Generate a new DID
const createDID = async () => {
  try {
    const did = await AdminAPI.DIDs.createDID();
    logger.debug(did);

    return did;
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
