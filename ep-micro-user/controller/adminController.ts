import { Response } from "express";
import { STATUS, logger, envUtils } from "ep-micro-common";
import { ERRORCODE } from "../constants";
import { Request } from "../types/express";
import { adminService } from "../services";
import { UploadedFile } from "express-fileupload";
import { adminModel } from "../models";
import { IUser } from "../types/custom";

export const adminController = {
    getLoggedInUserInfo: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Get Logged In User Info'
                #swagger.description = 'Endpoint to retrieve information about the currently logged-in user.'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: "string",
                    description: "Bearer token for authentication"
                }
            */
            const user_id = req.plainToken.user_id;
            const user = await adminService.getLoggedInUserInfo(user_id);
            return res.status(STATUS.OK).send({
                data: user,
                message: "Logged In User Info Fetched Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: getLoggedInUserInfo :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.ADMIN.ADMIN00000);
        }
    },
    updateProfilePic: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Update Profile Pic'
                #swagger.description = 'Endpoint to Update Profile Pic'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['file'] = {
                    in: 'formData',
                    required: true,
                    type: 'file',
                    description: 'Profile picture file to upload'
                }
            */
            const plainToken = req.plainToken;
            const file = req.files.file as UploadedFile;

            if (!file) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.ADMIN.ADMIN00001);

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.mimetype)) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.ADMIN.ADMIN00002);

            const uploadSizeLimit = envUtils.getNumberEnvVariableOrDefault("EP_UPLOAD_FILE_SIZE_LIMIT", 5 * 1024 * 1024)
            if (file.size > uploadSizeLimit) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.ADMIN.ADMIN00003);

            await adminService.updateProfilePic(file, plainToken.user_id);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Profile Picture Updated Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: updateProfilePic :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.ADMIN.ADMIN00000);
        }
    },
    updateProfile: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Update Profile'
                #swagger.description = 'Endpoint to User Profile'
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
                        dob: '1997-08-16'
                    }
                }  
            */
            const user: IUser = req.body;
            const { error } = adminModel.validateUpdateUser(user);

            if (error) {
                    if (error.details != null)
                        return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.ADMIN.ADMIN00000.errorCode, errorMessage: error.details[0].message });
                    else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.ADMIN.ADMIN00000.errorCode, errorMessage: error.message });
            }
            
            const plainToken = req.plainToken;

            await adminService.updateProfile(user, plainToken.user_id);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Profile Updated Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: updateUser :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.ADMIN.ADMIN00000);
        }
    },
}


