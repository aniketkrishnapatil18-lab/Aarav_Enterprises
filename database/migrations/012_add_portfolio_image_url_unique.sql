-- ============================================================
-- Migration 012: Make portfolio.image_url unique
-- Without this, `INSERT IGNORE` seeds (005, and the new LED
-- portfolio seed) are not idempotent — re-running db:setup would
-- duplicate every portfolio row on each run.
-- ============================================================

ALTER TABLE `portfolio`
  ADD UNIQUE INDEX `idx_portfolio_image_url` (`image_url`(255));
