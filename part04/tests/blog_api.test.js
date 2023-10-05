const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/Blog')
const listHelper = require('../utils/list_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(listHelper.blogs)
})

test('blogs are returned as json and the correct number of blogs', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(listHelper.blogs.length)
})

test('blogs have "id" property instead of "_id"', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
    expect(blog._id).toBeUndefined()
  })
})

test('creating a new blog post', async () => {
  const newBlog = {
    title: 'A random blog',
    author: 'Paquito',
    url: 'https://example.com/2',
    likes: 7,
  }

  const numberOfBlogsBefore = await Blog.find({}).countDocuments()

  const response = await api
    .post('/api/blogs')
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
    title: 'The blog that nobody likes',
    author: 'Bob',
    url: 'https://example.com/3',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const savedBlog = response.body
  expect(savedBlog.likes).toBe(0)
})


afterAll(async () => {
  await mongoose.connection.close()
})