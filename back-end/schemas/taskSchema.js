const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  userId: Joi.string().required(),
  date: Joi.string().required(),
});

module.exports = taskSchema;