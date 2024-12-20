import Joi from 'joi';

export const addWaterSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.string().required(),
});

export const updateWaterSchema = Joi.object({
  amount: Joi.number(),
  date: Joi.string(),
});

