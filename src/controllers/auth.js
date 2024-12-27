import * as authServices from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { cropUserData } from '../utils/userData.js';

const setupSession = (res, session) => {
  const { _id, refreshToken, refreshTokenValidUntil } = session;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
    expires: refreshTokenValidUntil,
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
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
