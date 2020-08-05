const errorHandler = (err, req, res, next) => {
  // Log to Console for dev
  console.log(err.stack.red);
    
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

module.exports = errorHandler;