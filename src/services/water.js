import { dateRegexp } from '../constants/water.js';
import UserCollection from '../db/models/User.js';
import WaterCollection from '../db/models/Water.js';


export const addWater = async (payload) => {
  const { userId, date } = await WaterCollection.create(payload);
  const waterList = await WaterCollection.find({ userId, date });
  const { daily_norma } = await UserCollection.findOne(userId);

  const getServingsCount = await WaterCollection.aggregate([
    {
      $match: {
        userId: { $eq: userId },
        date: { $regex: dateRegexp },
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

  return {waterList,stats};
};

export const deleteWater = async ({ _id, userId }) => {
  const data = await WaterCollection.findOneAndDelete({ _id, userId });
  return data;
};

export const updateWater = async ({ _id, userId, date,amount, options = {} }) => {
  const { daily_norma } = await UserCollection.findOne(userId);
  const rawResult = await WaterCollection.findOneAndUpdate({ _id, userId }, {date,amount}, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });

  if (!rawResult || !rawResult.value) return null;

  const getServingsCount = await WaterCollection.aggregate([
    {
      $match: {
        userId: { $eq: userId },
        // date: { $regex: dateRegexp },
      },
    },
    // {
    //   $group: {
    //     _id: userId,
    //     count: { $sum: 1 },
    //     totalAmount: { $sum: '$amount' },
    //   },
    // },
  ]);

  const servings = getServingsCount[0]?.count || 0;
  const totalAmount = getServingsCount[0]?.totalAmount || 0;
  const progressDailyNorma = Number(((totalAmount * 100) / daily_norma).toFixed(2));


  const stats = { date, servings, totalAmount, progressDailyNorma };
  console.log(getServingsCount);


  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};


// const userMonthStats = await monthStatsCollection.findOne({ userId });
// if (userMonthStats) {
//   await monthStatsCollection.findOneAndUpdate({ userId }, {
//     $inc: {
//       'stats.servings': servings,
//       'stats.totalAmount': totalAmount,
//     } ,
//     $set: {
//       'stats.progressDailyNorma': progressDailyNorma,
//     }});
// } else {
//   await monthStatsCollection.create({
//     userId,
//     daily_norma,
//     ...stats,
//   });
// }


  // const userMonthStats = await monthStatsCollection.findOne({ userId });
  // if (userMonthStats) {
  //   await monthStatsCollection.findOneAndUpdate({ userId }, { stats, daily_norma });
  // } else {
  //   await monthStatsCollection.create({ userId, daily_norma, ...stats });
  // }
