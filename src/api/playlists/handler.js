const Response = require("../../utils/Response");

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.getSongByPlaylist = this.getSongByPlaylist.bind(this);
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
    this.putPlaylistByIdHandler = this.putPlaylistByIdHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.deleteSongByPlaylist = this.deleteSongByPlaylist.bind(this);
    this.getActivities = this.getActivities.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePayload(request.payload);

    return Response.post(h, "success", "Playlist berhasil ditambahkan", {
      playlistId: await this._service.addPlaylist({
        name: request.payload.name,
        owner: request.auth.credentials.id,
      }),
    });
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateAddSongToPlaylistPayload(request.payload);

    await this._service.addSongToPlaylist(
      request.params.playlistId,
      request.payload.songId,
      request.auth.credentials.id
    );

    return Response.put(h, "success", "Playlist berhasil diperbarui");
  }

  async getSongByPlaylist(request) {
    return Response.get("success", {
      playlist: await this._service.getSongByPlaylist(
        request.params.playlistId,
        request.auth.credentials.id
      ),
    });
  }

  async getPlaylistHandler(request) {
    return Response.get("success", {
      playlists: await this._service.getPlaylists(request.auth.credentials.id),
    });
  }

  async getPlaylistByIdHandler(request, h) {
    return Response.get("success", {
      playlist: await this._service.getPlaylistById(request.params.id),
    });
  }

  async getActivities(request) {
    return Response.get(
      "success",
      await this._service.getPlaylistsActivities(
        request.params.playlistId,
        request.auth.credentials.id
      )
    );
  }

  async putPlaylistByIdHandler(request, h) {
    this._validator.validatePayload(request.payload);

    await this._service.editPlaylistById(request.params.id, request.payload);

    return Response.putOrDelete("success", "Playlist berhasil diperbarui");
  }

  async deletePlaylistByIdHandler(request, h) {
    await this._service.verifyNotOwner(
      request.params.id,
      request.auth.credentials.id
    );

    await this._service.deletePlaylistById(request.params.id);

    return Response.putOrDelete("success", "Playlist berhasil dihapus");
  }

  async deleteSongByPlaylist(request) {
    this._validator.validateAddSongToPlaylistPayload(request.payload);

    await this._service.deletePlaylistByPlaylistIdAndSong(
      request.params.playlistId,
      request.payload.songId,
      request.auth.credentials.id
    );

    return Response.putOrDelete("success", "Playlist berhasil dihapus");
  }
}

module.exports = PlaylistHandler;
