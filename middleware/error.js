const ErrorResponse = require('../utils/error_response');

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // copy err 

  error.message = err.message;
  // Log to Console for dev
  console.log(err);
  
  // Mongoose bad object id
  if (err.name === 'CastError') {
    const message = `Bootcamp Not Found With Id of ${err.value}`;
    error = new ErrorResponse(message, 404); // new error response for cast error
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    // error = new ErrorResponse(err.message.split('{')[1].split('"')[1]+ ' name already exists', 400);
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorResponse(message, 400);
  }
    
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;