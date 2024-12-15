import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getUserByIdController,
  patchUserController,
} from '../controllers/user.js';
import { upload } from '../middlewares/multer.js';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get('/:id', ctrlWrapper(getUserByIdController));

userRouter.patch(
  '/:id',
  upload.single('avatarUrl'),
  ctrlWrapper(patchUserController),
);

export default userRouter;
