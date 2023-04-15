class GenericError extends Error {
  constructor(message, type = "GenericError", statusCode = 500) {
    super();
    this.message = message;
    this.name = type;
    this.statusCode = statusCode;
  }
}

module.exports = class AuthenticationError extends GenericError {
  constructor(message) {
    super(message, "AuthenticationError", 401);
  }
};

module.exports = class AccessDeniedError extends GenericError {
  constructor(message) {
    super(message, "AccessDeniedError", 403);
  }
};

module.exports = class FailedLoginError extends GenericError {
  constructor(message) {
    super(message, "FailedLoginError", 400);
  }
};

module.exports = class ExistingUserError extends GenericError {
  constructor(message) {
    super(message, "ExistingUserError", 400);
  }
};
