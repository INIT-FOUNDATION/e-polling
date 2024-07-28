import { logger, STATUS } from "ep-micro-common";
import { Request, Response } from "express";
import { ERRORCODE } from "../constants";
import { nominationsRepository, votesRepository } from "../repositories";
import { Vote } from "../models/votesModel";
import { requestModifierHelper } from "../helpers";
import { votesService } from "../services";
import { votesModel } from "../models";

export const votesController = {
    publishVoteWithMobile: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Votes']
                #swagger.summary = 'Publish Vote'
                #swagger.description = 'Endpoint to List Votes with pagination'
                #swagger.parameters['query'] = {
                    in: 'query',
                    required: false,
                    schema: {
                        nomineeId: 'N1',
                        voterName: 'John Doe',
                        voterMobile: 1234567890
                    }
                }    
            */
            const vote = new Vote(req.body);
            vote.voterDeviceDetails = requestModifierHelper.appendClientDetailsInRequest(req);

            const { error } = votesModel.validateCreateVote(req.body);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.VOTES.VOTES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.VOTES.VOTES000.errorCode, errorMessage: error.message });
            } 

            const nomineeExists = await nominationsRepository.existsByNomineeId(vote.nomineeId);
            if (!nomineeExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS001);

            const voteExists = await votesRepository.existsVoteByNomineeAndMobile(vote.nomineeId, vote.voterMobile);
            if (voteExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.VOTES.VOTES001);

            const txnId = await votesService.getMobileOtpForVote(vote);

            return res.status(STATUS.OK).send({
                data: { txnId },
                message: "Vote Otp Sent Successfully!"
            });
        } catch (error) {
            logger.error(`votesController :: publishVoteWithMobile :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.VOTES.VOTES000);
        }
    },
    verifyVoteWithMobile: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Votes']
                #swagger.summary = 'Verify Vote'
                #swagger.description = 'Endpoint to List Votes with pagination'
                #swagger.parameters['query'] = {
                    in: 'query',
                    required: false,
                    schema: {
                        txnId: 'N1',
                        otp: 'encryptedOtp'
                    }
                }    
            */
            const { txnId, otp } = req.body;

            const { error } = votesModel.validateVerifyVoteOtp(req.body);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.VOTES.VOTES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.VOTES.VOTES000.errorCode, errorMessage: error.message });
            } 

            const otpDetails = await votesService.getMobileOtpDetails(txnId);
            if (!otpDetails) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.VOTES.VOTES002);

            const otpVerified = await votesService.verifyMobileOtp(txnId, otp);
            if (!otpVerified) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.VOTES.VOTES003);

            await votesService.publishVote(otpDetails.vote);
            return res.status(STATUS.OK).send({
                data: {},
                message: "Vote Published Successfully!"
            });
        } catch (error) {
            logger.error(`votesController :: verifyVoteWithMobile :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.VOTES.VOTES000);
        }
    },
    publishVoteWithEmail: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Votes']
                #swagger.summary = 'Publish Vote'
                #swagger.description = 'Endpoint to List Votes with pagination'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        nomineeId: 'N1',
                        voterName: 'John Doe',
                        voterEmail: 'yN9Ji@example.com'
                    }
                }    
            */
            const vote = new Vote(req.body);
            vote.voterDeviceDetails = requestModifierHelper.appendClientDetailsInRequest(req);

            const { error } = votesModel.validateCreateVote(req.body);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.VOTES.VOTES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.VOTES.VOTES000.errorCode, errorMessage: error.message });
            }

            const nomineeExists = await nominationsRepository.existsByNomineeId(vote.nomineeId);
            if (!nomineeExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOMINATIONS.NOMINATIONS001);

            const voteExists = await votesRepository.existsVoteByNomineeIdAndEmail(vote.nomineeId, vote.voterEmail);
            if (voteExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.VOTES.VOTES001);

            await votesService.publishVote(vote);

            return res.status(STATUS.OK).send({
                data: {},
                message: "Vote Published Successfully!"
            });
        } catch (error) {
            logger.error(`votesController :: publishVoteWithEmail :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.VOTES.VOTES000);
        }
    }
}   