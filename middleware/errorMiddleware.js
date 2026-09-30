const { errorResponse } = require('../utils/response');

/**
 * Centralized Global Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => e.message);
  }

  // Handle Mongoose Duplicate Key Error (e.g. Unique Email)
  if (err.code && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${field} already exists.`;
  }

  // Handle Mongoose Invalid ObjectId CastError
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // Handle Syntax Error in JSON Body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  }

  return errorResponse(res, statusCode, message, errors);
};

module.exports = errorMiddleware;
