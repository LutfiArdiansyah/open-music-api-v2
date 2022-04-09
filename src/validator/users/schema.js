const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(4).max(32).required(),
  password: Joi.string().min(4).max(18).required(),
  fullname: Joi.string().min(3).max(50).required(),
});

module.exports = { UserPayloadSchema };
