import { QUERY } from "../constants";
import { CategoryStatus } from "../enums";
import { ICategory } from "../types/custom";
import { pg, logger } from "ep-micro-common";

export const categoriesRepository = {
    createCategory: async (category: ICategory) => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.addCategory,
                values: [category.category_name, category.category_description, category.status, category.created_by, category.updated_by]
            };
            logger.debug(`categoryRepository :: createCategory :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: createCategory :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`categoryRepository :: createCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateCategory: async (category: ICategory) => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.updateCategory,
                values: [category.category_name, category.category_description, category.status, category.created_by, category.updated_by, category.category_id]
            };
            logger.debug(`categoryRepository :: updateCategory :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: updateCategory :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`categoryRepository :: updateCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getCategoryById: async (categoryId: number): Promise<ICategory> => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.getCategoryById,
                values: [categoryId]
            };
            logger.debug(`categoryRepository :: getCategoryById :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: getCategoryById :: db result :: ${JSON.stringify(result)}`);
            
            return result.length ? result[0] : null;
        } catch (error) {
            logger.error(`categoryRepository :: getCategoryById :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listCategories: async (currentPage: number, pageSize: number): Promise<ICategory[]> => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.listCategories,
                values: [currentPage, pageSize]
            };
            logger.debug(`categoryRepository :: listCategories :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: listCategories :: db result :: ${JSON.stringify(result)}`);
            
            return result;
        } catch (error) {
            logger.error(`categoryRepository :: listCategories :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getCategoriesCount: async (): Promise<number> => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.getCategoriesCount
            };
            logger.debug(`categoryRepository :: getCategoriesCount :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: getCategoriesCount :: db result :: ${JSON.stringify(result)}`);
            
            return result.length ? result[0].count : 0;
        } catch (error) {
            logger.error(`categoryRepository :: getCategoriesCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByCategoryId: async (categoryId: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.existsByCategoryId,
                values: [categoryId]
            };
            logger.debug(`categoryRepository :: existsByCategoryId :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: existsByCategoryId :: db result :: ${JSON.stringify(result)}`);
            
            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`categoryRepository :: existsByCategoryId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByCategoryName: async (categoryName: string, categoryId: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.existsByCategoryName,
                values: [categoryName]
            };
            if (categoryId) _query.text = ` AND category_id <> ${categoryId}`;
            logger.debug(`categoryRepository :: existsByCategoryName :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: existsByCategoryName :: db result :: ${JSON.stringify(result)}`);
            
            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`categoryRepository :: existsByCategoryName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateCategoryStatus: async (categoryId: number, status: CategoryStatus) => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.updateCategoryStatus,
                values: [status, categoryId]
            };
            logger.debug(`categoryRepository :: updateCategoryStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`categoryRepository :: updateCategoryStatus :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`categoryRepository :: updateCategoryStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
