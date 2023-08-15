const express = require("express");
const upload = require("../middleware/uploadFile");
const { seedUser, seedProducts } = require("../controllers/seedController");

const seedRouter = express.Router();

seedRouter.get("/users", upload.single("image"), seedUser);
seedRouter.get("/products", upload.single("image"), seedProducts);

module.exports = seedRouter;
