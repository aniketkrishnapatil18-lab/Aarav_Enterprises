-- ============================================================
-- Migration 012: Create clients table
-- ============================================================

CREATE TABLE IF NOT EXISTS `clients` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`             VARCHAR(255) NOT NULL,
  `logo_url`         VARCHAR(500) DEFAULT NULL,
  `service_provided` VARCHAR(255) DEFAULT NULL,
  `is_active`        TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order`       INT NOT NULL DEFAULT 0,
  `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_clients_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
