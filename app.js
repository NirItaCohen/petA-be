const express = require('express');
const morgan = require('morgan');

const app = express();

const userRouter = require('./routes/userRoutes');
const petRouter = require('./routes/petRoutes');

// Middlewares
// Devlopment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// Routes
app.use('/users', userRouter);
app.use('/pets', petRouter);

module.exports = app;
