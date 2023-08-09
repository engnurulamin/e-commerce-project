const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw createError(401, "Access token not found, Please login");
    }
    const decoded = jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "Invalid access token, Please login again");
    }

    req.user = decoded.user;
    return next();
    // ... Rest of the middleware logic ...
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (token) {
      throw createError(400, "User is already logged in");
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw createError(403, "Forbidden. Only admin can access");
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
module.exports = { isLoggedIn, isLoggedOut, isAdmin };
