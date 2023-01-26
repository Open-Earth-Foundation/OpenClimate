const Settings = require("../orm/settings");
const logger = require("../logger").child({ module: __filename });

// Perform Agent Business Logic

// Theme
const setTheme = async (data = {}) => {
  try {
    await Settings.updateTheme(data);
    const updatedTheme = await Settings.readTheme();
    return updatedTheme;
  } catch (error) {
    logger.error("Error updating settings");
    throw error;
  }
};

const getTheme = async () => {
  try {
    const currentTheme = await Settings.readTheme();
    return currentTheme;
  } catch (error) {
    logger.error("Error getting Theme");
    throw error;
  }
};

// SMTP
const getSMTP = async () => {
  try {
    const currentSMTP = await Settings.readSMTP();
    return currentSMTP;
  } catch (error) {
    logger.error("Error getting SMTP");
    throw error;
  }
};

const setSMTP = async (data = {}) => {
  try {
    await Settings.updateSMTP(data);
    const updatedSMTP = await Settings.readSMTP();
    return updatedSMTP;
  } catch (error) {
    logger.error("Error updating SMTP");
    throw error;
  }
};

// Organization
const getOrganization = async () => {
  try {
    const currentOrganization = await Settings.readOrganization();
    return currentOrganization;
  } catch (error) {
    logger.error("Error getting Organization");
    throw error;
  }
};

const setOrganization = async (data = {}) => {
  try {
    await Settings.updateOrganization(data);
    const updatedOrganization = await Settings.readOrganization();
    return updatedOrganization;
  } catch (error) {
    logger.error("Error updating organization name");
    throw error;
  }
};

const getSchemas = async () => {
  return {
    SCHEMA_VERIFIED_EMPLOYEE: process.env.SCHEMA_VERIFIED_EMPLOYEE,
  };
};

export = {
  getTheme,
  setTheme,
  getSMTP,
  setSMTP,
  getOrganization,
  setOrganization,
  getSchemas,
};
