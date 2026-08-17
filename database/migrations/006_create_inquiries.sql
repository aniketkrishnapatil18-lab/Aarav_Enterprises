-- ============================================================
-- Migration 006: Create inquiries + inquiry_messages tables
-- ============================================================

CREATE TABLE IF NOT EXISTS `inquiries` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `inquiry_number`   VARCHAR(20) NOT NULL UNIQUE,
  `customer_id`      INT UNSIGNED NOT NULL,
  `product_id`       INT UNSIGNED DEFAULT NULL,
  `service_name`     VARCHAR(150) DEFAULT NULL,
  `language`         ENUM('en','hi','mr','mixed') NOT NULL DEFAULT 'en',
  `status`           ENUM(
                       'NEW',
                       'REQUIREMENT_COLLECTED',
                       'ADMIN_REVIEW',
                       'ACCEPTED',
                       'IN_PROGRESS',
                       'DESIGN_READY',
                       'CUSTOMER_REVIEW',
                       'REVISION',
                       'COMPLETED',
                       'CANCELLED'
                     ) NOT NULL DEFAULT 'NEW',
  `business_name`    VARCHAR(200) DEFAULT NULL,
  `requirements`     TEXT DEFAULT NULL,
  `budget`           VARCHAR(100) DEFAULT NULL,
  `deadline`         DATE DEFAULT NULL,
  `preferred_colors` VARCHAR(300) DEFAULT NULL,
  `quantity`         INT DEFAULT NULL,
  `ai_summary`       TEXT DEFAULT NULL,
  `collected_data`   JSON DEFAULT NULL,
  `assigned_to`      INT UNSIGNED DEFAULT NULL,
  `priority`         ENUM('LOW','NORMAL','HIGH','URGENT') NOT NULL DEFAULT 'NORMAL',
  `human_handoff`    TINYINT(1) NOT NULL DEFAULT 0,
  `notes`            TEXT DEFAULT NULL,
  `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_inquiries_customer` (`customer_id`),
  INDEX `idx_inquiries_product` (`product_id`),
  INDEX `idx_inquiries_status` (`status`),
  INDEX `idx_inquiries_number` (`inquiry_number`),
  INDEX `idx_inquiries_created` (`created_at`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`product_id`)  REFERENCES `products`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assigned_to`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `inquiry_messages` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `inquiry_id`    INT UNSIGNED NOT NULL,
  `sender`        ENUM('admin','customer','ai','system') NOT NULL DEFAULT 'admin',
  `message`       TEXT NOT NULL,
  `admin_id`      INT UNSIGNED DEFAULT NULL,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_inq_messages_inquiry` (`inquiry_id`),
  FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`)   REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
