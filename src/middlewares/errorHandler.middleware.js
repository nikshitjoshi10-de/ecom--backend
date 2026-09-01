const apiError = require("../utils/apiError");


/**
 * Library errors (mongoose, jsonwebtoken, multer) arrive in THEIR shape.
 * Each translator is a tiny pure function that converts one of them into OURS.
 * A lookup list instead of an if/else ladder: adding a case is one entry.
 */
const translators = [
  {
    match: (e) => e.name === 'ValidationError' && e.errors,           // mongoose
    make: (e) => apiError(400, 'Validation failed', Object.values(e.errors).map((x) => x.message)),
  },
  {
    match: (e) => e.code === 11000,                                    // duplicate key
    make: (e) => apiError(409, `${Object.keys(e.keyValue ?? {})[0] ?? 'Field'} already exists`),
  },
  { match: (e) => e.name === 'CastError',         make: (e) => apiError(400, `Invalid ${e.path}`) },
  { match: (e) => e.name === 'JsonWebTokenError', make: () => apiError(401, 'Invalid token') },
  { match: (e) => e.name === 'TokenExpiredError', make: () => apiError(401, 'Token expired') },
  { match: (e) => e.code === 'LIMIT_FILE_SIZE',   make: () => apiError(400, 'File must be 2 MB or smaller') },
];

const normalise = (err) => {
  if (err?.isApiError) return err;
  const t = translators.find((x) => x.match(err));
  return t ? t.make(err) : apiError(err?.statusCode || 500, err?.message || 'Internal server error');
};

/**
 * THE single place where an error becomes an HTTP response.
 * Express recognises an error middleware by its 4 arguments.
 * It must be registered LAST in app.js.
 */
 const errorHandler = (err, _req, res, _next) => {
  const e = normalise(err);

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${e.statusCode}] ${e.message}`);
  }

  res.status(e.statusCode).json({
    success: false,
    statusCode: e.statusCode,
    message: e.message,
    errors: e.errors ?? [],
    // stack traces only in development - never leak them to real users
    ...(process.env.NODE_ENV === 'development' && { stack: err?.stack }),
  });
};

module.exports = errorHandler
