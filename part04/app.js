const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const usersRouter = require('./controllers/users');
const bcrypt = require('bcrypt');

const app = express();

const Blog = require('./models/Blog');

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);

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

app.delete('/api/blogs/:id', async (request, response) => {
  const blogId = request.params.id;

  try {
    await Blog.findByIdAndRemove(blogId);
    response.status(204).end();
  } catch (error) {
    response.status(404).json({ error: 'Blog not found' });
  }
});

app.put('/api/blogs/:id', async (request, response) => {
  const { id } = request.params;
  const { likesToIncrease } = request.body;

  try {
    const blogToUpdate = await Blog.findById(id);
    if (!blogToUpdate) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    blogToUpdate.likes += likesToIncrease;
    const updatedBlog = await blogToUpdate.save();

    response.status(200).json(updatedBlog.toJSON());
  } catch (error) {
    response.status(400).json({ error: 'Invalid blog id' });
  }
});

module.exports = app;
