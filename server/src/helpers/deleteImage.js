const fs = require("fs").promises;

const deleteImage = async (imagePath) => {
  try {
    await fs.unlink(imagePath);
    await fs.unlink(imagePath);
    console.log("Image is deleted");
  } catch (error) {
    console.error("Image does not exist");
  }
};

module.exports = { deleteImage };
