import { useState, useEffect } from 'react';
import { notificationAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Bell, CheckCircle } from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

export default function AdminNotifications() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Notifications — Admin';
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await notificationAPI.list({});
      setList(res.data.data || []);
    } catch { setList([]); }
    finally { setLoading(false); }
  }

  async function markRead(id) {
    try {
      await notificationAPI.markRead(id);
      load();
    } catch { toast.error('Failed to mark read.'); }
  }

  async function markAllRead() {
    try {
      await notificationAPI.markAll();
      toast.success('All marked as read.');
      load();
    } catch { toast.error('Failed to mark all read.'); }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Notifications</h1>
        <button onClick={markAllRead} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
          <CheckCircle size={15} /> Mark All Read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 70, borderRadius: '0.75rem' }} />)
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
            <Bell size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No notifications yet.</p>
          </div>
        ) : (
          list.map(n => (
            <div key={n.id} className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: n.is_read ? 0.6 : 1, borderLeft: n.is_read ? '1px solid var(--brand-border)' : '3px solid #7C3AED' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{n.title}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>{n.body}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.3rem' }}>{timeAgo(n.created_at)}</div>
              </div>
              {!n.is_read && (
                <button onClick={() => markRead(n.id)} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}>
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
