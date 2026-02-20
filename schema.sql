--======================================================================
--Create Database
CREATE DATABASE partnergrid CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE partnergrid;
-- =====================================================================
-- PartnerGrid core onboarding schema (MySQL)
-- Vendors, Vendor Users, Societies, Society Users
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist (optional, for clean re-run)
DROP TABLE IF EXISTS society_users;
DROP TABLE IF EXISTS societies;
DROP TABLE IF EXISTS vendor_users;
DROP TABLE IF EXISTS vendors;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- VENDORS
-- =====================================================================
CREATE TABLE vendors (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    legal_name                VARCHAR(255) NOT NULL,
    trade_name                VARCHAR(255),
    entity_type               ENUM('INDIVIDUAL','PROPRIETORSHIP','PARTNERSHIP','COMPANY','LLP') NOT NULL,
    pan                       VARCHAR(20),
    gstin                     VARCHAR(20),
    msme_udyam_number         VARCHAR(50),
    cin_llpin                 VARCHAR(50),
    shop_establishment_number VARCHAR(50),

    registered_address_line1  VARCHAR(255),
    registered_address_line2  VARCHAR(255),
    city                      VARCHAR(100),
    state                     VARCHAR(100),
    pincode                   VARCHAR(20),

    service_coverage_desc     VARCHAR(500),

    primary_contact_name      VARCHAR(150),
    primary_contact_phone     VARCHAR(20),
    primary_contact_email     VARCHAR(150),
    secondary_contact_name    VARCHAR(150),
    secondary_contact_phone   VARCHAR(20),
    secondary_contact_email   VARCHAR(150),

    operating_hours_text      VARCHAR(255),
    emergency_contact_name    VARCHAR(150),
    emergency_contact_phone   VARCHAR(20),

    bank_account_name         VARCHAR(150),
    bank_account_number       VARCHAR(50),
    bank_ifsc                 VARCHAR(20),

    risk_tier                 ENUM('GOLD','STANDARD','LIMITED') DEFAULT 'LIMITED',
    preferred_job_min_value   DECIMAL(15,2),
    preferred_job_max_value   DECIMAL(15,2),
    max_concurrent_jobs       INT,
    emergency_response_time_minutes INT,

    warranty_offered          TINYINT(1) DEFAULT 0,
    amc_offered               TINYINT(1) DEFAULT 0,
    average_rating            DECIMAL(3,2),

    status                    ENUM('DRAFT','PENDING_VERIFICATION','ACTIVE','SUSPENDED')
                              DEFAULT 'DRAFT',

    onboarding_completed_at   DATETIME NULL,
    created_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_vendors_pan (pan),
    UNIQUE KEY uq_vendors_gstin (gstin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- VENDOR USERS
-- =====================================================================
CREATE TABLE vendor_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_id          BIGINT UNSIGNED NOT NULL,
    email              VARCHAR(150) NOT NULL,
    mobile_country_code VARCHAR(10),
    mobile_number      VARCHAR(20),
    password_hash      VARCHAR(255) NOT NULL,
    full_name          VARCHAR(150) NOT NULL,
    role               ENUM('OWNER','MANAGER','STAFF') NOT NULL,
    is_primary_contact TINYINT(1) DEFAULT 0,
    is_active          TINYINT(1) DEFAULT 1,
    last_login_at      DATETIME NULL,
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_users_vendor
        FOREIGN KEY (vendor_id) REFERENCES vendors(id),

    UNIQUE KEY uq_vendor_users_vendor_email (vendor_id, email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SOCIETIES
-- =====================================================================
CREATE TABLE societies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    legal_name              VARCHAR(255) NOT NULL,
    short_name              VARCHAR(150),
    registration_number     VARCHAR(100),
    registration_date       DATE,
    registering_authority   VARCHAR(150),

    society_type            ENUM('FLAT_OWNERS','PLOT_OWNERS','MAINTENANCE_ONLY') NOT NULL,

    project_name            VARCHAR(150),
    registered_address_line1 VARCHAR(255),
    registered_address_line2 VARCHAR(255),
    city                    VARCHAR(100),
    state                   VARCHAR(100),
    pincode                 VARCHAR(20),

    pan                     VARCHAR(20),
    gstin                   VARCHAR(20),
    tan                     VARCHAR(20),

    risk_tier               ENUM('TIER_A','TIER_B','TIER_C') DEFAULT 'TIER_C',

    num_flats_units         INT,
    num_towers_wings        INT,
    annual_maintenance_budget_amount DECIMAL(15,2),

    payment_mode_preference ENUM('DIRECT_VIA_PLATFORM','RECORD_ONLY')
                            DEFAULT 'RECORD_ONLY',

    tender_threshold_amount DECIMAL(15,2) DEFAULT 100000.00,
    min_quotations_below_threshold INT DEFAULT 3,

    emergency_approval_rules_json JSON NULL,

    status                  ENUM('DRAFT','PENDING_VERIFICATION','ACTIVE','SUSPENDED')
                            DEFAULT 'DRAFT',

    onboarding_completed_at DATETIME NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_societies_regno (registration_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SOCIETY USERS
-- =====================================================================
CREATE TABLE society_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    society_id           BIGINT UNSIGNED NOT NULL,
    email                VARCHAR(150) NOT NULL,
    mobile_country_code  VARCHAR(10),
    mobile_number        VARCHAR(20),
    password_hash        VARCHAR(255) NOT NULL,
    full_name            VARCHAR(150) NOT NULL,

    role                 ENUM(
                            'CHAIRMAN','SECRETARY','TREASURER',
                            'MC_MEMBER','PROPERTY_MANAGER',
                            'ACCOUNTANT','AUDITOR','STAFF'
                          ) NOT NULL,

    term_start_date      DATE NULL,
    term_end_date        DATE NULL,
    is_authorized_signatory TINYINT(1) DEFAULT 0,
    approval_limit_amount   DECIMAL(15,2) NULL,

    is_active            TINYINT(1) DEFAULT 1,
    last_login_at        DATETIME NULL,
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_society_users_society
        FOREIGN KEY (society_id) REFERENCES societies(id),

    UNIQUE KEY uq_society_users_society_email (society_id, email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- SYSTEM USERS(ADMIN, CRM_VENDOR, CRM_SOCIETY)
-- =====================================================================
CREATE TABLE system_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,

    role ENUM('ADMIN','CRM_VENDOR','CRM_SOCIETY') NOT NULL,

    is_active TINYINT(1) DEFAULT 1,
    is_first_login TINYINT(1) DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================================
-- PRIORITIES (LOW, MEDIUM, HIGH, CRITICAL)
-- =====================================================================
CREATE TABLE priorities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(50) NOT NULL,
    level INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================================
-- REQUEST TRIGGERS (Complaint, Maintenance, etc.)
-- =====================================================================
CREATE TABLE request_triggers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================================
-- REQUEST CATEGORIES (Electrical, Plumbing, etc.)
-- =====================================================================
CREATE TABLE request_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================================
-- REQUEST SUBCATEGORIES
-- =====================================================================
CREATE TABLE request_subcategories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    label VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (category_id) REFERENCES request_categories(id)
);

-- =====================================================================
-- APPROXIMATE VALUES (Estimated Cost Ranges)
-- =====================================================================
CREATE TABLE approximate_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(100) NOT NULL,
    min_amount DECIMAL(12,2),
    max_amount DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================================
-- REQUEST STATUSES (NEW → COMPLETED → CANCELLED)
-- =====================================================================
CREATE TABLE request_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(50) NOT NULL,
    order_sequence INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================================
-- SERVICE REQUESTS (MAIN TABLE)
-- =====================================================================
CREATE TABLE service_requests (
    id VARCHAR(20) PRIMARY KEY,   -- req01, req02

    request_no VARCHAR(20) UNIQUE NOT NULL,

    status_id INT NOT NULL,
    priority_id INT NOT NULL,
    trigger_id INT NOT NULL,
    category_id INT NOT NULL,
    subcategory_id INT NOT NULL,
    approximate_value_id INT NOT NULL,

    summary VARCHAR(100) NOT NULL,
    description VARCHAR(500),

    society_id INT NOT NULL,
    created_by_user_id INT NOT NULL,
    updated_by_user_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (status_id) REFERENCES request_statuses(id),
    FOREIGN KEY (priority_id) REFERENCES priorities(id),
    FOREIGN KEY (trigger_id) REFERENCES request_triggers(id),
    FOREIGN KEY (category_id) REFERENCES request_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES request_subcategories(id),
    FOREIGN KEY (approximate_value_id) REFERENCES approximate_values(id)
);

-- =====================================================================
-- SERVICE REQUEST LOGS (AUDIT / HISTORY TRACKING)
-- =====================================================================
CREATE TABLE service_request_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,

    service_request_id VARCHAR(20) NOT NULL,

    status_id INT,
    priority_id INT,
    trigger_id INT,
    category_id INT,
    subcategory_id INT,
    approximate_value_id INT,

    summary VARCHAR(100),
    description VARCHAR(500),

    action_by_user_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (service_request_id) REFERENCES service_requests(id),
    FOREIGN KEY (status_id) REFERENCES request_statuses(id),
    FOREIGN KEY (priority_id) REFERENCES priorities(id),
    FOREIGN KEY (trigger_id) REFERENCES request_triggers(id),
    FOREIGN KEY (category_id) REFERENCES request_categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES request_subcategories(id),
    FOREIGN KEY (approximate_value_id) REFERENCES approximate_values(id)
);
