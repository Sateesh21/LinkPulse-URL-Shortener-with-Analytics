const Joi = require("joi");

const registerValidation = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).messages({
  "string.min": "{{#label}} must be at least {{#limit}} characters",
  "any.required": "{{#label}} is required",
  "string.empty": "{{#label}} should not be empty",
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).messages({
  "string.email": "Please Provide a valid email address",
  "any.required": "{{#label}} required",
  "string.empty": "{{#label}} should not be empty",
});

const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
}).messages({
  "any.required": "{{#label}} required",
  "string.empty": "{{#label}} should not be empty",
});

const forgetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
}).messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required",
  "string.empty": "Email should not be empty",
});

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgetPasswordValidation,
};
