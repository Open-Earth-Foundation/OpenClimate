const sendAdminMessage = require('./transport')

// Admin API Call to fetch a schema
const fetchSchema = async (schema_id) => {
  try {
    console.log('Fetching Schema')

    const schema = await sendAdminMessage(
      'get',
      `/schemas/${schema_id}`,
      {},
      {},
    )

    return schema.schema
  } catch (error) {
    console.error('Fetching Schema Error')
    throw error
  }
}

export = {
  fetchSchema,
}
