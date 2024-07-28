import Joi from "joi";
import { MenuStatus } from "../enums";
import { IMenu } from "../types/custom";

class Menu implements IMenu {
    menu_id: number;
    menu_name: string;
    menu_description: string;
    status: number;
    parent_menu_id: number;
    menu_order: number;
    route_url: string;
    icon_class: string;
    date_created: string;
    date_updated: string;

    constructor(menu: IMenu) {
        this.menu_id = menu.menu_id;
        this.menu_name = menu.menu_name;
        this.menu_description = menu.menu_description;
        this.status = menu.status || MenuStatus.ACTIVE;
        this.parent_menu_id = menu.parent_menu_id;
        this.menu_order = menu.menu_order;
        this.route_url = menu.route_url;
        this.icon_class = menu.icon_class;
        this.date_created = menu.date_created || new Date().toISOString();
        this.date_updated = menu.date_updated || new Date().toISOString();
    }
}

const validateCreateMenu = (menu: IMenu): Joi.ValidationResult => {
    const menuSchema = Joi.object({
        menu_id: Joi.number().allow("", null),
        menu_name: Joi.string().min(3).max(30).required(),
        menu_description: Joi.string().min(3).max(50).required(),
        status: Joi.number().valid(...Object.values(MenuStatus)),
        parent_menu_id: Joi.number().allow("", null),
        menu_order: Joi.number().allow("", null),
        route_url: Joi.string().allow("", null),
        icon_class: Joi.string().allow("", null),
        date_created: Joi.string().allow("", null),
        date_updated: Joi.string().allow("", null)
    });
    return menuSchema.validate(menu);
};

const validateUpdateMenu = (menu: Partial<IMenu>): Joi.ValidationResult => {
    const menuSchema = Joi.object({
        menu_id: Joi.number().required(),
        menu_name: Joi.string().min(3).max(30).required(),
        menu_description: Joi.string().min(3).max(50).required(),
        status: Joi.number().valid(...Object.values(MenuStatus)),
        parent_menu_id: Joi.number().allow("", null),
        menu_order: Joi.number().allow("", null),
        route_url: Joi.string().allow("", null),
        icon_class: Joi.string().allow("", null)
    });
    return menuSchema.validate(menu);
};

const validateUpdateMenuStatus = (menu: IMenu): Joi.ValidationResult => {
    const menuSchema = Joi.object({
        menu_id: Joi.number().required(),
        status: Joi.number().valid(...Object.values(MenuStatus)).required()
    });
    return menuSchema.validate(menu);
};

export {
    validateCreateMenu,
    validateUpdateMenu,
    validateUpdateMenuStatus,
    Menu
};
