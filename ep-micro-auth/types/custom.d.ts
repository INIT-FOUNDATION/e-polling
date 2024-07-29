import { UserStatus } from "../enums";

export interface IUser {
    user_id: number,
    user_name: string;
    display_name: string;
    mobile_number: string;
    email_id: string;
    role_id: number;
    password: string;
    status: UserStatus,
    maximum_invalid_attempts: number,
    invalid_attempts: number,
    password_last_updated: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}