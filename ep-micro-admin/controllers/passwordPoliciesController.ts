import { logger, STATUS } from "ep-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { IPasswordPolicy } from "../types/custom";
import { PASSWORDPOLICIES } from "../constants/ERRORCODE";
import { passwordPoliciesService } from "../services/passwordPoliciesService";
import { PasswordPolicy, validateCreatePasswordPolicy, validateUpdatePasswordPolicy } from "../models/passwordPoliciesModel";
import { passwordPoliciesRepository } from "../repositories";

export const passwordPoliciesController = {
    listPasswordPolicies: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Password Policies']
                #swagger.summary = 'List Password Policies'
                #swagger.description = 'Endpoint to List Password Policies'
            */
            const passwordPolicies = await passwordPoliciesService.listPasswordPolicies();
            return res.status(STATUS.OK).send({
                data: passwordPolicies,
                message: "Password Policies Fetched Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: listPasswordPolicies :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
    addPasswordPolicy: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Password Policies']
                #swagger.summary = 'Add Password Policy'
                #swagger.description = 'Endpoint to Add Password Policy'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        password_expiry: 10,
                        password_history: 10,
                        minimum_password_length: 8,
                        complexity: 3,
                        alphabetical: 1,
                        numeric: 1,
                        special_characters: 1,
                        allowed_special_characters: '!@#$%^&*()',
                        maximum_invalid_attempts: 5,
                    }
                }    
            */
            const passwordPolicy: IPasswordPolicy = new PasswordPolicy(req.body)
            const { error } = validateCreatePasswordPolicy(passwordPolicy);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: PASSWORDPOLICIES.PASSWORDPOLICIES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: PASSWORDPOLICIES.PASSWORDPOLICIES000.errorCode, errorMessage: error.message });
            }

            await passwordPoliciesService.createPasswordPolicy(passwordPolicy);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Password Policy Added Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: addPasswordPolicy :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
    updatePasswordPolicy: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Password Policies']
                #swagger.summary = 'Update Password Policy'
                #swagger.description = 'Endpoint to Update Password Policy'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        id: 1,
                        password_expiry: 10,
                        password_history: 10,
                        minimum_password_length: 8,
                        complexity: 3,
                        alphabetical: 1,
                        numeric: 1,
                        special_characters: 1,
                        allowed_special_characters: '!@#$%^&*()',
                        maximum_invalid_attempts: 5,
                    }
                }    
            */
            const passwordPolicy: IPasswordPolicy = req.body
            const { error } = validateUpdatePasswordPolicy(passwordPolicy);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: PASSWORDPOLICIES.PASSWORDPOLICIES000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: PASSWORDPOLICIES.PASSWORDPOLICIES000.errorCode, errorMessage: error.message });
            }

            const passwordPolicyExists = await passwordPoliciesRepository.existByPasswordPolicyId(passwordPolicy.id);
            if (!passwordPolicyExists) return res.status(STATUS.BAD_REQUEST).send(PASSWORDPOLICIES.PASSWORDPOLICIES001);

            await passwordPoliciesService.updatePasswordPolicy(passwordPolicy);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Password Policy Updated Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: updatePasswordPolicy :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
    getPasswordPolicyById: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Password Policies']
                #swagger.summary = 'Get Password Policy'
                #swagger.description = 'Endpoint to Get Password Policy'
            */
            const passwordPolicyId = req.params.passwordPolicyId;
            if (!passwordPolicyId) return res.status(STATUS.BAD_REQUEST).send(PASSWORDPOLICIES.PASSWORDPOLICIES002)

            const passwordPolicyExists = await passwordPoliciesRepository.existByPasswordPolicyId(parseInt(passwordPolicyId));
            if (!passwordPolicyExists) return res.status(STATUS.BAD_REQUEST).send(PASSWORDPOLICIES.PASSWORDPOLICIES001);

            const passwordPolicy = await passwordPoliciesService.getPasswordPolicyById(parseInt(passwordPolicyId));

            return res.status(STATUS.OK).send({
                data: passwordPolicy,
                message: "Password Policy Fetched Successfully",
            });
        } catch (error) {
            logger.error(`passwordPoliciesController :: getPasswordPolicyById :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(PASSWORDPOLICIES.PASSWORDPOLICIES000);
        }
    },
}