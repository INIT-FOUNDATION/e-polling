import { logger, STATUS } from "ep-micro-common";
import { rolesService } from "../services/rolesService";
import { Response } from "express";
import { Request } from "../types/express";
import { validateCreateRole, validateUpdateRole, Role, validateUpdateRoleStatus } from "../models/rolesModel";
import { IRole } from "../types/custom";
import { ROLES } from "../constants/ERRORCODE";
import { GRID_DEFAULT_OPTIONS } from "../constants/CONST";

export const rolesController = {
    listRoles: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Roles']
                #swagger.summary = 'List Roles'
                #swagger.description = 'Endpoint to retrieve Roles List'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "Bearer token for authentication"
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        is_active: true,
                        page_size: 50,
                        current_page: 1
                    }
                }    
            */
            const isActive = req.body.is_active || false;
            const pageSize = req.body.page_size || 0;
            const currentPage = req.body.current_page ? (req.body.current_page - 1) * pageSize : 0 ;

            const rolesList = await rolesService.listRoles(isActive, pageSize, currentPage);
            const rolesCount = await rolesService.listRolesCount(isActive);

            return res.status(STATUS.OK).send({
                data: { rolesList, rolesCount },
                message: "Roles Fetched Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: listRoles :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    addRole: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Add Role'
            #swagger.description = 'Endpoint to create Role'
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
                        role_name: 'Department Head',
                        role_description: 'Head of the Department',
                        level: 'Level of Role',
                        permissions: [
                            {
                                menu_id: 1,
                                permission_id: 2
                            }
                        ]
                }
             }
            */
            const plainToken = req.plainToken;
            const role: IRole = new Role(req.body);
            const { error } = validateCreateRole(role);
    
            if (error) {
                if (error.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({
                        errorCode: ROLES.ROLE00000.errorCode,
                        errorMessage: error.details[0].message
                    });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({
                        errorCode: ROLES.ROLE00000.errorCode,
                        errorMessage: error.message
                    });
                }
            }
    
            const roleExistsByName = await rolesService.existsByRoleName(role.role_name, null);
            if (roleExistsByName) {
                return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00007);
            }
    
            role.created_by = plainToken.user_id;
            role.updated_by = plainToken.user_id;
    
            await rolesService.addRole(role);
    
            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Added Successfully"
            });
        } catch (error) {
            logger.error(`rolesController :: addRole :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    
    updateRole: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Update Role'
            #swagger.description = 'Endpoint to update Role'
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
                        role_id: 2,
                        role_name: 'Department Head',
                        role_description: 'Head of the Department',
                        status: 1,
                        level: 'Level of Role',
                        permissions: [
                            {
                                menu_id: 1,
                                permission_id: 2
                            }
                        ]
                }
            }
            */
            const plainToken = req.plainToken;
            const role: IRole = req.body
            const { error } = validateUpdateRole(role);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ROLES.ROLE00000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ROLES.ROLE00000.errorCode, errorMessage: error.message });
            }

            const roleExistsById = await rolesService.existsByRoleId(role.role_id);
            if (!roleExistsById) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const roleExistsByName = await rolesService.existsByRoleName(role.role_name, role.role_id);
            if (roleExistsByName) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00007);

            role.updated_by = plainToken.user_id;

            await rolesService.updateRole(role);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Updated Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: updateRole :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    getRoleById: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Get Role'
            #swagger.description = 'Endpoint to retrieve Role Information'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */

            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003)

            const roleExists = await rolesService.existsByRoleId(parseInt(roleId));
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const role = await rolesService.getRoleById(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: role,
                message: "Role Fetched Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: getRoleById :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    updateRoleStatus: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Update Role Status'
            #swagger.description = 'Endpoint to update Role Status'
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
                        role_id: 2,
                        status: 1
                }
            }
            */
            const plainToken = req.plainToken;
            const role: IRole = req.body
            const { error } = validateUpdateRoleStatus(role);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ROLES.ROLE00000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ROLES.ROLE00000.errorCode, errorMessage: error.message });
            }

            const roleExists = await rolesService.existsByRoleId(role.role_id);
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            await rolesService.updateRoleStatus(role.role_id, role.status, plainToken.user_id);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Status Updated Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: updateRoleStatus :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    getAccessListByRoleId: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Get Access List By Role Id'
            #swagger.description = 'Endpoint to retrieve Access List with Role Id'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003);

            const roleExists = await rolesService.existsByRoleId(parseInt(roleId));
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const accessList = await rolesService.getAccessListByRoleId(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: accessList,
                message: "Access List Fetched Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: getAccessListByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    getMenusList: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Get Menu List'
            #swagger.description = 'Endpoint to retrieve Menu List'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */
            const isActive = req.query.isActive === "1";
            const menusList = await rolesService.getMenusList(Boolean(isActive));

            return res.status(STATUS.OK).send({
                data: menusList,
                message: "Menus List Fetched Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: getMenusListByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    getDefaultAccessList: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Get Default Access List'
            #swagger.description = 'Endpoint to retrieve Default Access List'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */
            const defaultAccessList = await rolesService.getDefaultAccessList();
            return res.status(STATUS.OK).send({
                data: defaultAccessList,
                message: "Default Access List Fetched Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: getCombinedAccessListByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    getRolesByLevel: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'Get Roles by Level'
            #swagger.description = 'Endpoint to retrieve Roles List by level'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */
            const level = req.params.level;
            if (!level) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00009);

            const roles = await rolesService.getRolesByLevel(level);
            return res.status(STATUS.OK).send({
                data: roles,
                message: "Roles List Fetched Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: getRolesByLevel :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
    listLevels: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*
            #swagger.tags = ['Roles']
            #swagger.summary = 'List Levels'
            #swagger.description = 'Endpoint to retrieve List Levels'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */
            const level = req.plainToken.level;
            let levels = [];

            switch (level) {

                case 'Admin':
                    levels = ['Department', 'Employee'];
                    break;
    
                case 'Department':
                    levels = ['Employee'];
                    break;
    
                case 'Employee':
                    levels = ['Employee'];
                    break;
            }
            return res.status(STATUS.OK).send({
                data: levels,
                message: "Levels Fetched Successfully",
            });
        } catch (error) {
            logger.error(`rolesController :: listLevels :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ROLES.ROLE00000);
        }
    },
}