require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const corsOptions = require('./utils/corsOptions');
const loginRouter = require('./controllers/login');
const cloudinaryRouter = require('./controllers/cloudinary');
const imageRouter = require('./controllers/image');
const imageOrderRouter = require('./controllers/imageOrder');
const userRouter = require('./controllers/user');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors(corsOptions));
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/cloudinary', cloudinaryRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/imageOrder', imageOrderRouter);
app.use(middleware.tokenExtractor);
app.use('/images', middleware.userExtractor, imageRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
