const Joi = require("joi");

const SongPayloadSchema = Joi.object({
  title: Joi.string().max(100).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  genre: Joi.string().max(100).required(),
  performer: Joi.string().max(100).required(),
  duration: Joi.number(),
  albumId: Joi.string().max(30),
});

module.exports = { SongPayloadSchema };
