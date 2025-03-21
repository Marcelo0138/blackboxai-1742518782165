const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // MongoDB Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: errors
    });
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: 'Erro de duplicação',
      details: `${field} já está em uso`
    });
  }

  // JWT Authentication Error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }

  // JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado'
    });
  }

  // Mongoose Cast Error (Invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      details: `${err.value} não é um ID válido`
    });
  }

  // Multer File Upload Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'Arquivo muito grande',
      details: 'O tamanho máximo permitido é 5MB'
    });
  }

  // Custom API Error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Default Error
  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Custom Error Class for operational errors
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  APIError
};