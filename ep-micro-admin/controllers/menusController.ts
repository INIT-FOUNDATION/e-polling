import { logger, STATUS } from "ep-micro-common";
import { Request, Response } from "express";
import { menusModel } from "../models";
import { ERRORCODE } from "../constants";
import { menusService } from "../services";
import { menuRepository } from "../repositories";

export const menusController = {
    createMenu: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Menus']
                #swagger.summary = 'Create Menu'
                #swagger.description = 'Endpoint to Create Menu'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        menu_name: 'Categories',
                        menu_description: 'Menu to manage categories',
                        parent_menu_id: 1,
                        menu_order: 1,
                        route_url: '/categories',
                        icon_class: 'fa fa-menu'
                    }
                }    
            */
            const menu = new menusModel.Menu(req.body);

            const { error } = menusModel.validateCreateMenu(menu);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.MENUS.MENUS000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.MENUS.MENUS000.errorCode, errorMessage: error.message });
            }

            const menuNameExists = await menuRepository.existsByMenuName(menu.menu_name, null);
            if (menuNameExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.MENUS.MENUS005);

            await menusService.createMenu(menu);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Menu Created Successfully!"
            });
        } catch (error) {
            logger.error(`menusController :: createMenu :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        }
    },

    updateMenu: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Menus']
                #swagger.summary = 'Update Menu'
                #swagger.description = 'Endpoint to Update Menu'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        menu_id: 2,
                        menu_name: 'Categories',
                        menu_description: 'Menu to manage categories',
                        parent_menu_id: 1,
                        menu_order: 1,
                        route_url: '/categories',
                        icon_class: 'fa fa-menu'
                    }
                }    
            */
            const menu = new menusModel.Menu(req.body);

            const { error } = menusModel.validateUpdateMenu(menu);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.MENUS.MENUS000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.MENUS.MENUS000.errorCode, errorMessage: error.message });
            }

            const menuIdExists = await menuRepository.existsByMenuId(menu.menu_id);
            if (!menuIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.MENUS.MENUS001);

            const menuNameExists = await menuRepository.existsByMenuName(menu.menu_name, menu.menu_id);
            if (menuNameExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.MENUS.MENUS005);

            await menusService.updateMenu(menu);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Menu Updated Successfully!"
            });
        } catch (error) {
            logger.error(`menusController :: updateMenu :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        }
    },

    getMenus: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Menus']
                #swagger.summary = 'List Menus'
                #swagger.description = 'Endpoint to List Menus'
            */
            const menus = await menusService.listMenus();
            return res.status(STATUS.OK).send({
                data: menus,
                message: "Menus Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`menusController :: getMenus :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.MENUS.MENUS000);
        }
    },
    getMenu: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Menus']
                #swagger.summary = 'Get Menu'
                #swagger.description = 'Endpoint to Get Menu'
            */
            const { menuId } = req.params;
            if (!menuId) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.MENUS.MENUS002);

            const menuIdExists = await menuRepository.existsByMenuId(parseInt(menuId));
            if (!menuIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.MENUS.MENUS001);

            const menu = await menusService.getMenuById(parseInt(menuId));
            return res.status(STATUS.OK).send({
                data: menu,
                message: "Menu Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`menusController :: getMenu :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.MENUS.MENUS000);
        }
    },
    updateMenuStatus: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Menus']
                #swagger.summary = 'Update Menu Status'
                #swagger.description = 'Endpoint to Update Menu Status'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        menu_id: 2,
                        status: 1
                    }
                }    
            */
            const { menuId, status } = req.body;

            const { error } = menusModel.validateUpdateMenuStatus(req.body);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.MENUS.MENUS000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.MENUS.MENUS000.errorCode, errorMessage: error.message });
            }

            const menuIdExists = await menuRepository.existsByMenuId(parseInt(menuId));
            if (!menuIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.MENUS.MENUS001);

            await menusService.updateMenuStatus(parseInt(menuId), status);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Menu Status Updated Successfully!"
            });
        } catch (error) {
            logger.error(`menusController :: updateMenuStatus :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.MENUS.MENUS000);
        }
    }
}