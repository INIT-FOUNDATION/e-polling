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
    status: number;
    profile_pic_url: string;
    last_logged_in: string;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}