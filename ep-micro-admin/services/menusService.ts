import { CacheTTL } from "../enums";
import { menusRepository } from "../repositories";
import { IMenu } from "../types/custom";
import { logger, redis } from "ep-micro-common";

export const menusService = {
    createMenu: async (menu: IMenu) => {
        try {
            await menusRepository.createMenu(menu);
            redis.deleteRedis(`menus`);
        } catch (error) {
            logger.error(`menusService :: createMenu :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateMenu: async (menu: IMenu) => {
        try {
            await menusRepository.updateMenu(menu);
            redis.deleteRedis(`menus`);
            redis.deleteRedis(`menu:${menu.menu_id}`);
        } catch (error) {
            logger.error(`menusService :: updateMenu :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateMenuStatus: async (menuId: number, status: number) => {
        try {
            await menusRepository.updateMenuStatus(menuId, status);
            redis.deleteRedis(`menus`);
            redis.deleteRedis(`menu:${menuId}`);
        } catch (error) {
            logger.error(`menusService :: updateMenuStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listMenus: async (): Promise<IMenu[]> => {
        try {
            const key = `menus`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const menus = await menusRepository.listMenus();
            if (menus && menus.length > 0) {
                redis.SetRedis(key, menus, CacheTTL.LONG);
                return menus;
            }
        } catch (error) {
            logger.error(`menusService :: listMenus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getMenuById: async (menuId: number): Promise<IMenu> => {
        try {
            const key = `menu:${menuId}`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const menu = await menusRepository.getMenuById(menuId);
            if (menu) {
                redis.SetRedis(key, menu, CacheTTL.LONG);
                return menu;
            }
        } catch (error) {
            logger.error(`menusService :: getMenuById :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}