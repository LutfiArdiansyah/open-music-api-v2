const Response = require("../../utils/Response");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const id = await this._usersService.verifyUserCredential(request.payload);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(
      accessToken,
      refreshToken,
      id
    );

    return Response.post(h, "success", "Authentication berhasil ditambahkan", {
      accessToken,
      refreshToken,
    });
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    return Response.post(
      h,
      "success",
      "Authentication berhasil ditambahkan",
      {
        accessToken,
      },
      200
    );
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return Response.putOrDelete("success", "Refresh token berhasil dihapus");
  }
}

module.exports = AuthenticationsHandler;
