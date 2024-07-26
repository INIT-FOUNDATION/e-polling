import { logger, STATUS } from "ep-micro-common";
import { Request, Response } from "express";
import { categoriesModel } from "../models";
import { ERRORCODE } from "../constants";
import { categoriesService } from "../services";
import { categoryRepository } from "../repositories";
import { GridDefaultOptions } from "../enums";

export const categoriesController = {
    createCategory: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Categories']
                #swagger.summary = 'Create Category'
                #swagger.description = 'Endpoint to Create Category'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        category_name: 'Technology',
                        category_description: 'Category for tech-related content'
                    }
                }    
            */
            const category = new categoriesModel.Category(req.body);

            const { error } = categoriesModel.validateCreateCategory(category);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.CATEGORIES.CATEGORIES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.CATEGORIES.CATEGORIES000.errorCode, errorMessage: error.message });
            }

            const categoryNameExists = await categoryRepository.existsByCategoryName(category.category_name, null);
            if (categoryNameExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES005);

            await categoriesService.createCategory(category);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Category Created Successfully!"
            });
        } catch (error) {
            logger.error(`categoriesController :: createCategory :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        }
    },
    updateCategory: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Categories']
                #swagger.summary = 'Update Category'
                #swagger.description = 'Endpoint to Update Category'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        category_id: 2,
                        category_name: 'Technology',
                        category_description: 'Updated description'
                    }
                }    
            */
            const category = new categoriesModel.Category(req.body);

            const { error } = categoriesModel.validateUpdateCategory(category);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.CATEGORIES.CATEGORIES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.CATEGORIES.CATEGORIES000.errorCode, errorMessage: error.message });
            }

            const categoryIdExists = await categoryRepository.existsByCategoryId(category.category_id);
            if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);

            const categoryNameExists = await categoryRepository.existsByCategoryName(category.category_name, category.category_id);
            if (categoryNameExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES005);

            await categoriesService.updateCategory(category);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Category Updated Successfully!"
            });
        } catch (error) {
            logger.error(`categoriesController :: updateCategory :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send();
        }
    },
    getCategories: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Categories']
                #swagger.summary = 'List Categories'
                #swagger.description = 'Endpoint to List Categories with pagination'
                #swagger.parameters['query'] = {
                    in: 'query',
                    required: false,
                    schema: {
                        pageSize: 10,
                        currentPage: 1
                    }
                }    
            */
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE } = req.query;
            const categories = await categoriesService.listCategories(Number(pageSize), Number(currentPage));
            const categoriesCount = await categoriesService.getCategoriesCount();

            return res.status(STATUS.OK).send({
                data: { categories, categoriesCount },
                message: "Categories Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`categoriesController :: getCategories :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.CATEGORIES.CATEGORIES000);
        }
    },
    getCategory: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Categories']
                #swagger.summary = 'Get Category'
                #swagger.description = 'Endpoint to Get Category'
                #swagger.parameters['params'] = {
                    in: 'params',
                    required: true,
                    schema: {
                        categoryId: 2
                    }
                }    
            */
            const { categoryId } = req.params;
            if (!categoryId) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES002);

            const categoryIdExists = await categoryRepository.existsByCategoryId(parseInt(categoryId));
            if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);

            const category = await categoriesService.getCategoryById(parseInt(categoryId));
            return res.status(STATUS.OK).send({
                data: category,
                message: "Category Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`categoriesController :: getCategory :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.CATEGORIES.CATEGORIES000);
        }
    },
    updateCategoryStatus: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Categories']
                #swagger.summary = 'Update Category Status'
                #swagger.description = 'Endpoint to Update Category Status'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        categoryId: 2,
                        status: 1
                    }
                }    
            */
            const { categoryId, status } = req.body;

            const { error } = categoriesModel.validateUpdateCategoryStatus(req.body);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.CATEGORIES.CATEGORIES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.CATEGORIES.CATEGORIES000.errorCode, errorMessage: error.message });
            }

            const categoryIdExists = await categoryRepository.existsByCategoryId(parseInt(categoryId));
            if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);

            await categoriesService.updateCategoryStatus(parseInt(categoryId), status);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Category Status Updated Successfully!"
            });
        } catch (error) {
            logger.error(`categoriesController :: updateCategoryStatus :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.CATEGORIES.CATEGORIES000);
        }
    }
};
