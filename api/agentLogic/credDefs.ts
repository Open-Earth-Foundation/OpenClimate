const AdminAPI = require('../adminAPI')
const logger = require('../logger').child({module: __filename})

// Perform Agent Business Logic

// Retrieve Credential Definition IDs
const createdCredDefIDs = async (
  credDefID,
  issuerDID,
  schemaID,
  schemaIssuerDID,
  schemaName,
  schemaVersion,
) => {
  try {
    const credDefIDs = await AdminAPI.CredDefs.createdCredDefIDs(
      credDefID,
      issuerDID,
      schemaID,
      schemaIssuerDID,
      schemaName,
      schemaVersion,
    )

    logger.debug(credDefIDs)

    return credDefIDs
  } catch (error) {
    logger.error('Error Fetching Created Credential Definitions IDs')
    throw error
  }
}

// Fetch Credential Definition by Credential Definition ID (JamesKEbert)TODO: how to differentiate between personally generated versus fetched cred defs in DB
const fetchCredDef = async (credDefID) => {
  try {
    // (JamesKEbert) TODO: Query in DB before attempting to fetch via admin api
    const credDef = await AdminAPI.CredDefs.fetchCredDef(credDefID)

    return credDef
  } catch (error) {
    logger.error('Error Fetching Credential Definition')
    throw error
  }
}

// Create a new credential from a given schema.
const createCredDef = async (tag = 'default', schema_id) => {
  try {
    const credDefID = await AdminAPI.CredDefs.createCredDef(
      tag,
      schema_id,
      0,
      false,
    )

    logger.debug(credDefID)

    return credDefID
  } catch (error) {
    logger.error('Error Creating Credential Definition')
    throw error
  }
}

export = {
  createCredDef,
  createdCredDefIDs,
  fetchCredDef,
}
