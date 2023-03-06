const Users = require("../orm/users");
const logger = require("../logger").child({ module: __filename });

// Perform Agent Business Logic
const getRole = async (roleID) => {
  try {
    const role = await Users.readRole(roleID);

    return role;
  } catch (error) {
    logger.error("Error Fetching Role");
    throw error;
  }
};

const getAll = async () => {
  try {
    const roles = await Users.readRoles();

    return roles;
  } catch (error) {
    logger.error("Error Fetching Roles");
    throw error;
  }
};

const createRole = async function (rolename) {
  try {
    await Users.createRole(rolename);
  } catch (error) {
    logger.error("Error Fetching Roles");
    throw error;
  }
};

export = {
  createRole,
  getRole,
  getAll,
};
