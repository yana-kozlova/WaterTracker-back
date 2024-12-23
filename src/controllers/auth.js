import * as authServices from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { cropUserData } from '../utils/userData.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import { patchUser } from '../services/user.js';
import { saveFileToUploadDir } from '../utils/dir/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';


const setupSession = (res, session) => {
  const { _id, refreshToken, refreshTokenValidUntil } = session;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const user = await authServices.register(req.body);
  const { session } = await authServices.login(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered and logged user!',
    data: {
      accessToken: session.accessToken,
      user: cropUserData(user),
    },
  });
};

export const loginController = async (req, res) => {
  const { session, user } = await authServices.login(req.body);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully login user',
    data: {
      accessToken: session.accessToken,
      user: cropUserData(user),
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logout(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshSessionController = async (req, res) => {
  const session = await authServices.refreshUserSession(req.cookies);

  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refresh session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res) => {
  await authServices.requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await authServices.loginOrSignupWithGoogle(req.body.code);

  setupSession(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

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
