const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helpers/jasonwt");
const Product = require("../models/productModel");
const slugify = require("slugify");

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
    const productExist = await Product.exists({ name: name });

    if (productExist) {
      throw createError(409, "This product already exists");
    }

    const product = await Product.create({
      name: name,
      slug: slugify(name),
      description: description,
      price: price,
      quantity: quantity,
      shipping: shipping,
      image: imageBufferString,
      category: category,
    });

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