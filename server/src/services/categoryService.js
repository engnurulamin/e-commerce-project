const Category = require("../models/categoryModel");
const slugify = require("slugify");

const create_category = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });

  return newCategory;
};

const get_categories = async () => {
  return await Category.find({}).select("name slug").lean();
};

const get_category = async (slug) => {
  return await Category.find({ slug }).select("name slug").lean();
};

module.exports = { create_category, get_categories, get_category };
