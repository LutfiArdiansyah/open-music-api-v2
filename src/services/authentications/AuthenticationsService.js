const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(accessToken, refreshToken, id) {
    const query = {
      text: "UPDATE users SET access_token = $1, refresh_token = $2 WHERE id = $3",
      values: [accessToken, refreshToken, id],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: "SELECT refresh_token FROM users WHERE refresh_token = $1",
      values: [refreshToken],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(refreshToken) {
    await this.verifyRefreshToken(refreshToken);

    const query = {
      text: "UPDATE users set access_token = null, refresh_token = null WHERE refresh_token = $1",
      values: [refreshToken],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
