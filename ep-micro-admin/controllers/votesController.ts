import { logger, STATUS } from "ep-micro-common";
import { Request, Response } from "express";
import { GridDefaultOptions } from "../enums";
import { votesService } from "../services";
import { ERRORCODE } from "../constants";
import { eventsRepository } from "../repositories";

export const votesController = {
    listVotes: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Votes']
                #swagger.summary = 'List Votes'
                #swagger.description = 'Endpoint to List Votes with pagination'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE, eventId = "" } = req.query;
            const votes = await votesService.listVotes(Number(currentPage), Number(pageSize), String(eventId));
            const votesCount = await votesService.getVotesCount(String(eventId));

            return res.status(STATUS.OK).send({
                data: { votes: votes || [], votesCount },
                message: "Votes Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`votesController :: getJudges :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.VOTES.VOTES000);
        }
    },
    getNominationVotesByEventId: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Votes']
                #swagger.summary = 'Get Nomination Votes'
                #swagger.description = 'Endpoint to Get Nomination Votes with pagination'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE, eventId = "" } = req.query;
            
            const eventExists = await eventsRepository.existsByEventId(String(eventId));
            if (!eventExists) return res.status(STATUS.NOT_FOUND).send(ERRORCODE.EVENTS.EVENTS001);

            const votes = await votesService.getNomineeVotesByEvent(Number(currentPage), Number(pageSize), String(eventId));
            const votesCount = await votesService.getNomineeVotesCountByEvent(String(eventId));

            return res.status(STATUS.OK).send({
                data: { votes: votes || [], votesCount },
                message: "Votes Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`votesController :: getNominationVotesByEventId :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.VOTES.VOTES000);
        }
    }
}   