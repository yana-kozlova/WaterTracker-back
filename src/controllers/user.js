import createHttpError from 'http-errors';
import { getUserById, patchUser } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/dir/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getUserByIdController = async (req, res) => {
  const { id: _id } = req.params;
  const user = await getUserById(_id);

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
  const { id: _id } = req.params;
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
    // next(createHttpError(404, 'User not found'));
    // return;
    throw createHttpError(404, 'User not found');
  }
  res.json({
    status: 200,
    message: `Successfully patched a user!`,
    data: result.user,
  });
};
