import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { getMonthStatsController } from '../controllers/month.js';

const monthRouter = Router();

monthRouter.use(authenticate);
monthRouter.get('/', ctrlWrapper(getMonthStatsController));

export default monthRouter;
