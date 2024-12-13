import { Router } from "express";

import {registerController, loginController, refreshSessionController,logoutController} from "../controllers/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { registerUserSchema, loginUserSchema } from "../validation/auth.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), ctrlWrapper(registerController));
authRouter.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginController));
authRouter.post("/refresh", ctrlWrapper(refreshSessionController));
authRouter.post("/logout", ctrlWrapper(logoutController));
export default authRouter;
