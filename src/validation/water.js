import Joi from 'joi';

export const addWaterSchema = Joi.object({
  amount: Joi.number().required(),
  date: Joi.string().required(),
});

