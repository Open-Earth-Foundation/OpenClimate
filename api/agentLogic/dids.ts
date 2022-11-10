const AdminAPI = require('../adminAPI')

// Perform Agent Business Logic

// Set the public DID
const setPublicDID = async (did) => {
  try {
    const response = await AdminAPI.DIDs.setPublicDID(did)
    console.log(response)

    return
  } catch (error) {
    console.error('Error Setting Public DID')
    throw error
  }
}

// Fetch current public DID. (JamesKEbert)Note:Discuss possibilities around db caching of this public did
const fetchPublicDID = async () => {
  try {
    const publicDID = await AdminAPI.DIDs.fetchPublicDID()
    console.log(publicDID)

    return publicDID
  } catch (error) {
    console.error('Error Fetching Public DID')
    throw error
  }
}

// Generate a new DID
const createDID = async () => {
  try {
    const did = await AdminAPI.DIDs.createDID()
    console.log(did)

    return did
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
