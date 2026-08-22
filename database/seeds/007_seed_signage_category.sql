-- ============================================================
-- Seed 007: Add the LED Sign Board category
-- The original 10 categories (seed 002) are all graphic-design
-- services; the business's core physical product — LED signage —
-- had no matching category until now.
-- ============================================================

INSERT IGNORE INTO `categories` (`name`, `slug`, `description`, `icon`, `sort_order`) VALUES
('LED Sign Board', 'led-sign-board', 'Custom LED sign boards and illuminated shop signage', 'Lightbulb', 11);
