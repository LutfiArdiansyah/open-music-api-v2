const Response = require("../../utils/Response");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validatePayload(request.payload);

    return Response.post(h, "success", "Song berhasil ditambahkan", {
      songId: await this._service.addSong(request.payload),
    });
  }

  async getSongHandler(request) {
    return Response.get("success", {
      songs: await this._service.getSongs(request.query),
    });
  }

  async getSongByIdHandler(request, h) {
    return Response.get("success", {
      song: await this._service.getSongById(request.params.id),
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validatePayload(request.payload);

    await this._service.editSongById(request.params.id, request.payload);

    return Response.putOrDelete("success", "Song berhasil diperbarui");
  }

  async deleteSongByIdHandler(request, h) {
    await this._service.deleteSongById(request.params.id);

    return Response.putOrDelete("success", "Song berhasil dihapus");
  }
}

module.exports = SongHandler;
