import { Response, Request } from "express";
import { logger, STATUS } from "ep-micro-common";
import { ERRORCODE } from "../constants";
import { eventsRepository } from "../repositories";
import { nominationsService } from "../services";
import { UploadedFile } from "express-fileupload";
import { requestModifierHelper } from "../helpers";
import { nominationsModel } from "../models";

export const nominationsController = {
    getNominationsByEvent: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Nominations']
            #swagger.summary = 'List Nominations By Event'
            #swagger.description = 'Endpoint to List Nominations By Event'
            #swagger.parameters['params'] = {
                    in: 'params',
                    required: true,
                    schema: {
                        eventId: 'E1',
                    }
                }   
            */
            const { eventId } = req.params;

            const eventExists = await eventsRepository.existsByEventId(String(eventId));
            if (!eventExists) return res.status(STATUS.NOT_FOUND).send(ERRORCODE.EVENTS.EVENTS001);

            const nominations = await nominationsService.listNominationsByEvent(String(eventId));

            return res.status(STATUS.OK).send({
                data: { nominations },
                message: "Nominations Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`nominationsController :: getNominations :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOMINATIONS.NOMINATIONS000);
        }
    },
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
            const file = req.files.file as UploadedFile;

            if (!file) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS006);

            const { error } = nominationsModel.validateCreateNomination(nomination);
            if (error) {
                return res.status(STATUS.BAD_REQUEST).send({ 
                    errorCode: ERRORCODE.NOMINATIONS.NOMINATIONS000.errorCode, 
                    errorMessage: error.details ? error.details[0].message : error.message 
                });
            }

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
};
