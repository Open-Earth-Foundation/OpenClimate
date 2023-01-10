const sendAdminMessage = require('./transport')
const logger = require('../logger').child({module: __filename})

// Fetch existing Credential Definitions IDs request message to be sent to the Cloud Agent Adminstration API
const createdCredDefIDs = async (
  cred_def_id,
  issuer_did,
  schema_id,
  schema_issuer_did,
  schema_name,
  schema_version,
) => {
  try {
    logger.debug('Fetching Created Credential Definition IDs')

    const credDefs = await sendAdminMessage(
      'get',
      `/credential-definitions/created`,
      {
        cred_def_id,
        issuer_did,
        schema_id,
        schema_issuer_did,
        schema_name,
        schema_version,
      },
      {},
    )

    return credDefs.credential_definition_ids
  } catch (error) {
    logger.error('Fetching Credential Definitions Error')
    throw error
  }
}

// Fetch a Credential Definition via the Admin API
const fetchCredDef = async (cred_def_id) => {
  try {
    logger.debug('Fetching Credential Definition')

    const credDef = await sendAdminMessage(
      'get',
      `/credential-definitions/${cred_def_id}`,
      {},
      {},
    )

    return credDef.credential_definition
  } catch (error) {
    logger.error('Fetching Credential Definitions Error')
    throw error
  }
}

// Create a Credential Definition based off a schema via the Admin API
const createCredDef = async (
  tag,
  schema_id,
  revocation_registry_size = 0,
  support_revocation = false,
) => {
  try {
    logger.debug('Creating Credential Definition')

    const credDefID = await sendAdminMessage(
      'post',
      `/credential-definitions`,
      {},
      {tag, schema_id, revocation_registry_size, support_revocation},
    )

    return credDefID.credential_definition_id
  } catch (error) {
    logger.error('Creating Credential Definitions Error')
    throw error
  }
}

export = {
  createCredDef,
  createdCredDefIDs,
  fetchCredDef,
}
