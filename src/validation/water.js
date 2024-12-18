import Joi from 'joi';

export const addWaterSchema = Joi.object({
  date: Joi.string().max(10).messages({
    'string.max': 'Date should have a valid format of date',
  }),
  amount: Joi.string().min(2).max(4).messages({
    'string.min': 'Amount should have at least {#limit} characters',
    'string.max': 'Old password should have at most {#limit} characters',
  }),
});

