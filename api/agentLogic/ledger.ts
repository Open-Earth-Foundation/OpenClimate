const AdminAPI = require('../adminAPI')

// Perform Agent Business Logic

// Fetch the Transaction Author Agreement (TAA) from the ledger
const fetchTAA = async () => {
  try {
    const TAA = await AdminAPI.Ledger.fetchTAA()

    return TAA
  } catch (error) {
    console.error('Error Fetching Ledger TAA')
    throw error
  }
}

// Accept the Transaction Author Agreement (TAA) from the ledger
const acceptTAA = async (version, text, mechanism = 'wallet_agreement') => {
  try {
    const response = await AdminAPI.Ledger.acceptTAA(version, text, mechanism)

    return
  } catch (error) {
    console.error('Error Accepting Ledger TAA')
    throw error
  }
}

export = {
  acceptTAA,
  fetchTAA,
}
