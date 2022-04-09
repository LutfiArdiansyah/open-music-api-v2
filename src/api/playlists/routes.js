const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "POST",
    path: "/playlists/{playlistId}/songs",
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistHandler,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}",
    handler: handler.getPlaylistByIdHandler,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{playlistId}/songs",
    handler: handler.getSongByPlaylist,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{playlistId}/activities",
    handler: handler.getActivities,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "PUT",
    path: "/playlists/{id}",
    handler: handler.putPlaylistByIdHandler,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: "om_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{playlistId}/songs",
    handler: handler.deleteSongByPlaylist,
    options: {
      auth: "om_jwt",
    },
  },
];

module.exports = routes;
