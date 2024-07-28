import { CategoryStatus, EventStatus, JudgeStatus, NominationStatus, SupportRequestStatus, VoteStatus } from "../enums";

export interface ICategory {
    category_id: number;
    category_name: string;
    category_description: string;
    status: CategoryStatus;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IEvent {
    eventId: string;
    eventName: string;
    eventDescription: string;
    startTime: string;
    endTime: string;
    status: EventStatus;
    categoryId: number;
    dateCreated: string;
    dateUpdated: string;
    createdBy: number;
    updatedBy: number;
}

export interface IJudge {
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
}

export interface INomination {
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
}

export interface IVote {
    voteId: string;
    nomineeId: string;
    voterName: string;
    voterMobile ?: number;
    voterEmail ?: string;
    dateCreated: string;
    dateUpdated: string;
    voterDeviceDetails: string;
    status: VoteStatus;
}

export interface IVoteResult {
    nomineeName: string;
    votes: number
}

export interface IPlatformLinks {
    instagram: string;
    tiktok: string;
    twitch: string;
    youtube: string;
    other: string;
}

export interface ISupportRequest {
    supportRequestId: string;
    requesterName: string;
    requesterEmail: string;
    requesterMessage: string;
    resolvedBy: number;
    dateCreated: string;
    dateUpdated: string;
    requesterDeviceDetails: SupportRequestStatus;
    status: SupportRequestStatus;
}