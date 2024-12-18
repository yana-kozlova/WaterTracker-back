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

const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get('/', ctrlWrapper(getUserController));
usersRouter.patch('/current', validateBody(updateUserSchema), ctrlWrapper(patchUserController));
usersRouter.patch('/water-rate', validateBody(updateWaterRateSchema), ctrlWrapper(patchWaterRateController));
usersRouter.patch('/avatar', upload.single('avatar_url'), ctrlWrapper(patchUserAvatarController));

export default usersRouter;




