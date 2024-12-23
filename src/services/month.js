import UserCollection from '../db/models/User.js';
import WaterCollection from '../db/models/Water.js';

export const getMonthStats = async (userId) => {
  const { daily_norma } = await UserCollection.findOne(userId);
  const monthStats = await WaterCollection.aggregate([
    {
      $match: { userId: { $eq: userId } },
    },
    {
      $project: {
        formattedDate: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: { $dateFromString: { dateString: '$date' } },
          },
        },
        amount: 1,
        servings: 1,
      },
    },
    {
      $group: {
        _id: '$formattedDate',
        totalAmount: { $sum: '$amount' },
        totalServings: { $sum: 1 },
      },
    },
    {
      $addFields: {
        progress: {
          $round: [{ $multiply: [{ $divide: ['$totalAmount', daily_norma] }, 100] }, 1],
        },
        dailyNorma: daily_norma,
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        progress: 1,
        totalServings: 1,
        dailyNorma: 1,
      },
    },
  ]);

  return monthStats;
};

// {
//     "_id": "2024-12-21",
//     "totalAmount": 7500,
//     "count": 2,
//     "progress": 50
// }
