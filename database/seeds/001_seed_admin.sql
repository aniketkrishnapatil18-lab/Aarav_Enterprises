-- ============================================================
-- Seed 001: Default admin user
-- Password: Admin@123 (bcrypt hash)
-- ============================================================

INSERT IGNORE INTO `admins` (`name`, `email`, `password_hash`, `role`)
VALUES (
  'Aarav Admin',
  'admin@aaraventerprises.com',
  '$2a$10$sQdc2TwuiYBtSvZiK7v/XuzKT8kF7fcbzF.5rPr5OQImHqqcOVOFy',
  'super_admin'
);

-- NOTE: The hash above is for password "Admin@123"
-- Change it immediately after first login via Admin Settings.
