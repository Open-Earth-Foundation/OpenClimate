const AdminAPI = require("../adminAPI");
const logger = require("../logger").child({ module: __filename });

// Perform Agent Business Logic

// Fetch a schema by schemaID
const fetchSchema = async (schemaID) => {
  try {
    const schema = await AdminAPI.Schemas.fetchSchema(schemaID);

    logger.debug(schema);

    return schema;
  } catch (error) {
    logger.error("Error Fetching Schema");
    throw error;
  }
};

export = {
  fetchSchema,
};
