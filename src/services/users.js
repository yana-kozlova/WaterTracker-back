import UserCollection from '../db/models/User.js';

export const getUsers = async () => {
  const users = await UserCollection.find();
  return users;
};

export const getUserById = async (id) => {
  const user = await UserCollection.findById(id);
  console.log(user);
  return user;
};

export const patchUser = async (id, payload, options = {}) => {
  const updatedUser = await UserCollection.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!updatedUser || !updatedUser.value) return null;

  return {
    user: updatedUser.value,
    isNew: Boolean(updatedUser?.lastErrorObject?.upserted),
  };
};
