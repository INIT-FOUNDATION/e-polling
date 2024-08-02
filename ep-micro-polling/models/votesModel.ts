import Joi from "joi";
import { VoteStatus } from "../enums";
import { IDeviceDetails, IVote } from "../types/custom";
import { v4 as uuidv4 } from "uuid";

class Vote implements IVote {
  voteId: string;
  nomineeId: string;
  voterName: string;
  voterMobile?: number;
  voterEmail?: string;
  dateCreated: string;
  dateUpdated: string;
  voterDeviceDetails: IDeviceDetails;
  status: VoteStatus;

  constructor(vote: IVote) {
    this.voteId = vote.voteId || uuidv4();
    this.nomineeId = vote.nomineeId;
    this.voterName = vote.voterName;
    this.voterMobile = vote.voterMobile;
    this.voterEmail = vote.voterEmail || "";
    this.dateCreated = vote.dateCreated || new Date().toISOString();
    this.dateUpdated = vote.dateUpdated || new Date().toISOString();
    this.voterDeviceDetails = vote.voterDeviceDetails;
    this.status = vote.status || VoteStatus.ACTIVE;
  }
}

const validateCreateVote = (vote: IVote): Joi.ValidationResult => {
  const voteSchema = Joi.object({
    voteId: Joi.string().required(),
    nomineeId: Joi.string().required(),
    voterName: Joi.string().min(3).max(50).required(),
    voterMobile: Joi.number().integer().min(1000000000).max(9999999999).allow(null),
    voterEmail: Joi.string().email().allow("", null),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    voterDeviceDetails: Joi.object().required(),
    status: Joi.string().valid(...Object.values(VoteStatus)).required()
  });
  return voteSchema.validate(vote);
};

const validateVerifyVoteOtp = (voteOtpDetails: any): Joi.ValidationResult => {
  const voteOtpSchema = Joi.object({
    txnId: Joi.string().required(),
    otp: Joi.string().required()
  });
  return voteOtpSchema.validate(voteOtpDetails);
}

export {
  Vote,
  validateCreateVote,
  validateVerifyVoteOtp
};
