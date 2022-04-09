const Joi = require("joi");

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  password: Joi.string().min(3).max(18).required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
