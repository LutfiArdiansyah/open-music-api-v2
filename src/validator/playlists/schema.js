const Joi = require("joi");

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
});

const AddSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().min(3).max(30).required(),
});

module.exports = { PlaylistPayloadSchema, AddSongToPlaylistPayloadSchema };
