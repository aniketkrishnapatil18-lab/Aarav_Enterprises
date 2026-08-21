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
      padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid var(--border-light)' : '1px solid transparent',
      boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <nav style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          background: 'var(--nav-pill-bg)',
          borderRadius: 999,
          padding: '0.35rem',
        }} className="desktop-nav">
          {NAV_LINKS.map(link => {
            const isActive = location.pathname === link.to ||
              (link.to !== '/' && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.45rem 1rem',
                  borderRadius: 999,
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.22s ease',
                  color: isActive ? 'white' : 'var(--text-main)',
                  background: isActive ? 'var(--grad-primary)' : 'transparent',
                  boxShadow: isActive ? '0 2px 12px rgba(124,58,237,0.35)' : 'none',
                  letterSpacing: isActive ? '-0.01em' : '0',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--brand-violet)';
                    e.currentTarget.style.background = 'var(--nav-pill-active)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Search Bar */}
          <div className="desktop-nav nav-search-wrap" style={{
            position: 'relative',
            display: 'flex', alignItems: 'center',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '999px',
            padding: '0.4rem 1rem',
            marginRight: '0.5rem'
          }}>
            <Search size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search services..."
              className="nav-search-input"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-main)', fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          <button
            onClick={() => openWhatsApp()}
            className="btn-whatsapp-navbar"
            style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
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
        <div className="container" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)', padding: '1.5rem',
          marginTop: '1rem', borderRadius: '1rem', boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
            {NAV_LINKS.map(link => {
              const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '0.75rem 1rem',
                    color: isActive ? 'white' : 'var(--text-main)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderRadius: 10,
                    background: isActive ? 'var(--grad-primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                    boxShadow: isActive ? '0 2px 10px rgba(124,58,237,0.25)' : 'none',
                  }}
                >
                  {isActive && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.8)', flexShrink: 0,
                    }} />
                  )}
                  {link.label}
                </Link>
              );
            })}
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
        .nav-search-input {
          width: 130px;
          transition: width 0.3s ease;
        }
        .nav-search-input:focus {
          width: 220px;
        }
        /* Search bar is the first thing to give up its space — hidden before
           the nav links + Order Now button would otherwise start crowding. */
        @media (max-width: 1180px) {
          .nav-search-wrap { display: none !important; }
        }
        @media (max-width: 980px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
