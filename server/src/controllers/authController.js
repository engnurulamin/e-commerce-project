const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createJsonWebToken } = require("../helpers/jasonwt");
const {
  jwtActivationKey,
  client_url,
  jwtAccessKey,
  jwtRefreshKey,
} = require("../secret");
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} = require("../helpers/cookie");

const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User does not exist. Please register");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email/Password did not match");
    }

    if (user.isBanned) {
      throw createError(
        403,
        "Your account is banned. Please contact with authority"
      );
    }
    const userWithouitPassword = user.toObject();
    delete userWithouitPassword.password;

    const accessToken = createJsonWebToken({ user }, jwtAccessKey, "5m");

    setAccessTokenCookie(res, accessToken);
    // res.cookie("accessToken", accessToken, {
    //   maxAge: 5 * 60 * 1000,
    //   httpOnly: true,
    //   // secure: true,
    //   sameSite: "none",
    // });

    const refreshToken = createJsonWebToken({ user }, jwtRefreshKey, "7d");

    setRefreshTokenCookie(res, refreshToken);
    // res.cookie("refreshToken", refreshToken, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    // });

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully",
      payload: { userWithouitPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

    if (!decodedToken) {
      throw createError(401, "Invalid refresh token");
    }

    const accessToken = createJsonWebToken(
      decodedToken.user,
      jwtAccessKey,
      "5m"
    );
    setAccessTokenCookie(res, accessToken);
    // res.cookie("accessToken", accessToken, {
    //   maxAge: 5 * 60 * 1000,
    //   httpOnly: true,
    //   // secure: true,
    //   sameSite: "none",
    // });
    return successResponse(res, {
      statusCode: 200,
      message: "New access token is generated",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleProtected = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Protected resources accessed successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtected,
};
