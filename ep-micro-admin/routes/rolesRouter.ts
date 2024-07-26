import express from "express";
import { rolesController } from "../controllers/rolesController";

const rolesRouter = express.Router();

rolesRouter.post("/list", rolesController.listRoles);

rolesRouter.post("/add", rolesController.addRole);

rolesRouter.post("/update", rolesController.updateRole);

rolesRouter.get("/menusList", rolesController.getMenusList);

rolesRouter.get("/defaultAccessList", rolesController.getDefaultAccessList);

rolesRouter.get("/:roleId", rolesController.getRoleById);

rolesRouter.post("/updateStatus", rolesController.updateRoleStatus);

rolesRouter.get("/accessList/:roleId", rolesController.getAccessListByRoleId);

export {
    rolesRouter
}
