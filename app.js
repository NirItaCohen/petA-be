const express = require("express");
const morgan = require("morgan");

const app = express();

const userRouter = require("./routes/userRoutes");
const petRouter = require("./routes/petRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/errorHandler");

// Middlewares
// Devlopment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());

// Routes
app.use("/users", userRouter);
app.use("/pets", petRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${(req, originalUrl)} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
