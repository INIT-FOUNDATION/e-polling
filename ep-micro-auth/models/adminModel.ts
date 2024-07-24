import { IUser } from "../types/custom";
import Joi from "joi";


const validateLoginDetails = (user: IUser): Joi.ValidationResult => {
    const loginSchema = Joi.object({
        user_name: Joi.string().pattern(/^[1-9]\d{9}$/).required(),
        password: Joi.string().required()
    });
    return loginSchema.validate(user);
};

const validateVerifyForgotPassword = (otpDetails: any): Joi.ValidationResult => {
    const verifyForgotPasswordSchema = Joi.object({
        otp: Joi.string().required(),
        txnId: Joi.string().required()
    });
    return verifyForgotPasswordSchema.validate(otpDetails);
};

const validateResetPassword = (resetPasswordDetails: any): Joi.ValidationResult => {
    const resetPasswordSchema = Joi.object({
        txnId: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string().required()
    });
    return resetPasswordSchema.validate(resetPasswordDetails);
};

export {
    validateLoginDetails,
    validateVerifyForgotPassword,
    validateResetPassword
};
