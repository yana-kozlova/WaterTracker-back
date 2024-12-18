import { Schema, model } from 'mongoose';

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

const WaterCollection = model('water', addWaterSchema);
export default WaterCollection;
