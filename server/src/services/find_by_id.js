const createError = require("http-errors");
const mongoose = require("mongoose");

const find_by_id = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);

    if (!item) throw createError(404, `${Model.modelName} does not exist`);

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid ID");
    }

    throw error;
  }
};

module.exports = { find_by_id };
