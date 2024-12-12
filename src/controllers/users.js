
import { getUsers } from '../services/users.js';

export const getUsersController = async (req, res) => {
  const users = await getUsers();

  res.status(200).json({
    status: 200,
    message: 'Successfully found users!',
    data: users,
  });
};


