import { CacheTTL } from "../enums";
import { categoriesRepository } from "../repositories";
import { ICategory } from "../types/custom";
import { logger, redis } from "ep-micro-common";

export const categoriesService = {
    listCategories: async (): Promise<ICategory[]> => {
        try {
            const key = `categories`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const categories = await categoriesRepository.listCategories();
            if (categories && categories.length > 0) {
                redis.SetRedis(key, categories, CacheTTL.LONG);
                return categories;
            }
        } catch (error) {
            logger.error(`categoriesService :: listCategories :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
};
