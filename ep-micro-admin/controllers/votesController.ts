import { logger, STATUS } from "ep-micro-common";
import { Request, Response } from "express";
import { GridDefaultOptions } from "../enums";
import { votesService } from "../services";
import { ERRORCODE } from "../constants";

export const votesController = {
    listVotes: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Votes']
                #swagger.summary = 'List Votes'
                #swagger.description = 'Endpoint to List Votes with pagination'
                #swagger.parameters['query'] = {
                    in: 'query',
                    required: false,
                    schema: {
                        pageSize: 10,
                        currentPage: 1,
                        eventId: 'E1'
                    }
                }    
            */
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE, eventId } = req.query;
            const votes = await votesService.listVotes(Number(pageSize), Number(currentPage), String(eventId));
            const votesCount = await votesService.getVotesCount(String(eventId));

            return res.status(STATUS.OK).send({
                data: { votes, votesCount },
                message: "Votes Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`votesController :: getJudges :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.VOTES.VOTES000);
        }
    },
}   