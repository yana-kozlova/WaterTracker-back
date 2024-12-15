import createHttpError from 'http-errors';
import { findSession, findUser } from '../services/auth.js';
export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Authorization header must be type Bearer'));
  }

  const session = await findSession({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
  if (Date.now() > session.accessTokenValidUntil) {
    console.log('accessTokenValidUntil');
    return next(
      createHttpError(401, 'Access token expired', {
        code: 'TOKEN_EXPIRED',
        hint: 'Please refresh your access token.',
      }),
    );
  }

  const user = await findUser({ _id: session.userId });

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
