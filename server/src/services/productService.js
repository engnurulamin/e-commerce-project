const Product = require("../models/productModel");
const slugify = require("slugify");
const createError = require("http-errors");

const create_product = async (productData) => {
  const {
    name,
    description,
    price,
    quantity,
    shipping,
    imageBufferString,
    category,
  } = productData;

  const productExist = await Product.exists({ name: name });

  if (productExist) {
    throw createError(409, "This product is already existed");
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

  return product;
};

const get_all_products = async (page = 1, limit = 4) => {
  const products = await Product.find({})
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ crratedAt: -1 });

  if (!products) {
    throw createError(404, "Products not found !");
  }
  const count = await Product.find({}).countDocuments();
  const totalPage = Math.ceil(count / limit);

  return { products, count, totalPage };
};

const get_product = async (slug) => {
  return Product.findOne({ slug }).populate("category");
};

module.exports = {
  create_product,
  get_all_products,
  get_product,
};
