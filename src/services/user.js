// import UserCollection from '../db/models/User.js';

// export const patchUser = async (id, payload, options = {}) => {
//   const updatedUser = await UserCollection.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//     includeResultMetadata: true,
//     ...options,
//   });

//   if (!updatedUser || !updatedUser.value) return null;

//   return {
//     user: updatedUser.value,
//     isNew: Boolean(updatedUser?.lastErrorObject?.upserted),
//   };
// };
