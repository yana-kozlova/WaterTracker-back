import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import validateBody from '../utils/validateBody.js';
// import { isValidId } from '../middlewares/isValidId.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { addWaterSchema } from '../validation/water.js';
import { addWaterController } from '../controllers/water.js';


const todayWaterRouter = Router();


todayWaterRouter.use(authenticate);

todayWaterRouter.post('/add', validateBody(addWaterSchema),ctrlWrapper(addWaterController));
// todayWaterRouter.delete('/:id',isValidId, validateBody(), ctrlWrapper());
// todayWaterRouter.patch('/edit/:id',isValidId, validateBody(), ctrlWrapper());


export default todayWaterRouter;

