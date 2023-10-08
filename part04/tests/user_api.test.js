const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const User = require('../models/User')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(listHelper.users)
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

afterAll(async () => {
  await mongoose.connection.close()
})