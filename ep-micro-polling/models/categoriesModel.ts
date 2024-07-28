import { ICategory } from "../types/custom";
import Joi from "joi";
import { CategoryStatus } from "../enums";

class Category implements ICategory {
    category_id: number;
    category_name: string;
    category_description: string;
    status: number;
    date_created: string;
    date_updated: string;
    created_by: number;
    updated_by: number;

    constructor(category: ICategory) {
        this.category_id = category.category_id;
        this.category_name = category.category_name;
        this.category_description = category.category_description;
        this.status = category.status || CategoryStatus.ACTIVE;
        this.date_created = category.date_created || new Date().toISOString();
        this.date_updated = category.date_updated || new Date().toISOString();
        this.created_by = category.created_by;
        this.updated_by = category.updated_by;
    }
}

const validateCreateCategory = (category: ICategory): Joi.ValidationResult => {
    const categorySchema = Joi.object({
        category_id: Joi.number().allow("", null),
        category_name: Joi.string().min(3).max(30).required(),
        category_description: Joi.string().min(3).max(50).required(),
        status: Joi.number().valid(...Object.values(CategoryStatus)),
        date_created: Joi.string().allow("", null),
        date_updated: Joi.string().allow("", null),
        created_by: Joi.number(),
        updated_by: Joi.number()
    });
    return categorySchema.validate(category);
};

const validateUpdateCategory = (category: ICategory): Joi.ValidationResult => {
    const categorySchema = Joi.object({
        category_id: Joi.number().required(),
        category_name: Joi.string().min(3).max(30).required(),
        category_description: Joi.string().min(3).max(50).required(),
        status: Joi.number().valid(...Object.values(CategoryStatus)),
    });
    return categorySchema.validate(category);
};

const validateUpdateCategoryStatus = (category: ICategory): Joi.ValidationResult => {
    const categorySchema = Joi.object({
        category_id: Joi.number().required(),
        status: Joi.number().valid(...Object.values(CategoryStatus)).required()
    });
    return categorySchema.validate(category);
};

export {
    validateCreateCategory,
    validateUpdateCategory,
    validateUpdateCategoryStatus,
    Category
};
