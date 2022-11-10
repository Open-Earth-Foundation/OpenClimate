const AdminAPI = require('../adminAPI')

// Perform Agent Business Logic

// Fetch a schema by schemaID
const fetchSchema = async (schemaID) => {
  try {
    const schema = await AdminAPI.Schemas.fetchSchema(schemaID)

    console.log(schema)

    return schema
  } catch (error) {
    console.error('Error Fetching Schema')
    throw error
  }
}

export = {
  fetchSchema,
}
