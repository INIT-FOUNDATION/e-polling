import express from 'express';
import { authContoller } from '../controllers';

export const authRouter = express.Router();

authRouter.get("/health", authContoller.health);
