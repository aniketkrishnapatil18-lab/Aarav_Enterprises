-- ============================================================
-- Migration 017: Add final design and publishing tracking to inquiries
-- ============================================================

ALTER TABLE inquiries ADD COLUMN final_design_url VARCHAR(500) DEFAULT NULL;
ALTER TABLE inquiries ADD COLUMN is_published TINYINT(1) NOT NULL DEFAULT 0;
