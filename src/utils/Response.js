const ClientError = require("../exceptions/ClientError");
const NotFoundError = require("../exceptions/NotFoundError");
const InvariantError = require("../exceptions/InvariantError");
const AuthenticationError = require("../exceptions/AuthenticationError");
const AuthorizationError = require("../exceptions/AuthorizationError");

class Response {
  post(h, status, message, data, statusCode) {
    return h.response({ status, message, data }).code(statusCode || 201);
  }

  get(status, data) {
    return { status, data };
  }

  putOrDelete(status, message) {
    return { status, message };
  }

  put(h, status, message, statusCode) {
    return h.response({ status, message }).code(statusCode || 201);
  }

  error(h, status, message, code) {
    return h.response({ status, message }).code(code);
  }

  errorHandler() {
    return (request, h) => {
      const { response } = request;

      if (response instanceof ClientError) {
        return this.error(
          h,
          "fail",
          response.message,
          response.statusCode | 400
        );
      }

      if (response instanceof NotFoundError) {
        return this.error(
          h,
          "fail",
          response.message,
          response.statusCode | 400
        );
      }

      if (response instanceof AuthenticationError) {
        return this.error(
          h,
          "fail",
          response.message,
          response.statusCode | 401
        );
      }

      if (response instanceof AuthorizationError) {
        return this.error(
          h,
          "fail",
          response.message,
          response.statusCode | 403
        );
      }

      if (response instanceof InvariantError) {
        return this.error(
          h,
          "error",
          "Maaf, terjadi kegagalan pada server kami.",
          500
        );
      }

      return response.continue || response;
    };
  }
}

module.exports = new Response();
