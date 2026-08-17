-- ============================================================
-- Migration 004: Create portfolio table
-- ============================================================

CREATE TABLE IF NOT EXISTS `portfolio` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL,
  `title`       VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image_url`   VARCHAR(500) NOT NULL,
  `client_name` VARCHAR(150) DEFAULT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order`  INT NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_portfolio_category` (`category_id`),
  INDEX `idx_portfolio_featured` (`is_featured`),
  INDEX `idx_portfolio_active` (`is_active`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
