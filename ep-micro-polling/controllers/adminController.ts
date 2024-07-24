import { Request, Response } from "express";
import { STATUS } from "owa-micro-common";

export const adminController = {
    health: (req: Request, res: Response): Response => {
        /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Health Check API'
                #swagger.description = 'Endpoint to health check Admin Service'
        */
        return res.status(STATUS.OK).send({
            data: null,
            message: "Admin Service is Healthy",
        });
    }
}

