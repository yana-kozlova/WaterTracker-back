import Joi from 'joi';
import { emailRegexp, genderList } from '../constants/user.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().max(32).required().messages({
    'any.required': 'Name is required',
    'string.max': 'Name should have at most {#limit} characters',
    'string.empty': 'Name cannot be empty',
  }),
  email: Joi.string().email().pattern(emailRegexp).required().messages({
    'string.email': 'Email must be a valid email address',
    'string.pattern.base': 'Email does not match the required pattern',
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
  }),
  password: Joi.string().min(8).max(64).required().messages({
    'any.required': 'Password is required',
    'string.min': 'Password should have at least {#limit} characters',
    'string.max': 'Password should have at most {#limit} characters',
    'string.empty': 'Password cannot be empty',
  }),
  gender: Joi.string()
    .valid(...genderList)
    .messages({
      'any.only': `Gender must be one of the following: ${genderList.join(', ')}`,
    }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password cannot be empty',
  }),
});
