import UserCollection from '../db/models/User.js';
import WaterCollection from '../db/models/Water.js';

export const addWater = async (payload) => {
  const { amount, date, userId } = await WaterCollection.create(payload);
  const { daily_norma } = await UserCollection.findOne(userId);

  const prevDate = new Date(date).toISOString().split('T')[0];
  const nextDate = new Date(date).toISOString().split('T')[0];

  console.log(typeof date);

  const servingsCount = await WaterCollection.aggregate([
    // {
    //   $project: {
    //     dateOnly: {
    //       $dateToString: { format: "%Y-%m-%d", date: date }
    //     }
    //   }
    // },
    { $match: { userId: userId } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  console.log(servingsCount);

  const servings = servingsCount[0].count;
  const totalAmount = servingsCount[0].totalAmount;
  const progressDailyNorma = (totalAmount * 100) / daily_norma;

  return { amount, date, userId, stats: { daily_norma, servings, totalAmount, progressDailyNorma } };
};

export const deleteWater = async ({ _id, userId }) => {
  const water = await WaterCollection.findOneAndDelete({ _id, userId });
  return water;
};

export const updateWater = async ({ _id, userId, payload, options = {} }) => {
  const rawResult = await WaterCollection.findOneAndUpdate({ _id, userId }, payload, {
    ...options,
    new: true,
    includeResultMetadata: true,
  });
  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};
