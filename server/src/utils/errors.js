export class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('Unhandled Error:', err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};
