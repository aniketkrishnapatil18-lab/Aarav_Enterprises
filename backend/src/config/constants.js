// ============================================================
// Backend Configuration: Constants
// ============================================================

const INQUIRY_STATUS = {
  NEW: 'NEW',
  REQUIREMENT_COLLECTED: 'REQUIREMENT_COLLECTED',
  ADMIN_REVIEW: 'ADMIN_REVIEW',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  DESIGN_READY: 'DESIGN_READY',
  CUSTOMER_REVIEW: 'CUSTOMER_REVIEW',
  REVISION: 'REVISION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const INQUIRY_STATUS_LABELS = {
  NEW: 'New',
  REQUIREMENT_COLLECTED: 'Requirement Collected',
  ADMIN_REVIEW: 'Admin Review',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  DESIGN_READY: 'Design Ready',
  CUSTOMER_REVIEW: 'Customer Review',
  REVISION: 'Revision',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
  MR: 'mr',
  MIXED: 'mixed',
};

const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  HUMAN_HANDOFF: 'human_handoff',
  ARCHIVED: 'archived',
};

const NOTIFICATION_TYPES = {
  NEW_INQUIRY: 'new_inquiry',
  STATUS_CHANGE: 'status_change',
  HUMAN_HANDOFF: 'human_handoff',
  NEW_MESSAGE: 'new_message',
};

const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  VENDOR: 'vendor',
};

const ALLOWED_UPLOAD_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

module.exports = {
  INQUIRY_STATUS,
  INQUIRY_STATUS_LABELS,
  LANGUAGES,
  CONVERSATION_STATUS,
  NOTIFICATION_TYPES,
  ADMIN_ROLES,
  ALLOWED_UPLOAD_TYPES,
  MAX_FILE_SIZE,
};
