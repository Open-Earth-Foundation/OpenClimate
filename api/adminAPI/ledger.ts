const sendAdminMessage = require('./transport')

// Generate operations and requests to be sent to the Cloud Agent Adminstration API

// Fetch the Ledger TAA
const fetchTAA = async () => {
  try {
    console.log('Fetching Ledger TAA')

    const TAA = await sendAdminMessage('get', `/ledger/taa`, {}, {})

    return TAA.result
  } catch (error) {
    console.error('Ledger TAA Fetching Error')
    throw error
  }
}

const acceptTAA = async (version, text, mechanism = 'wallet_agreement') => {
  try {
    console.log('Accepting Ledger TAA')

    const response = await sendAdminMessage(
      'post',
      `/ledger/taa/accept`,
      {},
      {version, text, mechanism},
    )

    return response
  } catch (error) {
    console.error('Ledger TAA Acceptance Error')
    throw error
  }
}

export = {
  acceptTAA,
  fetchTAA
}
