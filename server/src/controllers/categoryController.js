const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const slugify = require("slugify");
const {
  create_category,
  get_categories,
  get_category,
} = require("../services/categoryService");
const { find_by_id } = require("../services/find_by_id");

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

const getCategories = async (req, res, next) => {
  try {
    const categories = await get_categories();

    return successResponse(res, {
      statusCode: 200,
      message: "All categories return successfully",
      payload: { categories },
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await get_category(slug);

    return successResponse(res, {
      statusCode: 200,
      message: "Category return successfully",
      payload: { category },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCategory, getCategories, getCategory };
