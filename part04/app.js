const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const Blog = require('./models/Blog');

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    })
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  };
  
  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});

module.exports = app;
