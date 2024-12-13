import createHttpError from 'http-errors';
import { getUserById, getUsers, patchUser } from '../services/users.js';

export const getAllUsersController = async (req, res) => {
  const users = await getUsers();

  res.status(200).json({
    status: 200,
    message: 'Success!',
    data: users,
  });
};

export const getUserByIdController = async (req, res) => {
  const { id: _id } = req.params;
  const user = await getUserById(_id);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found user!',
    data: user,
  });
};

export const patchUserController = async (req, res) => {
  const { id: _id } = req.params;
  const result = await patchUser(_id, req.body);

  if (!result) {
    // next(createHttpError(404, 'User not found')) ??
    createHttpError(404, 'User not found');
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a user!`,
    data: result.user,
  });
};
