const Websockets = require("../websockets.ts");
let Organizations = require("../orm/organizations");
const logger = require("../logger").child({ module: __filename });

// Perform Agent Business Logic
const createOrganization = async function (
  name,
  category,
  type,
  country,
  jurisdiction
) {
  // Empty/data checks
  if (!name || !category || !type || !country || !jurisdiction)
    return { error: "ORGANIZATION ERROR: All fields must be filled out." };

  try {
    // Checking for duplicate organization
    const duplicateOrganization = await Organizations.readOrganizationByName(
      name
    );
    if (duplicateOrganization)
      return {
        error:
          "ORGANIZATION ERROR: An organization with this name already exists.",
      };

    const organization = await Organizations.createOrganization(
      name,
      category,
      type,
      country,
      jurisdiction
    );

    // Broadcast the message to all connections
    Websockets.sendMessageToAll("ORGANIZATIONS", "ORGANIZATIONS", {
      organizations: [organization],
    });

    // Return true to trigger the success message
    return true;
  } catch (error) {
    logger.error("Error Fetching Organization");
    throw error;
  }
};

const getOrganization = async (organization_id) => {
  try {
    const organization = await Organizations.readOrganization(organization_id);
    return organization;
  } catch (error) {
    logger.error("Error Fetching Organization");
    throw error;
  }
};

const getAll = async () => {
  try {
    const organizations = await Organizations.readOrganizations();
    return organizations;
  } catch (error) {
    logger.error("Error Fetching Organizations");
    throw error;
  }
};

const updateOrganization = async function (
  organization_id,
  name,
  category,
  type,
  country,
  jurisdiction
) {
  try {
    if (
      !organization_id ||
      !name ||
      !category ||
      !type ||
      !country ||
      !jurisdiction
    ) {
      logger.error("a field is empty.");
      return { error: "ORGANIZATION ERROR: All fields must be filled out." };
    }

    // Checking for duplicate organization
    const duplicateOrganization = await Organizations.readOrganizationByName(
      name
    );
    if (
      duplicateOrganization &&
      duplicateOrganization.organization_id !== organization_id
    ) {
      return {
        error:
          "ORGANIZATION ERROR: An organization with this name already exists.",
      };
    }

    const updatedOrganization = await Organizations.updateOrganizationInfo(
      organization_id,
      name,
      category,
      type,
      country,
      jurisdiction
    );

    // Broadcast the message to all connections
    Websockets.sendMessageToAll("ORGANIZATIONS", "ORGANIZATIONS", {
      organizations: [organization_id],
    });

    logger.debug("Updated organization");

    // Return true to trigger a success message
    return true;
  } catch (error) {
    logger.error("Error Fetching Organization update");
    throw error;
  }
};

// Need a strategy for updating users who had this organization...
// So we're waiting to handle this scenario later
// const deleteOrganization = async function (organization_id) {
//   try {
//     const deletedOrganization = await Organizations.deleteOrganization(organization_id)

//     // Broadcast the message to all connections
//     Websockets.sendMessageToAll('ORGANIZATIONS', 'ORGANIZATION_DELETED', deletedOrganization)

//     // Return true to trigger a success message
//     return true
//   } catch (error) {
//     logger.error('Error Fetching Organization')
//     throw error
//   }
// }

export = {
  createOrganization,
  getOrganization,
  getAll,
  updateOrganization,
  // deleteOrganization
};
