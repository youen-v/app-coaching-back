class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Requête invalide') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Non autorisé') {
    super(message, 401);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(message, 404);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError
};
