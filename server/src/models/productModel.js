const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      Minlength: [3, "Min length at least 3 characters"],
      Maxlength: [150, "Max length can 150 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      lowercase: true,
      unique: true,
      Minlength: [3, "Min length at least 3 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => `${props.value} is not valid price!`,
      },
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => `${props.value} is not valid quantity!`,
      },
    },

    sold: {
      type: Number,
      required: [true, "Sold quantity is required"],
      default: 0,
      trim: true,
      // validate: {
      //   validator: (v) => v > 0,
      //   message: (props) => `${props.value} is not valid sold!`,
      // },
    },

    shipping: {
      type: Number,
      default: 0,
    },

    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Product Image  is required"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
