import express from "express";
import { categoriesController } from "../controllers";

export const categoriesRouter = express.Router();

categoriesRouter.post("/add", categoriesController.createCategory);

categoriesRouter.post("/update", categoriesController.updateCategory);

categoriesRouter.post("/updateStatus", categoriesController.updateCategoryStatus);

categoriesRouter.get("/list", categoriesController.getCategories);

categoriesRouter.get("/:categoryId", categoriesController.getCategory);