import { Schema, model } from 'mongoose';
import { emailRegexp } from '../../constants/users.js';

const usersSchema = new Schema(
  {
    name: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['woman', 'man'],
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

const UsersCollection = model('user', usersSchema);
export default UsersCollection;
