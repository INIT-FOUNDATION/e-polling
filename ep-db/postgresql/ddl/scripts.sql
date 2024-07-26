-- Table: m_users
INSERT INTO m_users VALUES (1, '1234567890', 'Super Admin', NULL, NULL, 1234567890, null, 1, null, 1, '$2a$10$7AMdZXYTCEjhBvW8Q6wHje9tf91SwP7Xwt2zEytSFMB33lA9bXSM2', NOW(), 0, 1, null, NOW(), NOW(), NOW(), null, null);

-- Table: m_roles
INSERT INTO m_roles VALUES (1, 'Super Admin', 'Role for Super Admin', 1, NOW(), NOW(), null, null);

-- Table: m_permissions
INSERT INTO m_permissions(permission_id, permission_name) VALUES (1, 'Write');
INSERT INTO m_permissions(permission_id, permission_name) VALUES (2, 'Read');

-- Table: m_menus
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (1, 'Admin Management', 'Menu for User Administration', 1, '/admin-management', 'fa fa-icon');
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (2, 'Form Builder', 'Menu for Form Builder', 2, '/form-builder', 'fa fa-icon');
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (3, 'Workflow Builder', 'Menu for Workflow Builder', 3, '/workflow-builder', 'fa fa-icon');
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (4, 'Workflow Assignment', 'Menu for Workflow Assignment', 4, '/workflow-assignment', 'fa fa-icon');