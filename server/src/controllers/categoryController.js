const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const create_category = require("../services/categoryService");

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await create_category(name);

    return successResponse(res, {
      statusCode: 200,
      message: "Category was created successfully",
      payload: { newCategory },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCategory };
