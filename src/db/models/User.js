import { Schema, model } from 'mongoose';
import { emailRegexp, genderList } from '../../constants/user.js';

const userSchema = new Schema(
  {
    avatar_url: {
      type: String,
    },
    daily_norma: {
      type: Number,
      default: 15000,
    },
    name: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: genderList,
      default: 'female',
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
