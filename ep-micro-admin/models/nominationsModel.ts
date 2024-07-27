import Joi from "joi";
import { NominationStatus } from "../enums";
import { INomination, IPlatformLinks } from "../types/custom";

class Nomination implements INomination {
  nomineeId: string;
  nomineeName: string;
  selfNominee: boolean;
  requesterName: string;
  requesterEmail: string;
  profilePictureUrl: string;
  nomineePlatformLinks: IPlatformLinks;
  eventId: string;
  dateCreated: string;
  dateUpdated: string;
  createdBy: number;
  updatedBy: number;
  status: NominationStatus;

  constructor(nomination: INomination) {
    this.nomineeId = nomination.nomineeId;
    this.nomineeName = nomination.nomineeName;
    this.selfNominee = nomination.selfNominee || false;
    this.requesterName = nomination.selfNominee ? nomination.nomineeName : nomination.requesterName;
    this.requesterEmail = nomination.requesterEmail;
    this.profilePictureUrl = nomination.profilePictureUrl || "";
    this.nomineePlatformLinks = nomination.nomineePlatformLinks || {
      instagram: "",
      tiktok: "",
      twitch: "",
      youtube: "",
      other: ""
    };
    this.eventId = nomination.eventId;
    this.dateCreated = nomination.dateCreated || new Date().toISOString();
    this.dateUpdated = nomination.dateUpdated || new Date().toISOString();
    this.createdBy = nomination.createdBy;
    this.updatedBy = nomination.updatedBy;
    this.status = nomination.status || NominationStatus.PENDING;
  }
}

const validateCreateNomination = (nomination: INomination): Joi.ValidationResult => {
  const nomineeSchema = Joi.object({
    nomineeId: Joi.string().required(),
    nomineeName: Joi.string().min(3).max(50).required(),
    selfNominee: Joi.boolean().required(),
    requesterName: Joi.string().min(3).max(50).required(),
    requesterEmail: Joi.string().email().required(),
    profilePictureUrl: Joi.string().uri().allow("", null),
    nomineePlatformLinks: Joi.object({
      instagram: Joi.string().uri().allow("", null),
      tiktok: Joi.string().uri().allow("", null),
      twitch: Joi.string().uri().allow("", null),
      youtube: Joi.string().uri().allow("", null),
      other: Joi.string().uri().allow("", null),
    }).default({
      instagram: "",
      tiktok: "",
      twitch: "",
      youtube: "",
      other: ""
    }),
    eventId: Joi.string().required(),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().allow("", null),
    status: Joi.string().valid(...Object.values(NominationStatus)).required()
  });
  return nomineeSchema.validate(nomination);
};

const validateUpdateNomination = (nomination: INomination): Joi.ValidationResult => {
  const nomineeSchema = Joi.object({
    nomineeId: Joi.string().required(),
    nomineeName: Joi.string().min(3).max(50).required(),
    selfNominee: Joi.boolean().required(),
    requesterName: Joi.when('selfNominee', {
      is: true,
      then: Joi.string().valid(Joi.ref('nomineeName')).required(),
      otherwise: Joi.string().min(3).max(50).required()
    }),
    requesterEmail: Joi.string().email().required(),
    profilePictureUrl: Joi.string().uri().allow("", null),
    nomineePlatformLinks: Joi.object({
      instagram: Joi.string().uri().allow("", null),
      tiktok: Joi.string().uri().allow("", null),
      twitch: Joi.string().uri().allow("", null),
      youtube: Joi.string().uri().allow("", null),
      other: Joi.string().uri().allow("", null),
    }).default({
      instagram: "",
      tiktok: "",
      twitch: "",
      youtube: "",
      other: ""
    }),
    eventId: Joi.string().required(),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().required(),
    status: Joi.string().valid(...Object.values(NominationStatus)).required()
  });
  return nomineeSchema.validate(nomination);
};

const validateUpdateNominationStatus = (nomination: INomination): Joi.ValidationResult => {
  const nomineeSchema = Joi.object({
    nomineeId: Joi.string().required(),
    status: Joi.string().valid(...Object.values(NominationStatus)).required()
  });
  return nomineeSchema.validate(nomination);
};

export {
  Nomination,
  validateCreateNomination,
  validateUpdateNomination,
  validateUpdateNominationStatus
};
