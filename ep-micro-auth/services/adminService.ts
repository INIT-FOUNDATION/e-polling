import { IUser } from "../types/custom";
import { redis, logger, pg, nodemailerUtils, ejsUtils, commonCommunication } from "ep-micro-common";
import { USERS } from "../constants/QUERY";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import { CONFIG } from "../constants/CONST";
import { SMS, WHATSAPP } from "../constants/COMMUNICATION";
import { CacheTTL } from "../enums/cacheTTL";


export const adminService = {
    getUserInRedisByUserName: async (username: string): Promise<string> => {
        try {
            let key = `User|Username:${username}`
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
                redis.SetRedis(`Admin_Forgot_Password|User:${otpDetails.userName}`, otpDetails, 3 * 60);
                redis.SetRedis(`Admin_Forgot_Password|TxnId:${otpDetails.txnId}`, otpDetails, 3 * 60)
            };
        } catch (error) {
            logger.error(`adminService :: setForgotPasswordOTPInRedis :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getInvalidLoginAttempts: async (user_name: string): Promise<number> => {
        try {
            const _query = {
                text: USERS.getInvalidAttempts,
                values: [user_name]
            };
            logger.debug(`adminService :: getInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: getInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].invalid_attempts;
        } catch (error) {
            logger.error(`adminService :: getInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getMaxInvalidLoginAttempts: async (): Promise<number> => {
        try {
            const _query = {
                text: USERS.getMaxInvalidLoginAttempts
            };
            logger.debug(`adminService :: getMaxInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: getMaxInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].maximum_invalid_attempts;
        } catch (error) {
            logger.error(`adminService :: getMaxInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    incrementInvalidLoginAttempts: async (userName: string) => {
        try {
            const _query = {
                text: USERS.incrementInvalidAttempts,
                values: [userName]
            };
            logger.debug(`adminService :: incrementInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: incrementInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`adminService :: incrementInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setUserInActive: async (userName: string) => {
        try {
            const _query = {
                text: USERS.setUserInActive,
                values: [userName]
            };
            logger.debug(`adminService :: setUserInActive :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: setUserInActive :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
            redis.deleteRedis(`USERS_COUNT`);
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
                const _query = {
                    text: USERS.getUserByUsername,
                    values: [userName]
                };
                logger.debug(`adminService :: getUserByUserName :: query :: ${JSON.stringify(_query)}`);

                const result = await pg.executeQueryPromise(_query);
                logger.debug(`adminService :: getUserByUserName :: db result :: ${JSON.stringify(result)}`);

                if (result && result.length > 0) {
                    redis.SetRedis(`User|Username:${userName}`, result[0], CONFIG.REDIS_EXPIRE_TIME_PWD);
                    return result[0];
                };
            }
        } catch (error) {
            logger.error(`adminService :: getUserByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserLoginStatus: async (loginStatus: number, userName: string) => {
        try {
            const _query = {
                text: USERS.updateUserLoggedInStatus,
                values: [userName, loginStatus]
            };
            logger.debug(`adminService :: updateUserLoginStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: updateUserLoginStatus :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(`User|Username:${userName}`);
        } catch (error) {
            logger.error(`adminService :: updateUserLoginStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    resetPassword: async (newPassword: string, mobileNumber: number): Promise<boolean> => {
        try {
            const _query = {
                text: USERS.resetPasswordQuery,
                values: [newPassword, mobileNumber]
            };
            logger.debug(`adminService :: resetPassword :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: resetPassword :: db result :: ${JSON.stringify(result)}`);

            return true;
        } catch (error) {
            logger.error(`adminService :: resetPassword :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    isForgotPasswordOtpAlreadySent: async (mobileNumber: string): Promise<boolean> => {
        try {
            const key = `Admin_Forgot_Password|User:${mobileNumber}`;
            const cachedResult = await redis.GetKeyRedis(key);
            return cachedResult ? true : false;
        } catch (error) {
            logger.error(`adminService :: isForgotPasswordOtpAlreadySent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getForgotPasswordOtpDetails: async (txnId: string): Promise<string> => {
        try {
            const key = `Admin_Forgot_Password|TxnId:${txnId}`;
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
                await nodemailerUtils.sendEmail('OLL WORKFLOW AUTOMATION | FORGOT PASSWORD OTP', emailTemplateHtml, otpDetails.emailId);
            }
            if (otpDetails.mobileNumber) {
                const smsBodyTemplate = SMS.USER_LOGIN_WITH_OTP.body;
                const smsBodyCompiled = smsBodyTemplate.replace("<otp>", otpDetails.otp)
                  .replace("<module>", "OLL Workflow Automation")
                  .replace("<time>", "3 min");
                await commonCommunication.sendSms(smsBodyCompiled, otpDetails.mobileNumber, SMS.USER_LOGIN_WITH_OTP.template_id);
                await commonCommunication.sendWhatsapp(WHATSAPP.USER_LOGIN_WITH_OTP.template_id, otpDetails.mobileNumber, ["OLL Workflow Automation", otpDetails.otp, "3 mins"])
              }
        } catch (error) {
            logger.error(`adminService :: shareForgotOTPUserDetails :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    verifyForgetPasswordOtp: async (userName: string, oldTxnId: string): Promise<string> => {
        try {
            const txnId = uuidv4();
            const forgotPasswordUserKey = `Admin_Forgot_Password|User:${userName}`;
            const forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${txnId}`;
            const forgotPasswordTxnIdKey = `Admin_Forgot_Password|TxnId:${oldTxnId}`;

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
            const cachedResult = await redis.GetKeyRedis(`FORGOT_PASSWORD_CHANGE_${txnId}`);
            return cachedResult;
        } catch (error) {
            logger.error(`adminService :: getForgotPasswordChangeDetails :: ${error.message} :: ${error}`)
            throw new Error(error)
        }
    },
    resetForgetPassword: async (reqData: any, userName: string) => {
        try {
            const hashedPassword = await bcrypt.hash(reqData.newPassword, 10);
            const passwordUpdated = await adminService.resetPassword(hashedPassword, parseInt(userName));

            if (passwordUpdated) {
                await redis.deleteRedis(`FORGOT_PASSWORD_CHANGE_${reqData.txnId}`);
                await redis.deleteRedis(`Admin_Forgot_Password|User:${userName}`);
                await redis.deleteRedis(`User|Username:${userName}`);
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
    existsByUsername: async (userName: string): Promise<boolean> => {
        try {
            const _query = {
                text: USERS.existsByUserName,
                values: [userName]
            };
            logger.debug(`adminService :: existsByUsername :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: existsByUsername :: db result :: ${JSON.stringify(result)}`)

            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`adminService :: existsByUsername :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    existsByMobileNumber: async (mobileNumber: number): Promise<boolean> => {
        try {
            const _query = {
                text: USERS.existsByMobileNumber,
                values: [mobileNumber]
            };
            logger.debug(`adminService :: existsByMobileNumber :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: existsByMobileNumber :: db result :: ${JSON.stringify(result)}`)

            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`adminService :: existsByMobileNumber :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
}