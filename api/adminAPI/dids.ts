const sendAdminMessage = require('./transport')

// Generate operations and requests to be sent to the Cloud Agent Adminstration API

// Set the Agent's public DID
const setPublicDID = async (did) => {
  try {
    console.log('Setting Public DID')

    const response = await sendAdminMessage(
      'post',
      `/wallet/did/public`,
      {did},
      {},
    )

    return response.result
  } catch (error) {
    console.error('Public DID Setting Error')
    throw error
  }
}

// Fetch the set public DID message to be sent to the Cloud Agent Adminstration API
const fetchPublicDID = async () => {
  try {
    console.log('Fetching Public DID from AdminAPI')

    const publicDID = await sendAdminMessage(
      'get',
      `/wallet/did/public`,
      {},
      {},
    )

    return publicDID.result
  } catch (error) {
    console.error('Public DID Fetching Error')
    throw error
  }
}

// Create a DID message to be sent to the Cloud Agent Adminstration API
const createDID = async () => {
  try {
    console.log('Creating DID')

    const did = await sendAdminMessage('post', `/wallet/did/create`, {}, {})

    return did.result
  } catch (error) {
    console.error('Error Creating DID')
    throw error
  }
}

export = {
  createDID,
  fetchPublicDID,
  setPublicDID,
}
