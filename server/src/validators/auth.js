const { body } = require("express-validator");

// Validate Registration
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name must be within 3-31 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password should be within 6-20 characters. At least one uppercase, one lowercase, one number and a special character"
    ),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 6 })
    .withMessage("Address should be at least 3 characters"),

  body("phone").trim().notEmpty().withMessage("Phone is required"),

  body("image")
    .custom((value, { req }) => {
      if (!req.file || !req.file.buffer) {
        throw new Error("User image is required");
      }
      return true;
    })
    .withMessage("Image is required"),
];

// Validate Sign In
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password should be within 6-20 characters. At least one uppercase, one lowercase, one number and a special character"
    ),
];

const validateChangePassword = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password should be within 6-20 characters. At least one uppercase, one lowercase, one number and a special character"
    ),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("New Password must be at least 6 characters")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "New Password should be within 6-20 characters. At least one uppercase, one lowercase, one number and a special character"
    ),

  body("confiremdPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("New password did not match");
    }
    return true;
  }),
];

const validateForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address"),
];

const validateResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is missing"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .withMessage(
      "Password should be within 6-20 characters. At least one uppercase, one lowercase, one number and a special character"
    ),
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateChangePassword,
  validateForgetPassword,
  validateResetPassword,
};
