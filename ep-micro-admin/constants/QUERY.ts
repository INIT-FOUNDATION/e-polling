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

export const MENUS = {
    addMenu: `INSERT INTO m_menus(menu_name, menu_description, status, parent_menu_id, menu_order, route_url, icon_class, date_created, date_updated)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
    listMenus: `SELECT menu_id, menu_name, menu_description, status, parent_menu_id, menu_order, route_url, icon_class
                FROM m_menus WHERE status <> 2
                ORDER BY date_updated DESC `,
    updateMenu: `UPDATE m_menus 
                SET menu_name = $2, menu_description = $3, status = $4, parent_menu_id = $5, menu_order = $6, route_url = $7, icon_class = $8, date_updated = NOW() 
                WHERE menu_id = $1`,
    existsByMenuId: `SELECT EXISTS (
        SELECT 1
        FROM m_menus
        WHERE menu_id = $1 AND status <> 2
    )`,
    getMenuById: `SELECT menu_name, menu_description, status, parent_menu_id, menu_order, route_url, icon_class, date_created, date_updated 
                FROM m_menus 
                WHERE menu_id = $1 AND status <> 2`,
    existsByMenuName: `SELECT EXISTS (
        SELECT 1
        FROM m_menus
        WHERE menu_name = $1 AND status <> 2
    )`,
    updateMenuStatus: `UPDATE m_menus SET status = $2, date_updated = NOW() WHERE menu_id = $1`
};

export const CATEGORIES = {
    addCategory: `INSERT INTO m_categories(category_name, category_description, status, date_created, date_updated, created_by, updated_by)
                    VALUES ($1, $2, $3, NOW(), NOW(), $4, $5)`,
    listCategories: `SELECT category_id, category_name, category_description, status
                      FROM m_categories WHERE status <> 2 AND created_by = $3
                      ORDER BY date_updated DESC LIMIT $1 OFFSET $2`,
    getCategoriesCount: `SELECT count(*) as count FROM m_categories WHERE status <> 2 AND created_by = $1`,
    updateCategory: `UPDATE m_categories 
                      SET category_name = $2, category_description = $3, status = $4, date_updated = NOW(), created_by = $5, updated_by = $6 
                      WHERE category_id = $1`,
    existsByCategoryId: `SELECT EXISTS (
        SELECT 1
        FROM m_categories
        WHERE category_id = $1 AND status <> 2
    )`,
    getCategoryById: `SELECT category_name, category_description, status, date_created, date_updated, created_by, updated_by 
                       FROM m_categories 
                       WHERE category_id = $1 AND status <> 2`,
    existsByCategoryName: `SELECT EXISTS (
        SELECT 1
        FROM m_categories
        WHERE category_name = $1 AND status <> 2
    )`,
    updateCategoryStatus: `UPDATE m_categories SET status = $2, updated_by = $3, date_updated = NOW() WHERE category_id = $1`
};
