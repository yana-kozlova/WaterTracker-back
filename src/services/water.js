// import { dateRegexp } from '../constants/water.js';
import UserCollection from '../db/models/User.js';
import WaterCollection from '../db/models/Water.js';

// getWater;

// export const getWater = async ({ userId }) => {
//   const water = await WaterCollection.find({ userId });

//   return water;
// };

export const addWater = async (payload) => {
  const { userId, date } = await WaterCollection.create(payload);

  const curDayLocal = new Date(date).toLocaleDateString('en-CA').split(',')[0];
  const dateRegexp = new RegExp(`^${curDayLocal}`);

  const waterList = await WaterCollection.aggregate([
    {
      $match: {
        userId: { $eq: userId },
        date: { $regex: dateRegexp },
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ]);

  return { waterList };
};

export const deleteWater = async ({ _id, userId }) => {

  const data = await WaterCollection.findOneAndDelete({ _id, userId });
  return data;
};

export const updateWater = async ({ _id, userId, date, amount, options = {} }) => {
  const waterList = await WaterCollection.findOneAndUpdate(
    { _id, userId },
    { date, amount },
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!waterList || !waterList.value) return null;

  return {
    data: { waterList: waterList.value },
    isNew: Boolean(waterList.lastErrorObject.upserted),
  };
};
