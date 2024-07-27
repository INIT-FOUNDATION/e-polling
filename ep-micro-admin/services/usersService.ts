import { pg, logger, redis, JSONUTIL, objectStorageUtility, envUtils, ejsUtils, commonCommunication } from "ep-micro-common";
import { USERS } from "../constants/QUERY";
import { IPasswordPolicy, IUser } from "../types/custom";
import { DEFAULT_PASSWORD, OBJECT_STORAGE_BUCET } from "../constants/CONST";
import { passwordPoliciesService } from "./passwordPoliciesService";
import bcrypt from "bcryptjs";
import RandExp from "randexp";
import { SMS, WHATSAPP } from "../constants/COMMUNICATION";
import { CacheTTL } from "../enums";
import { usersRepository } from "../repositories";

export const usersService = {
  listUsers: async (userId: number, pageSize: number, currentPage: number, searchQuery: string): Promise<IUser[]> => {
    try {
      let key = `users|user:${userId}`;
      const _query = {
        text: USERS.usersList
      };

      if (searchQuery) {
        const isSearchStringAMobileNumber = /^\d{10}$/.test(searchQuery);
        if (isSearchStringAMobileNumber) {
          key += `|search|mobile_number:${searchQuery}`;
          _query.text += ` AND mobile_number = ${searchQuery}`;
        } else {
          _query.text += ` AND display_name ILIKE '%${searchQuery}%'`;
          key += `|search|display_name:${searchQuery}`;
        }
      }

      if (pageSize) {
        key += `|LIMIT:${pageSize}`;
        _query.text += ` LIMIT ${pageSize}`;
      }

      if (currentPage) {
        key += `|OFFSET:${currentPage}`;
        _query.text += ` OFFSET ${currentPage}`;
      }

      const isUserUpdatedWithin5min = await usersRepository.usersUpdatedWithinFiveMints();

      if (!isUserUpdatedWithin5min) {
        const cachedResult = await redis.GetKeyRedis(key);
        if (cachedResult) {
          logger.debug(`usersService :: listUsers :: cached result :: ${cachedResult}`)
          return JSON.parse(cachedResult)
        }
      }

      logger.debug(`usersService :: listUsers :: query :: ${JSON.stringify(_query)}`);

      const usersResult: IUser[] = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: listUsers :: db result :: ${JSON.stringify(usersResult)}`);

      for (const user of usersResult) {
        if (user.profile_pic_url) user.profile_pic_url = await usersService.generatePublicURLFromObjectStoragePrivateURL(user.profile_pic_url, 3600);
      }

      if (usersResult && usersResult.length > 0) redis.SetRedis(key, usersResult, CacheTTL.LONG);
      return usersResult;
    } catch (error) {
      logger.error(`usersService :: listUsers :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  listUsersCount: async (userId: number, searchQuery: string): Promise<number> => {
    try {
      let key = `users_count|user:${userId}`;
      const _query = {
        text: USERS.usersListCount
      };

      if (userId != 1) _query.text += ` AND ${userId} = ANY(reporting_to_users)`;

      if (searchQuery) {
        const isSearchStringAMobileNumber = /^\d{10}$/.test(searchQuery);
        if (isSearchStringAMobileNumber) {
          key += `|search|mobile_number:${searchQuery}`;
          _query.text += ` AND mobile_number = ${searchQuery}`;
        } else {
          _query.text += ` AND display_name ILIKE '%${searchQuery}%'`;
          key += `|search|display_name:${searchQuery}`;
        }
      }

      const isUserUpdatedWithin5min = await usersRepository.usersUpdatedWithinFiveMints();

      if (!isUserUpdatedWithin5min) {
        const cachedResult = await redis.GetKeyRedis(key);
        if (cachedResult) {
          logger.debug(`usersService :: listUsersCount :: cached result :: ${cachedResult}`)
          return JSON.parse(cachedResult)
        }
      }

      logger.debug(`usersService :: listUsersCount :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: listUsersCount :: db result :: ${JSON.stringify(result)}`)

      if (result.length > 0) {
        const count = parseInt(result[0].count);
        if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
        return count
      };
    } catch (error) {
      logger.error(`usersService :: listUsersCount :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  createUser: async (user: IUser) => {
    try {
      const passwordPolicies = await passwordPoliciesService.listPasswordPolicies();
      const passwordPolicy = passwordPolicies[0];

      const { encryptedPassword, plainPassword } = await usersService.generatePasswordFromPasswordPolicy(passwordPolicy);
      user.password = encryptedPassword;
      user.display_name = JSONUTIL.capitalize(user.display_name.trim());

      await usersRepository.createUser(user);

      await usersService.sharePasswordToUser({
        emailId: user.email_id,
        password: plainPassword,
        displayName: user.display_name,
        mobileNumber: user.mobile_number,
        communicationType: "CREATE_USER"
      });

      await redis.deleteRedis(`users|user:1|limit:50`);
      await redis.deleteRedis(`users_count|user:1`);
    } catch (error) {
      logger.error(`usersService :: createUser :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateUser: async (user: IUser) => {
    try {
      await usersRepository.updateUser(user);

      await redis.deleteRedis(`users|user:1|limit:50`);
      await redis.deleteRedis(`users_count|user:1`);
      await redis.deleteRedis(`user:${user.user_id}`);
      await redis.deleteRedis(`user|username:${user.user_name}`);
    } catch (error) {
      logger.error(`usersService :: updateUser :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getUserById: async (userId: number): Promise<IUser> => {
    try {
      const key = `USER:${userId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`usersService :: getUserById :: userId :: ${userId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const user = await usersRepository.getUserById(userId);

      if (user) {
        if (user) user.profile_pic_url = await usersService.generatePublicURLFromObjectStoragePrivateURL(user.profile_pic_url, 3600);
        redis.SetRedis(key, user, CacheTTL.LONG)
        return user;
      }
    } catch (error) {
      logger.error(`usersService :: getUserById :: userId :: ${userId} :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  generatePasswordFromPasswordPolicy: async (passwordPolicy: IPasswordPolicy): Promise<any> => {
    try {
      let pattern = "", tempStr = "";
      const alphabetical = /[A-Z][a-z]/;
      const numeric = /[0-9]/;
      const special = /[!@#$&*]/;

      const passwordLength = passwordPolicy.minimum_password_length;
      tempStr += (passwordPolicy.complexity && passwordPolicy.alphabetical) ? alphabetical.source : '';
      tempStr += numeric.source;

      if (passwordPolicy.complexity && passwordPolicy.numeric) {
        tempStr += numeric.source;
      }

      if (passwordPolicy.complexity && passwordPolicy.special_characters) {
        tempStr += special.source;
      }

      if (tempStr) {
        tempStr += `{${passwordLength}}`;
        pattern = tempStr;
      } else {
        pattern = '[1-9]{' + length + '}';
      }

      const regexPattern = new RegExp(pattern);
      const randomExpression = new RandExp(regexPattern).gen();
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(randomExpression, salt);
      return { encryptedPassword, plainPassword: randomExpression };
    } catch (error) {
      logger.error(`usersService :: generatePasswordFromPasswordPolicy :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getUsersByRoleId: async (roleId: number): Promise<IUser[]> => {
    try {
      const key = `users|role:${roleId}`;
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`usersService :: getUsersByRoleId :: roleId :: ${roleId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const users = await usersRepository.getUsersByRoleId(roleId);
      
      if (users && users.length > 0) redis.SetRedis(key, users, CacheTTL.LONG);
      return users;
    } catch (error) {
      logger.error(`usersService :: getUsersByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  resetPasswordForUserId: async (userId: number) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(DEFAULT_PASSWORD, salt);

      await usersRepository.resetPasswordForUserId(password, userId);
    } catch (error) {
      logger.error(`usersService :: resetPasswordForUserId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  generatePublicURLFromObjectStoragePrivateURL: async (locationPath: string, expiresIn: number = 3600): Promise<string> => {
    try {
      const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCET, locationPath, expiresIn);
      return temporaryPublicURL;
    } catch (error) {
      logger.error(`usersService :: generatePublicURLFromObjectStoragePrivateURL :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  sharePasswordToUser: async (passwordDetails: any) => {
    try {
      switch (passwordDetails.communicationType) {
        case "CREATE_USER":
          if (passwordDetails.emailId) {
            const emailTemplateHtml = await ejsUtils.generateHtml('views/sharePasswordEmailTemplate.ejs', passwordDetails);
            const emailBodyBase64 = Buffer.from(emailTemplateHtml).toString('base64');
            await commonCommunication.sendEmail(emailBodyBase64, 'E-POLLING | LOGIN DETAILS', [passwordDetails.emailId]);
          }

          if (passwordDetails.mobileNumber) {
            const adminUrl = envUtils.getStringEnvVariableOrDefault("EP_WORKFLOW_ADMIN_MODULE_URL", "http://localhost:4200");
            const smsBodyTemplate = SMS.ADMIN_USER_CREATION.body;
            const smsBodyCompiled = smsBodyTemplate.replace("<name>", passwordDetails.displayName)
              .replace("<password>", passwordDetails.password)
              .replace("<url>", adminUrl);
            await commonCommunication.sendSms(smsBodyCompiled, passwordDetails.mobileNumber, SMS.ADMIN_USER_CREATION.template_id);

            await commonCommunication.sendWhatsapp(WHATSAPP.ADMIN_USER_CREATION.template_id, passwordDetails.mobileNumber, [passwordDetails.displayName, passwordDetails.password, adminUrl])
          }
          break;
        case "RESET_PASSWORD":
          if (passwordDetails.emailId) {
            const emailTemplateHtml = await ejsUtils.generateHtml('views/sharePasswordEmailTemplate.ejs', passwordDetails);
            const emailBodyBase64 = Buffer.from(emailTemplateHtml).toString('base64');
            await commonCommunication.sendEmail(emailBodyBase64, 'E-POLLING | LOGIN DETAILS', [passwordDetails.emailId]);
          }

          if (passwordDetails.mobileNumber) {
            const adminUrl = envUtils.getStringEnvVariableOrDefault("EP_WORKFLOW_ADMIN_MODULE_URL", "http://localhost:4200");
            const smsBodyTemplate = SMS.ADMIN_RESET_PASSWORD.body;
            const smsBodyCompiled = smsBodyTemplate.replace("<name>", passwordDetails.displayName)
              .replace("<password>", passwordDetails.password)
            await commonCommunication.sendSms(smsBodyCompiled, passwordDetails.mobileNumber, SMS.ADMIN_RESET_PASSWORD.template_id);
            await commonCommunication.sendWhatsapp(WHATSAPP.ADMIN_RESET_PASSWORD.template_id, passwordDetails.mobileNumber, [passwordDetails.displayName, passwordDetails.password])
          }
          break;
        case "USER_LOGIN_OTP":
          if (passwordDetails.emailId) {
            const emailTemplateHtml = await ejsUtils.generateHtml('views/sharePasswordEmailTemplate.ejs', passwordDetails);
            const emailBodyBase64 = Buffer.from(emailTemplateHtml).toString('base64');
            await commonCommunication.sendEmail(emailBodyBase64, 'E-POLLING | LOGIN DETAILS', [passwordDetails.emailId]);
          }

          if (passwordDetails.mobileNumber) {
            const smsBodyTemplate = SMS.USER_LOGIN_WITH_OTP.body;
            const smsBodyCompiled = smsBodyTemplate.replace("<otp>", passwordDetails.otp)
              .replace("<module>", "E-Polling")
              .replace("<time>", "3 min");
            await commonCommunication.sendSms(smsBodyCompiled, passwordDetails.mobileNumber, SMS.USER_LOGIN_WITH_OTP.template_id);

            await commonCommunication.sendWhatsapp(WHATSAPP.USER_LOGIN_WITH_OTP.template_id, passwordDetails.mobileNumber, ["E-Polling", passwordDetails.otp, "3 mins"])
          }
          break;

        default:
          break;
      }
    } catch (error) {
      logger.error(`adminService :: sharePasswordToUser :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateUserStatus: async (user: IUser, status: number, updatedBy: number) => {
    try {
      await usersRepository.updateUserStatus(user, status, updatedBy);

      await redis.deleteRedis(`user:${user.user_id}`);
      await redis.deleteRedis(`user|username:${user.user_name}`);
      await redis.deleteRedis(`users|user:1|limit:50`);
      await redis.deleteRedis(`users_count|user:1`);
    } catch (error) {
      logger.error(`usersService :: updateUserStatus :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  }
}
