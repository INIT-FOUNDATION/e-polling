export enum CategoryStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    DELETED = 2
}

export enum JudgeStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    DELETED = 2
}

export enum EventStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    OPENED = 2,
    CLOSED = 3,
    DELETED = 4
}

export enum NominationStatus {
    PENDING = 0,
    APPROVED = 1,
    REJECTED = 2
}

export enum SupportRequestStatus {
    OPEN = 0,
    RESOLVED = 1,
}

export enum VoteStatus {
    INACTIVE = 0,
    ACTIVE = 1
}

export enum NotificationStatus {
    UNREAD = 0,
    READ = 1
}

export enum SupportRequestsPeriodTypes {
    TODAY = 1,
    YESTERDAY = 2,
    PAST = 3
}

export enum NotificationTypes {
    SUPPORT_REQUEST = 1,
    NOMINATION = 2,
    VOTE = 3
}