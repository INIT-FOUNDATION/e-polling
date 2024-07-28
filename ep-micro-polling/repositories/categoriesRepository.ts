import { QUERY } from "../constants";
import { ICategory } from "../types/custom";
import { pg, logger } from "ep-micro-common";

export const categoriesRepository = {
    listCategories: async (): Promise<ICategory[]> => {
        try {
            const _query = {
                text: QUERY.CATEGORIES.listCategories,
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
};
