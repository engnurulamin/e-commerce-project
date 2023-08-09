const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");
const logger = require("../controllers/loggerController");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUsername,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.log("info", "Message sent: %s", info.response);
  } catch (error) {
    logger.error("error", "Error occured: ", error);
    throw error;
  }
};

module.exports = emailWithNodeMailer;
