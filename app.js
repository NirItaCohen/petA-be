const express = require("express");
const morgan = require("morgan");

const app = express();

const userRouter = require("./routes/userRoutes");
const petRouter = require("./routes/petRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/errorHandler");
const cookieParser = require("cookie-parser");

// Middlewares
// Devlopment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Body parser
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/users", userRouter);
app.use("/pets", petRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${(req, originalUrl)} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
