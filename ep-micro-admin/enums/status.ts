export enum UserStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    DELETED = 2,
    LOCKED = 3,
    LOGGED_IN = 4,
    LOGGED_OUT = 5
}

export enum RoleStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    DELETED = 2
}

export enum GenderStatus {
    MALE = 1,
    FEMALE = 2,
    OTHERS = 3
}

export enum MenuStatus {
    INACTIVE = 0,
    ACTIVE = 1,
    DELETED = 2
}

export enum GridDefaultOptions {
    PAGE_SIZE = 50,
    CURRENT_PAGE = 1
}

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