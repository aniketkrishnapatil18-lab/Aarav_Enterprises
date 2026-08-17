-- ============================================================
-- Migration 009: Create notifications table
-- ============================================================

CREATE TABLE IF NOT EXISTS `notifications` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_id`    INT UNSIGNED DEFAULT NULL,
  `type`        VARCHAR(50) NOT NULL DEFAULT 'new_inquiry',
  `title`       VARCHAR(300) NOT NULL,
  `body`        TEXT NOT NULL,
  `data`        JSON DEFAULT NULL,
  `is_read`     TINYINT(1) NOT NULL DEFAULT 0,
  `read_at`     DATETIME DEFAULT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notifications_admin` (`admin_id`),
  INDEX `idx_notifications_read` (`is_read`),
  INDEX `idx_notifications_type` (`type`),
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
