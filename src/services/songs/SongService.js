const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDtoSong } = require("../../dto/song");
const album = require("../../dto/album");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const auditDate = new Date();

    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        auditDate,
        auditDate,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs(params) {
    let result = [];
    if (params.title && params.performer) {
      const query = {
        text: "SELECT * FROM songs WHERE LOWER(title) like $1 and LOWER(performer) like $2",
        values: [
          `%${params.title.toLowerCase()}%`,
          `%${params.performer.toLowerCase()}%`,
        ],
      };
      result = await this._pool.query(query);
    } else if (params.title) {
      const query = {
        text: "SELECT * FROM songs WHERE LOWER(title) like $1 ",
        values: [`%${params.title.toLowerCase()}%`],
      };
      result = await this._pool.query(query);
    } else if (params.performer) {
      const query = {
        text: "SELECT * FROM songs WHERE LOWER(performer) like $1 ",
        values: [`%${params.performer.toLowerCase()}%`],
      };
      result = await this._pool.query(query);
    } else {
      result = await this._pool.query("SELECT * FROM songs");
    }
    return result.rows.map(album.mapDtoSong);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return result.rows.map(mapDtoSong)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        new Date(),
        id,
      ],
    };

    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
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

module.exports = SongService;
