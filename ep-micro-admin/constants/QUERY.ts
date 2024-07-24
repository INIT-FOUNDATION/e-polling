export const ROLES = {
    listRoles: 'SELECT role_id, role_name, role_description, level, status from m_roles',
    listRolesCount: 'SELECT count(*) AS count from m_roles',
    addRole: 'INSERT INTO m_roles (role_name, role_description, level, created_by, updated_by) VALUES ($1, $2, $3, $4, $5) RETURNING role_id',
    updateRole: 'UPDATE m_roles SET role_name = $2, role_description = $3, level = $4, updated_by = $5, status = $6, date_updated = NOW() WHERE role_id = $1',
    getRole: 'SELECT role_name, role_description, level, status FROM m_roles WHERE role_id = $1 AND status IN (0, 1)',
    updateRoleStatus: 'UPDATE m_roles SET status = $2, updated_by = $3, date_updated = NOW() WHERE role_id = $1',
    getAccessListByRoleId: `SELECT mm.menu_id, 
                            mm.menu_name,
                            mm.route_url,
                            mm.icon_class,
                            sum(CASE WHEN (ac.permission_id) = 1 THEN 1 ELSE 0 END) write_permission,
                            sum(CASE WHEN (ac.permission_id) = 2 THEN 1 ELSE 0 END) read_permission,
                            (CASE WHEN sum(COALESCE(ac.permission_id, 0)) > 0 THEN 1 ELSE 0 END) display_permission
                        FROM m_menus mm 
                        LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$1
                        LEFT OUTER JOIN m_permissions mp ON ac.permission_id = mp.permission_id
                        WHERE mm.status=1
                        GROUP BY mm.menu_id, mm.menu_name, mm.route_url, mm.icon_class, mm.menu_order
                        ORDER BY mm.menu_order ASC`,
    getMenusList: `SELECT menu_id, menu_name AS label, route_url as link, icon_class as icon, status, 'true' as initiallyOpened from m_menus`,
    getDefaultAccessList: "SELECT menu_id, menu_name, route_url, icon_class, permission_id, permission_name FROM m_menus CROSS JOIN m_permissions WHERE status = 1 ORDER BY parent_menu_id, menu_id, permission_id",
    existsByRoleId: `SELECT EXISTS (
                        SELECT 1
                            FROM m_roles
                            WHERE role_id = $1 AND status IN (0, 1)
                    )`,
    existsByRoleName: `SELECT EXISTS (
                        SELECT 1
                            FROM m_roles
                            WHERE role_name = $1 AND status = 1
                    )`,
    deleteExistingPermissions: "DELETE from access_control where role_id = $1",
    addPermissions: "INSERT INTO access_control (role_id, menu_id, permission_id, created_by, updated_by) values($1, $2, $3, $4, $4)",
    getRolesByLevel: "SELECT role_id, role_name, level from m_roles WHERE status = 1 AND level = $1 ORDER BY date_created DESC"
}

export const USERS = {
    existsByMobileNumber: `SELECT EXISTS (
        SELECT 1
            FROM m_users
            WHERE mobile_number = $1
    )`,
    existsByUserId: `SELECT EXISTS (
        SELECT 1
            FROM m_users
            WHERE user_id = $1 AND status <> 2
    )`,
    createUser: `INSERT INTO m_users(
        user_name, first_name, last_name, display_name, dob, gender, mobile_number, password, role_id, email_id, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING user_id`,
    updateUser: `UPDATE m_users SET first_name = $2, last_name = $3, dob = $4, gender = $5, email_id = $6, updated_by = $7, role_id = $8, status = $9, display_name = $10, date_updated = NOW() WHERE user_id = $1`,
    getUser: `SELECT * from vw_m_users WHERE user_id = $1 AND status <> 2`,
    getUsersByRoleId: `select user_id, user_name, initcap(display_name) as display_name, mobile_number, initcap(role_name) as role_name  from vw_m_users where role_id = $1 AND status <> 2`,
    resetPasswordForUserId: `UPDATE m_users SET password = $2, password_last_updated = NOW(), date_updated = NOW() WHERE user_id = $1`,
    usersList: `select * from vw_m_users WHERE role_id <> 1 AND status <> 2`,
    latestUpdatedCheck: `SELECT COUNT(*) as count FROM vw_m_users WHERE date_updated >= NOW() - INTERVAL '5 minutes'`,
    usersListCount: `select count(*) as count from vw_m_users WHERE role_id <> 1 AND status <> 2`,
    getReportingUsersList: `SELECT VU.user_id, VU.display_name FROM vw_m_users VU
    INNER JOIN m_roles R ON VU.role_id = R.role_id and R.status=1 and VU.status IN (1, 4, 5)
    WHERE R.level`,
    updateUserStatus: `UPDATE m_users SET status = $2, updated_by = $3, date_updated = NOW() WHERE user_id = $1`,
}

export const USER_DEPARTMENT_MAPPING = {
    createUserDepartmentMapping: `INSERT INTO m_user_department_assoc (user_id, department_id) VALUES ($1, $2)`,
    updateUserUpdateMapping: `UPDATE m_user_department_assoc SET department_id = $2 WHERE user_id = $1`
}

export const USER_REPORTING_MAPPING = {
    updateInActiveReportingMapping: `UPDATE m_user_reporting_assoc SET status = 0, date_updated = NOW() WHERE user_id = $1 RETURNING reporting_to`,
    createUserReportingMapping: `INSERT INTO m_user_reporting_assoc (user_id, reporting_to) VALUES ($1, $2)`
};

export const DEPARTMENTS = {
    listDepartments: 'SELECT department_id, department_name FROM m_departments WHERE status = 1',
    addDepartment: `INSERT INTO m_departments (department_name) VALUES ($1)`,
    updateDepartment: `UPDATE m_departments SET department_name = $2, date_updated = NOW() WHERE department_id = $1`,
    getDepartment: `SELECT department_id, department_name from m_departments WHERE department_id = $1 AND status = 1`,
    updateDepartmentStatus: 'UPDATE m_departments SET status = $2, date_updated = NOW() WHERE department_id = $1',
    existsByDepartmentId: `SELECT EXISTS (
        SELECT 1
            FROM m_departments
            WHERE department_id = $1 AND status = 1
    )`,
    existsByDepartmentName: `SELECT EXISTS (
        SELECT 1
            FROM m_departments
            WHERE department_name = $1 AND status = 1
    )`
}

export const PASSWORD_POLICY = {
    addPasswordPolicy: `INSERT INTO password_policies(password_expiry, password_history, minimum_password_length, complexity, alphabetical, "numeric", special_characters, allowed_special_characters, maximum_invalid_attempts)
	                                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    listPasswordPolicies: `SELECT id, password_expiry, password_history, minimum_password_length, complexity, alphabetical, numeric, special_characters, allowed_special_characters, maximum_invalid_attempts FROM password_policies ORDER BY date_updated DESC`,
    updatePasswordPolicy: `UPDATE password_policies SET password_expiry = $2, password_history = $3, minimum_password_length = $4, complexity = $5, alphabetical = $6, numeric = $7, special_characters = $8, allowed_special_characters = $9, maximum_invalid_attempts = $10, date_updated = NOW() WHERE id = $1`,
    existsByPasswordPolicyId: `SELECT EXISTS (
        SELECT 1
            FROM password_policies
            WHERE id = $1
    )`,
    getPasswordPolicyById: `SELECT password_expiry, password_history, minimum_password_length, complexity, alphabetical, numeric, special_characters, allowed_special_characters, maximum_invalid_attempts FROM password_policies WHERE id = $1`
}