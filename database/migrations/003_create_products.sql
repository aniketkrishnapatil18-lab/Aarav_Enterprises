-- ============================================================
-- Migration 003: Create products (services) table
-- ============================================================

CREATE TABLE IF NOT EXISTS `products` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id`     INT UNSIGNED NOT NULL,
  `name`            VARCHAR(150) NOT NULL,
  `slug`            VARCHAR(180) NOT NULL UNIQUE,
  `short_desc`      VARCHAR(300) DEFAULT NULL,
  `description`     TEXT DEFAULT NULL,
  `starting_price`  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `max_price`       DECIMAL(10,2) DEFAULT NULL,
  `price_label`     VARCHAR(50) DEFAULT 'onwards',
  `currency`        VARCHAR(10) NOT NULL DEFAULT 'INR',
  `delivery_days`   INT DEFAULT NULL,
  `revisions`       INT DEFAULT NULL,
  `file_formats`    VARCHAR(300) DEFAULT NULL,
  `thumbnail_url`   VARCHAR(500) DEFAULT NULL,
  `is_featured`     TINYINT(1) NOT NULL DEFAULT 0,
  `is_active`       TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order`      INT NOT NULL DEFAULT 0,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_products_category` (`category_id`),
  INDEX `idx_products_slug` (`slug`),
  INDEX `idx_products_featured` (`is_featured`),
  INDEX `idx_products_active` (`is_active`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
