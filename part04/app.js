const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./middleware/middleware');

const app = express();

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);

module.exports = app;
