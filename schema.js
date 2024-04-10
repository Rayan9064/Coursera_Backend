const Joi = require('joi');

module.exports.userSchema = Joi.object({
    name: Joi.string().required(),
	  email: Joi.string().required().email(),
    password: Joi.string().min(8).required()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9]).*$', ''))
    .messages({
      'string.pattern.base': 'must have at least one uppercase letter, one special character, and two numbers',
    }),
});

module.exports.courseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string(),
  instructors: Joi.array().required(),
  duration: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  level: Joi.string().required(),
  popularity: Joi.string().required(),
});

module.exports.validateLogin = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(8).required()
  .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9]).*$', ''))
  .messages({
    'string.pattern.base': 'must have at least one uppercase letter, one special character, and two numbers',
  }),
});

module.exports.validateUpdate = Joi.object({
  name: Joi.string().required(),
  newName: Joi.string().required(),
  email: Joi.string().required().email(),
  newEmail: Joi.string().email().required(),
  password: Joi.string().min(8).required()
  .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9].*[0-9]).*$', ''))
  .messages({
    'string.pattern.base': 'must have at least one uppercase letter, one special character, and two numbers',
  }),
});