import { Router } from 'express';

import authRouter from './auth.js';
// import usersRouter from './users.js';
import waterRouter from './water.js';
import monthRouter from './month.js';


const router = Router();

router.use('/auth', authRouter);
// router.use('/users', usersRouter);
router.use('/water', waterRouter);
router.use('/home', monthRouter);

export default router;
