import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { patchUser } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/dir/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import { cropUserData } from '../utils/userData.js';

export const getUserController = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found user!',
    data: cropUserData(user),
  });
};

export const patchUserController = async (req, res) => {
  const _id = req.user.id;
  let payload;

  if (req.body.old_password) {
    const isPasswordValid = await bcrypt.compare(req.body.old_password, req.user.password);
    if (!isPasswordValid) throw createHttpError(400, 'Old password is incorrect');
    const hashPassword = await bcrypt.hash(req.body.new_password, 10);

    payload = {
      ...req.body,
      ...(req.body.new_password && { password: hashPassword }),
    };
  } else {
    payload = { ...req.body };
  }

  const result = await patchUser(_id, payload);

  if (!result) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a user!`,
    data: cropUserData(result.user),
  });
};

export const patchUserAvatarController = async (req, res) => {
  const _id = req.user.id;

  const avatar = req.file;
  let photoUrl;

  if (avatar) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(avatar);
    } else {
      photoUrl = await saveFileToUploadDir(avatar);
    }
  }

  const result = await patchUser(_id, {
    ...req.body,
    avatar_url: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `User's avatar is successfully updated!`,
    data: cropUserData(result.user),
  });
};

export const patchWaterRateController = async (req, res) => {
  const _id = req.user.id;

  const result = await patchUser(_id, { ...req.body });

  if (!result) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Daily Norma is successfully updated!`,
    data: cropUserData(result.user),
  });
};
