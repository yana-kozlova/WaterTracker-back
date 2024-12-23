import UsersCollection from '../db/models/User.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import Handlebars from "handlebars";
import jwt from "jsonwebtoken";
import { randomBytes } from 'crypto';
import SessionCollection from '../db/models/Session.js';
import { TEMPLATE_DIR } from "../constants/index.js";
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from "../utils/sendEmail.js";
import { validateCode, getFullNameFromGoogleTokenPayload } from "../utils/googleOAuth2.js";
import { accessTokenLifetime, refreshTokenLifetime } from '../constants/index.js';
import UserCollection from '../db/models/User.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  };
};
export const register = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });

  if (user) {
    throw createHttpError(409, 'Email already used');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = UsersCollection.create({
    ...payload,
    password: hashPassword,
  });
  return newUser;
};

export const login = async ({ email, password }) => {
  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password is invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  const createdSession = await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });

  return { session: createdSession, user };
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionCollection.deleteOne({ userId: session.userId });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => UsersCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );
  const resetPasswordTemplatePath = path.join(
    TEMPLATE_DIR,
    'reset-password-email.html',
  );

  const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf-8');

  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
export const loginOrSignupWithGoogle = async code =>{
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  if(!payload){
    throw createHttpError(401);
  }

  let user = await UsersCollection.findOne({
    email: payload.email,
  });

  if(!user){
    const password = await bcrypt.hash(randomBytes(10), 10);
    const username = getFullNameFromGoogleTokenPayload(payload);

    user = UsersCollection.create({
      email: payload.email,
      username,
      password,
    });
  }
  const newSession = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const patchUser = async (id, payload, options = {}) => {
  const updatedUser = await UserCollection.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!updatedUser || !updatedUser.value) return null;

  return {
    user: updatedUser.value,
    isNew: Boolean(updatedUser?.lastErrorObject?.upserted),
  };
};
