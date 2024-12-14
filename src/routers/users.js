import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getUserByIdController,
  patchUserController,
} from '../controllers/users.js';
import { upload } from '../middlewares/multer.js';

const userRouter = Router();

userRouter.get('/:id', ctrlWrapper(getUserByIdController));

userRouter.patch(
  '/:id',
  upload.single('avatarUrl'),
  ctrlWrapper(patchUserController),
);

export default userRouter;
