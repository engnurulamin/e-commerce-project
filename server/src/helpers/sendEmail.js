const emailWithNodeMailer = require("../helpers/email");
const createError = require("http-errors");

const sendEmail = async (emailData) => {
  try {
    await emailWithNodeMailer(emailData);
  } catch (error) {
    throw createError(500, "Failed to send varification email");
  }
};

module.exports = sendEmail;
