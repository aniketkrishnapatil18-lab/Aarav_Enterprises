-- ============================================================
-- Migration 011: Add WhatsApp sample fields to portfolio
--
-- Written to be safely re-runnable: `db:setup` re-runs every
-- migration file on every invocation with no "already applied"
-- tracking, and plain `ALTER TABLE ADD COLUMN` isn't idempotent —
-- running it twice against a database that already has these
-- columns fails with "Duplicate column name". Each ALTER below is
-- guarded by an INFORMATION_SCHEMA check so it's a no-op if the
-- column/index already exists.
-- ============================================================

SET @col_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'tags'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `portfolio` ADD COLUMN `tags` VARCHAR(500) DEFAULT NULL AFTER `client_name`',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'whatsapp_sample'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `portfolio` ADD COLUMN `whatsapp_sample` TINYINT(1) NOT NULL DEFAULT 1 AFTER `tags`',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND COLUMN_NAME = 'caption'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `portfolio` ADD COLUMN `caption` VARCHAR(300) DEFAULT NULL AFTER `whatsapp_sample`',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND INDEX_NAME = 'idx_portfolio_wa_sample'
);
SET @sql = IF(@idx_exists = 0,
  'ALTER TABLE `portfolio` ADD INDEX `idx_portfolio_wa_sample` (`whatsapp_sample`)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
