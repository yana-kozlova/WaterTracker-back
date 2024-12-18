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
      type: number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

sessionSchema.post('save', handleSaveError);

sessionSchema.pre('findOneAndUpdate', setUpdateSettings);

sessionSchema.post('findOneAndUpdate', handleSaveError);

const WaterCollection = model('water', addWaterSchema);
export default WaterCollection;
