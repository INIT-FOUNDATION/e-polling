import { logger, STATUS } from "ep-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { GridDefaultOptions } from "../enums";
import { supportRequestsService } from "../services";
import { ERRORCODE } from "../constants";
import { SupportRequestsPeriodTypes } from "../enums";
import { supportRequestsModel } from "../models";
import { supportRequestsRepository } from "../repositories";

export const supportRequestsController = {
    getSupportRequests: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Support Requests']
                #swagger.summary = 'List Support Requests'
                #swagger.description = 'Endpoint to List Support Requests with pagination and filtering by period'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
           
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE, periodType = SupportRequestsPeriodTypes.TODAY } = req.query;

            if (periodType && !Object.values(SupportRequestsPeriodTypes).includes(Number(periodType))) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.SUPPORTREQUESTS.SUPPORTREQUESTS000);

            const supportRequests = await supportRequestsService.listSupportRequests(Number(currentPage), Number(pageSize), Number(periodType));
            const supportRequestsCount = await supportRequestsService.getSupportRequestsCount(Number(periodType));

            return res.status(STATUS.OK).send({
                data: { supportRequests: supportRequests || [], supportRequestsCount },
                message: "Support Requests Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`supportRequestsController :: getSupportRequests :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.SUPPORTREQUESTS.SUPPORTREQUESTS000);
        }
    },
    updateSupportRequestStatus: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Support Requests']
                #swagger.summary = 'Update Support Request Status'
                #swagger.description = 'Endpoint to Update Support Request Status'
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
                        supportRequestId: 'S1',
                        status: 1
                    }
                }
            */

            const { error } = supportRequestsModel.validateUpdateSupportRequestStatus(req.body);
            if (error) {
                if (error.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({
                        errorCode: ERRORCODE.SUPPORTREQUESTS.SUPPORTREQUESTS000.errorCode,
                        errorMessage: error.details[0].message
                    });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({
                        errorCode: ERRORCODE.SUPPORTREQUESTS.SUPPORTREQUESTS000.errorCode,
                        errorMessage: error.message
                    });
                }
            }
            const resolvedBy = req.plainToken.user_id;

            const supportRequestExists = await supportRequestsRepository.existsBySupportRequestId(req.body.supportRequestId);
            if (!supportRequestExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.SUPPORTREQUESTS.SUPPORTREQUESTS001);

            await supportRequestsService.updateSupportRequestStatus(req.body.supportRequestId, req.body.status, resolvedBy);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Support Request Status Updated Successfully!"
            });
        } catch (error) {
            logger.error(`supportRequestsController :: updateSupportRequestStatus :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.SUPPORTREQUESTS.SUPPORTREQUESTS000);
        }
    }
};
