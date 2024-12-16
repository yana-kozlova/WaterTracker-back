import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { patchUser } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/dir/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getUserController = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found user!',
    data: user,
  });
};

export const patchUserController = async (req, res) => {
  const _id = req.user.id;

  if (req.body.old_password) {
    const isPasswordValid = await bcrypt.compare(req.body.old_password, req.user.password);
    if (!isPasswordValid) throw createHttpError(400, 'Old password is incorrect');
  }

  const hashPassword = await bcrypt.hash(req.body.new_password, 10);

  const result = await patchUser(_id, {
    ...req.body,
    ...(req.body.new_password && { password: hashPassword }),
  });

  if (!result) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a user!`,
    data: result.user,
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
    avatarUrl: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a user!`,
    data: result.user,
  });
};
