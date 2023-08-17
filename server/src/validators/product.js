const { body } = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name must be within 3-150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters"),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category").trim().notEmpty().withMessage("Product name is required"),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive number"),
];

module.exports = {
  validateProduct,
};
