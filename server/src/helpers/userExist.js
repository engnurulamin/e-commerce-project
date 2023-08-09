const User = require("../models/userModel");

const userExist = async (email) => {
  return await User.exists({ email: email });
};

module.exports = userExist;
