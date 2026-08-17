-- ============================================================
-- Migration 010: Create attachments table
-- ============================================================

CREATE TABLE IF NOT EXISTS `attachments` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `inquiry_id`      INT UNSIGNED DEFAULT NULL,
  `conversation_id` INT UNSIGNED DEFAULT NULL,
  `message_id`      INT UNSIGNED DEFAULT NULL,
  `original_name`   VARCHAR(300) NOT NULL,
  `file_name`       VARCHAR(300) NOT NULL,
  `file_path`       VARCHAR(500) NOT NULL,
  `file_url`        VARCHAR(500) DEFAULT NULL,
  `mime_type`       VARCHAR(100) DEFAULT NULL,
  `file_size`       BIGINT UNSIGNED DEFAULT NULL,
  `source`          ENUM('whatsapp','admin_upload','customer_upload') NOT NULL DEFAULT 'whatsapp',
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_attachments_inquiry` (`inquiry_id`),
  INDEX `idx_attachments_conversation` (`conversation_id`),
  FOREIGN KEY (`inquiry_id`)      REFERENCES `inquiries`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`conversation_id`) REFERENCES `whatsapp_conversations`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`message_id`)      REFERENCES `whatsapp_messages`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
