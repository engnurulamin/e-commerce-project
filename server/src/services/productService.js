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

const get_all_products = async (page = 1, limit = 4, filter = {}) => {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ crratedAt: -1 });

  const count = await Product.find(filter).countDocuments();
  const totalPage = Math.ceil(count / limit);

  if (products == false) throw createError(404, "Products Not Found");
  return { products, count, totalPage };
};

const get_product = async (slug) => {
  const product = await Product.findOne({ slug }).populate("category");

  if (!product) throw createError(404, "Product not found");
  return product;
};

const delete_product = async (slug) => {
  const d_product = await Product.findOneAndDelete({ slug });

  if (!d_product) {
    throw createError(404, "Product not found");
  }

  return d_product;
};

const update_product = async (slug, update, image, updateOptions) => {
  if (update.name) {
    update.slug = slugify(update.name);
  }

  if (image) {
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "Image is too large. It must be less than 2 MB");
    }

    update.image = image.buffer.toString("base64");
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    update,
    updateOptions
  );

  if (!updatedProduct) {
    throw createError(404, "Product does not exist");
  }

  return updatedProduct;
};

module.exports = {
  create_product,
  get_all_products,
  get_product,
  delete_product,
  update_product,
};
