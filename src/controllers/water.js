import { addWater, deleteWater, updateWater } from '../services/water.js';
import createHttpError from 'http-errors';

export const getWaterController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await getWater({ userId });
  res.status(200).json({
    status: 200,
    message: 'Successfully found records of water!',
    data,
  });
};

export const addWaterController = async (req, res) => {
  const { _id: userId } = req.user;

  const data = await addWater({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created record amount of water!',
    data,
  });
};

export const deleteWaterController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;

  const data = await deleteWater({ _id, userId });

  if (!data) {
    throw createHttpError(404, 'Record not found or already deleted');
  }

  res.status(204).json({
    status: 204,
    data,
  });
};

export const updateWaterController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const { date, amount } = req.body;

  const result = await updateWater({
    _id,
    userId,
    date,
    amount,
  });

  if (!result) {
    throw createHttpError(404, `Record water by id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully patched a record of water!`,
    data: result.data,
  });
};
