const axios = require('axios')

// Function to send a request to the Cloud Agent Administration API
const sendAdminMessage = async (method, path, params = {}, data = {}) => {
  try {
    console.log('Sending Admin API Message', params)
    const response = await axios({
      method: method,
      url: `${process.env.AGENTADDRESS || 'localhost:8150'}${path}`,
      params: params,
      data: data,
    })

    return response.data
  } catch (error) {
    console.error('Admin API Request Error')
    throw error
  }
}

export = sendAdminMessage
