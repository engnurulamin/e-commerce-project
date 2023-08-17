const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { find_by_id } = require("../services/find_by_id");
const { deleteImage } = require("../helpers/deleteImage");
const { createJsonWebToken } = require("../helpers/jasonwt");
const {
  jwtActivationKey,
  client_url,
  jwtResetPasswordKey,
} = require("../secret");
const emailWithNodeMailer = require("../helpers/email");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userExist = require("../helpers/userExist");
const sendEmail = require("../helpers/sendEmail");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".* ", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "Users Not Found");

    return successResponse(res, {
      statusCode: 200,
      message: "All users return successfully",
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 < Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await find_by_id(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User return successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    await find_by_id(User, id, options);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const image = req.file;

    if (!image) {
      throw createError(400, "Image is required");
    }

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "Image is too large. It must be less than 2 MB");
    }
    const imageBufferString = image.buffer.toString("base64");

    const userExist = await User.userExist(email);
    if (userExist) {
      throw createError(409, "User already exists");
    }

    const token = createJsonWebToken(
      { name, email, password, phone, address, image: imageBufferString },
      jwtActivationKey,
      "10m"
    );

    const emailData = {
      email,
      subject: "Account activation mail",
      html: `
    <h2>Hello ${name} ! </h2>
    <p>Please click here <a href="${client_url}/api/users/activate/${token}" target=""_blank>Active your account </a> </p>`,
    };

    sendEmail(emailData);
    // try {
    //   await emailWithNodeMailer(emailData);
    // } catch (error) {
    //   next(createError(500, "Failed to send varification email"));
    //   return;
    // }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to complete regestration process`,
    });
  } catch (error) {
    next(error);
  }
};

const userAccountActivation = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token was not found");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, "Unable to verify user");
      // warn start
      const userExist = await User.exists({ email: decoded.email });

      if (userExist) {
        throw createError(409, "User already exists");
      }
      // warn end
      await User.create(decoded);
      return successResponse(res, {
        statusCode: 201,
        message: "User was registered successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

const UpdateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    // const options = { password: 0 };
    // updatedOptions will pass in built-in findByIdAndUpdate()
    const options = { new: true, runValidators: true, context: "query" };
    await find_by_id(User, id, options);

    let update = {};
    const allowed_fields = ["name", "password", "address", "phone"];
    for (let key in req.body) {
      if (allowed_fields.includes(key)) {
        update[key] = req.body[key];
      } else if (key === "email") {
        throw createError(400, "Email can't be updated");
      }
    }
    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "Image is too large. It must be less than 2 MB");
      }

      update.image = image.buffer.toString("base64");
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      update,
      options
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User does not exist");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User has updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const banUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await find_by_id(User, id);
    const update = { isBanned: true };
    const updatedOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      update,
      updatedOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User was not banned");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User has banned successfully",
    });
  } catch (error) {
    next(error);
  }
};

const unbanUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await find_by_id(User, id);
    const update = { isBanned: false };
    const updatedOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      update,
      updatedOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User was not unbanned");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User has unbanned successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const user = await find_by_id(User, id);

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, "Password did not match!!");
    }

    const update = { $set: { password: newPassword } };
    const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      update,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "Unabel to cahnage password ");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password has been changed successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    console.log("Email is: ", userData);
    if (!userData) {
      throw createError(
        404,
        "Email is incorrect. Please enter the registered email"
      );
    }

    const token = createJsonWebToken({ email }, jwtResetPasswordKey, "15m");
    console.log(token);
    const emailData = {
      email,
      subject: "Reset password mail",
      html: `
      <h2>Hello ${userData.name} ! </h2>
      <p>Please click here <a href="${client_url}/api/users/reser-password/${token}" target=""_blank>Reset your password </a> </p>`,
    };

    sendEmail(emailData);
    // try {
    //   await emailWithNodeMailer(emailData);
    // } catch (error) {
    //   next(createError(500, "Failed to send reset password email"));
    //   return;
    // }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to complete reset password process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, jwtResetPasswordKey);

    if (!decoded) {
      throw createError(400, "Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "Fail to reset password");
    }
    return successResponse(res, {
      statusCode: 200,
      message: `Password reset successfully`,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getUsers,
  getUser,
  deleteUser,
  UpdateUser,
  processRegister,
  userAccountActivation,
  banUser,
  unbanUser,
  updatePassword,
  forgetPassword,
  resetPassword,
};
