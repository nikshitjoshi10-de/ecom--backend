
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

 
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
  }
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id';
  }
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  console.error(err.message);

  res.status(statusCode).json({ success: false, message });
};

module.exports=errorHandler;