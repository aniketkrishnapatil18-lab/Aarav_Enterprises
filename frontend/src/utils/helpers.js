// ============================================================
// Frontend Utilities: WhatsApp helpers
// ============================================================

const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || '15551960714';

/**
 * Build a WhatsApp chat URL with optional pre-filled message
 */
export function buildWhatsAppUrl(message = '', serviceContext = null) {
  let text = message;
  if (!text && serviceContext) {
    text = `Hi! I'm interested in your *${serviceContext}* service. Please help me.`;
  } else if (!text) {
    text = 'Hi! I need help with a graphic design service.';
  }
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${WA_NUMBER.replace(/[^0-9]/g, '')}?text=${encoded}`;
}

/**
 * Open WhatsApp chat in a new tab
 */
export function openWhatsApp(message = '', serviceContext = null) {
  const url = buildWhatsAppUrl(message, serviceContext);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Format price in Indian Rupee style
 */
export function formatPrice(amount, label = 'onwards') {
  if (!amount || amount === 0) return 'Configurable';
  const formatted = parseFloat(amount).toLocaleString('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return label ? `${formatted} ${label}` : formatted;
}

/**
 * Get status badge config
 */
export function getStatusConfig(status) {
  const configs = {
    NEW:                    { label: 'New',                  className: 'badge-new',       color: '#60A5FA' },
    REQUIREMENT_COLLECTED:  { label: 'Requirements Collected', className: 'badge-collected', color: '#C084FC' },
    ADMIN_REVIEW:           { label: 'Admin Review',         className: 'badge-review',    color: '#FBBF24' },
    ACCEPTED:               { label: 'Accepted',             className: 'badge-accepted',  color: '#4ADE80' },
    IN_PROGRESS:            { label: 'In Progress',          className: 'badge-progress',  color: '#818CF8' },
    DESIGN_READY:           { label: 'Design Ready',         className: 'badge-ready',     color: '#2DD4BF' },
    CUSTOMER_REVIEW:        { label: 'Customer Review',      className: 'badge-review',    color: '#FBBF24' },
    REVISION:               { label: 'Revision',             className: 'badge-revision',  color: '#F87171' },
    COMPLETED:              { label: 'Completed',            className: 'badge-completed', color: '#22C55E' },
    CANCELLED:              { label: 'Cancelled',            className: 'badge-cancelled', color: '#9CA3AF' },
  };
  return configs[status] || { label: status, className: 'badge-new', color: '#60A5FA' };
}

/**
 * Get language display name
 */
export function getLanguageLabel(code) {
  const map = { en: 'English', hi: 'Hindi', mr: 'Marathi', mixed: 'Mixed' };
  return map[code] || code;
}

/**
 * Format relative time
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date  = new Date(dateStr);
  const now   = new Date();
  const diff  = Math.floor((now - date) / 1000);
  if (diff < 60)      return 'Just now';
  if (diff < 3600)    return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)   return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800)  return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Format date
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/**
 * Truncate text
 */
export function truncate(str, n = 80) {
  if (!str) return '';
  return str.length > n ? str.substring(0, n) + '...' : str;
}
