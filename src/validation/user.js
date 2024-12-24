import Joi from 'joi';
import { emailRegexp, genderList } from '../constants/user.js';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(0).max(32).messages({
    'string.max': 'Name should have at most {#limit} characters',
  }),
  email: Joi.string().email().pattern(emailRegexp).messages({
    'string.email': 'Email must be a valid email address',
    'string.pattern.base': 'Email does not match the required pattern',
    'string.empty': 'Email cannot be empty',
  }),
  old_password: Joi.string().min(8).max(64).messages({
    'string.min': 'Old password should have at least {#limit} characters',
    'string.max': 'Old password should have at most {#limit} characters',
    'string.empty': 'Old password cannot be empty',
  }),
  new_password: Joi.string().min(8).max(64).messages({
    'string.min': 'New password should have at least {#limit} characters',
    'string.max': 'New password should have at most {#limit} characters',
    'string.empty': 'New password cannot be empty',
  }),
  daily_norma: Joi.number().min(0).max(15000).messages({
    'string.min': 'Daily Norma should have at least {#limit} characters',
    'string.max': 'Daily Norma should have at most {#limit} characters',
  }),
  gender: Joi.string()
    .valid(...genderList)
    .messages({
      'any.only': `Gender must be one of the following: ${genderList.join(', ')}`,
    }),
});

export const updateWaterRateSchema = Joi.object({
  daily_norma: Joi.number().min(0).max(15000).messages({
    'string.min': 'Daily Norma should have at least {#limit} characters',
    'string.max': 'Daily Norma should have at most {#limit} characters',
  }),
});
