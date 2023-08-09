const express = require("express");
const {
  getUsers,
  getUser,
  deleteUser,
  processRegister,
  userAccountActivation,
  UpdateUser,
  banUser,
  unbanUser,
  updatePassword,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");
const upload = require("../middleware/uploadFile");
const {
  validateUserRegistration,
  validateChangePassword,
  validateForgetPassword,
  validateResetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");

const userRouter = express.Router();

userRouter.post(
  "/process-register",
  upload.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  processRegister
);
userRouter.post("/activate", isLoggedOut, userAccountActivation);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getUser);
userRouter.delete("/:id", isLoggedIn, deleteUser);
userRouter.put(
  "/reset-password",
  validateResetPassword,
  runValidation,
  resetPassword
);
userRouter.put("/:id", upload.single("image"), isLoggedIn, UpdateUser);
userRouter.put("/ban-user/:id", isLoggedIn, isAdmin, banUser);
userRouter.put("/unban-user/:id", isLoggedIn, isAdmin, unbanUser);
userRouter.put(
  "/update-password/:id",
  validateChangePassword,
  runValidation,
  isLoggedIn,
  updatePassword
);
userRouter.post(
  "/forget-password",
  validateForgetPassword,
  runValidation,
  forgetPassword
);

module.exports = userRouter;
