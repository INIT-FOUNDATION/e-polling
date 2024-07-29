export const USERS = {
    getLoggedInUserInfo: `SELECT U.user_id AS user_id,
                        U.user_name AS user_name,
                        TO_CHAR(U.dob, 'DD/MM/YYYY') AS dob,
                        U.gender AS gender,
                        U.email_id AS email_id,
                        U.first_name AS first_name,
                        U.last_name AS last_name,
                        U.mobile_number AS mobile_number,
                        U.display_name AS display_name,
                        R.role_id AS role_id,
                        R.role_name AS role_name, 
                        U.profile_pic_url
                    FROM m_users U
                    LEFT OUTER JOIN m_roles R ON U.role_id = R.role_id
                    WHERE U.user_id = $1 AND U.status IN (1,4)`,
    updateProfilePic: `UPDATE m_users SET profile_pic_url = $2, updated_by = $1, date_updated = NOW() WHERE user_id = $1`,
    updateProfile: `UPDATE m_users SET first_name = $2, last_name = $3, email_id = $4, dob = $5, display_name = $6, updated_by = $1, date_updated = NOW() WHERE user_id = $1`,
}