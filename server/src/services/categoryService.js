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

const update_category = async (name, slug) => {
  let filter = { slug };
  let update = { $set: { name: name, slug: slugify(name) } };
  let option = { new: true };

  const updateCategory = await Category.findOneAndUpdate(
    filter,
    update,
    option
  );
  return updateCategory;
};

module.exports = {
  create_category,
  get_categories,
  get_category,
  update_category,
};
