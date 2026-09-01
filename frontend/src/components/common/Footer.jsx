import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin, Globe, Share2, Send } from 'lucide-react';
import { openWhatsApp } from '../../utils/helpers';

const SERVICES = [
  'Logo Design', 'Visiting Card', 'Brochure Design', 'Menu Card',
  '3D Logo', 'Banner Design', 'Flex & Printing', 'Social Media',
];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-light)',
      padding: '4rem 0 2rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', color: 'white',
              }}>A</div>
              <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                Aarav Enterprises
              </span>
            </div>
            <p style={{ color: 'var(--text-subtle)', lineHeight: 1.7, fontSize: '0.9rem', maxWidth: 240, marginBottom: '1.5rem' }}>
              Creative Designs. Professional Branding. Powerful Visuals. Your trusted partner for all graphic design needs.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Globe, Share2, Send].map((Icon, i) => (
                <div key={i} style={{
                  width: 38, height: 38, borderRadius: 8,
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                  <Icon size={18} color="var(--text-subtle)" />
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1.25rem', fontSize: '1rem' }}>Our Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {SERVICES.map(s => (
                <Link key={s} to="/services" style={{
                  color: 'var(--text-subtle)', fontSize: '0.875rem', textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--brand-violet)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-subtle)'}
                >{s}</Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1.25rem', fontSize: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Portfolio', to: '/portfolio' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'Contact', to: '/contact' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{
                  color: 'var(--text-subtle)', fontSize: '0.875rem', textDecoration: 'none',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--brand-violet)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-subtle)'}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '1.25rem', fontSize: '1rem' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <a
                onClick={(e) => { e.preventDefault(); openWhatsApp(); }}
                href="#"
                style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-subtle)', textDecoration: 'none', fontSize: '0.875rem' }}
              >
                <MessageCircle size={16} color="#25D366" />
                WhatsApp AI: +1 (555) 196-0714
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
                <Phone size={16} color="var(--brand-violet)" />
                +91 9763530208
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
                <Mail size={16} color="var(--brand-violet)" />
                info@aaraventerprises.com
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
                <MapPin size={16} color="var(--brand-violet)" style={{ flexShrink: 0, marginTop: 2 }} />
                Pune, Maharashtra, India
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Aarav Enterprises. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Crafted with ❤️ for creative businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
