// import { dateRegexp } from '../constants/water.js';
import UserCollection from '../db/models/User.js';
import WaterCollection from '../db/models/Water.js';

export const addWater = async (payload) => {
  const { userId, date } = await WaterCollection.create(payload);
  const waterList = await WaterCollection.find({ userId, date });
  const { daily_norma } = await UserCollection.findOne(userId);


  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];



  console.log(currentDate);
  console.log(typeof(currentDate));


  const dateRegexp = new RegExp(`^${currentDate}`);

  const getServingsCount = await WaterCollection.aggregate([
    {
      $match: {
        userId: { $eq: userId },
        // date: { $regex: dateRegexp },
      },
    },
    {
      $group: {
        _id: userId,
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  const servings = getServingsCount[0]?.count || 0;
  const totalAmount = getServingsCount[0]?.totalAmount || 0;
  const progressDailyNorma = Number(((totalAmount * 100) / daily_norma).toFixed(2));
  const stats = { date, servings, totalAmount, progressDailyNorma };

  return { waterList, stats };
};

export const deleteWater = async ({ _id, userId }) => {
  const data = await WaterCollection.findOneAndDelete({ _id, userId });
  return data;
};

export const updateWater = async ({ _id, userId, date, amount, options = {} }) => {
  const { daily_norma } = await UserCollection.findOne(userId);
  const rawResult = await WaterCollection.findOneAndUpdate(
    { _id, userId },
    { date, amount },
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  const getServingsCount = await WaterCollection.aggregate([
    {
      $match: {
        userId: { $eq: userId },
        // date: { $regex: dateRegexp },
      },
    },
    {
      $group: {
        _id: userId,
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  const servings = getServingsCount[0]?.count || 0;
  const totalAmount = getServingsCount[0]?.totalAmount || 0;
  const progressDailyNorma = Number(((totalAmount * 100) / daily_norma).toFixed(2));

  const stats = { date, servings, totalAmount, progressDailyNorma };

  return {
    data:{data: rawResult.value,stats},
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};
