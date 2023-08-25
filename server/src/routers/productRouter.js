const express = require("express");

const upload = require("../middleware/uploadFile");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const {
  createProduct,
  getAllProgucts,
  getProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");

const productRouter = express.Router();

productRouter.post(
  "/",
  upload.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  createProduct
);

productRouter.get("/", getAllProgucts);
productRouter.get("/:slug", getProduct);

module.exports = productRouter;
