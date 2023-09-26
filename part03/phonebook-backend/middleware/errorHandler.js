const errorHandler = (error, _request, response, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).json({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
  
    response.status(500).json({ error: 'Internal Server Error' });

    next();
  };
  
module.exports = errorHandler;