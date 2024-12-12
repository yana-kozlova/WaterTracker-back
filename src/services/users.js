import UserCollection from '../db/models/User.js';

export const getUsers = async () => {
  const users = await UserCollection.find();
  return users;
};

export const getUserById = async (id) => {
  // console.log(id);
  const user = await UserCollection.findById(id);
  console.log(user);
  return user;
};
