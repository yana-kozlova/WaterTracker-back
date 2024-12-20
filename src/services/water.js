
import WaterCollection from '../db/models/Water.js';



export const addWater = async (payload) => {
  const {amount,_id,date} = await WaterCollection.create(payload);
//  console.log(_id);


  return {amount,_id,date};
};








// export const addWater = async (payload) => {
//   const data = await WaterCollection.create(payload);
// //  console.log(_id);


//   return data;
// };



export const deleteWater = async ({ _id, userId }) => {
  const water = await WaterCollection.findOneAndDelete({ _id, userId });
  return water;
};
