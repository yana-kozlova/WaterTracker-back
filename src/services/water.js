
import WaterCollection from '../db/models/Water.js';



export const addWater = async (payload) => {
  const {amount,date,userId} = await WaterCollection.create(payload);
  return {amount,date,userId};
}

export const deleteWater = async ({ _id, userId }) => {
  const water = await WaterCollection.findOneAndDelete({ _id, userId });
  return water;
};

export const updateWater = async ({
  _id,
  userId,
  payload,
  options = {},
}) => {
  const rawResult = await WaterCollection.findOneAndUpdate(
    { _id, userId },
    payload,
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};
