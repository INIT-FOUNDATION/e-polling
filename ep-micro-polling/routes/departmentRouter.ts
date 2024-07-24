import express from "express";
import { departmentsController } from "../controllers/departmentsController";

export const departmentRouter = express.Router();

departmentRouter.get("/list", departmentsController.listDepartments);

departmentRouter.post("/add", departmentsController.addDepartment);

departmentRouter.post("/update", departmentsController.updateDepartment);

departmentRouter.get("/:departmentId", departmentsController.getDepartmentById);

departmentRouter.post("/updateStatus", departmentsController.updateDepartmentStatus);
