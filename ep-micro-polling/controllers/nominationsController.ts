import { Response, Request } from "express";
import { logger, STATUS } from "ep-micro-common";
import { ERRORCODE } from "../constants";
import { eventsRepository } from "../repositories";
import { nominationsService } from "../services";

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
};
