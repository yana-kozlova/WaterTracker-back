import UserCollection from '../db/models/User.js';

export const getUserById = async (id) => {
  const user = await UserCollection.findById(id);
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

