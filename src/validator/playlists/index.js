const InvariantError = require("../../exceptions/InvariantError");
const {
  PlaylistPayloadSchema,
  AddSongToPlaylistPayloadSchema,
} = require("./schema");

const PlaylistsValidator = {
  validatePayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateAddSongToPlaylistPayload: (payload) => {
    const validationResult = AddSongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
