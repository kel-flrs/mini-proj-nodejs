import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required.',
    }),
});
