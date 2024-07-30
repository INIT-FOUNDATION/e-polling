import { CacheTTL, EventStatus } from "../enums";
import { votesRepository } from "../repositories";
import { IVote, IVoteResult } from "../types/custom";
import { logger, redis } from "ep-micro-common";
import { nominationsService } from "./nominationsService";
import { v4 as uuidv4 } from 'uuid';
import { encDecHelper } from "../helpers";
import { eventsService } from "./eventsService";
import { commonCommunication } from "ep-micro-common";
import moment from "moment";
import { COMMUNICATION } from "../constants";

export const votesService = {
    getMobileOtpForVote: async (vote: IVote): Promise<string> => {
        try {
            logger.info(`votesService :: getMobileOtpForVote :: vote :: ${vote}`);
            const txnId = uuidv4();
            const otp = Math.floor(100000 + Math.random() * 900000);

            const smsBodyTemplate = COMMUNICATION.SMS.USER_LOGIN_WITH_OTP.body;
            const smsBodyCompiled = smsBodyTemplate.replace("<otp>", String(otp))
              .replace("<module>", "E-Polling")
              .replace("<time>", "3 min");
            await commonCommunication.sendSms(smsBodyCompiled, vote.voterMobile, COMMUNICATION.SMS.USER_LOGIN_WITH_OTP.template_id);

            redis.SetRedis(`vote|txn_id:${txnId}`, { otp, vote }, CacheTTL.MID);
            return txnId;
        } catch (error) {
            logger.error(`votesService :: getMobileOtpForVote :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getMobileOtpDetails: async (txnId: string): Promise<any> => {
        try {
            logger.info(`votesService :: getMobileOtpDetails :: txnId :: ${txnId}`);
            const otpDetails = await redis.GetRedis(`vote|txn_id:${txnId}`);
            logger.debug(`votesService :: getMobileOtpDetails :: otpDetails :: ${JSON.stringify(otpDetails)}`);
            return otpDetails ? JSON.parse(otpDetails) : null;
        } catch (error) {
            logger.error(`votesService :: getMobileOtpDetails :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    verifyMobileOtp: async (txnId: string, otp: string): Promise<boolean> => {
        try {
            logger.info(`votesService :: verifyMobileOtp :: txnId :: ${txnId} :: otp :: ${otp}`);
            const otpDetails = await votesService.getMobileOtpDetails(txnId);
            if (!otpDetails) return false;

            const decrytedOtp = encDecHelper.decryptPayload(otp);
            if  (decrytedOtp !== otpDetails.otp) return false;

            await redis.deleteRedis(`votes|txn_id:${txnId}`);
            return true;
        } catch (error) {
            logger.error(`votesService :: verifyMobileOtp :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    publishVote: async (vote: IVote) => {
        try {
            const nomination = await nominationsService.getNomination(vote.nomineeId);
            const event = await eventsService.getEvent(nomination.eventId);
            if (moment().isAfter(moment(event.endTime))) {
                await eventsService.updateEventStatus(event.eventId, EventStatus.CLOSED, event.createdBy);
            };
            
            logger.info(`votesService :: publishVote :: vote :: ${JSON.stringify(vote)}`);
            await votesRepository.publishVote(vote);
            await redis.deleteRedis(`votes|page:0|limit:50`);
            await redis.deleteRedis(`votes|count`);
            await redis.deleteRedis(`votes|event:${nomination.eventId}|page:0|limit:50`);
            await redis.deleteRedis(`votes|event:${nomination.eventId}|count`);
            await redis.deleteRedis(`votes|event:${nomination.eventId}|page:0|limit:50`);
            await redis.deleteRedis(`votes_result|event:${nomination.eventId}|count`);
            await redis.deleteRedis(`votes_result|event:${nomination.eventId}|page:0|limit:50`);
            await redis.deleteRedis(`votes_result|event:${nomination.eventId}|count`);
        } catch (error) {
            logger.error(`votesService :: publishVote :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNomineeVotesByEvent: async (currentPage: number, pageSize: number, eventId: string): Promise<IVoteResult[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            const key = `votes_result|event:${eventId}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const votes = await votesRepository.getNominationVotesByEventId(currentPage, pageSize, eventId);
            if (votes && votes.length > 0) redis.SetRedis(key, votes, CacheTTL.LONG);
            return votes;
        } catch (error) {
            logger.error(`votesService :: getNomineeVotesByEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
}