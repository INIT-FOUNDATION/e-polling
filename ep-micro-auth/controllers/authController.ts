import { Request, Response } from "express";
import { STATUS } from "ep-micro-common";

export const authContoller = {
    health: (req: Request, res: Response): Response => {
        /*  
            #swagger.tags = ['Auth']
            #swagger.summary = 'Health Check API'
            #swagger.description = 'Endpoint for health check of Auth Micro Service'
        */
        return res.status(STATUS.OK).send({
            data: null,
            message: "Auth Service is Healthy",
        });
    },
}