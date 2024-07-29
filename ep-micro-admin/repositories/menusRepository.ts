import { QUERY } from "../constants";
import { MenuStatus } from "../enums";
import { IMenu } from "../types/custom";
import { pg, logger } from "ep-micro-common";

export const menusRepository = {
    createMenu: async (menu: IMenu) => {
        try {
            const _query = {
                text: QUERY.MENUS.addMenu,
                values: [menu.menu_name, menu.menu_description, menu.status, menu.parent_menu_id, menu.menu_order, menu.route_url, menu.icon_class]
            }
            logger.debug(`menuRepository :: createMenu :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`menuRepository :: createMenu :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`menuRepository :: createMenu :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateMenu: async (menu: IMenu) => {
        try {
            const _query = {
                text: QUERY.MENUS.updateMenu,
                values: [menu.menu_name, menu.menu_description, menu.status, menu.parent_menu_id, menu.menu_order, menu.route_url, menu.menu_id]
            }
            logger.debug(`menuRepository :: updateMenu :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`menuRepository :: updateMenu :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`menuRepository :: updateMenu :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getMenuById: async (menuId: number): Promise<IMenu> => {
        try {
            const _query = {
                text: QUERY.MENUS.getMenuById,
                values: [menuId]
            };
            logger.debug(`menuRepository :: getMenuById :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`menuRepository :: getMenuById :: db result :: ${JSON.stringify(result)}`);
            return result.length ? result[0] : null;
        } catch (error) {
            logger.error(`menuRepository :: getMenuById :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listMenus: async (): Promise<IMenu[]> => {
        try {
            const _query = {
                text: QUERY.MENUS.listMenus
            };
            logger.debug(`menuRepository :: getAllMenus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`menuRepository :: getAllMenus :: db result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`menuRepository :: getAllMenus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByMenuId: async (menuId: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.MENUS.existsByMenuId,
                values: [menuId]
            };
            logger.debug(`menuRepository :: existsByMenuId :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`menuRepository :: existsByMenuId :: db result :: ${JSON.stringify(result)}`);
            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`menuRepository :: existsByMenuId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByMenuName: async (menuName: string, menuId: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.MENUS.existsByMenuName,
                values: [menuName]
            };
            if (menuId) _query.text += ` AND menu_id <> ${menuId}`;
            logger.debug(`menuRepository :: existsByMenuId :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`menuRepository :: existsByMenuId :: db result :: ${JSON.stringify(result)}`);
            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`menuRepository :: existsByMenuId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateMenuStatus: async (menuId: number, status: MenuStatus) => {
        try {
            const _query = {
                text: QUERY.MENUS.updateMenuStatus,
                values: [menuId, status]
            };
            logger.debug(`menuRepository :: updateMenuStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`menuRepository :: updateMenuStatus :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`menuRepository :: updateMenuStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}