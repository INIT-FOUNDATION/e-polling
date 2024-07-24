import Joi from "joi";
import { IPasswordPolicy } from "../types/custom";

class PasswordPolicy implements IPasswordPolicy {
    id: number;
    password_expiry: number;
    password_history: number;
    minimum_password_length: number;
    complexity: number;
    alphabetical: number;
    numeric: number;
    special_characters: number;
    allowed_special_characters: string;
    maximum_invalid_attempts: number;
    date_created: string | undefined;
    date_updated: string | undefined;

    constructor(passwordPolicy: IPasswordPolicy) {
        this.id = passwordPolicy.id;
        this.password_expiry = passwordPolicy.password_expiry;
        this.password_history = passwordPolicy.password_history;
        this.minimum_password_length = passwordPolicy.minimum_password_length;
        this.complexity = passwordPolicy.complexity;
        this.alphabetical = passwordPolicy.alphabetical;
        this.numeric = passwordPolicy.numeric;
        this.special_characters = passwordPolicy.special_characters;
        this.allowed_special_characters = passwordPolicy.allowed_special_characters;
        this.maximum_invalid_attempts = passwordPolicy.maximum_invalid_attempts;
        this.date_created = passwordPolicy.date_created;
        this.date_updated = passwordPolicy.date_updated;
    }
}

const validateCreatePasswordPolicy = (PasswordPolicy: IPasswordPolicy): Joi.ValidationResult => {
    const PasswordPolicySchema = Joi.object({
        id: Joi.number().allow("", null),
        password_expiry: Joi.number().required(),
        password_history: Joi.number().required(),
        minimum_password_length: Joi.number().required(),
        complexity: Joi.number().required(),
        alphabetical: Joi.number().required(),
        numeric: Joi.number().required(),
        special_characters: Joi.number().required(),
        allowed_special_characters: Joi.string().required(),
        maximum_invalid_attempts: Joi.number().required(),
        date_created: Joi.string().allow("", null),
        date_updated: Joi.string().allow("", null)
    });
    return PasswordPolicySchema.validate(PasswordPolicy);
};

const validateUpdatePasswordPolicy = (PasswordPolicy: IPasswordPolicy): Joi.ValidationResult => {
    const PasswordPolicySchema = Joi.object({
        id: Joi.number().required(),
        password_expiry: Joi.number().required(),
        password_history: Joi.number().required(),
        minimum_password_length: Joi.number().required(),
        complexity: Joi.number().required(),
        alphabetical: Joi.number().required(),
        numeric: Joi.number().required(),
        special_characters: Joi.number().required(),
        allowed_special_characters: Joi.string().required(),
        maximum_invalid_attempts: Joi.number().required(),
        date_created: Joi.string().allow("", null),
        date_updated: Joi.string().allow("", null)
    });
    return PasswordPolicySchema.validate(PasswordPolicy);
};

export {
    PasswordPolicy,
    validateCreatePasswordPolicy,
    validateUpdatePasswordPolicy
};