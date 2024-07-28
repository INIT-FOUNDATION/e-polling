import { BlobOptions } from "buffer";
import { CategoryStatus, EventStatus, JudgeStatus, NominationStatus, NotificationStatus, NotificationTypes, SupportRequestStatus, UserStatus, VoteStatus } from "../enums";

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

export interface IVoteResult {
    nomineeName: string;
    votes: number
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
    createdBy ?: number;
    updatedBy ?: number;
    status: NominationStatus;
    nomineeDeviceDetails: IDeviceDetails;
}

export interface IVote {
    voteId: string;
    nomineeId: string;
    voterName: string;
    voterMobile ?: number;
    voterEmail ?: string;
    dateCreated: string;
    dateUpdated: string;
    voterDeviceDetails: IDeviceDetails;
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
    requesterDeviceDetails: IDeviceDetails;
    status: SupportRequestStatus;
}

export interface IDeviceDetails {
    deviceType: string;
    deviceOs: string;
    deviceOsVersion: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    browserVersion: string;
    browserName: string;
    clientIp: string;
}

export interface INotification {
    notificationId: string;
    notificationType: NotificationTypes,
    notificationDescription: string;
    notifiedTo: number;
    dateCreated: string;
    dateUpdated: string;
    status: NotificationStatus;
}

export interface IUser {
    user_id: number;
    user_name: string;
    display_name: string;
    first_name: string;
    last_name: string;
    mobile_number: number;
    email_id: string;
    gender: number;
    dob: string;
    role_id: number;
    password: string;
    invalid_attempts: string;
    status: UserStatus;
    profile_pic_url: string;
    last_logged_in: string;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}