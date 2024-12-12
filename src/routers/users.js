import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getUsersController } from '../controllers/users.js';

const usersRouter = Router();

usersRouter.get('/', ctrlWrapper(getUsersController));

export default usersRouter;
