import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Search } from 'lucide-react';
import { openWhatsApp } from '../../utils/helpers';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Home',      to: '/' },
  { label: 'About',     to: '/about' },
  { label: 'Services',  to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Pricing',   to: '/pricing' },
  { label: 'Contact',   to: '/contact' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 990,
      transition: 'all 0.3s ease',
      padding: scrolled ? '0.75rem 1.5rem' : '1.25rem 1.5rem',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid var(--border-light)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: 'white',
            boxShadow: 'var(--shadow-glow)',
          }}>A</div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Aarav <span className="gradient-text">Enterprises</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.5rem',
        }} className="desktop-nav">
          {NAV_LINKS.map(link => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: isActive ? 'var(--brand-violet)' : 'var(--text-main)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Search Bar */}
          <div className="desktop-nav" style={{
            position: 'relative',
            display: 'flex', alignItems: 'center',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '999px',
            padding: '0.4rem 1rem',
            marginRight: '0.5rem'
          }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search services..." 
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-main)', fontSize: '0.9rem', width: '150px'
              }}
            />
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          <button
            onClick={() => openWhatsApp()}
            className="btn-whatsapp-navbar"
          >
            <MessageCircle size={19} className="wa-icon" />
            <span className="desktop-nav">Order Now</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: 10, color: 'var(--text-main)', cursor: 'pointer', padding: '0.6rem',
              display: 'none',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)', padding: '1.5rem',
          marginTop: '1rem', borderRadius: '1rem', boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '0.85rem 1rem',
                  color: location.pathname === link.to ? 'var(--brand-violet)' : 'var(--text-main)',
                  fontWeight: 600, textDecoration: 'none', borderRadius: 8,
                  background: location.pathname === link.to ? 'var(--bg-subtle)' : 'transparent',
                }}
              >{link.label}</Link>
            ))}
          </div>
          <button
            onClick={() => openWhatsApp()}
            className="btn-whatsapp"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <MessageCircle size={18} /> Order Now
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
