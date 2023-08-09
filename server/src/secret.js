require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbUrl =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerce";
const defaultImage =
  process.env.DEFAULT_USER_IMG || "public/image/user/food-5.jpg";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "sdfsdggtrghrthyrh";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "Your_access_key_here";
const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "Your_reset_password_key_here";
const jwtRefreshKey =
  process.env.JWT_REFRESH_KEY || "your_refresh_token_key_here";
const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const client_url = process.env.CLIENT_URL || "";

module.exports = {
  serverPort,
  mongodbUrl,
  defaultImage,
  jwtActivationKey,
  jwtAccessKey,
  smtpUsername,
  smtpPassword,
  client_url,
  jwtResetPasswordKey,
  jwtRefreshKey,
};
