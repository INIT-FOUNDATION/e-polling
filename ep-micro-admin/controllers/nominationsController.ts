import { Response } from "express";
import { Request } from "../types/express";
import { logger, STATUS } from "ep-micro-common";
import { nominationsModel } from "../models";
import { ERRORCODE } from "../constants";
import { nominationsRepository } from "../repositories";
import { nominationsService } from "../services";
import { UploadedFile } from "express-fileupload";
import { GridDefaultOptions, NominationStatus } from "../enums";
import { requestModifierHelper } from "../helpers";

export const nominationsController = {
    createNomination: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Nominations']
            #swagger.summary = 'Create Nomination'
            #swagger.description = 'Endpoint to Create Nomination'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            #swagger.parameters['nomineeName'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'Name of the nominee',
                example: 'Jane Doe'
            }
            #swagger.parameters['selfNominee'] = {
                in: 'formData',
                required: true,
                type: 'boolean',
                description: 'Whether the nomination is self-nomination',
                example: false
            }
            #swagger.parameters['requesterName'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'Name of the requester',
                example: 'John Smith'
            }
            #swagger.parameters['requesterEmail'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'Email of the requester',
                example: 'john.smith@example.com'
            }
            #swagger.parameters['nomineePlatformLinks'] = {
                in: 'formData',
                required: false,
                type: 'object',
                description: 'Platform links for the nominee',
                properties: {
                    instagram: {
                        type: 'string',
                        description: 'Instagram profile link',
                        example: 'http://instagram.com/example'
                    },
                    tiktok: {
                        type: 'string',
                        description: 'TikTok profile link',
                        example: 'http://tiktok.com/example'
                    },
                    twitch: {
                        type: 'string',
                        description: 'Twitch profile link',
                        example: 'http://twitch.com/example'
                    },
                    youtube: {
                        type: 'string',
                        description: 'YouTube profile link',
                        example: 'http://youtube.com/example'
                    },
                    other: {
                        type: 'string',
                        description: 'Other platform link',
                        example: 'http://other.com/example'
                    }
                }
            }
            #swagger.parameters['eventId'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'ID of the event',
                example: 'E1'
            }
            #swagger.parameters['file'] = {
                in: 'formData',
                required: true,
                type: 'file',
                description: 'Profile Picture for the nomination'
            }
            */
            const nomination = new nominationsModel.Nomination(req.body);
            nomination.nomineeDeviceDetails = requestModifierHelper.appendClientDetailsInRequest(req);
            const userId = req.plainToken.user_id;
            const file = req.files.file as UploadedFile;

            if (!file) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS006);

            if (["image/jpeg", "image/png", "image/jpg"].indexOf(file.mimetype) === -1) 
                return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS007);

            if (file.size > 5 * 1024 * 1024) 
                return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS008);

            const { error } = nominationsModel.validateCreateNomination(nomination);
            if (error) {
                return res.status(STATUS.BAD_REQUEST).send({ 
                    errorCode: ERRORCODE.NOMINATIONS.NOMINATIONS000.errorCode, 
                    errorMessage: error.details ? error.details[0].message : error.message 
                });
            }

            nomination.createdBy = userId;
            nomination.updatedBy = userId;

            await nominationsService.createNomination(nomination, file);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Nomination Created Successfully!"
            });
        } catch (error) {
            logger.error(`nominationsController :: createNomination :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOMINATIONS.NOMINATIONS000);
        }
    },
    updateNomination: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Nominations']
            #swagger.summary = 'Update Nomination'
            #swagger.description = 'Endpoint to Update Nomination'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            #swagger.parameters['nomineeId'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'Id of the nominee',
                example: 'N1'
            }
            #swagger.parameters['nomineeName'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'Name of the nominee',
                example: 'Jane Doe'
            }
            #swagger.parameters['selfNominee'] = {
                in: 'formData',
                required: true,
                type: 'boolean',
                description: 'Whether the nomination is self-nomination',
                example: false
            }
            #swagger.parameters['requesterName'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'Name of the requester',
                example: 'John Smith'
            }
            #swagger.parameters['requesterEmail'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'Email of the requester',
                example: 'john.smith@example.com'
            }
            #swagger.parameters['nomineePlatformLinks'] = {
                in: 'formData',
                required: false,
                type: 'object',
                description: 'Platform links for the nominee',
                properties: {
                    instagram: {
                        type: 'string',
                        description: 'Instagram profile link',
                        example: 'http://instagram.com/example'
                    },
                    tiktok: {
                        type: 'string',
                        description: 'TikTok profile link',
                        example: 'http://tiktok.com/example'
                    },
                    twitch: {
                        type: 'string',
                        description: 'Twitch profile link',
                        example: 'http://twitch.com/example'
                    },
                    youtube: {
                        type: 'string',
                        description: 'YouTube profile link',
                        example: 'http://youtube.com/example'
                    },
                    other: {
                        type: 'string',
                        description: 'Other platform link',
                        example: 'http://other.com/example'
                    }
                }
            }
            #swagger.parameters['eventId'] = {
                in: 'formData',
                required: true,
                type: 'string',
                description: 'ID of the event',
                example: 'E1'
            }
            #swagger.parameters['file'] = {
                in: 'formData',
                required: false,
                type: 'file',
                description: 'Profile Picture for the nomination'
            }
            */
            const nomination = new nominationsModel.Nomination(req.body);
            nomination.nomineeDeviceDetails = requestModifierHelper.appendClientDetailsInRequest(req);
            const userId = req.plainToken.user_id;
            const file = req.files && req.files.file ? req.files.file as UploadedFile : null;

            if (file && ["image/jpeg", "image/png", "image/jpg"].indexOf(file.mimetype) === -1) 
                return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS007);

            if (file && file.size > 5 * 1024 * 1024) 
                return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS008);

            const { error } = nominationsModel.validateUpdateNomination(nomination);
            if (error) {
                return res.status(STATUS.BAD_REQUEST).send({ 
                    errorCode: ERRORCODE.NOMINATIONS.NOMINATIONS000.errorCode, 
                    errorMessage: error.details ? error.details[0].message : error.message 
                });
            }

            const nominationIdExists = await nominationsRepository.existsByNomineeId(nomination.nomineeId);
            if (!nominationIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS001);

            nomination.updatedBy = userId;

            await nominationsService.updateNomination(nomination, file);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Nomination Updated Successfully!"
            });
        } catch (error) {
            logger.error(`nominationsController :: updateNomination :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOMINATIONS.NOMINATIONS000);
        }
    },
    getNominations: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Nominations']
            #swagger.summary = 'List Nominations'
            #swagger.description = 'Endpoint to List Nominations with pagination'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */
            const userId = req.plainToken.user_id;
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE, status = NominationStatus.PENDING, eventId = "" } = req.query;
            const nominations = await nominationsService.listNominations(Number(currentPage), Number(pageSize), userId, Number(status), String(eventId));
            const nominationsCount = await nominationsService.getNominationsCount(userId, Number(status), String(eventId));

            return res.status(STATUS.OK).send({
                data: { nominations: nominations || [], nominationsCount },
                message: "Nominations Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`nominationsController :: getNominations :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOMINATIONS.NOMINATIONS000);
        }
    },
    getNomination: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Nominations']
            #swagger.summary = 'Get Nomination'
            #swagger.description = 'Endpoint to Get a Nomination'
            #swagger.parameters['Authorization'] = {
                in: 'header',
                required: true,
                type: 'string',
                description: 'Bearer token for authentication'
            }
            */
            const { nomineeId } = req.params;
            if (!nomineeId) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS002);

            const nominationIdExists = await nominationsRepository.existsByNomineeId(nomineeId);
            if (!nominationIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS001);

            const nomination = await nominationsService.getNomination(nomineeId);
            return res.status(STATUS.OK).send({
                data: nomination,
                message: "Nomination Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`nominationsController :: getNomination :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOMINATIONS.NOMINATIONS000);
        }
    },
    updateNominationStatus: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Nominations']
            #swagger.summary = 'Update Nomination Status'
            #swagger.description = 'Endpoint to Update Nomination Status'
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
                    nomineeId: 'N1',
                    status: 1
                }
            }
            */
            const { nomineeId, status } = req.body;
            const userId = req.plainToken.user_id;

            const { error } = nominationsModel.validateUpdateNominationStatus(req.body);
            if (error) {
                return res.status(STATUS.BAD_REQUEST).send({ 
                    errorCode: ERRORCODE.NOMINATIONS.NOMINATIONS000.errorCode, 
                    errorMessage: error.details ? error.details[0].message : error.message 
                });
            }

            const nominationIdExists = await nominationsRepository.existsByNomineeId(nomineeId);
            if (!nominationIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS001);

            await nominationsService.updateNominationStatus(nomineeId, status, userId);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Nomination Status Updated Successfully!"
            });
        } catch (error) {
            logger.error(`nominationsController :: updateNominationStatus :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOMINATIONS.NOMINATIONS000);
        }
    },
};
