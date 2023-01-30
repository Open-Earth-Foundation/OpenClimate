const AdminAPI = require('../adminAPI')
const logger = require('../logger').child({module: __filename})

// Perform Agent Business Logic

// Fetch the Transaction Author Agreement (TAA) from the ledger
const fetchTAA = async () => {
  try {
    const TAA = await AdminAPI.Ledger.fetchTAA()

    return TAA
  } catch (error) {
    logger.error('Error Fetching Ledger TAA')
    throw error
  }
}

// Accept the Transaction Author Agreement (TAA) from the ledger
const acceptTAA = async (version, text, mechanism = 'wallet_agreement') => {
  try {
    const response = await AdminAPI.Ledger.acceptTAA(version, text, mechanism)

    return
  } catch (error) {
    logger.error('Error Accepting Ledger TAA')
    throw error
  }
}

export = {
  acceptTAA,
  fetchTAA,
}
