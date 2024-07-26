import express from "express";
import { menusController } from "../controllers";

export const menusRouter = express.Router();

menusRouter.post("/add", menusController.createMenu);

menusRouter.post("/update", menusController.updateMenu);

menusRouter.post("/updateStatus", menusController.updateMenuStatus);

menusRouter.get("/list", menusController.getMenus);

menusRouter.get("/:menuId", menusController.getMenu);