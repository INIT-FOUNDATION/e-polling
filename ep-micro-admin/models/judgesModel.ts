import Joi from "joi";
import { JudgeStatus } from "../enums";
import { IJudge } from "../types/custom";

class Judge implements IJudge {
  judgeId: string;
  judgeName: string;
  profilePictureUrl: string;
  designation: string;
  eventId: string;
  dateCreated: string;
  dateUpdated: string;
  createdBy: number;
  updatedBy: number;
  status: JudgeStatus;

  constructor(judge: IJudge) {
    this.judgeId = judge.judgeId;
    this.judgeName = judge.judgeName;
    this.profilePictureUrl = judge.profilePictureUrl || "";
    this.designation = judge.designation;
    this.eventId = judge.eventId;
    this.dateCreated = judge.dateCreated || new Date().toISOString();
    this.dateUpdated = judge.dateUpdated || new Date().toISOString();
    this.createdBy = judge.createdBy;
    this.updatedBy = judge.updatedBy;
    this.status = judge.status || JudgeStatus.ACTIVE;
  }
}

const validateCreateJudge = (judge: IJudge): Joi.ValidationResult => {
  const judgeSchema = Joi.object({
    judgeId: Joi.string().required(),
    judgeName: Joi.string().min(3).max(50).required(),
    profilePictureUrl: Joi.string().uri().allow("", null),
    designation: Joi.string().min(3).max(50).required(),
    eventId: Joi.string().required(),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().allow("", null),
    status: Joi.string().valid(...Object.values(JudgeStatus)).required()
  });
  return judgeSchema.validate(judge);
};

const validateUpdateJudge = (judge: IJudge): Joi.ValidationResult => {
  const judgeSchema = Joi.object({
    judgeId: Joi.string().required(),
    judgeName: Joi.string().min(3).max(50).required(),
    profilePictureUrl: Joi.string().uri().allow("", null),
    designation: Joi.string().min(3).max(50).required(),
    eventId: Joi.string().required(),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().required(),
    status: Joi.string().valid(...Object.values(JudgeStatus)).required()
  });
  return judgeSchema.validate(judge);
};

const validateUpdateJudgeStatus = (judge: IJudge): Joi.ValidationResult => {
  const judgeSchema = Joi.object({
    judgeId: Joi.string().required(),
    status: Joi.string().valid(...Object.values(JudgeStatus)).required()
  });
  return judgeSchema.validate(judge);
};

export {
  Judge,
  validateCreateJudge,
  validateUpdateJudge,
  validateUpdateJudgeStatus
};