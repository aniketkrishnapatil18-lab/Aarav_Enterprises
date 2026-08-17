import { useState, useEffect } from 'react';
import { Menu, Bell, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationAPI } from '../../services/api';
import ThemeToggle from '../common/ThemeToggle';

export default function AdminHeader({ onMenuClick }) {
  const [unread, setUnread] = useState(0);
  const admin = JSON.parse(localStorage.getItem('ae_admin') || '{}');

  useEffect(() => {
    notificationAPI.list({ unread: true })
      .then(res => setUnread(res.data.unreadCount || 0))
      .catch(() => {});
  }, []);

  return (
    <header style={{
      height: 64, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)',
      display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem', flexShrink: 0,
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      <button onClick={onMenuClick} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', display: 'none', padding: '0.25rem' }} className="mobile-only">
        <Menu size={22} />
      </button>

      <div style={{ flex: 1 }} />

      <Link to="/" target="_blank" style={{ color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
        <ExternalLink size={15} /> View Website
      </Link>

      {/* Theme Toggle Button */}
      <ThemeToggle />

      <Link to="/admin/notifications" style={{ position: 'relative', color: 'var(--text-subtle)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: 'var(--grad-primary)',
            borderRadius: '50%', width: 18, height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: 'white',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
          {(admin.name || 'A').charAt(0).toUpperCase()}
        </div>
        <div style={{ display: 'none' }} className="desktop-only">
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>{admin.name || 'Admin'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'capitalize' }}>{admin.role || 'admin'}</div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .mobile-only { display: block !important; } .desktop-only { display: block !important; } }
      `}</style>
    </header>
  );
}
