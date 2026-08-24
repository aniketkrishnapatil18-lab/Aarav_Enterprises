-- ============================================================
-- Aarav Enterprises — Master Database Setup Script
-- Run this file to set up the entire database from scratch
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS `aarav_enterprises`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `aarav_enterprises`;

-- Run migrations in order
SOURCE migrations/001_create_admins.sql;
SOURCE migrations/002_create_categories.sql;
SOURCE migrations/003_create_products.sql;
SOURCE migrations/004_create_portfolio.sql;
SOURCE migrations/005_create_customers.sql;
SOURCE migrations/006_create_inquiries.sql;
SOURCE migrations/007_create_conversations.sql;
SOURCE migrations/008_create_ai_knowledge.sql;
SOURCE migrations/009_create_notifications.sql;
SOURCE migrations/010_create_attachments.sql;
SOURCE migrations/011_add_portfolio_wa_fields.sql;
SOURCE migrations/012_add_portfolio_image_url_unique.sql;

-- Run seeds in order
SOURCE seeds/001_seed_admin.sql;
SOURCE seeds/002_seed_categories.sql;
SOURCE seeds/003_seed_products.sql;
SOURCE seeds/004_seed_ai_knowledge.sql;
SOURCE seeds/005_seed_portfolio.sql;
SOURCE seeds/007_seed_signage_category.sql;
SOURCE seeds/008_seed_led_portfolio.sql;
SOURCE seeds/009_seed_more_products.sql;
SOURCE seeds/010_seed_product_thumbnails.sql;
SOURCE seeds/011_fix_portfolio_images.sql;

SELECT 'Aarav Enterprises database setup complete!' AS status;
