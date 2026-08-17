-- ============================================================
-- Migration 011: Add WhatsApp sample fields to portfolio
-- ============================================================

ALTER TABLE `portfolio`
  ADD COLUMN `tags`             VARCHAR(500) DEFAULT NULL AFTER `client_name`,
  ADD COLUMN `whatsapp_sample`  TINYINT(1) NOT NULL DEFAULT 1 AFTER `tags`,
  ADD COLUMN `caption`          VARCHAR(300) DEFAULT NULL AFTER `whatsapp_sample`;

ALTER TABLE `portfolio`
  ADD INDEX `idx_portfolio_wa_sample` (`whatsapp_sample`);
