import { DEPARTMENTS_STATUS } from "../constants/CONST";
import { DEPARTMENTS } from "../constants/ERRORCODE";
import { IDepartment } from "../types/custom";
import Joi from "joi";

class Department implements IDepartment {
    department_id: number;
    department_name: string;
    status: number;
    date_created: string;
    date_updated: string;
    created_by: number;
    updated_by: number;
  
    constructor(department: IDepartment) {
      this.department_id = department.department_id;
      this.department_name = department.department_name;
      this.status = department.status;
      this.date_created = department.date_created;
      this.date_updated = department.date_updated
    }
  }

  const validateCreateDepartment = (department: IDepartment): Joi.ValidationResult => {
    const departmentSchema = Joi.object({
      department_id: Joi.number().allow("", null),
      department_name: Joi.string().min(3).max(20).required().error(
        new Error(DEPARTMENTS.DEPARTMENT001.errorMessage)
      ),
      status: Joi.number().valid(...Object.values(DEPARTMENTS_STATUS)),
      date_created: Joi.string().allow("", null),
      date_updated: Joi.string().allow("", null)
    });
    return departmentSchema.validate(department);
  };
  
  const validateUpdateDepartment = (department: IDepartment): Joi.ValidationResult => {
    const departmentSchema = Joi.object({
      department_id: Joi.number().required(),
      department_name: Joi.string().min(3).max(20).required().error(
        new Error(DEPARTMENTS.DEPARTMENT001.errorMessage)
      )
    });
    return departmentSchema.validate(department);
  };
  
  const validateUpdateDepartmentStatus = (department: IDepartment): Joi.ValidationResult => {
    const departmentSchema = Joi.object({
      department_id: Joi.number().required(),
      status: Joi.number().valid(...Object.values(DEPARTMENTS_STATUS)).required().error(
        new Error(DEPARTMENTS.DEPARTMENT004.errorMessage)
      )
    });
    return departmentSchema.validate(department);
  };
  
  export {
    Department,
    validateCreateDepartment,
    validateUpdateDepartment,
    validateUpdateDepartmentStatus
  };
  