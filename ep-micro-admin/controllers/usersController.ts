import { logger, STATUS } from "ep-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { usersService } from "../services";
import { IUser } from "../types/custom";
import { usersModel } from "../models";
import { ROLES, USERS } from "../constants/ERRORCODE";
import { encDecHelper } from "../helpers";
import { GridDefaultOptions } from "../enums";
import { rolesRepository, usersRepository } from "../repositories";

export const usersController = {
    listUsers: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'List Users'
                #swagger.description = 'Endpoint to Retrieve Users List'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        page_size: 50,
                        current_page: 1,
                        search_query: '8169104556'
                    }
                }    
            */
            const userId = req.plainToken.user_id;
            const pageSize = req.body.page_size || GridDefaultOptions.PAGE_SIZE;
            let currentPage = req.body.current_page || GridDefaultOptions.CURRENT_PAGE;
            const searchQuery = req.body.search_query || "";

            if (currentPage > 1) {
                currentPage = (currentPage - 1) * pageSize;
            } else {
                currentPage = 0;
            }

            const usersList = await usersService.listUsers(userId, pageSize, currentPage, searchQuery);
            const usersCount = await usersService.listUsersCount(userId, searchQuery);

            return res.status(STATUS.OK).send({
                data: { usersList, usersCount },
                message: "Users Fetched Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: listUsers :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    createUser: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Add User'
                #swagger.description = 'Endpoint to Add User'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        first_name: 'Narsima',
                        last_name: 'Chilkuri',
                        email_id: 'narsimachilkuri237@gmail.com',
                        mobile_number: '8169104556',
                        dob: '1997-08-16',
                        gender: 1,
                        role_id: 2,
                    }
                }    
            */
            const plainToken = req.plainToken;
            const user: IUser = new usersModel.User(req.body);

            const { error } = usersModel.validateCreateUser(user);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.message });
            }

            const roleExists = await rolesRepository.existsByRoleId(user.role_id);
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const userExists = await usersRepository.existsByMobileNumber(user.mobile_number);
            if (userExists) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00005);

            user.created_by = plainToken.user_id;
            user.updated_by = plainToken.user_id;

            await usersService.createUser(user);

            return res.status(STATUS.OK).send({
                data: null,
                message: "User Added Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: createUser :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    updateUser: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Update User'
                #swagger.description = 'Endpoint to Update User'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        user_id: 'encryptedHash',
                        first_name: 'Narsima',
                        last_name: 'Chilkuri',
                        email_id: 'narsimachilkuri237@gmail.com',
                        mobile_number: '8169104556',
                        dob: '1997-08-16',
                        gender: 1,
                        role_id: 2,
                        status: 1
                    }
                }    
            */
            const plainToken = req.plainToken;
            if (req.body.user_id) req.body.user_id = parseInt((req.body.user_id));

            const user: IUser = req.body;

            if (user.mobile_number) {
                user.user_name = user.mobile_number.toString();
            }

            const { error } = usersModel.validateUpdateUser(user);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.message });
            }

            const roleExists = await rolesRepository.existsByRoleId(user.role_id);
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const userExists = await usersRepository.existsByUserId(user.user_id);
            if (!userExists) return res.status(STATUS.BAD_REQUEST).send(USERS.USER000011);

            user.updated_by = plainToken.user_id;

            await usersService.updateUser(user);

            return res.status(STATUS.OK).send({
                data: null,
                message: "User Updated Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: updateUser :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    getUserById: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Get User'
                #swagger.description = 'Endpoint to Retrieve User Information By User Id'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                } 
            */
            const userId = req.params.userId;
            if (!userId) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00006)

            const user = await usersService.getUserById(parseInt(userId));

            return res.status(STATUS.OK).send({
                data: user,
                message: "User Fetched Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: getUserById :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    listUsersByRoleId: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'List Users'
                #swagger.description = 'Endpoint to Retrieve Users List By Role Id'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                } 
            */
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00007);

            const users = await usersService.getUsersByRoleId(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: users,
                message: "Users Fetched Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: listUsersByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    resetPasswordForUserId: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Reset User Password'
                #swagger.description = 'Endpoint to Reset User Password'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                } 
            */
            const userId = req.params.userId;
            if (!userId) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00006);

            const userExists = await usersRepository.existsByUserId(parseInt(userId));
            if (!userExists) return res.status(STATUS.BAD_REQUEST).send(USERS.USER000011);

            await usersService.resetPasswordForUserId(parseInt(userId));

            return res.status(STATUS.OK).send({
                data: null,
                message: "Resetted Password Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: resetPasswordForUserId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    updateStatus: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Users']
                #swagger.summary = 'Update User Status'
                #swagger.description = 'Update User Status by User Id and Status'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        user_id: 'encryptedHash',
                        status: 1
                    }
                }
        */
        try {
            let userId = req.body.user_id;
            const status = req.body.status;
            const updatedBy = req.plainToken.user_id;

            if (![0,1,2,3].includes(status)) return res.status(STATUS.BAD_REQUEST).send(USERS.USER000014);

            if (!userId) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00006);

            userId = parseInt(encDecHelper.decryptPayload(userId));

            const user = await usersService.getUserById(userId);
            if (!user) return res.status(STATUS.BAD_REQUEST).send(USERS.USER000011);

            await usersService.updateUserStatus(user, status, updatedBy);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Updated User Status Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: updateStatus :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    }
}
