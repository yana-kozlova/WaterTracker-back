// import { dateRegexp } from '../constants/water.js';
import UserCollection from '../db/models/User.js';
import WaterCollection from '../db/models/Water.js';

export const getWater = async ({ userId }) => {
  const water = await WaterCollection.find({ userId });

  const curDayLocal = new Date().toLocaleDateString('en-CA').split(',')[0];
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

  return waterList;
};

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
  const { daily_norma } = await UserCollection.findOne(userId);

  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];
  const dateRegexp = new RegExp(`^${currentDate}`);

  console.log(dateRegexp);
  console.log(_id, userId);

  const getServingsCount = await WaterCollection.aggregate([
    {
      $match: {
        userId: { $eq: userId },
        date: { $regex: dateRegexp },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  const curDate = new Date();
  const month = curDate.toLocaleString('US-us', { month: 'short' });
  const day = curDate.getDate();
  const formattedDate = `${day}, ${month}`;

  const servings = getServingsCount[0]?.count || 0;
  const totalAmount = getServingsCount[0]?.totalAmount || 0;
  const progress = Number(((totalAmount * 100) / daily_norma).toFixed(2));
  const dayStats = { formattedDate, daily_norma, progress, servings };

  console.log(dayStats);

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
