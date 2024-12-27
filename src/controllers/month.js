import { getMonthStats } from '../services/month.js';

export const getMonthStatsController = async (req, res, next) => {
  const { _id: userId } = req.user;

  const data = await getMonthStats(userId);
  res.json({
    status: 200,
    message: 'Successfully found stats!',
    data,
  });
};
