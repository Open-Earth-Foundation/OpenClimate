const sendAdminMessage = require("./transport");
const logger = require("../logger").child({ module: __filename });

// Admin API Call to fetch a schema
const fetchSchema = async (schema_id) => {
  try {
    logger.debug("Fetching Schema");

    const schema = await sendAdminMessage(
      "get",
      `/schemas/${schema_id}`,
      {},
      {}
    );

    return schema.schema;
  } catch (error) {
    logger.error("Fetching Schema Error");
    throw error;
  }
};

export = {
  fetchSchema,
};
