const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  userId: Joi.string(),
});

module.exports = userSchema;