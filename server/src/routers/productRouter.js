const express = require("express");

const upload = require("../middleware/uploadFile");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const { createProduct } = require("../controllers/productController");

const productRouter = express.Router();

productRouter.post("/", upload.single("image"), createProduct);

module.exports = productRouter;
