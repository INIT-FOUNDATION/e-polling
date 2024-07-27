import { Response } from "express";
import { Request } from "../types/express";
import { logger, STATUS } from "ep-micro-common";
import { judgesModel } from "../models";
import { ERRORCODE } from "../constants";
import { judgesRepository } from "../repositories";
import { judgesService } from "../services";
import { UploadedFile } from "express-fileupload";
import { GridDefaultOptions } from "../enums";

export const judgesController = {
    createJudge: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Judges']
            #swagger.summary = 'Create Judge'
            #swagger.description = 'Endpoint to Create Judge'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    judgeId: 'J1',
                    judgeName: 'John Doe',
                    designation: 'Judge',
                    eventId: 'E1',
                    status: 'ACTIVE'
                }
            }
            #swagger.parameters['file'] = {
                in: 'formData',
                required: true,
                type: 'file',
                description: 'Profile picture of the judge'
            }
            */
            const judge = new judgesModel.Judge(req.body);
            const userId = req.plainToken.user_id;
            const file = req.files.file as UploadedFile;

            if (!file) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.JUDGES.JUDGES006);

            const { error } = judgesModel.validateCreateJudge(judge);
            if (error) {
                if (error.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({ 
                        errorCode: ERRORCODE.JUDGES.JUDGES000.errorCode, 
                        errorMessage: error.details[0].message 
                    });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({ 
                        errorCode: ERRORCODE.JUDGES.JUDGES000.errorCode, 
                        errorMessage: error.message 
                    });
                }
            }

            judge.createdBy = userId;
            judge.updatedBy = userId;

            await judgesService.createJudge(judge, file);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Judge Created Successfully!"
            });
        } catch (error) {
            logger.error(`judgesController :: createJudge :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.JUDGES.JUDGES000);
        }
    },
    updateJudge: async (req: Request, res: Response) => {
        try {
            const judge = new judgesModel.Judge(req.body);
            const userId = req.plainToken.user_id;
            const file = req.files.file as UploadedFile;

            const { error } = judgesModel.validateUpdateJudge(judge);
            if (error) {
                if (error.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({ 
                        errorCode: ERRORCODE.JUDGES.JUDGES000.errorCode, 
                        errorMessage: error.details[0].message 
                    });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({ 
                        errorCode: ERRORCODE.JUDGES.JUDGES000.errorCode, 
                        errorMessage: error.message 
                    });
                }
            }

            const judgeIdExists = await judgesRepository.existsByJudgeId(judge.judgeId);
            if (!judgeIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.JUDGES.JUDGES001);

            judge.updatedBy = userId;

            await judgesService.updateJudge(judge, file);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Judge Updated Successfully!"
            });
        } catch (error) {
            logger.error(`judgesController :: updateJudge :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.JUDGES.JUDGES000);
        }
    },

    getJudges: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Judges']
            #swagger.summary = 'List Judges'
            #swagger.description = 'Endpoint to List Judges with pagination'
            #swagger.parameters['query'] = {
                in: 'query',
                required: false,
                schema: {
                    pageSize: 10,
                    currentPage: 1
                }
            }    
            */
            const userId = req.plainToken.user_id;
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE } = req.query;
            const judges = await judgesService.listJudges(Number(pageSize), Number(currentPage), userId);
            const judgesCount = await judgesService.getJudgesCount(userId);

            return res.status(STATUS.OK).send({
                data: { judges, judgesCount },
                message: "Judges Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`judgesController :: getJudges :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.JUDGES.JUDGES000);
        }
    },

    getJudge: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Judges']
            #swagger.summary = 'Get Judge'
            #swagger.description = 'Endpoint to Get Judge'
            #swagger.parameters['params'] = {
                in: 'params',
                required: true,
                schema: {
                    judgeId: 'J1'
                }
            }    
            */
            const { judgeId } = req.params;
            if (!judgeId) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.JUDGES.JUDGES002);

            const judgeIdExists = await judgesRepository.existsByJudgeId(judgeId);
            if (!judgeIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.JUDGES.JUDGES001);

            const judge = await judgesService.getJudge(judgeId);
            return res.status(STATUS.OK).send({
                data: judge,
                message: "Judge Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`judgesController :: getJudge :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.JUDGES.JUDGES000);
        }
    },

    updateJudgeStatus: async (req: Request, res: Response) => {
        try {
            /*  
            #swagger.tags = ['Judges']
            #swagger.summary = 'Update Judge Status'
            #swagger.description = 'Endpoint to Update Judge Status'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    judgeId: 'J1',
                    status: 1
                }
            }    
            */
            const { judgeId, status } = req.body;
            const userId = req.plainToken.user_id;

            const { error } = judgesModel.validateUpdateJudgeStatus(req.body);
            if (error) {
                if (error.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({ 
                        errorCode: ERRORCODE.JUDGES.JUDGES000.errorCode, 
                        errorMessage: error.details[0].message 
                    });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({ 
                        errorCode: ERRORCODE.JUDGES.JUDGES000.errorCode, 
                        errorMessage: error.message 
                    });
                }
            }

            const judgeIdExists = await judgesRepository.existsByJudgeId(judgeId);
            if (!judgeIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.JUDGES.JUDGES001);

            await judgesService.updateJudgeStatus(judgeId, status, userId);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Judge Status Updated Successfully!"
            });
        } catch (error) {
            logger.error(`judgesController :: updateJudgeStatus :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.JUDGES.JUDGES000);
        }
    }
};
