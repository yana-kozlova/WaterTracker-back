import { Router } from 'express';

import authRouter from './auth.js';
import usersRouter from './users.js';
import todayWaterRouter from './water.js';



const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/today-water', todayWaterRouter);

export default router;
