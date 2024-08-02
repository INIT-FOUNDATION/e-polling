import { logger, STATUS } from "ep-micro-common";
import { Request, Response } from "express";
import { supportRequestsService } from "../services";
import { ERRORCODE } from "../constants";
import { ISupportRequest } from "../types/custom";
import { SupportRequest } from "../models/supportRequestsModel";
import { supportRequestsModel } from "../models";
import { requestModifierHelper } from "../helpers";

export const supportRequestsController = {
    createSupportRequest: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Support Requests']
                #swagger.summary = 'Create Support Request'
                #swagger.description = 'Endpoint to Create Support Request'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        requesterName: 'Narsima Chilkuri',
                        requesterEmail: 'narsimachilkuri237@gmail.com',
                        requesterMessage: 'hello',
                    }
                } 
            */
            const supportRequest: ISupportRequest = new SupportRequest(req.body);
            supportRequest.requesterDeviceDetails = requestModifierHelper.appendClientDetailsInRequest(req);

            const { error } = supportRequestsModel.validateCreateSupportRequest(supportRequest);
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

            await supportRequestsService.createSupportRequest(supportRequest);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Support Requested Successfully!"
            });
        } catch (error) {
            logger.error(`supportRequestsController :: createSupportRequest :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.SUPPORTREQUESTS.SUPPORTREQUESTS000);
        }
    },
};
