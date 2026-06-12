const Joi = require("joi");

const urlValidator = Joi.object({
  originalUrl: Joi.string().uri().required(),
}).messages({
  "string.uri": "Please provide a valid URL starting with http:// or https://",
  "any.required": "{{#label}} is required",
  "string.empty": "{{#label}} should not be empty",
});

module.exports = urlValidator;