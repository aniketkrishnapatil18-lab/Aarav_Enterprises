-- ============================================================
-- Migration 005: Create customers table
-- ============================================================

CREATE TABLE IF NOT EXISTS `customers` (
  `id`                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `whatsapp_number`    VARCHAR(20) NOT NULL UNIQUE,
  `phone`              VARCHAR(20) DEFAULT NULL,
  `name`               VARCHAR(150) DEFAULT NULL,
  `email`              VARCHAR(150) DEFAULT NULL,
  `preferred_language` ENUM('en','hi','mr','mixed') NOT NULL DEFAULT 'en',
  `profile_name`       VARCHAR(150) DEFAULT NULL,
  `first_contact_at`   DATETIME DEFAULT NULL,
  `last_contact_at`    DATETIME DEFAULT NULL,
  `total_inquiries`    INT UNSIGNED NOT NULL DEFAULT 0,
  `notes`              TEXT DEFAULT NULL,
  `created_at`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_customers_whatsapp` (`whatsapp_number`),
  INDEX `idx_customers_phone` (`phone`),
  INDEX `idx_customers_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
