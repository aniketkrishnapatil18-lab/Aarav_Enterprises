-- ============================================================
-- Migration 008: Create ai_knowledge_base table
-- ============================================================

CREATE TABLE IF NOT EXISTS `ai_knowledge_base` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key_name`    VARCHAR(100) NOT NULL UNIQUE,
  `label`       VARCHAR(200) NOT NULL,
  `value`       TEXT NOT NULL,
  `category`    VARCHAR(50) NOT NULL DEFAULT 'general',
  `description` VARCHAR(300) DEFAULT NULL,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_knowledge_key` (`key_name`),
  INDEX `idx_knowledge_category` (`category`),
  INDEX `idx_knowledge_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- Migration: Create settings table
-- ============================================================

CREATE TABLE IF NOT EXISTS `settings` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key_name`   VARCHAR(100) NOT NULL UNIQUE,
  `value`      TEXT DEFAULT NULL,
  `label`      VARCHAR(200) DEFAULT NULL,
  `type`       ENUM('text','number','boolean','json','secret') NOT NULL DEFAULT 'text',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_settings_key` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
