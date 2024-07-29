
export const USERS = {
    getUserByUsername:`SELECT u.user_id, user_name, password, display_name, u.role_id, mobile_number, email_id, u.status
	from m_users u left join m_roles r on u.role_id = r.role_id
	WHERE user_name = $1 AND u.status IN (1,4,5)`,
    selectRoleDetailsQueryByRoleId:`SELECT * FROM m_roles WHERE role_id = $1`,
    getInvalidAttempts:`SELECT invalid_attempts FROM m_users WHERE user_name = $1`,
    getMaxInvalidLoginAttempts:`SELECT maximum_invalid_attempts FROM password_policies ORDER BY date_created DESC LIMIT 1`,
    incrementInvalidAttempts:`UPDATE m_users SET invalid_attempts = invalid_attempts + 1 WHERE user_name = $1`,
    setUserInActive:`UPDATE m_users SET status = 0 WHERE user_name = $1`,
    updateUserLoggedInStatus:`UPDATE m_users SET status = $2, last_logged_in = NOW() WHERE user_name = $1`,
    resetPasswordQuery:`UPDATE m_users SET password = $1, password_last_updated = NOW() WHERE mobile_number = $2`,
    existsByUserName: `SELECT EXISTS (
        SELECT 1
            FROM m_users
            WHERE user_name = $1 AND status NOT IN (0,2)
    )`,
    existsByMobileNumber: `SELECT EXISTS (
        SELECT 1
            FROM m_users
            WHERE mobile_number = $1 AND status NOT IN (0,2)
    )`
}