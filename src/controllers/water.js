import { addWater, deleteWater } from "../services/water.js";

export const addWaterController = async (req, res) => {
  const { _id: userId } = req.user;
  console.log(req.user);

  const data = await addWater({...req.body, userId});

  res.status(201).json({
    status: 201,
    message: 'Successfully created record amount of water!',
    data
  });
};

export const deleteWaterController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;

  const result = await deleteWater({ _id, userId });

  if (!result) {
    throw createHttpError(404, `Water id=${_id} not found`);
  }

  res.status(204).send();
};


