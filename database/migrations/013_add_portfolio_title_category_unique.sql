-- ============================================================
-- Migration 013: Make (category_id, title) unique on portfolio
--
-- Migration 012 made `image_url` unique so seeds 002/005's
-- `INSERT IGNORE` placeholder rows wouldn't duplicate on repeat
-- `db:setup` runs. But seed 011 permanently changes those same
-- rows' `image_url` away from the placeholder value to fix the
-- broken images — which means on the NEXT `db:setup` run, seeds
-- 002/005 no longer see a matching image_url, so `INSERT IGNORE`
-- happily inserts a fresh duplicate row (same title, new id, old
-- broken image_url), which then collides with 011 trying to set
-- it to an already-used target URL.
--
-- (category_id, title) never changes, so it's a stable dedup key
-- for these placeholder seeds regardless of what 011 does to
-- image_url afterward.
--
-- Guarded/idempotent — see migration 011 for why that matters.
-- ============================================================

SET @idx_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio' AND INDEX_NAME = 'idx_portfolio_cat_title'
);
SET @sql = IF(@idx_exists = 0,
  'ALTER TABLE `portfolio` ADD UNIQUE INDEX `idx_portfolio_cat_title` (`category_id`, `title`(191))',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
