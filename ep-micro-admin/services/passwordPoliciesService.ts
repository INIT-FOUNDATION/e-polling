import { pg, logger, redis } from "ep-micro-common";
import { PASSWORD_POLICY } from "../constants/QUERY";
import { IPasswordPolicy } from "../types/custom";
import { CacheTTL } from "../enums";

export const passwordPoliciesService = {
    createPasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
        try {
            const key = 'password_policies';
            const _query = {
                text: PASSWORD_POLICY.addPasswordPolicy,
                values: [passwordPolicy.password_expiry, passwordPolicy.password_history, passwordPolicy.minimum_password_length,
                passwordPolicy.complexity, passwordPolicy.alphabetical, passwordPolicy.numeric,
                passwordPolicy.special_characters, passwordPolicy.allowed_special_characters, passwordPolicy.maximum_invalid_attempts]
            };
            logger.debug(`passwordPoliciesService :: createPasswordPolicy :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesService :: createPasswordPolicy :: db result :: ${JSON.stringify(result)}`)

            redis.deleteRedis(key);
            return result;
        } catch (error) {
            logger.error(`passwordPoliciesService :: createPasswordPolicy :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updatePasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
        try {
            const _query = {
                text: PASSWORD_POLICY.updatePasswordPolicy,
                values: [passwordPolicy.id, passwordPolicy.password_expiry, passwordPolicy.password_history,
                passwordPolicy.minimum_password_length, passwordPolicy.complexity,
                passwordPolicy.alphabetical, passwordPolicy.numeric,
                passwordPolicy.special_characters, passwordPolicy.allowed_special_characters,
                passwordPolicy.maximum_invalid_attempts]
            };
            logger.debug(`passwordPoliciesService :: createPasswordPolicy :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesService :: createPasswordPolicy :: db result :: ${JSON.stringify(result)}`)

            redis.deleteRedis('password_policies');
            redis.deleteRedis(`password_policy:${passwordPolicy.id}`);
            return result;
        } catch (error) {
            logger.error(`passwordPoliciesService :: createPasswordPolicy :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    listPasswordPolicies: async () => {
        try {
            const key = `password_policies`;
            const cachedResult = await redis.GetKeyRedis(key);

            if (cachedResult) {
                logger.debug(`passwordPoliciesService :: listPasswordPolicies :: cached result :: ${cachedResult}`)
                return JSON.parse(cachedResult)
            }

            const _query = {
                text: PASSWORD_POLICY.listPasswordPolicies,
            };
            logger.debug(`passwordPoliciesService :: listPasswordPolicies :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesService :: listPasswordPolicies :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) redis.SetRedis(key, result, CacheTTL.LONG);
            return result;
        } catch (error) {
            logger.error(`passwordPoliciesService :: listPasswordPolicies :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    existsByPasswordPolicyId: async (passwordPolicyId: number): Promise<boolean> => {
        try {
          const _query = {
            text: PASSWORD_POLICY.existsByPasswordPolicyId,
            values: [passwordPolicyId]
          };
          logger.debug(`passwordPoliciesService :: existsByPasswordPolicyId :: query :: ${JSON.stringify(_query)}`)
    
          const result = await pg.executeQueryPromise(_query);
          logger.debug(`passwordPoliciesService :: existsByPasswordPolicyId :: db result :: ${JSON.stringify(result)}`)
    
          return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
          logger.error(`passwordPoliciesService :: existsByPasswordPolicyId :: ${error.message} :: ${error}`)
          throw new Error(error.message);
        }
      },
      getPasswordPolicyById: async (passwordPolicyId: number): Promise<IPasswordPolicy> => {
        try {
          const key = `password_policy:${passwordPolicyId}`
          const cachedResult = await redis.GetKeyRedis(key);
          if (cachedResult) {
            logger.debug(`passwordPoliciesService :: getPasswordPolicyById :: passwordPolicyId :: ${passwordPolicyId} :: cached result :: ${cachedResult}`)
            return JSON.parse(cachedResult)
          }
    
          const _query = {
            text: PASSWORD_POLICY.getPasswordPolicyById,
            values: [passwordPolicyId]
          };
          logger.debug(`passwordPoliciesService :: getPasswordPolicyById :: query :: ${JSON.stringify(_query)}`)
    
          const result = await pg.executeQueryPromise(_query);
          logger.debug(`passwordPoliciesService :: getPasswordPolicyById :: db result :: ${JSON.stringify(result)}`)
    
          if (result && result.length > 0) redis.SetRedis(key, result[0], CacheTTL.LONG);
          return result && result.length > 0 ? result[0] : [];
        } catch (error) {
          logger.error(`passwordPoliciesService :: getPasswordPolicyById :: passwordPolicyId :: ${passwordPolicyId} :: ${error.message} :: ${error}`)
          throw new Error(error.message);
        }
      },
}