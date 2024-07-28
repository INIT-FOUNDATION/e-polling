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
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    nomineeId: 'N1',
                    nomineeName: 'Jane Doe',
                    selfNominee: false,
                    requesterName: 'John Smith',
                    requesterEmail: 'john.smith@example.com',
                    profilePictureUrl: 'http://example.com/profile.jpg',
                    nomineePlatformLinks: {
                        instagram: 'http://instagram.com/example',
                        tiktok: 'http://tiktok.com/example',
                        twitch: 'http://twitch.com/example',
                        youtube: 'http://youtube.com/example',
                        other: 'http://other.com/example'
                    },
                    eventId: 'E1',
                    dateCreated: '2024-07-25T12:00:00Z',
                    dateUpdated: '2024-07-25T12:00:00Z',
                    createdBy: 123,
                    updatedBy: 123,
                    status: 'PENDING'
                }
            }
            #swagger.parameters['file'] = {
                in: 'formData',
                required: true,
                type: 'file',
                description: 'Supporting document for the nomination'
            }
            */
            const nomination = new nominationsModel.Nomination(req.body);
            nomination.nomineeDeviceDetails = requestModifierHelper.appendClientDetailsInRequest(req);
            const userId = req.plainToken.user_id;
            const file = req.files.file as UploadedFile;

            if (!file) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS006);

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
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    nomineeId: 'N1',
                    nomineeName: 'Jane Doe',
                    selfNominee: false,
                    requesterName: 'John Smith',
                    requesterEmail: 'john.smith@example.com',
                    profilePictureUrl: 'http://example.com/profile.jpg',
                    nomineePlatformLinks: {
                        instagram: 'http://instagram.com/example',
                        tiktok: 'http://tiktok.com/example',
                        twitch: 'http://twitch.com/example',
                        youtube: 'http://youtube.com/example',
                        other: 'http://other.com/example'
                    },
                    eventId: 'E1',
                    dateCreated: '2024-07-25T12:00:00Z',
                    dateUpdated: '2024-07-25T12:00:00Z',
                    createdBy: 123,
                    updatedBy: 123,
                    status: 'PENDING'
                }
            }
            #swagger.parameters['file'] = {
                in: 'formData',
                required: false,
                type: 'file',
                description: 'Supporting document for the nomination (optional)'
            }
            */
            const nomination = new nominationsModel.Nomination(req.body);
            nomination.nomineeDeviceDetails = requestModifierHelper.appendClientDetailsInRequest(req);
            const userId = req.plainToken.user_id;
            const file = req.files.file as UploadedFile;

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
            #swagger.parameters['query'] = {
                in: 'query',
                required: false,
                schema: {
                    pageSize: 10,
                    currentPage: 1,
                    status: 1,
                    eventId: 'E1'
                }
            }
            */
            const userId = req.plainToken.user_id;
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE, status = NominationStatus.APPROVED, eventId } = req.query;
            const nominations = await nominationsService.listNominations(Number(pageSize), Number(currentPage), userId, Number(status), String(eventId));
            const nominationsCount = await nominationsService.getNominationsCount(userId, Number(status), String(eventId));

            return res.status(STATUS.OK).send({
                data: { nominations, nominationsCount },
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
            #swagger.parameters['params'] = {
                in: 'params',
                required: true,
                schema: {
                    nomineeId: 'N1'
                }
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
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    nomineeId: 'N1',
                    status: 'APPROVED'
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
