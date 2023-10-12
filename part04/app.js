const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const jwt = require('jsonwebtoken');

const app = express();

const Blog = require('./models/Blog');

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

app.get('/api/blogs', async (request, response, next) => {
  try {
    const token = getTokenFrom(request);

    if (!token) {
      return response.status(401).json({ error: 'Token missing' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' });
    }

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: '' });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

app.post('/api/blogs', async (request, response, next) => {
  try {
    const blog = new Blog(request.body);

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    
    const user = await User.findById(decodedToken.id);

    if (!request.body.title || !request.body.url) {
      return response.status(400).json({ error: 'Title and URL are required' });
    }

    blog.user = user.id;

    const result = await blog.save();
    user.blogs = user.blogs.concat(result.id);
    await user.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
  };
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
