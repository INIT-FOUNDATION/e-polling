import { Response, Request } from "express";
import { logger, STATUS } from "ep-micro-common";
import { ERRORCODE } from "../constants";
import { eventsRepository } from "../repositories";
import { eventsService, nominationsService } from "../services";
import { UploadedFile } from "express-fileupload";
import { requestModifierHelper } from "../helpers";
import { nominationsModel } from "../models";
import { EventStatus } from "../enums";

export const nominationsController = {
    getNominationsByEvent: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Nominations']
            #swagger.summary = 'List Nominations By Event'
            #swagger.description = 'Endpoint to List Nominations By Event' 
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
            const file = req.files.file as UploadedFile;

            if (!file) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS006);

            if (file && ["image/jpeg", "image/png", "image/jpg"].indexOf(file.mimetype) === -1) 
                return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS007);

            if (file && file.size > 5 * 1024 * 1024) 
                return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS008);

            const { error } = nominationsModel.validateCreateNomination(nomination);
            if (error) {
                return res.status(STATUS.BAD_REQUEST).send({ 
                    errorCode: ERRORCODE.NOMINATIONS.NOMINATIONS000.errorCode, 
                    errorMessage: error.details ? error.details[0].message : error.message 
                });
            }

            const event = await eventsService.getEvent(nomination.eventId);
            if (event.status in [EventStatus.INACTIVE, EventStatus.DELETED]) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS009);
            if (event.status === EventStatus.CLOSED) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS010);

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
