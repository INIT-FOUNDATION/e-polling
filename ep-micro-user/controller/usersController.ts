import { Request, Response } from "express";
import { STATUS } from "ep-micro-common";

export const userController = {
    health: (req: Request, res: Response): Response => {
        /*  
            #swagger.tags = ['User']
            #swagger.summary = 'Health Check API'
            #swagger.description = 'Endpoint for health check of User Micro Service'
        */
        return res.status(STATUS.OK).send({
            data: null,
            message: "User Service is Healthy",
        });
    }
}

