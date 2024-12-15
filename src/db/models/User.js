import { Schema, model } from 'mongoose';
import { emailRegexp, genderList } from '../../constants/user.js';

const userSchema = new Schema(
  {
    avatarUrl: {
      type: String,
    },
    dailyNorm: {
      type: Number,
      default: 1500,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
      enum: genderList,
      default: 'woman',
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const UserCollection = model('user', userSchema);
export default UserCollection;
