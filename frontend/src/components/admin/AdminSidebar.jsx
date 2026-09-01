import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, MessageSquare, MessageCircle,
  Package, Image, BookOpen, Bell, BarChart2, Settings, LogOut, X, Sparkles, Video
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/conversations', label: 'WhatsApp Chat', icon: MessageCircle },
  { to: '/admin/products', label: 'Services Catalog', icon: Package },
  { to: '/admin/portfolio', label: 'Portfolio Showcase', icon: Image },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/videos', label: 'Product Videos', icon: Video },
  { to: '/admin/knowledge', label: 'AI Knowledge Base', icon: BookOpen },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart2 },
  { to: '/admin/settings', label: 'System Settings', icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('ae_token');
    localStorage.removeItem('ae_admin');
    navigate('/admin/login');
  }

  return (
    <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`} style={{
      width: 270, minHeight: '100vh', background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-light)', display: 'flex',
      flexDirection: 'column', flexShrink: 0, zIndex: 995,
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit', fontWeight: 800, color: 'white', fontSize: '1.2rem',
            boxShadow: 'var(--shadow-glow)',
          }}>A</div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>Aarav Enterprises</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--brand-violet)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={11} color="#D97706" /> Admin Console
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', display: 'none' }} className="sidebar-close">
          <X size={20} />
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'hidden' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <item.icon size={18} />
            <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Footer */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border-light)' }}>
        <button
          onClick={handleLogout}
          className="admin-nav-item"
          style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}
        >
          <LogOut size={18} />
          <span style={{ fontWeight: 600 }}>Logout</span>
        </button>
      </div>

      <style>{`
        .admin-nav-item {
          display: flex; alignItems: center; gap: 0.75rem; padding: 0.75rem 1rem;
          border-radius: var(--radius-lg); color: var(--text-muted); text-decoration: none;
          font-weight: 600; transition: all 0.2s ease; cursor: pointer; border: 1px solid transparent;
        }
        .admin-nav-item:hover {
          background: var(--bg-subtle); color: var(--text-main);
        }
        .admin-nav-item.active {
          background: var(--badge-bg-purple); color: var(--brand-violet); border-color: var(--badge-border-purple); font-weight: 700;
        }
        @media (max-width: 768px) { .sidebar-close { display: block !important; } }
      `}</style>
    </aside>
  );
}
