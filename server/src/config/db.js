const mongoose = require("mongoose");
const { mongodbUrl } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDatabase = async (options) => {
  try {
    await mongoose.connect(mongodbUrl, (options = {}));
    logger.log("info", "Dsatabase Connected successfully");
    mongoose.connection.on("error", (error) => {
      logger.log("error", "Connection Error :", error);
    });
  } catch (error) {
    logger.log("error", "DB Connection Fail:", error.toString());
  }
};

module.exports = connectDatabase;
