import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const addWaterSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

addWaterSchema.post('save', handleSaveError);

addWaterSchema.pre('findOneAndUpdate', setUpdateSettings);

addWaterSchema.post('findOneAndUpdate', handleSaveError);

const WaterCollection = model('water', addWaterSchema);
export default WaterCollection;
