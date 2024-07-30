import { IUser } from "../types/custom";
import { redis, logger, nodemailerUtils, ejsUtils, commonCommunication } from "ep-micro-common";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import { CONFIG } from "../constants/CONST";
import { SMS, WHATSAPP } from "../constants/COMMUNICATION";
import { CacheTTL } from "../enums/cacheTTL";
import { adminRepository } from "../repositories";


export const adminService = {
    getUserInRedisByUserName: async (username: string): Promise<string> => {
        try {
            let key = `user|username:${username}`
            let result = await redis.GetKeyRedis(key);
            return result;
        } catch (error) {
            logger.error(`adminService :: getUserInRedisByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setForgotPasswordOTPInRedis: async (otpDetails: any) => {
        try {
            if (otpDetails) {
                redis.SetRedis(`forgot_password|user:${otpDetails.userName}`, otpDetails, 3 * 60);
                redis.SetRedis(`forgot_password|txnId:${otpDetails.txnId}`, otpDetails, 3 * 60)
            };
        } catch (error) {
            logger.error(`adminService :: setForgotPasswordOTPInRedis :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setUserInActive: async (userName: string) => {
        try {
            await adminRepository.setUserInActive(userName);
            await redis.deleteRedis(`users|offset:0|limit:50`);
            await redis.deleteRedis(`users_count`);
        } catch (error) {
            logger.error(`adminService :: setUserInActive :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getUserByUserName: async (userName: string): Promise<IUser> => {
        try {
            const cachedResult = await adminService.getUserInRedisByUserName(userName);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            } else {
                const user = await adminRepository.getUserByUserName(userName);
                logger.debug(`adminService :: getUserByUserName :: user :: ${JSON.stringify(user)}`);

                if (user) {
                    redis.SetRedis(`users|username:${userName}`, user, CONFIG.REDIS_EXPIRE_TIME_PWD);
                    return user;
                };
            }
        } catch (error) {
            logger.error(`adminService :: getUserByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserLoginStatus: async (loginStatus: number, userName: string) => {
        try {
            await adminRepository.updateUserLoginStatus(loginStatus, userName);
            await redis.deleteRedis(`user|username:${userName}`);
        } catch (error) {
            logger.error(`adminService :: updateUserLoginStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    isForgotPasswordOtpAlreadySent: async (mobileNumber: string): Promise<boolean> => {
        try {
            const key = `forgot_password|user:${mobileNumber}`;
            const cachedResult = await redis.GetKeyRedis(key);
            return cachedResult ? true : false;
        } catch (error) {
            logger.error(`adminService :: isForgotPasswordOtpAlreadySent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getForgotPasswordOtpDetails: async (txnId: string): Promise<string> => {
        try {
            const key = `forgot_password|txnId:${txnId}`;
            const cachedResult = await redis.GetKeyRedis(key);
            return cachedResult;
        } catch (error) {
            logger.error(`adminService :: isForgotPasswordOtpAlreadySent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getForgetPasswordOtp: async (mobileNumber: string): Promise<string> => {
        try {
            let txnId = uuidv4();
            let otp = Math.floor(100000 + Math.random() * 900000);
            const user = await adminService.getUserByUserName(mobileNumber);
            const otpDetails = {
                otp,
                txnId,
                userName: user.user_name,
                displayName: user.display_name,
                emailId: user.email_id,
                mobileNumber: mobileNumber
            }

            adminService.setForgotPasswordOTPInRedis(otpDetails);
            adminService.shareForgotOTPUserDetails(otpDetails);
            return txnId;
        } catch (error) {
            logger.error(`adminService :: getForgetPasswordOtp :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    shareForgotOTPUserDetails: async (otpDetails: any) => {
        try {
            if (otpDetails.emailId) {
                const emailTemplateHtml = await ejsUtils.generateHtml('views/forgotPasswordOtpEmailTemplate.ejs', otpDetails);
                await nodemailerUtils.sendEmail('E-POLLING | FORGOT PASSWORD OTP', emailTemplateHtml, otpDetails.emailId);
            }
            if (otpDetails.mobileNumber) {
                const smsBodyTemplate = SMS.USER_LOGIN_WITH_OTP.body;
                const smsBodyCompiled = smsBodyTemplate.replace("<otp>", otpDetails.otp)
                  .replace("<module>", "E-Polling")
                  .replace("<time>", "3 min");
                await commonCommunication.sendSms(smsBodyCompiled, otpDetails.mobileNumber, SMS.USER_LOGIN_WITH_OTP.template_id);
                await commonCommunication.sendWhatsapp(WHATSAPP.USER_LOGIN_WITH_OTP.template_id, otpDetails.mobileNumber, ["E-Polling", otpDetails.otp, "3 mins"])
              }
        } catch (error) {
            logger.error(`adminService :: shareForgotOTPUserDetails :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    verifyForgetPasswordOtp: async (userName: string, oldTxnId: string): Promise<string> => {
        try {
            const txnId = uuidv4();
            const forgotPasswordUserKey = `forgot_password|user:${userName}`;
            const forgotPasswordChangeKey = `forgot_password_change|txnId:${txnId}`;
            const forgotPasswordTxnIdKey = `forgot_password|txnId:${oldTxnId}`;

            await redis.deleteRedis(forgotPasswordUserKey);
            await redis.deleteRedis(forgotPasswordTxnIdKey);
            redis.SetRedis(forgotPasswordChangeKey, { userName }, CacheTTL.SHORT);
            return txnId;
        } catch (error) {
            logger.error(`adminService :: verifyForgetPasswordOtp :: ${error.message} :: ${error}`)
            throw new Error(error)
        }
    },
    getForgotPasswordChangeDetails: async (txnId: string) => {
        try {
            const cachedResult = await redis.GetKeyRedis(`forgot_password_change|txnId:${txnId}`);
            return cachedResult;
        } catch (error) {
            logger.error(`adminService :: getForgotPasswordChangeDetails :: ${error.message} :: ${error}`)
            throw new Error(error)
        }
    },
    resetForgetPassword: async (reqData: any, userName: string) => {
        try {
            const hashedPassword = await bcrypt.hash(reqData.newPassword, 10);
            const passwordUpdated = await adminRepository.resetPassword(hashedPassword, parseInt(userName));

            if (passwordUpdated) {
                await redis.deleteRedis(`forgot_password_change|txnId:${reqData.txnId}`);
                await redis.deleteRedis(`forgot_password|user:${userName}`);
                await redis.deleteRedis(`user|username:${userName}`);
                await redis.deleteRedis(userName);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            logger.error(`adminService :: resetForgetPassword :: ${error.message} :: ${error}`)
            throw new Error(error)
        }
    },
}