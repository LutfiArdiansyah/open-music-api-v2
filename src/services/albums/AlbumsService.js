const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDtoAlbum, mapDtoSong } = require("../../dto/album");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const auditDate = new Date();

    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, auditDate, auditDate],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");
    return result.rows.map(mapDtoAlbum);
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    const albums = await this._pool.query(query);

    if (this.validateResult(albums)) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = albums.rows.map(mapDtoAlbum)[0];

    const songs = await this._pool.query({
      text: "SELECT * FROM songs WHERE album_id = $1",
      values: [album.id],
    });

    return {
      ...album,
      ...{ songs: songs.rows.map(mapDtoSong) },
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, new Date(), id],
    };

    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
    }
  }

  validateResult(result) {
    return (
      !result || !result.rows || !result.rows.length || result.rows.length == 0
    );
  }
}

module.exports = AlbumService;
