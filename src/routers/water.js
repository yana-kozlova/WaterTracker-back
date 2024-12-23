import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import validateBody from '../utils/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { addWaterSchema, updateWaterSchema } from '../validation/water.js';
import { addWaterController, deleteWaterController, updateWaterController } from '../controllers/water.js';


const waterRouter = Router();


waterRouter.use(authenticate);

waterRouter.post('/add', validateBody(addWaterSchema), ctrlWrapper(addWaterController));
waterRouter.delete('/:id', isValidId, ctrlWrapper(deleteWaterController));
waterRouter.patch('/edit/:id',isValidId, validateBody(updateWaterSchema), ctrlWrapper(updateWaterController));


export default waterRouter;

