import { ROLES_STATUS } from "../constants/CONST";
import { ROLES } from "../constants/ERRORCODE";
import { IRole } from "../types/custom";
import Joi from "joi";

class Role implements IRole {
  role_id: number;
  role_name: string;
  role_description: string;
  level: string;
  status: number;
  permissions: any;
  date_created: string;
  date_updated: string;
  created_by: number;
  updated_by: number;

  constructor(role: IRole) {
    this.role_id = role.role_id;
    this.role_name = role.role_name;
    this.role_description = role.role_description;
    this.level = role.level;
    this.status = role.status;
    this.permissions = role.permissions;
    this.date_created = role.date_created;
    this.date_updated = role.date_updated;
    this.created_by = role.created_by;
    this.updated_by = role.updated_by
  }
}

const validateCreateRole = (role: IRole): Joi.ValidationResult => {
  const roleSchema = Joi.object({
    role_id: Joi.number().allow("", null),
    role_name: Joi.string().min(3).max(20).required().error(
      new Error(ROLES.ROLE00001.errorMessage)
    ),
    role_description: Joi.string().min(3).max(50).required().error(
      new Error(ROLES.ROLE00002.errorMessage)
    ),
    permissions: Joi.array().items(
      Joi.object({
        menu_id: Joi.number().required(),
        permission_id: Joi.number().required()
      })
    ).required().error(
      new Error(ROLES.ROLE00010.errorMessage)
    ),
    level: Joi.string().required(),
    status: Joi.number().valid(...Object.values(ROLES_STATUS)),
    date_created: Joi.string().allow("", null),
    date_updated: Joi.string().allow("", null),
    created_by: Joi.number(),
    updated_by: Joi.number()
  });
  return roleSchema.validate(role);
};

const validateUpdateRole = (role: IRole): Joi.ValidationResult => {
  const roleSchema = Joi.object({
    role_id: Joi.number().required(),
    role_name: Joi.string().min(3).max(20).required().error(
      new Error(ROLES.ROLE00001.errorMessage)
    ),
    role_description: Joi.string().min(3).max(50).required().error(
      new Error(ROLES.ROLE00002.errorMessage)
    ),
    level: Joi.string().required(),
    permissions: Joi.array().items(
      Joi.object({
        menu_id: Joi.number().required(),
        permission_id: Joi.number().required()
      })
    ).required().error(
      new Error(ROLES.ROLE00010.errorMessage)
    ),
    status: Joi.number().valid(...Object.values(ROLES_STATUS)),
  });
  return roleSchema.validate(role);
};

const validateUpdateRoleStatus = (role: IRole): Joi.ValidationResult => {
  const roleSchema = Joi.object({
    role_id: Joi.number().required(),
    status: Joi.number().valid(...Object.values(ROLES_STATUS)).required().error(
      new Error(ROLES.ROLE00004.errorMessage)
    )
  });
  return roleSchema.validate(role);
};


export {
  Role,
  validateCreateRole,
  validateUpdateRole,
  validateUpdateRoleStatus
};