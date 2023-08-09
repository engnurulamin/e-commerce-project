const express = require("express");
const upload = require("../middleware/uploadFile");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const {
  createCategory,
  getCategories,
  getCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");

const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  createCategory
);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategory);

module.exports = categoryRouter;
