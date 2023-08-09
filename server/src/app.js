const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const xssCleam = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: "Too many request",
});

app.use(cookieParser());
app.use(rateLimiter);
app.use(xssCleam());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);

app.get("/test", rateLimiter, (req, res) => {
  res.status(200).send({
    message: "API is working",
  });
});

// // client err
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

// // server err all error find here
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
