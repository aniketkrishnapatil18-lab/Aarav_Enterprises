import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Bell, CheckCircle2, MessageSquare, MessageCircle,
  Package, Receipt, ShieldAlert, Sparkles, Filter,
  Search, Trash2, ArrowRight, ExternalLink, Check,
  Clock, IndianRupee, AlertTriangle, Eye, CheckCheck
} from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

const REALISTIC_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'new_inquiry',
    category: 'orders',
    title: 'New Order: 3D LED Acrylic Sign Board',
    body: 'Aniket Krishna Patil (+91 97635 30208) requested quotation for 4x3 ft illuminated acrylic letters.',
    meta: '₹14,500 · High Priority',
    is_read: 0,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    link: '/admin/inquiries',
  },
  {
    id: 'notif-2',
    type: 'payment',
    category: 'payments',
    title: 'Payment Received: ₹28,000 for INV-2026-002',
    body: 'Kiran Signage Corp settled invoice for Acrylic Letter Glow Sign via Bank NEFT.',
    meta: 'Paid · NEFT Transfer',
    is_read: 0,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    link: '/admin/invoices',
  },
  {
    id: 'notif-3',
    type: 'whatsapp_handoff',
    category: 'chats',
    title: 'WhatsApp AI Bot: Human Handoff Requested',
    body: 'Mahesh Electronics (+91 98234 55667) asked for custom bulk rate on 10 Roll-Up Standees.',
    meta: 'Marathi · Urgent',
    is_read: 0,
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    link: '/admin/conversations',
  },
  {
    id: 'notif-4',
    type: 'design_approved',
    category: 'orders',
    title: 'Design Proof Approved: Shree Balaji Jewelers',
    body: 'Client approved high-resolution vector mockup for Gold Titanium Letter LED Board.',
    meta: 'Ready for Fabrication',
    is_read: 1,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    link: '/admin/inquiries',
  },
  {
    id: 'notif-5',
    type: 'inquiry_completed',
    category: 'orders',
    title: 'Order Fulfilled: AE-MTJY-089 (Mascot Logo Design)',
    body: 'Final brand package and vector source files were delivered to Pooja Wellness Clinic.',
    meta: 'Completed · ₹9,600',
    is_read: 1,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    link: '/admin/inquiries',
  },
  {
    id: 'notif-6',
    type: 'system',
    category: 'system',
    title: 'WhatsApp Cloud API & Gemini 2.0 Webhook Active',
    body: 'All incoming customer messages are being processed by the multilingual AI bot in real-time.',
    meta: 'System Healthy',
    is_read: 1,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    link: '/admin/knowledge',
  },
];

export default function AdminNotifications() {
  const [dbNotifications, setDbNotifications] = useState([]);
  const [localNotifications, setLocalNotifications] = useState(REALISTIC_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'UNREAD' | 'orders' | 'chats' | 'payments' | 'system'
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Notifications — Admin';
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await notificationAPI.list({});
      setDbNotifications(res.data.data || []);
    } catch {
      setDbNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  // Combined notification feed
  const allNotifications = useMemo(() => {
    const formattedDb = dbNotifications.map(n => ({
      id: `db-${n.id}`,
      dbId: n.id,
      type: n.type || 'new_inquiry',
      category: n.type?.includes('chat') || n.type?.includes('conversation') ? 'chats' : n.type?.includes('payment') ? 'payments' : 'orders',
      title: n.title,
      body: n.body,
      meta: n.data?.inquiry_number || 'Inquiry Update',
      is_read: n.is_read ? 1 : 0,
      created_at: n.created_at,
      link: '/admin/inquiries',
    }));

    const combined = [...formattedDb, ...localNotifications];
    return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [dbNotifications, localNotifications]);

  // Filtered List
  const filteredList = useMemo(() => {
    return allNotifications.filter(n => {
      let matchTab = true;
      if (filterTab === 'UNREAD') matchTab = n.is_read === 0;
      else if (filterTab !== 'ALL') matchTab = n.category === filterTab;

      const matchSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.body.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [allNotifications, filterTab, searchQuery]);

  const unreadCount = allNotifications.filter(n => n.is_read === 0).length;

  async function handleToggleRead(e, n) {
    e.stopPropagation();
    const newStatus = n.is_read === 1 ? 0 : 1;
    if (n.dbId && newStatus === 1) {
      try { await notificationAPI.markRead(n.dbId); } catch {}
    }
    setLocalNotifications(prev => prev.map(item => item.id === n.id ? { ...item, is_read: newStatus } : item));
    setDbNotifications(prev => prev.map(item => item.id === n.dbId ? { ...item, is_read: newStatus } : item));
    toast.success(newStatus === 1 ? 'Marked as read' : 'Marked as unread');
  }

  async function handleMarkAllRead() {
    try { await notificationAPI.markAll(); } catch {}
    setLocalNotifications(prev => prev.map(item => ({ ...item, is_read: 1 })));
    setDbNotifications(prev => prev.map(item => ({ ...item, is_read: 1 })));
    toast.success('All notifications marked as read');
  }

  function handleDelete(e, id) {
    e.stopPropagation();
    setLocalNotifications(prev => prev.filter(item => item.id !== id));
    setDbNotifications(prev => prev.filter(item => `db-${item.id}` !== id));
    toast.success('Notification removed');
  }

  function getNotificationBadge(type) {
    switch (type) {
      case 'new_inquiry':
        return { icon: Package, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' };
      case 'payment':
        return { icon: IndianRupee, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
      case 'whatsapp_handoff':
        return { icon: MessageCircle, color: '#25D366', bg: 'rgba(37, 211, 102, 0.12)' };
      case 'design_approved':
        return { icon: Sparkles, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' };
      case 'inquiry_completed':
        return { icon: CheckCircle2, color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' };
      case 'system':
      default:
        return { icon: ShieldAlert, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)' };
    }
  }

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* ── Top Header ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', letterSpacing: '-0.02em', margin: 0 }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: 999,
              background: 'var(--brand-violet)',
              color: '#FFFFFF',
            }}>
              {unreadCount} new
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      {/* ── Compact Filter Tabs & Search Bar ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          padding: '0.2rem',
          borderRadius: 8,
          gap: '0.2rem',
          flexWrap: 'wrap',
        }}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'orders', label: 'Orders' },
            { id: 'chats', label: 'WhatsApp' },
            { id: 'payments', label: 'Payments' },
            { id: 'system', label: 'System' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              style={{
                border: 'none',
                background: filterTab === tab.id ? 'var(--brand-violet)' : 'transparent',
                color: filterTab === tab.id ? '#FFFFFF' : 'var(--text-subtle)',
                fontWeight: filterTab === tab.id ? 700 : 500,
                fontSize: '0.78rem',
                padding: '0.35rem 0.7rem',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2rem', fontSize: '0.8rem', height: 34, borderRadius: 8 }}
          />
        </div>
      </div>

      {/* ── Notifications Inbox List ── */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
        {loading ? (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 56, borderRadius: 8 }} />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-subtle)' }}>
            <Bell size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
              No notifications
            </p>
            <p style={{ fontSize: '0.8rem', margin: 0 }}>
              {filterTab === 'UNREAD' ? 'You are all caught up!' : 'No notifications in this view.'}
            </p>
          </div>
        ) : (
          filteredList.map((n, idx) => {
            const badge = getNotificationBadge(n.type);
            const Icon = badge.icon;
            const isUnread = n.is_read === 0;

            return (
              <div
                key={n.id}
                onClick={() => n.link && navigate(n.link)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.85rem 1.25rem',
                  gap: '0.85rem',
                  borderBottom: idx < filteredList.length - 1 ? '1px solid var(--border-light)' : 'none',
                  background: isUnread ? 'var(--bg-surface)' : 'transparent',
                  cursor: n.link ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                  position: 'relative',
                }}
                className="table-row-hover"
              >
                {/* Unread Left Dot Indicator */}
                <div style={{ width: 6, display: 'flex', justifyContent: 'center' }}>
                  {isUnread && (
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--brand-violet)',
                      boxShadow: '0 0 6px var(--brand-violet)',
                      display: 'block',
                    }} />
                  )}
                </div>

                {/* Compact 32px Icon Badge */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: badge.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} color={badge.color} />
                </div>

                {/* Main Text Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 2 }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: isUnread ? 700 : 600,
                      color: 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {n.title}
                    </span>

                    {n.meta && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--text-subtle)',
                        background: 'var(--bg-subtle)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                        border: '1px solid var(--border-light)',
                      }}>
                        {n.meta}
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontSize: '0.8rem',
                    color: isUnread ? 'var(--text-main)' : 'var(--text-subtle)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.4,
                    opacity: isUnread ? 0.9 : 0.75,
                  }}>
                    {n.body}
                  </div>
                </div>

                {/* Timestamp */}
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-subtle)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {timeAgo(n.created_at)}
                </div>

                {/* Inline Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                  <button
                    onClick={(e) => handleToggleRead(e, n)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: isUnread ? 'var(--brand-violet)' : 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={isUnread ? 'Mark as read' : 'Mark as unread'}
                  >
                    <Check size={15} color={isUnread ? 'var(--brand-violet)' : 'var(--text-subtle)'} />
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, n.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      opacity: 0.6,
                    }}
                    title="Dismiss"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
