const express = require("express");

const upload = require("../middleware/uploadFile");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const { createProduct } = require("../controllers/productController");
const { validateProduct } = require("../validators/product");

const productRouter = express.Router();

productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidation,
  createProduct
);

module.exports = productRouter;
