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

describe('blog tests', () => {
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
      id: '6523c67ec572263022ffd38e',
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
      _id: '6523c67ec572263022ffd38e',
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

  test('400 Bad Request when missing title', async () => {
    const newBlogWithoutTitle = {
      id: '6523c67ec572263022ffd38e',
      author: 'Paco',
      url: 'https://example.com/4',
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('400 Bad Request when missing URL', async () => {
    const newBlogWithoutUrl = {
      id: '6523c67ec572263022ffd38e',
      title: 'A blog without URL',
      author: 'Paquito',
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
  })

  test('deleting a blog by ID', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
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
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await Blog.find({})
    const updatedBlogAfter = blogsAfter.find((blog) => blog.id === blogToUpdate.id)

    expect(updatedBlogAfter.likes).toBe(blogToUpdate.likes + updatedBlog.likesToIncrease)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})