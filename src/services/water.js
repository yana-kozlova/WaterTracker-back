
import WaterCollection from '../db/models/Water.js';

export const addWater = async (payload) => {
  const water = await WaterCollection.create(payload);
  return water;
};
