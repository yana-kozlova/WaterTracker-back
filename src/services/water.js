
import WaterCollection from '../db/models/Water.js';


const filterTotalAmountByDate = async (date, userId) => {
  const dateObj = new Date(date);

  const startOfDay = new Date(dateObj.setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(dateObj.setUTCHours(23, 59, 59, 999)).toISOString();

  console.log('Start of day:', startOfDay);
  console.log('End of day:', endOfDay);


  return await WaterCollection.aggregate([
    // {
    //   $match: {
    //     date: { $gte: startOfDay, $lt: endOfDay },
    //     userId: userId,
    //   },
    // },
    {
      $group: {
        _id: userId,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
};

export const addWater = async (payload) => {
  const { amount, _id: userId, date } = await WaterCollection.create(payload);

  console.log(date);
   const result = await filterTotalAmountByDate(date, userId);
  console.log('Total amount result for the day:', result);

  return { amount, userId };
};
