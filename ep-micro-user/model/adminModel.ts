import Joi from "joi";
import { IUser } from "../types/custom";
import { ADMIN } from "../constants/ERRORCODE";

const validateUpdateUser = (user: IUser): Joi.ValidationResult => {
    const userSchema = Joi.object({
      first_name: Joi.string().min(3).max(50).required().error(
        new Error(ADMIN.ADMIN00004.errorMessage)
      ),
      last_name: Joi.string().min(3).max(50).required().error(
        new Error(ADMIN.ADMIN00005.errorMessage)
      ),
      dob: Joi.date().iso(),
      email_id: Joi.string().email().required()
    });
    return userSchema.validate(user);
};

export {
    validateUpdateUser
}