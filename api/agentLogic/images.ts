require("dotenv").config();

let Images = require("../orm/images");

const logger = require("../logger").child({ module: __filename });

// Perform Agent Business Logic

const getAll = async () => {
  try {
    const images = await Images.readImages();
    return images;
  } catch (error) {
    logger.error("Error Fetching Images");
    throw error;
  }
};

const getImagesByType = async (type) => {
  try {
    const images = await Images.readImagesByType(type);
    return images;
  } catch (error) {
    logger.error("Error Fetching Images by Type");
    throw error;
  }
};

// Update the logo image
const setImage = async (name, type, image) => {
  // Checking image size.
  const buffer = Buffer.from(image.substring(image.indexOf(",") + 1));
  if (buffer.length > 1000000) {
    return { error: "ERROR: the image is over 1Mb." };
  }
  // Checking image MIME.
  if (
    !image.includes("data:image/png;base64,") &&
    !image.includes("data:image/jpeg;base64,") &&
    !image.includes("data:image/gif;base64,") &&
    !image.includes("data:image/webp;base64,")
  ) {
    logger.debug("This is not an image.");
    return { error: "ERROR: must be a valid image." };
  }

  try {
    await Images.updateImage(name, type, image);
    const updatedImage = await Images.readImagesByType("logo");
    return updatedImage;
  } catch (error) {
    logger.error("Error updating logo");
    throw error;
  }
};

export = {
  getAll,
  setImage,
  getImagesByType,
};
