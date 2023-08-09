const Category = require("../models/categoryModel");
const slugify = require("slugify");

const create_category = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });

  return newCategory;
};

module.exports = create_category;
