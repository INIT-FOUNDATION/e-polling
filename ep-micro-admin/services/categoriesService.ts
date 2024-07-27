import { categoriesRepository } from "../repositories";
import { ICategory } from "../types/custom";
import { logger, redis } from "ep-micro-common";

export const categoriesService = {
    createCategory: async (category: ICategory) => {
        try {
            await categoriesRepository.createCategory(category);
            redis.deleteRedis(`categories|created_by:${category.created_by}|page:0|limit:50`);
            redis.deleteRedis(`categories|created_by:${category.created_by}|count`);
        } catch (error) {
            logger.error(`categoriesService :: createCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateCategory: async (category: ICategory) => {
        try {
            await categoriesRepository.updateCategory(category);
            redis.deleteRedis(`categories|created_by:${category.created_by}|page:0|limit:50`);
            redis.deleteRedis(`categories|created_by:${category.created_by}|count`);
            redis.deleteRedis(`category:${category.category_id}`);
        } catch (error) {
            logger.error(`categoriesService :: updateCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateCategoryStatus: async (categoryId: number, status: number, createdBy: number) => {
        try {
            await categoriesRepository.updateCategoryStatus(categoryId, status);
            redis.deleteRedis(`categories|created_by:${createdBy}|page:0|limit:50`);
            redis.deleteRedis(`categories|created_by:${createdBy}|count`);
            redis.deleteRedis(`category:${categoryId}`);
        } catch (error) {
            logger.error(`categoriesService :: updateCategoryStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listCategories: async (currentPage: number, pageSize: number, createdBy: number): Promise<ICategory[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            const key = `categories|created_by:${createdBy}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const categories = await categoriesRepository.listCategories(currentPage, pageSize, createdBy);
            if (categories && categories.length > 0) {
                await redis.setRedis(key, JSON.stringify(categories));
                return categories;
            }
        } catch (error) {
            logger.error(`categoriesService :: listCategories :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getCategoriesCount: async (created_by: number): Promise<number> => {
        try {
            const key = `categories|created_by:${created_by}|count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const count = await categoriesRepository.getCategoriesCount(created_by);
            if (count) {
                await redis.setRedis(key, JSON.stringify(count));
                return count;
            }
        } catch (error) {
            logger.error(`categoriesService :: getCategoriesCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getCategoryById: async (categoryId: number): Promise<ICategory> => {
        try {
            const key = `category:${categoryId}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const category = await categoriesRepository.getCategoryById(categoryId);
            if (category) {
                await redis.setRedis(key, JSON.stringify(category));
                return category;
            }
        } catch (error) {
            logger.error(`categoriesService :: getCategoryById :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
