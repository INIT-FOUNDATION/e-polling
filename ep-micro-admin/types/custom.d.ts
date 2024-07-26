import { CategoryStatus, EventStatus, JudgeStatus, MenuStatus, NominationStatus, NotificationStatus, RoleStatus, SupportRequestStatus, UserStatus, VoteStatus } from "../enums";

export interface IRole {
    role_id: number;
    role_name: string;
    role_description: string;
    level: string;
    status: RoleStatus;
    permissions: any;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
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
    department_id: number;
    password: string;
    invalid_attempts: string;
    status: UserStatus;
    profile_pic_url: string;
    last_logged_in: string;
    reporting_to_users: number[];
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IPasswordPolicy {
    id: number;
    password_expiry: number;
    password_history: number;
    minimum_password_length: number;
    complexity: number;
    alphabetical: number;
    numeric: number;
    special_characters: number;
    allowed_special_characters: string;
    maximum_invalid_attempts: number;
    date_created: string | undefined;
    date_updated: string | undefined;
}

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

export interface IMenu {
    menu_id: number;
    menu_name: string;
    menu_description: string;
    status: MenuStatus;
    parent_menu_id: number;
    menu_order: number;
    route_url: string;
    date_created: string | undefined;
    date_updated: string | undefined;
}

export interface IPermission {
    permission_id: number;
    permission_name: string;
}

export interface IEvent {
    eventId: string;
    eventName: string;
    startDate: string;
    endDate: string;
    status: EventStatus;
    categoryId: number;
    dateCreated: string;
    dateUpdated: string;
    createdById: number;
    updatedById: number;
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

export interface INominee {
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
    voterMobile: number;
    dateCreated: string;
    dateUpdated: string;
    voterDeviceDetails: string;
    status: VoteStatus;
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
    dateCreated: string;
    dateUpdated: string;
    requesterDeviceDetails: SupportRequestStatus;
    status: SupportRequestStatus;
}

export interface INotification {
    notificationId: string;
    notificationDescription: string;
    notifiedTo: number;
    dateCreated: string;
    dateUpdated: string;
    status: NotificationStatus;
}