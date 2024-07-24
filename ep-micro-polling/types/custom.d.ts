export interface IRole {
    role_id: number;
    role_name: string;
    role_description: string;
    level: string;
    status: number;
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
    status: number;
    profile_pic_url: string;
    last_logged_in: string;
    reporting_to_users: number[];
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IDepartment {
    department_id: number;
    department_name: string;
    status: number | undefined; 
    date_created: string | undefined;
    date_updated: string | undefined;
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