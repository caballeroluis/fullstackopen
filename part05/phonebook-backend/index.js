const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const errorHandler = require('./middleware/errorHandler');

const server = http.createServer(app)
app.use(errorHandler);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})