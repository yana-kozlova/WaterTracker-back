import { Router } from 'express';

import authRouter from './auth.js';
import usersRouter from './users.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', usersRouter);

export default router;
