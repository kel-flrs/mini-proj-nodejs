const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle Joi validation errors
    if (err.isJoi) {
      return res.status(400).json({
        error: 'Validation error',
        details: err.details.map((detail) => ({
          message: detail.message,
          path: detail.path.join('.'),
        })),
      });
    }

    if (err.invalidCredentials) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: err.message,
      });
    }
  
    // Handle database-related errors
    if (err.sqlMessage) {
      console.error('Database error:', err.message);
      return res.status(500).json({
        error: 'Database Error',
        message: 'An unexpected error occurred. Please try again later.', // Generic message
      });
    }
  
    // Generic error handler
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
};
  
export default errorHandler;
  