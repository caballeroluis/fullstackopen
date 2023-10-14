const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const middlewareTokenExtractor = require('./middleware/middlewareTokenExtractor');
const middlewareUserExtractor = require('./middleware/middlewareUserExtractor');

const app = express();

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(middlewareTokenExtractor.tokenExtractor);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', middlewareUserExtractor.userExtractor, blogsRouter);

module.exports = app;
