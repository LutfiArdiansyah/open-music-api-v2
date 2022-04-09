require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

const Response = require("./src/utils/Response");

const albums = require("./src/api/albums");
const AlbumsService = require("./src/services/albums/AlbumsService");
const AlbumValidator = require("./src/validator/albums");

const songs = require("./src/api/songs");
const SongsService = require("./src/services/songs/SongService");
const SongValidator = require("./src/validator/songs");

const users = require("./src/api/users");
const UsersService = require("./src/services/users/UsersService");
const UsersValidator = require("./src/validator/users");

const authentications = require("./src/api/authentications");
const AuthenticationsService = require("./src/services/authentications/AuthenticationsService");
const TokenManager = require("./src/utils/TokenManager");
const AuthenticationsValidator = require("./src/validator/authentications");

const playlists = require("./src/api/playlists");
const PlaylistsService = require("./src/services/playlists/PlaylistsService");
const PlaylistsValidator = require("./src/validator/playlists");

const collaborations = require("./src/api/collaborations");
const CollaborationsService = require("./src/services/collaborations/CollaborationsService");
const CollaborationsValidator = require("./src/validator/collaborations");

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const collaborationsService = new CollaborationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(registerExternalPlugins());

  server.auth.strategy("om_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register(
    registerPlugins(
      usersService,
      authenticationsService,
      playlistsService,
      collaborationsService
    )
  );

  server.ext("onPreResponse", Response.errorHandler());

  await server.start();

  console.log(`Application running on port ${server.info.uri}`);
};

init();

function registerPlugins(
  usersService,
  authenticationsService,
  playlistsService,
  collaborationsService
) {
  return [
    {
      plugin: albums,
      options: {
        service: new AlbumsService(),
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongsService(),
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        tokenManager: TokenManager,
        validator: CollaborationsValidator,
      },
    },
  ];
}

function registerExternalPlugins() {
  return [
    {
      plugin: Jwt,
    },
  ];
}
