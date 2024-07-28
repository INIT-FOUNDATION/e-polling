import { logger, STATUS } from "ep-micro-common";
import { Response, Request } from "express";
import { ERRORCODE } from "../constants";
import { categoriesService } from "../services";

export const categoriesController = {
    getCategories: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Categories']
                #swagger.summary = 'List Categories'
                #swagger.description = 'Endpoint to List Categories with pagination' 
            */
            const categories = await categoriesService.listCategories();

            return res.status(STATUS.OK).send({
                data: { categories },
                message: "Categories Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`categoriesController :: getCategories :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.CATEGORIES.CATEGORIES000);
        }
    }
};
