const express = require("express");
const {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtected,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middleware/auth");
const { validateUserLogin } = require("../validators/auth");
const runValidation = require("../validators");

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protected", handleProtected);

module.exports = authRouter;
