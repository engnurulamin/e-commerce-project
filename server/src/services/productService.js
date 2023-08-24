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

module.exports = {
  create_product,
};
