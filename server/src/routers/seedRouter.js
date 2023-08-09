const express = require("express");
const upload = require("../middleware/uploadFile");
const { seedUser } = require("../controllers/seedController");

const seedRouter = express.Router();

seedRouter.get("/users", upload.single("image"), seedUser);

module.exports = seedRouter;
