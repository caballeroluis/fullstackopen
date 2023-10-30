const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1, author: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const usernameRegex = /^[a-zA-Z0-9_-]{3,40}$/
  
  if (username.length < 3) {
    return response.status(400).json({ error: 'Make sure that the username is at least 3 characters long' })
  }

  if (!usernameRegex.test(username)) {
    return response.status(400).json({ error: 'Invalid username format' })
  }

  if (password.length < 3) {
    return response.status(400).json({ error: 'Make sure that the password is at least 3 characters long' })
  }

  const existingUser = await User.findOne({ username })

  if (existingUser) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    password: passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter