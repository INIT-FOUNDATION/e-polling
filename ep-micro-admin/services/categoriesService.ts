import { categoryRepository } from "../repositories";
import { ICategory } from "../types/custom";
import { logger, redis } from "ep-micro-common";

export const categoriesService = {
    createCategory: async (category: ICategory) => {
        try {
            await categoryRepository.createCategory(category);
            redis.deleteRedis(`categories`);
        } catch (error) {
            logger.error(`categoriesService :: createCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateCategory: async (category: ICategory) => {
        try {
            await categoryRepository.updateCategory(category);
            redis.deleteRedis(`categories`);
            redis.deleteRedis(`category:${category.category_id}`);
        } catch (error) {
            logger.error(`categoriesService :: updateCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateCategoryStatus: async (categoryId: number, status: number) => {
        try {
            await categoryRepository.updateCategoryStatus(categoryId, status);
            redis.deleteRedis(`categories`);
            redis.deleteRedis(`category:${categoryId}`);
        } catch (error) {
            logger.error(`categoriesService :: updateCategoryStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listCategories: async (currentPage: number, pageSize: number): Promise<ICategory[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            const key = `categories|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const categories = await categoryRepository.listCategories(currentPage, pageSize);
            if (categories && categories.length > 0) {
                await redis.setRedis(key, JSON.stringify(categories));
                return categories;
            }
        } catch (error) {
            logger.error(`categoriesService :: listCategories :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getCategoriesCount: async (): Promise<number> => {
        try {
            const key = `categories|count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) {
                return JSON.parse(cacheResult);
            }

            const count = await categoryRepository.getCategoriesCount();
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

            const category = await categoryRepository.getCategoryById(categoryId);
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
