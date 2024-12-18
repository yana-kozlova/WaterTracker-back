import { addWater } from "../services/water.js";

export const addWaterController = async (req, res) => {
  const user = req.user;
  const { _id: userId } = req.user;
  console.log(user)

  const data = await addWater(_id, payload);

  res.status(201).json({
    status: 201,
    message: 'Successfully created record amount of water!',
    data
  });
};


