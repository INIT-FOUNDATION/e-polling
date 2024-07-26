import Joi from "joi";
import { IUser } from "../types/custom";
import { USERS } from "../constants/ERRORCODE";
import { GenderStatus, UserStatus } from "../enums";

class User implements IUser {
  user_id: number;
  user_name: string;
  display_name: string;
  first_name: string;
  last_name: string;
  mobile_number: number;
  email_id: string;
  gender: number;
  dob: string;
  role_id: number;
  department_id: number;
  password: string;
  invalid_attempts: string;
  status: number;
  profile_pic_url: string;
  last_logged_in: string;
  reporting_to_users: number[];
  date_created: string;
  date_updated: string;
  created_by: number;
  updated_by: number;

  constructor(user: IUser) {
    this.user_id = user.user_id;
    this.user_name = user.mobile_number ? user.mobile_number.toString() : "";
    this.display_name = `${user.first_name ? user.first_name : ""} ${user.last_name ? user.last_name : ""}`;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.mobile_number = user.mobile_number;
    this.email_id = user.email_id;
    this.gender = user.gender;
    this.dob = user.dob;
    this.role_id = user.role_id;
    this.department_id = user.department_id;
    this.password = user.password;
    this.invalid_attempts = user.invalid_attempts;
    this.status = user.status;
    this.profile_pic_url = user.profile_pic_url;
    this.last_logged_in = user.last_logged_in;
    this.reporting_to_users = user.reporting_to_users;
    this.date_created = user.date_created;
    this.date_updated = user.date_updated;
    this.created_by = user.created_by;
    this.updated_by = user.updated_by;
  }
}

const validateCreateUser = (user: IUser): Joi.ValidationResult => {
  const userSchema = Joi.object({
    user_id: Joi.number().allow("", null),
    user_name: Joi.string().min(3).max(20).required().error(
      new Error(USERS.USER00001.errorMessage)
    ),
    display_name: Joi.string().min(3).max(50).required().error(
      new Error(USERS.USER00002.errorMessage)
    ),
    first_name: Joi.string().min(3).max(50).required().error(
      new Error(USERS.USER00003.errorMessage)
    ),
    last_name: Joi.string().min(3).max(50).required().error(
      new Error(USERS.USER00004.errorMessage)
    ),
    mobile_number: Joi.number().integer().min(6000000000).max(9999999999).required(),
    dob: Joi.date().iso(),
    email_id: Joi.string().email().required(),
    gender: Joi.number().valid(...Object.values(GenderStatus)).required(),
    role_id: Joi.number().required(),
    department_id: Joi.number().required(),
    password: Joi.string().allow("", null),
    invalid_attempts: Joi.number(),
    status: Joi.number(),
    profile_pic_url: Joi.string().allow("", null),
    last_logged_in: Joi.string().allow("", null),
    reporting_to_users: Joi.array().items(Joi.number()).optional(),
    date_created: Joi.string().allow("", null),
    date_updated: Joi.string().allow("", null),
    created_by: Joi.number(),
    updated_by: Joi.number()
  });
  return userSchema.validate(user);
};

const validateUpdateUser = (user: IUser): Joi.ValidationResult => {
  const userSchema = Joi.object({
    user_id: Joi.number().required(),
    user_name: Joi.string().min(3).max(20).required().error(
      new Error(USERS.USER00001.errorMessage)
    ),
    display_name: Joi.string().min(3).max(50),
    first_name: Joi.string().min(3).max(50).required().error(
      new Error(USERS.USER00003.errorMessage)
    ),
    last_name: Joi.string().min(3).max(50).required().error(
      new Error(USERS.USER00004.errorMessage)
    ),
    dob: Joi.date().iso(),
    mobile_number: Joi.number().integer().min(6000000000).max(9999999999).required(),
    email_id: Joi.string().email().required(),
    gender: Joi.number().valid(...Object.values(GenderStatus)).required(),
    role_id: Joi.number().required(),
    department_id: Joi.number().required(),
    reporting_to_users: Joi.array().items(Joi.number()).optional(),
    status: Joi.number().valid(...Object.values(UserStatus)).required(),
  });
  return userSchema.validate(user);
};

export {
  User,
  validateCreateUser,
  validateUpdateUser
}