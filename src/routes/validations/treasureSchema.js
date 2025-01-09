import Joi from 'joi';

export const treasureSchema = Joi.object({
    latitude: Joi.number()
      .required()
      .messages({
        'any.required': 'Latitude is required.',
        'number.base': 'Latitude must be a valid number.',
      }),
    
    longitude: Joi.number()
      .required()
      .messages({
        'any.required': 'Longitude is required.',
        'number.base': 'Longitude must be a valid number.',
      }),
    
    distance: Joi.number()
      .valid(1, 10)
      .required()
      .messages({
        'any.required': 'Distance is required.',
        'number.base': 'Distance must be a valid number.',
        'any.only': 'Distance must be either 1 or 10 kilometers.',
      }),
    
    prizeValue: Joi.number()
      .integer()
      .min(10)
      .max(30)
      .optional()
      .messages({
        'number.base': 'Prize value must be a valid number.',
        'number.integer': 'Prize value must be a whole number.',
        'number.min': 'Prize value must be at least $10.',
        'number.max': 'Prize value must not exceed $30.',
      }),
});