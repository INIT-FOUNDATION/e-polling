import express from "express";
import { categoriesController } from "../controllers";

export const categoriesRouter = express.Router();

categoriesRouter.get("/list", categoriesController.getCategories);