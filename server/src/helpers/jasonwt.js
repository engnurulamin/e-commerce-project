const jwt = require("jsonwebtoken");
const logger = require("../controllers/loggerController");

const createJsonWebToken = (payload, secretyKey, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object");
  }

  if (typeof secretyKey !== "string" || secretyKey === "") {
    throw new Error("Secret key must be a non-empty string");
  }

  try {
    const token = jwt.sign(payload, secretyKey, { expiresIn });
    return token;
  } catch (error) {
    logger.error("error", "Failed to sing tke JWT", error);
    throw error;
  }
};

module.exports = { createJsonWebToken };
