import { Response, Request } from "express";
import { logger, STATUS } from "ep-micro-common";
import { ERRORCODE } from "../constants";
import { eventsRepository } from "../repositories";
import { judgesService } from "../services";

export const judgesController = {
    getJudgesByEvent: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Judges']
            #swagger.summary = 'List Judges By Event'
            #swagger.description = 'Endpoint to List Judges By Event'
            #swagger.parameters['params'] = {
                    in: 'params',
                    required: true,
                    schema: {
                        eventId: 'E1',
                    }
            }   
            */
            const { eventId } = req.params;
            const eventExists = await eventsRepository.existsByEventId(eventId);
            if (!eventExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.EVENTS.EVENTS001);

            const judges = await judgesService.listJudges(String(eventId));

            return res.status(STATUS.OK).send({
                data: { judges },
                message: "Judges Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`judgesController :: getJudges :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.JUDGES.JUDGES000);
        }
    }
};
