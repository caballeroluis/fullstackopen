const jwt = require('jsonwebtoken')
require('dotenv').config()

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = decodedToken
  }

  next()
}

module.exports = {
  userExtractor
}
