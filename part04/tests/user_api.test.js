const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const User = require('../models/User')
const Blog = require('../models/Blog')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const api = supertest(app)

let registeredUser = new User()

beforeAll(async () => {
  registeredUser = {
    username: 'testuser',
    password: 'testpassword',
    name: 'Test User',
  }

  await User.deleteMany({})
  await User.insertMany(listHelper.users)
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.blogs)
})

describe('when there is initially one user in db', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if username format is invalid', async () => {
    const usersAtStart = await listHelper.usersInDb()
  
    const newUser = {
      username: 'ro!@#',
      name: 'Superuser',
      password: 'salainen',
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('Invalid username format')
  
    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  
  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await listHelper.usersInDb()
  
    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('Make sure that the username is at least 3 characters long')
  
    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
  
  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await listHelper.usersInDb()
  
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sa',
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('Make sure that the password is at least 3 characters long')
  
    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

describe('User Creation and Authentication', () => {
  test('Create a new user', async () => {
    const response = await api
      .post('/api/users')
      .send(registeredUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toBe(registeredUser.username)
  })

  test('Log in with a registered user', async () => {
    const response = await api
      .post('/api/login')
      .send(registeredUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('token')

    registeredUser = { ...registeredUser, ...response.body }
  })

  test('Attempt to log in with invalid credentials', async () => {
    const loginCredentials = {
      username: 'nonexistentuser',
      password: 'wrongpassword',
    }

    await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Fetching blogs with authenticated user token', () => {
  test('Failed attempt to fetch blogs without a token', async () => {
    await api.get('/api/blogs').expect(401)
  })
  
  test('Failed attempt to post blogs without a token', async () => {
    await api
      .post('/api/blogs')
      .send({})
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('blog tests', () => {
  test('blogs are returned as json and the correct number of blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(listHelper.blogs.length)
  })

  test('blogs have "id" property instead of "_id"', async () => {
    const response = await api.get('/api/blogs')
      .set('Authorization', `Bearer ${registeredUser.token}`)

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
    })
  })

  test('creating a new blog post', async () => {
    const newBlog = {
      title: 'A random blog 2',
      author: 'Paquito',
      url: 'https://example.com/2',
      likes: 7,
    }

    const numberOfBlogsBefore = await Blog.find({}).countDocuments()

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const numberOfBlogsAfter = await Blog.find({}).countDocuments()
    expect(numberOfBlogsAfter).toBe(numberOfBlogsBefore + 1)

    const savedBlog = response.body
    expect(savedBlog.title).toBe(newBlog.title)
    expect(savedBlog.author).toBe(newBlog.author)
    expect(savedBlog.url).toBe(newBlog.url)
    expect(savedBlog.likes).toBe(newBlog.likes)
  })

  test('the "Like" property is 0 by default', async () => {
    const newBlogWithoutLikes = {
      _id: '652426b08766f89bf121a767',
      title: 'The blog that nobody likes',
      author: 'Bob',
      url: 'https://example.com/3',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = response.body
    expect(savedBlog.likes).toBe(0)
  })

  test('400 Bad Request when missing title', async () => {
    const newBlogWithoutTitle = {
      id: '652426bf8766f89bf121a76c',
      author: 'Paco',
      url: 'https://example.com/4',
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('400 Bad Request when missing URL', async () => {
    const newBlogWithoutUrl = {
      id: '652426da6991d13bb68455cb',
      title: 'A blog without URL',
      author: 'Paquito',
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .send(newBlogWithoutUrl)
      .expect(400)
  })

  test('deleting a blog by ID', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('update likes of the last blog', async () => {
    const blogsBefore = await Blog.find({})
    const blogToUpdate = blogsBefore[blogsBefore.length - 1]

    const updatedBlog = {
      likesToIncrease: 5,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await Blog.find({})
    const updatedBlogAfter = blogsAfter.find((blog) => blog.id === blogToUpdate.id)

    expect(updatedBlogAfter.likes).toBe(blogToUpdate.likes + updatedBlog.likesToIncrease)
  })

  test('authenticated user creates a blog and becomes its owner', async () => {
    const newBlog = {
      title: 'A random blog',
      author: 'Paquito',
      url: 'https://example.com/5',
      likes: 5,
    }
  
    const createBlogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blog = await Blog.findById(createBlogResponse.body.id)
  
    const user = await User.findOne({ username: registeredUser.username })
  
    expect(blog.user.toString()).toBe(user.id)
  })
})

describe('Deleting a user\'s own blog', () => {
  test('succeeds with status 204 if the user is the owner of the blog', async () => {
    const user = await User.findOne({ username: registeredUser.username })
    const newBlog = new Blog({
      title: 'Deleting? yeah, its My Blog',
      author: 'Test User',
      url: 'https://example.com/myblog',
      user: user._id,
    })

    await newBlog.save()

    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart.find(blog => blog.user.toString() === user._id.toString())

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status 401 if the user is not the owner of the blog', async () => {
    const user = await User.findOne({ username: registeredUser.username })
    const anotherUser = listHelper.users[0]

    const newBlog = new Blog({
      title: 'Deleting? Not My Blog',
      author: 'Another User',
      url: 'https://example.com/notmyblog',
      user: anotherUser._id,
    })

    await newBlog.save()

    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart.find(blog => blog.user.toString() === anotherUser._id.toString())

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${registeredUser.token}`)
      .expect(401)
  })
})


afterAll(async () => {
  await mongoose.connection.close()
})