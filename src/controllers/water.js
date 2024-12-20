import { addWater } from "../services/water.js";

export const addWaterController = async (req, res) => {
  const { _id: userId } = req.user;

  const data = await addWater({...req.body, userId});

  res.status(201).json({
    status: 201,
    message: 'Successfully created record amount of water!',
    data
  });
};


