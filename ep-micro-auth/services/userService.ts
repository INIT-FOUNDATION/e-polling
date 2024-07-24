import { IUser } from "../types/custom";
import { redis, logger, pg, nodemailerUtils, ejsUtils, commonCommunication, envUtils } from "ep-micro-common";
import { USERS } from "../constants/QUERY";
import { CONFIG } from "../constants/CONST";
import { SMS, WHATSAPP } from "../constants/COMMUNICATION";

export const userService = {
    getUserInRedisByUserName: async (username: string): Promise<string> => {
        try {
            let key = `Mob_User|Username:${username}`
            let result = await redis.GetKeyRedis(key);
            return result;
        } catch (error) {
            logger.error(`userService :: getUserInRedisByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getUserByUserName: async (userName: string): Promise<IUser> => {
        try {
            const cachedResult = await userService.getUserInRedisByUserName(userName);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            } else {
                const _query = {
                    text: USERS.getUserByUsername,
                    values: [userName]
                };
                logger.debug(`userService :: getUserByUserName :: query :: ${JSON.stringify(_query)}`);

                const result = await pg.executeQueryPromise(_query);
                logger.debug(`userService :: getUserByUserName :: db result :: ${JSON.stringify(result)}`);

                if (result && result.length > 0) {
                    redis.SetRedis(`EmployeeUser|Username:${userName}`, result[0], CONFIG.REDIS_EXPIRE_TIME_PWD);
                    return result[0];
                };
            }
        } catch (error) {
            logger.error(`userService :: getUserByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserLoginStatus: async (loginStatus: number, userName: string) => {
        try {
            const _query = {
                text: USERS.updateUserLoggedInStatus,
                values: [userName, loginStatus]
            };
            logger.debug(`userService :: updateUserLoginStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: updateUserLoginStatus :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(`EmployeeUser|Username:${userName}`);
        } catch (error) {
            logger.error(`userService :: updateUserLoginStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getInvalidLoginAttempts: async (user_name: string): Promise<number> => {
        try {
            const _query = {
                text: USERS.getInvalidAttempts,
                values: [user_name]
            };
            logger.debug(`userService :: getInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: getInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].invalid_attempts;
        } catch (error) {
            logger.error(`userService :: getInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getMaxInvalidLoginAttempts: async (): Promise<number> => {
        try {
            const _query = {
                text: USERS.getMaxInvalidLoginAttempts
            };
            logger.debug(`userService :: getMaxInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: getMaxInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].maximum_invalid_attempts;
        } catch (error) {
            logger.error(`userService :: getMaxInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    incrementInvalidLoginAttempts: async (userName: string) => {
        try {
            const _query = {
                text: USERS.incrementInvalidAttempts,
                values: [userName]
            };
            logger.debug(`userService :: incrementInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: incrementInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`userService :: incrementInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setUserInActive: async (userName: string) => {
        try {
            const _query = {
                text: USERS.setUserInActive,
                values: [userName]
            };
            logger.debug(`userService :: setUserInActive :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: setUserInActive :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
            redis.deleteRedis(`USERS_COUNT`);
        } catch (error) {
            logger.error(`userService :: setUserInActive :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setUserInRedisByTxnId : async (userData) => {     
        if (userData != undefined && userData != null) {
            let txnId = userData.txnId;
            await userService.sharePasswordToUser({
                otp: userData.otp,
                displayName: userData.display_name,
                emailId: userData.email_id,
                mobileNumber: userData.user_name,
                communicationType: "USER_LOGIN_OTP"
              });
            redis.SetRedis(`Mob_User|TxnId:${txnId}`, userData, 180)
        };
    },
    setUserInRedisForReg : async (phoneNo, userData, result) => {
        if (userData != undefined && userData != null) {
            try {
                let redisKey = `Mob_User|Mobile:${phoneNo}`
                await userService.setOTPInRedis(redisKey, userData);
                return result(null, 'done');
            } catch (e) {
                return result(e, null);
            }
        };
    },
    setOTPInRedis : async (redisKey, userData) => {
        let res = await userService.checkIfOtpExistInRedis(redisKey);
        if (res) {
            throw new Error('OTP ALREADY SENT')
        } else {
            redis.SetRedis(redisKey, userData, 180)
                .then()
                .catch(err => logger.error(err));
            return;
        }
    },
    checkIfOtpExistInRedis : async (key) => {
        let res = await redis.GetKeyRedis(key);
        return res;
    },
    sharePasswordToUser: async (passwordDetails: any) => {
        try {
          switch (passwordDetails.communicationType) {
            case "CREATE_USER":
              if (passwordDetails.emailId) {
                const emailTemplateHtml = await ejsUtils.generateHtml('views/sharePasswordEmailTemplate.ejs', passwordDetails);
                const emailBodyBase64 = Buffer.from(emailTemplateHtml).toString('base64');
                await commonCommunication.sendEmail(emailBodyBase64, 'OLL WORKFLOW AUTOMATION | LOGIN DETAILS', [passwordDetails.emailId]);
              }
    
              if (passwordDetails.mobileNumber) {
                const adminUrl = envUtils.getStringEnvVariableOrDefault("EP_WORKFLOW_USER_MODULE_URL", "http://localhost:4200");
                const smsBodyTemplate = SMS.USER_CREATION.body;
                const smsBodyCompiled = smsBodyTemplate.replace("<name>", passwordDetails.displayName)
                  .replace("<password>", passwordDetails.password)
                  .replace("<url>", adminUrl);
                await commonCommunication.sendSms(smsBodyCompiled, passwordDetails.mobileNumber, SMS.USER_CREATION.template_id);
    
                await commonCommunication.sendWhatsapp(WHATSAPP.USER_CREATION.template_id, passwordDetails.mobileNumber, [passwordDetails.displayName, passwordDetails.password, adminUrl])
              }
              break;
            case "RESET_PASSWORD":
              if (passwordDetails.emailId) {
                const emailTemplateHtml = await ejsUtils.generateHtml('views/sharePasswordEmailTemplate.ejs', passwordDetails);
                const emailBodyBase64 = Buffer.from(emailTemplateHtml).toString('base64');
                await commonCommunication.sendEmail(emailBodyBase64, 'OLL WORKFLOW AUTOMATION | LOGIN DETAILS', [passwordDetails.emailId]);
              }
    
              if (passwordDetails.mobileNumber) {
                const adminUrl = envUtils.getStringEnvVariableOrDefault("EP_WORKFLOW_MODULE_URL", "http://localhost:4200");
                const smsBodyTemplate = SMS.RESET_PASSWORD.body;
                const smsBodyCompiled = smsBodyTemplate.replace("<name>", passwordDetails.displayName)
                  .replace("<password>", passwordDetails.password)
                await commonCommunication.sendSms(smsBodyCompiled, passwordDetails.mobileNumber, SMS.RESET_PASSWORD.template_id);
                await commonCommunication.sendWhatsapp(WHATSAPP.RESET_PASSWORD.template_id, passwordDetails.mobileNumber, [passwordDetails.displayName, passwordDetails.password])
              }
              break;
            case "USER_LOGIN_OTP":
            //   if (passwordDetails.emailId) {
            //     const emailTemplateHtml = await ejsUtils.generateHtml('views/loginOTP.ejs', passwordDetails);
            //     const emailBodyBase64 = Buffer.from(emailTemplateHtml).toString('base64');
            //     await commonCommunication.sendEmail(emailBodyBase64, 'OLL WORKFLOW AUTOMATION | LOGIN DETAILS', [passwordDetails.emailId]);
            //   }
              if (passwordDetails.emailId) {
                const emailTemplateHtml = await ejsUtils.generateHtml('views/loginOTP.ejs', passwordDetails);
                await nodemailerUtils.sendEmail('OLL WORKFLOW AUTOMATION | LOGIN OTP', emailTemplateHtml, passwordDetails.emailId);
            }
    
              if (passwordDetails.mobileNumber) {
                const smsBodyTemplate = SMS.USER_LOGIN_WITH_OTP.body;
                const smsBodyCompiled = smsBodyTemplate.replace("<otp>", passwordDetails.otp)
                  .replace("<module>", "OLL Workflow Automation")
                  .replace("<time>", "3 min");
                await commonCommunication.sendSms(smsBodyCompiled, passwordDetails.mobileNumber, SMS.USER_LOGIN_WITH_OTP.template_id);
                await commonCommunication.sendWhatsapp(WHATSAPP.USER_LOGIN_WITH_OTP.template_id, passwordDetails.mobileNumber, ["OLL Workflow Automation", passwordDetails.otp, "3 mins"])
              }
              break;
    
            default:
              break;
          }
        } catch (error) {
          logger.error(`userService :: sharePasswordToUser :: ${error.message} :: ${error}`)
          throw new Error(error.message);
        }
      }
}