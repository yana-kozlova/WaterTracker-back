import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const monthStatsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    progressDailyNorma: {
      type: Number,
      required: true,
    },
    daily_norma: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);
monthStatsSchema.post('save', handleSaveError);

monthStatsSchema.pre('findOneAndUpdate', setUpdateSettings);

monthStatsSchema.post('findOneAndUpdate', handleSaveError);
const monthStatsCollection = model('monthWater', monthStatsSchema);

export default monthStatsCollection;
