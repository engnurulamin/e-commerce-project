const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { createJsonWebToken } = require("../helpers/jasonwt");
const Product = require("../models/productModel");
const slugify = require("slugify");
const {
  create_product,
  get_all_products,
  get_product,
  delete_product,
  update_product,
} = require("../services/productService");

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

const getAllProgucts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 4);

    const data = await get_all_products(page, limit);

    return successResponse(res, {
      statusCode: 200,
      message: "All products return successfully",
      payload: {
        products: data.products,
        pagination: {
          totalPage: data.totalPage,
          currentPage: page,
          previusPage: page - 1,
          nextPage: page + 1,
          totalProducts: data.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const data = await get_product(slug);

    return successResponse(res, {
      statusCode: 200,
      message: "Product returned successfully",
      payload: { data },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    await delete_product(slug);

    return successResponse(res, {
      statusCode: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const image = req.file;
    const updateOptions = { new: true, runValidators: true, context: "query" };

    let update = {};
    const allowed_fields = [
      "name",
      "description",
      "price",
      "quantity",
      "sold",
      "shipping",
    ];

    for (let key in req.body) {
      if (allowed_fields.includes(key)) {
        update[key] = req.body[key];
      }
    }

    const data = await update_product(slug, update, image, updateOptions);

    return successResponse(res, {
      statusCode: 200,
      message: "Product has updated successfully",
      payload: { data },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProgucts,
  getProduct,
  deleteProduct,
  updateProduct,
};
