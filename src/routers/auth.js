import { Router } from 'express';

import {
  registerController,
  loginController,
  refreshSessionController,
  logoutController,
  getGoogleOAuthUrlController,
  requestResetEmailController,
  resetPasswordController,
  loginWithGoogleController,
} from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
  updateUserSchema,
  updateWaterRateSchema,
} from '../validation/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getUserController,
  patchUserAvatarController,
  patchUserController,
  patchWaterRateController,
} from '../controllers/auth.js';
import { upload } from '../middlewares/multer.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginController));
authRouter.post('/refresh', ctrlWrapper(refreshSessionController));
authRouter.post('/logout', ctrlWrapper(logoutController));
authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));
authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
authRouter.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(loginWithGoogleController));

authRouter.get('/current', authenticate, ctrlWrapper(getUserController));
authRouter.patch('/current', authenticate, validateBody(updateUserSchema), ctrlWrapper(patchUserController));
authRouter.patch(
  '/water-rate',
  authenticate,
  validateBody(updateWaterRateSchema),
  ctrlWrapper(patchWaterRateController),
);
authRouter.patch('/avatar', authenticate, upload.single('avatar_url'), ctrlWrapper(patchUserAvatarController));

export default authRouter;
