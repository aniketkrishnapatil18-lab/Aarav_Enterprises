-- ============================================================
-- Migration 012: Make portfolio.image_url unique
-- Without this, `INSERT IGNORE` seeds (005, and the LED portfolio
-- seed) are not idempotent — re-running db:setup would duplicate
-- every portfolio row on each run.
--
-- Written to be safely re-runnable (see migration 011 for why):
-- guarded by an INFORMATION_SCHEMA check so it's a no-op if the
-- index already exists, instead of failing with "Duplicate key
-- name" on a second run.
-- ============================================================

SET @idx_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND INDEX_NAME = 'idx_portfolio_image_url'
);
SET @sql = IF(@idx_exists = 0,
  'ALTER TABLE `portfolio` ADD UNIQUE INDEX `idx_portfolio_image_url` (`image_url`(255))',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
