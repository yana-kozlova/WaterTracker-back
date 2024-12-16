import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getUserController,
  patchUserAvatarController,
  patchUserController,
  patchWaterRateController,
} from '../controllers/user.js';
import { upload } from '../middlewares/multer.js';
import validateBody from '../utils/validateBody.js';
import { updateUserSchema, updateWaterRateSchema } from '../validation/user.js';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get('/', ctrlWrapper(getUserController));

userRouter.patch('/', validateBody(updateUserSchema), ctrlWrapper(patchUserController));
userRouter.patch('/waterRate', validateBody(updateWaterRateSchema), ctrlWrapper(patchWaterRateController));
userRouter.patch('/avatar', upload.single('avatarUrl'), ctrlWrapper(patchUserAvatarController));

export default userRouter;
