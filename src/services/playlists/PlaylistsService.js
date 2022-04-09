const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const { mapDtoGetAllPlaylists } = require("../../dto/playlist");
const {
  mapDtoGetAllPlaylistActivities,
} = require("../../dto/playlist-activities");

const album = require("../../dto/album");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const auditDate = new Date();

    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, owner, auditDate, auditDate],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async addSongToPlaylist(playlistId, songId, owner) {
    await this.verifyNoteAccess(playlistId, owner);

    const querySong = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [songId],
    };
    const songs = await this._pool.query(querySong);

    if (this.validateResult(songs)) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    const queryPlaylist = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const playlists = await this._pool.query(queryPlaylist);

    if (this.validateResult(playlists)) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const auditDate = new Date();

    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, playlistId, songId, auditDate, auditDate],
    };

    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    await this.addActivities(playlistId, songId, owner, "add");
  }

  async getPlaylists(owner) {
    const query = {
      text:
        "SELECT p.*,s.username FROM playlists p, users s WHERE p.owner = s.id AND s.id = $1 " +
        "UNION " +
        "SELECT p.*,u.username FROM playlists p, users u, collaborations c WHERE c.playlist_id = p.id AND p.owner = u.id AND c.user_id = $1",
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDtoGetAllPlaylists);
  }

  async getSongByPlaylist(playlistId, owner) {
    await this.verifyNoteAccess(playlistId, owner);

    const query = {
      text: "SELECT p.*,u.username FROM playlists p, users u WHERE p.owner = u.id AND p.id = $1",
      values: [playlistId],
    };
    const playlists = await this._pool.query(query);

    if (this.validateResult(playlists)) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = playlists.rows.map(mapDtoGetAllPlaylists)[0];

    const songs = await this._pool.query({
      text: "select s.* from playlist_songs ps, songs s where ps.song_id = s.id and ps.playlist_id = $1",
      values: [playlistId],
    });

    return {
      ...playlist,
      ...{ songs: songs.rows.map(album.mapDtoSong) },
    };
  }

  async getPlaylistById(id) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    const playlists = await this._pool.query(query);

    if (this.validateResult(playlists)) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = playlists.rows.map(mapDtoPlaylist)[0];

    return playlist.rows.map(mapDtoGetAllPlaylists);
  }

  async editPlaylistById(id, { name, year }) {
    const query = {
      text: "UPDATE playlists SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, new Date(), id],
    };

    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new NotFoundError("Gagal memperbarui playlist. Id tidak ditemukan");
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async deletePlaylistByPlaylistIdAndSong(playlistId, songId, userId) {
    await this.verifyNoteAccess(playlistId, userId);

    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (this.validateResult(result)) {
      throw new NotFoundError("Playlist gagal dihapus. Song tidak ditemukan");
    }

    await this.addActivities(playlistId, songId, userId, "delete");
  }

  async verifyNotOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async getPlaylistsActivities(playlistId, owner) {
    await this.verifyNotOwner(playlistId, owner);

    const query = {
      text: "SELECT pa.*, u.username, s.title FROM playlist_song_activities pa, users u, songs s WHERE pa.user_id = u.id AND pa.song_id = s.id AND pa.playlist_id = $1 AND u.id = $2",
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    return {
      playlistId: playlistId,
      activities: result.rows.map(mapDtoGetAllPlaylistActivities),
    };
  }

  async addActivities(playlistId, songId, userId, action) {
    const auditDate = new Date();

    const id = `pa-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        id,
        playlistId,
        songId,
        userId,
        action,
        auditDate,
        auditDate,
        auditDate,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Activities gagal ditambahkan");
    }

    return id;
  }

  async verifyNoteAccess(playlistId, userId) {
    try {
      await this.verifyNotOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      await this.verifyCollaborator(playlistId, userId);
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  validateResult(result) {
    return (
      !result || !result.rows || !result.rows.length || result.rows.length == 0
    );
  }
}

module.exports = PlaylistService;
