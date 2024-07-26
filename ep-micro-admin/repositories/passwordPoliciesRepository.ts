import { pg, logger } from "ep-micro-common";
import { IPasswordPolicy } from "../types/custom";
import { QUERY } from "../constants";

export const passwordPoliciesRepository = {
    createPasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
        try {
            const _query = {
                text: QUERY.PASSWORD_POLICY.addPasswordPolicy,
                values: [passwordPolicy.password_expiry, passwordPolicy.password_history, passwordPolicy.minimum_password_length,
                passwordPolicy.complexity, passwordPolicy.alphabetical, passwordPolicy.numeric,
                passwordPolicy.special_characters, passwordPolicy.allowed_special_characters, passwordPolicy.maximum_invalid_attempts]
            };
            logger.debug(`passwordPoliciesRepository :: createPasswordPolicy :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesRepository :: createPasswordPolicy :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`passwordPoliciesRepository :: createPasswordPolicy :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updatePasswordPolicy: async (passwordPolicy: IPasswordPolicy) => {
        try {
            const _query = {
                text: QUERY.PASSWORD_POLICY.updatePasswordPolicy,
                values: [passwordPolicy.id, passwordPolicy.password_expiry, passwordPolicy.password_history,
                passwordPolicy.minimum_password_length, passwordPolicy.complexity,
                passwordPolicy.alphabetical, passwordPolicy.numeric,
                passwordPolicy.special_characters, passwordPolicy.allowed_special_characters,
                passwordPolicy.maximum_invalid_attempts]
            };
            logger.debug(`passwordPoliciesRepository :: createPasswordPolicy :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesRepository :: createPasswordPolicy :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`passwordPoliciesRepository :: createPasswordPolicy :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listPasswordPolicies: async (): Promise<IPasswordPolicy[]> => {
        try {
            const _query = {
                text: QUERY.PASSWORD_POLICY.listPasswordPolicies
            };
            logger.debug(`passwordPoliciesRepository :: listPasswordPolicies :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesRepository :: listPasswordPolicies :: db result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`passwordPoliciesRepository :: listPasswordPolicies :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existByPasswordPolicyId: async (passwordPolicyId: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.PASSWORD_POLICY.existsByPasswordPolicyId,
                values: [passwordPolicyId]
            };
            logger.debug(`passwordPoliciesRepository :: existByPasswordPolicyId :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesRepository :: existByPasswordPolicyId :: db result :: ${JSON.stringify(result)}`);
            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`passwordPoliciesRepository :: existByPasswordPolicyId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getPasswordPolicyById: async (passwordPolicyId: number): Promise<IPasswordPolicy> => {
        try {
            const _query = {
                text: QUERY.PASSWORD_POLICY.getPasswordPolicyById,
                values: [passwordPolicyId]
            };
            logger.debug(`passwordPoliciesRepository :: getPasswordPolicyById :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`passwordPoliciesRepository :: getPasswordPolicyById :: db result :: ${JSON.stringify(result)}`);
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`passwordPoliciesRepository :: getPasswordPolicyById :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}