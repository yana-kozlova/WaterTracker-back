import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllUsersController,
  getUserByIdController,
  patchUserController,
} from '../controllers/users.js';

const userRouter = Router();

userRouter.get('/', ctrlWrapper(getAllUsersController));

userRouter.get('/:id', ctrlWrapper(getUserByIdController));

userRouter.patch('/:id', ctrlWrapper(patchUserController));

export default userRouter;
