-- Table: m_users
CREATE TABLE m_users (
    user_id serial PRIMARY KEY,
    user_name VARCHAR(50),
    display_name VARCHAR(50),
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    mobile_number BIGINT,
    email_id VARCHAR(50),
    gender SMALLINT,
    dob DATE,
    role_id INT,
    password VARCHAR(100),
    password_last_updated TIMESTAMP DEFAULT now(),
    invalid_attempts INT DEFAULT 0,
    status smallint DEFAULT 1,
    profile_pic_url VARCHAR(100),
    last_logged_in TIMESTAMP DEFAULT now(),
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now(),
    created_by INT,
    updated_by INT
);

-- Table: m_roles
CREATE TABLE m_roles (
    role_id serial PRIMARY KEY,
    role_name VARCHAR(30),
    role_description VARCHAR(50),
    status smallint DEFAULT 1,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now(),
    created_by INT,
    updated_by INT
);

-- Table: m_menus
CREATE TABLE m_menus (
    menu_id serial PRIMARY KEY,
    menu_name VARCHAR(30),
    menu_description VARCHAR(50),
    status smallint DEFAULT 1,
    parent_menu_id INT,
    menu_order INT,
    route_url VARCHAR(30),
    icon_class VARCHAR(30),
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);

-- Table: password_policies
CREATE TABLE password_policies (
    id serial PRIMARY KEY,
    password_expiry SMALLINT,
    password_history SMALLINT,
    minimum_password_length SMALLINT,
    complexity SMALLINT,
    alphabetical SMALLINT,
    numeric SMALLINT,
    special_characters SMALLINT,
    allowed_special_characters VARCHAR(50),
    maximum_invalid_attempts INT,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);

-- Table: access_control
CREATE TABLE access_control (
    role_id INT,
    menu_id INT,
    permission_id INT,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now(),
    created_by INT,
    updated_by INT
);

-- Table: m_permissions
CREATE TABLE m_permissions (
    permission_id serial PRIMARY KEY,
    permission_name VARCHAR(30)
);

-- Table: m_categories
CREATE TABLE m_categories (
    category_id serial PRIMARY KEY,
    category_name VARCHAR(30),
    category_description VARCHAR(50),
    status smallint DEFAULT 1,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now(),
    created_by INT,
    updated_by INT
);
