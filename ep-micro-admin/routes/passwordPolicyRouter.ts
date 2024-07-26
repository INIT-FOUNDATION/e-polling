import express from "express";
import { passwordPoliciesController } from "../controllers";

export const passwordPolicyRouter = express.Router();

passwordPolicyRouter.get("/list", passwordPoliciesController.listPasswordPolicies);

passwordPolicyRouter.post("/add", passwordPoliciesController.addPasswordPolicy);

passwordPolicyRouter.post("/update", passwordPoliciesController.updatePasswordPolicy);

passwordPolicyRouter.get("/:passwordPolicyId", passwordPoliciesController.getPasswordPolicyById);