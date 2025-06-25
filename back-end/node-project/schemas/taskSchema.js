const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.string().required(),
  userId: Joi.string(),
  status: Joi.string()
  .valid("CONCLUIDO", "EM_ANDAMENTO", "A_FAZER")
  .required()
});

module.exports = taskSchema;