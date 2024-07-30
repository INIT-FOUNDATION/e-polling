import { logger, redis } from "ep-micro-common";
import { IPasswordPolicy } from "../types/custom";
import { CacheTTL } from "../enums";
import { passwordPoliciesRepository } from "../repositories";

export const passwordPoliciesService = {
  createPasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
    try {
      const key = 'password_policies';
      await passwordPoliciesRepository.createPasswordPolicy(passwordPolicy);
      await redis.deleteRedis(key);
    } catch (error) {
      logger.error(`passwordPoliciesService :: createPasswordPolicy :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updatePasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
    try {
      await passwordPoliciesRepository.updatePasswordPolicy(passwordPolicy);
      await redis.deleteRedis('password_policies');
      await redis.deleteRedis(`password_policy:${passwordPolicy.id}`);
    } catch (error) {
      logger.error(`passwordPoliciesService :: createPasswordPolicy :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  listPasswordPolicies: async (): Promise<IPasswordPolicy[]> => {
    try {
      const key = `password_policies`;
      const cachedResult = await redis.GetKeyRedis(key);

      if (cachedResult) {
        logger.debug(`passwordPoliciesService :: listPasswordPolicies :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const passwordPolicies = await passwordPoliciesRepository.listPasswordPolicies();
      if (passwordPolicies && passwordPolicies.length > 0) redis.SetRedis(key, passwordPolicies, CacheTTL.LONG);
      return passwordPolicies;
    } catch (error) {
      logger.error(`passwordPoliciesService :: listPasswordPolicies :: ${error.message} :: ${error}`)
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

      const passwordPolicy = await passwordPoliciesRepository.getPasswordPolicyById(passwordPolicyId);
      if (passwordPolicy) redis.SetRedis(key, passwordPolicy, CacheTTL.LONG);
      return passwordPolicy;
    } catch (error) {
      logger.error(`passwordPoliciesService :: getPasswordPolicyById :: passwordPolicyId :: ${passwordPolicyId} :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
}