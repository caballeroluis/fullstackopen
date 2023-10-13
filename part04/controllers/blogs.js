const blogsRouter = require('express').Router()
const User = require('../models/User')
const Blog = require('../models/Blog')
require('dotenv').config();
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const token = request.token;

    if (!token) {
      return response.status(401).json({ error: 'Token missing' });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' });
    }

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: '' });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const token = request.token;

    if (!token) {
      return response.status(401).json({ error: 'Token missing' });
    }

    const blog = new Blog(request.body);
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const token = request.token;
    if (!token) {
      return response.status(401).json({ error: 'Token missing' });
    }
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
  
    const blogId = request.params.id;
    const blog = await Blog.findById(blogId);
    
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    
    if (decodedToken.id !== blog.user.toString()) {
      return response.status(401).json({ error: 'Not authorized to delete this blog' });
    }
  
    await Blog.findByIdAndRemove(blogId);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});


blogsRouter.put('/:id', async (request, response) => {
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

module.exports = blogsRouter