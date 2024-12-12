import UsersCollection from '../db/models/User.js';


export const getUsers = async (req, res) => {
  const users = await UsersCollection.find();
  return users;
};

