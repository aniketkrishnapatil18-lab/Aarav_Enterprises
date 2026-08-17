-- ============================================================
-- Migration 007: Create whatsapp_conversations + whatsapp_messages
-- ============================================================

CREATE TABLE IF NOT EXISTS `whatsapp_conversations` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `customer_id`       INT UNSIGNED NOT NULL,
  `inquiry_id`        INT UNSIGNED DEFAULT NULL,
  `wa_conversation_id` VARCHAR(100) DEFAULT NULL,
  `phone`             VARCHAR(20) NOT NULL,
  `language`          ENUM('en','hi','mr','mixed') NOT NULL DEFAULT 'en',
  `status`            ENUM('active','closed','human_handoff','archived') NOT NULL DEFAULT 'active',
  `service_context`   VARCHAR(150) DEFAULT NULL,
  `started_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_message_at`   DATETIME DEFAULT NULL,
  `closed_at`         DATETIME DEFAULT NULL,
  `message_count`     INT UNSIGNED NOT NULL DEFAULT 0,
  `ai_context`        JSON DEFAULT NULL,
  `created_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_wa_conv_customer` (`customer_id`),
  INDEX `idx_wa_conv_inquiry` (`inquiry_id`),
  INDEX `idx_wa_conv_phone` (`phone`),
  INDEX `idx_wa_conv_status` (`status`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`inquiry_id`)  REFERENCES `inquiries`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `whatsapp_messages` (
  `id`              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `conversation_id` INT UNSIGNED NOT NULL,
  `wa_message_id`   VARCHAR(100) DEFAULT NULL,
  `sender`          ENUM('customer','ai','admin') NOT NULL DEFAULT 'customer',
  `message_type`    ENUM('text','image','audio','video','document','template') NOT NULL DEFAULT 'text',
  `content`         TEXT DEFAULT NULL,
  `media_url`       VARCHAR(500) DEFAULT NULL,
  `media_id`        VARCHAR(200) DEFAULT NULL,
  `language`        ENUM('en','hi','mr','mixed') DEFAULT NULL,
  `is_ai_generated` TINYINT(1) NOT NULL DEFAULT 0,
  `sent_at`         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_wa_msg_conversation` (`conversation_id`),
  INDEX `idx_wa_msg_sent` (`sent_at`),
  INDEX `idx_wa_msg_wa_id` (`wa_message_id`),
  FOREIGN KEY (`conversation_id`) REFERENCES `whatsapp_conversations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
