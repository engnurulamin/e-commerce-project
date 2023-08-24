const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helpers/jasonwt");
const Product = require("../models/productModel");
const slugify = require("slugify");
const { create_product } = require("../services/productService");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;
    const image = req.file;

    if (!image) {
      throw createError(400, "Image is required");
    }

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "Image is too large. It must be less than 2 MB");
    }
    const imageBufferString = image.buffer.toString("base64");

    const productData = {
      name,
      description,
      price,
      quantity,
      shipping,
      imageBufferString,
      category,
    };

    const product = await create_product(productData);

    return successResponse(res, {
      statusCode: 200,
      message: "Product was added successfully",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct };
