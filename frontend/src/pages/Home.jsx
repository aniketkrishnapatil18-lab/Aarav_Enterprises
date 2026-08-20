import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, MessageCircle, Palette, Zap, Shield,
  Eye, ChevronLeft, ChevronRight, Sparkles,
  Lightbulb, Printer, Box
} from 'lucide-react';

/* Responsive hero grid: stack on mobile */
const heroGridStyle = `
  @media (max-width: 768px) {
    .hero-carousel-grid {
      grid-template-columns: 1fr !important;
      padding: 2.5rem 0 5rem !important;
      min-height: unset !important;
      gap: 1.5rem !important;
    }
  }
`;
import { productAPI, portfolioAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';

// ── Service Card Component (Shop by Category Style) ───────────
function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service.slug || service.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'var(--bg-subtle)', 
        borderRadius: '1.25rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
      }}>
        {service.thumbnail_url ? (
          <img src={service.thumbnail_url} alt={service.name} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        ) : (
          <Palette size={48} color="var(--brand-violet)" style={{ opacity: 0.5 }} />
        )}
      </div>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          {service.name}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          {service.starting_price > 0 ? `Starting from ₹${service.starting_price}` : 'Explore'}
        </p>
      </div>
    </Link>
  );
}

// ── Portfolio Thumb (Shop by Category Style) ─────────────────
function PortfolioThumb({ item }) {
  return (
    <Link to="/portfolio" style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'var(--bg-subtle)', 
        borderRadius: '1.25rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {item.category_name && (
          <span style={{
             position: 'absolute', top: 12, left: 12,
             background: 'var(--brand-violet)', color: 'white',
             padding: '0.2rem 0.6rem', borderRadius: 999,
             fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase'
          }}>{item.category_name}</span>
        )}
        <img src={item.image_url} alt={item.title} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={e => { e.target.src = `https://placehold.co/500x500/160C33/A78BFA?text=${encodeURIComponent(item.category_name || 'Design')}`; }} />
      </div>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          {item.title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
          {item.category_name || 'Design'}
        </p>
      </div>
    </Link>
  );
}

// ── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, gradient }) {
  return (
    <div className="glass-card glass-card-hover" style={{ padding: '2rem' }}>
      <div style={{
        width: 54, height: 54, borderRadius: 16,
        background: gradient || 'var(--grad-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.25rem', boxShadow: '0 6px 20px rgba(124, 58, 237, 0.25)',
      }}>
        <Icon size={26} color="white" />
      </div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem', color: 'var(--text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

// ── Hero Centered ────────────────────────────────────────────
function HeroCentered() {
  return (
    <section className="bg-dots" style={{ 
      position: 'relative', overflow: 'hidden', paddingTop: '7rem', paddingBottom: '7rem',
      background: 'var(--bg-main)', minHeight: '88vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center'
    }}>
      <style>{`
        .hero-float-el { display: flex; }
        .hero-float-img { display: block; }
        @media (max-width: 900px) {
          .hero-float-el, .hero-float-img { display: none !important; }
        }
      `}</style>
      
      {/* Ambient orbs */}
      <div className="orb orb-purple" style={{ top: '20%', left: '30%', opacity: 0.5 }} />
      <div className="orb orb-pink" style={{ top: '40%', right: '30%', opacity: 0.3 }} />

      {/* ── FLOATING ELEMENTS (Quso.ai Style) ── */}
      {/* Top Left Group */}
      <div className="animate-float-slow hero-float-el" style={{
        position: 'absolute', top: '12%', left: '6%',
        display: 'flex', alignItems: 'center', gap: '0.8rem', zIndex: 10
      }}>
        <div style={{
          background: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>Custom Sizes</span>
        </div>
        <div style={{
          background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem'
        }}>
          <Zap size={20} color="var(--brand-violet)" />
        </div>
      </div>

      {/* Top Right Group */}
      <div className="animate-float-fast hero-float-el" style={{
        position: 'absolute', top: '16%', right: '6%',
        display: 'flex', alignItems: 'center', gap: '0.8rem', zIndex: 10
      }}>
        <div style={{
          background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
        }}>
          <Sparkles size={20} color="var(--brand-pink)" />
        </div>
        <div style={{
          background: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>Premium Quality</span>
        </div>
      </div>

      {/* Mid Left Group */}
      <div className="animate-float-fast hero-float-el" style={{
        position: 'absolute', top: '35%', left: '12%',
        display: 'flex', alignItems: 'center', gap: '0.8rem', zIndex: 9
      }}>
        <div style={{
          background: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>Fast Turnaround</span>
        </div>
        <div style={{
          background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
        }}>
          <Lightbulb size={20} color="#F59E0B" />
        </div>
      </div>

      {/* Mid Right Group */}
      <div className="animate-float-slow hero-float-el" style={{
        position: 'absolute', top: '38%', right: '12%',
        display: 'flex', alignItems: 'center', gap: '0.8rem', zIndex: 9
      }}>
        <div style={{
          background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1.5rem'
        }}>
          <Shield size={20} color="#10B981" />
        </div>
        <div style={{
          background: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>Eco-Friendly</span>
        </div>
      </div>

      {/* Bottom Left Overlapping Cards */}
      <div className="animate-float-fast hero-float-img" style={{
        position: 'absolute', bottom: '12%', left: '2%', zIndex: 10, width: 320, height: 220
      }}>
        {/* Back Card */}
        <div style={{
          position: 'absolute', bottom: 20, left: 10,
          background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '1rem',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)',
          width: 220, transform: 'rotate(-8deg)', transformOrigin: 'bottom left'
        }}>
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80" alt="LED Board" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: '0.6rem' }} />
        </div>
        {/* Front Card */}
        <div style={{
          position: 'absolute', bottom: 0, left: 70,
          background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '1rem',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)',
          width: 240, transform: 'rotate(5deg)'
        }}>
          <img src="https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?auto=format&fit=crop&w=400&q=80" alt="UV Printing" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '0.75rem' }} />
          <div style={{ padding: '0.5rem 0.25rem 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Printer size={14} color="var(--brand-pink)" />
            <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)' }}>UV Printing</span>
          </div>
        </div>
      </div>

      {/* Bottom Right Overlapping Cards */}
      <div className="animate-float-slow hero-float-img" style={{
        position: 'absolute', bottom: '16%', right: '2%', zIndex: 10, width: 320, height: 240
      }}>
        {/* Back Card */}
        <div style={{
          position: 'absolute', top: 0, right: 90,
          background: 'var(--bg-card)', padding: '0.4rem', borderRadius: '1rem',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)',
          width: 200, transform: 'rotate(6deg)'
        }}>
           <div style={{ background: 'var(--bg-subtle)', height: 120, borderRadius: '0.6rem', padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ width: '50%', height: 8, background: 'var(--border-light)', borderRadius: 4 }}></div>
              <div style={{ width: '90%', height: 8, background: 'var(--border-light)', borderRadius: 4 }}></div>
              <div style={{ width: '70%', height: 8, background: 'var(--border-light)', borderRadius: 4 }}></div>
           </div>
        </div>
        {/* Front Card */}
        <div style={{
          position: 'absolute', top: 30, right: 10,
          background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '1rem',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)',
          width: 250, transform: 'rotate(-4deg)'
        }}>
          <img src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80" alt="Acrylic Sign Boards" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '0.75rem' }} />
          <div style={{ padding: '0.5rem 0.25rem 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Box size={14} color="var(--brand-violet)" />
            <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-main)' }}>Acrylic Boards</span>
          </div>
        </div>
      </div>

      {/* ── CENTRAL CONTENT ── */}
      <div className="container" style={{ position: 'relative', zIndex: 20, maxWidth: 800 }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 6.5vw, 4.8rem)',
          fontWeight: 900, lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: 'var(--text-main)',
          marginBottom: '1rem',
        }}>
          Premium Signage &<br />
          <span className="gradient-text" style={{ backgroundImage: 'var(--grad-primary)' }}>Printing Solutions</span>
        </h1>
        
        <p style={{
          fontSize: '1.15rem', color: 'var(--text-muted)',
          lineHeight: 1.6, maxWidth: 600, margin: '0 auto 2.5rem',
        }}>
          Custom LED Sign Boards, UV Printing, and Acrylic Letters designed to make your brand stand out. Built to last, delivered fast.
        </p>

        {/* Happy Customers Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex' }}>
            {['#7C3AED', '#DB2777', '#D97706', '#059669'].map((c, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${c} 0%, ${c}99 100%)`,
                border: '2px solid var(--bg-main)',
                marginLeft: i > 0 ? -10 : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', color: 'white', fontWeight: 800,
              }}>
                {['A', 'R', 'S', 'M'][i]}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            500+ Happy Customers
          </div>
        </div>

        <button
          onClick={() => openWhatsApp('Hi! I need to discuss a new signage project.', 'Signage Project')}
          className="btn-whatsapp"
          style={{ padding: '1.1rem 2.5rem', fontSize: '1.05rem', borderRadius: 'var(--radius-lg)' }}
        >
          Explore More
        </button>
        
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 500, marginBottom: '3rem' }}>
          Free quote available. No upfront costs.
        </p>

        {/* Floating Social Icons (Reference: quso.ai) */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1rem',
          flexWrap: 'wrap', maxWidth: 400, margin: '0 auto'
        }}>
          {[
            { 
              color: '#FF0000', label: 'YouTube',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> 
            },
            { 
              color: '#E1306C', label: 'Instagram',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> 
            },
            { 
              color: '#0A66C2', label: 'LinkedIn',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            },
            { 
              color: '#000000', label: 'X (Twitter)',
              svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> 
            }
          ].map((item, idx) => (
            <div key={idx} className={idx % 2 === 0 ? "animate-float-slow" : "animate-float-fast"} style={{
              width: 50, height: 50, borderRadius: '1rem',
              background: 'var(--bg-card)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)',
              transform: `translateY(${idx % 2 === 0 ? '5px' : '-5px'})`,
              color: item.color,
            }}>
              {item.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Home Component ──────────────────────────────────────
export default function Home() {
  const [services,  setServices]  = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    document.title = 'Aarav Enterprises — Signage, LED Boards & Printing in Pune';
    async function load() {
      try {
        const [sRes, pRes] = await Promise.all([
          productAPI.list({ featured: true }),
          portfolioAPI.list({ featured: true }),
        ]);
        setServices(sRes.data.data || []);
        setPortfolio(pRes.data.data || []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayServices  = services.length > 0 ? services.slice(0, 6) : FALLBACK_SERVICES;
  const displayPortfolio = portfolio.length > 0 ? portfolio.slice(0, 6) : FALLBACK_PORTFOLIO;

  return (
    <>
      {/* ── HERO CENTERED ──────────────────────────────────── */}
      <HeroCentered />

      {/* ── TRUST BAR ──────────────────────────────────────── */}
      <section style={{
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--bg-surface)',
        padding: '1.75rem 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { Icon: Palette, title: 'Custom Designs', sub: '100% Original, Made for You' },
              { Icon: Zap,     title: 'Fast Turnaround', sub: 'Delivery in 1–5 Days' },
              { Icon: MessageCircle, title: 'WhatsApp Support', sub: 'Chat 24/7 in Hindi & English' },
              { Icon: Shield,  title: 'Premium Quality', sub: 'Durable & Print-Ready' },
            ].map(({ Icon, title, sub }, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.5rem 1rem',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'var(--badge-bg-purple)',
                  border: '1px solid var(--badge-border-purple)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} color="var(--brand-violet)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SERVICES (Shop by Category) ───────────── */}
      <section className="section" id="services" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Shop by Category
            </h2>
            <Link to="/services" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="hide-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '1.5rem', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { id: 'cat-1', name: 'UV Printing Service', thumbnail_url: 'https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?auto=format&fit=crop&w=400&q=80', starting_price: 999 },
              { id: 'cat-2', name: 'Acrylic Sign Board', thumbnail_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=400&q=80', starting_price: 1499 },
              { id: 'cat-3', name: 'Roll Up Standee', thumbnail_url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=400&q=80', starting_price: 1999 },
              { id: 'cat-4', name: 'LED Sign Board', thumbnail_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80', starting_price: 2499 },
              { id: 'cat-5', name: 'Glow Sign Board', thumbnail_url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=400&q=80', starting_price: 2999 },
              { id: 'cat-6', name: 'Flex Banner', thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80', starting_price: 499 },
              { id: 'cat-7', name: 'Letter Sign Board', thumbnail_url: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=400&q=80', starting_price: 1299 },
              { id: 'cat-8', name: 'LED Acrylic Letter', thumbnail_url: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=400&q=80', starting_price: 3499 },
            ].map(s => (
              <div key={s.id} style={{ minWidth: '200px', flexShrink: 0 }}>
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT WORK ───────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-surface)', paddingTop: '2.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Recent work
            </h2>
            <Link to="/portfolio" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="hide-scroll" style={{ display: 'flex', overflowX: 'auto', gap: '1.5rem', paddingBottom: '1rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {displayPortfolio.map((item, i) => (
              <div key={item.id || i} style={{ minWidth: '200px', flexShrink: 0 }}>
                <PortfolioThumb item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="section-title">Why Businesses Trust <span className="gradient-text">Aarav Enterprises</span></h2>
            <p className="section-subtitle">We combine artistic creativity, fast turnaround, and automated AI assistance for seamless execution.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
            <FeatureCard
              icon={Palette}
              title="Original & Custom Designs"
              desc="Every logo, card, and banner is designed from scratch to match your unique brand identity."
              gradient="linear-gradient(135deg, #7C3AED, #DB2777)"
            />
            <FeatureCard
              icon={MessageCircle}
              title="24/7 AI WhatsApp Assistant"
              desc="Never wait for quotes. Our AI collects your requirements anytime in English, Hindi, or Marathi."
              gradient="linear-gradient(135deg, #059669, #10B981)"
            />
            <FeatureCard
              icon={Zap}
              title="Fast Express Delivery"
              desc="Need designs urgently? Get visiting cards and social media posts within 24 to 48 hours."
              gradient="linear-gradient(135deg, #D97706, #EF4444)"
            />
            <FeatureCard
              icon={Shield}
              title="Print & Digital Formats"
              desc="Receive high-resolution print-ready PDFs, EPS vector sources, PNGs, and JPEGs."
              gradient="linear-gradient(135deg, #2563EB, #7C3AED)"
            />
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION BANNER ────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '4rem 2rem', textAlign: 'center',
            background: 'var(--grad-hero)',
            border: '1px solid var(--border-glow)',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', marginBottom: '1rem', color: 'var(--text-main)' }}>
              Ready to Upgrade Your <span className="gradient-text">Brand Identity?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 650, margin: '0 auto 2.5rem', lineHeight: 1.7, fontWeight: 500 }}>
              Chat with our AI assistant on WhatsApp right now to get an instant quote and share your design requirements.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => openWhatsApp()} className="btn-whatsapp" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                <MessageCircle size={20} /> Chat on WhatsApp Now
              </button>
              <Link to="/pricing" className="btn-secondary" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
                View Transparent Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Fallback data if backend is offline
const FALLBACK_SERVICES = [
  { id: 1, name: 'Logo Design', slug: 'logo-design', short_desc: 'Unique 2D & 3D brand logo designs with vector files', starting_price: 999, price_label: 'onwards', delivery_days: 3, category_name: 'Logo', is_featured: true },
  { id: 2, name: 'Visiting Card Design', slug: 'visiting-card', short_desc: 'Professional single & double side business card designs', starting_price: 299, price_label: 'onwards', delivery_days: 2, category_name: 'Business Card', is_featured: true },
  { id: 3, name: 'Social Media Posts', slug: 'social-media', short_desc: 'High-converting Instagram & Facebook post creatives', starting_price: 299, price_label: 'onwards', delivery_days: 1, category_name: 'Social Media', is_featured: true },
  { id: 4, name: 'Flex & Banner Design', slug: 'flex-banner', short_desc: 'Large format outdoor flex banners and hoardings', starting_price: 499, price_label: 'onwards', delivery_days: 2, category_name: 'Printing', is_featured: false },
  { id: 5, name: '3D Logo Design', slug: '3d-logo', short_desc: 'Premium 3D embossed logo design with metallic rendering', starting_price: 1499, price_label: 'onwards', delivery_days: 5, category_name: '3D Logo', is_featured: true },
  { id: 6, name: 'Brochure & Catalog', slug: 'brochure-design', short_desc: 'Bi-fold & tri-fold corporate company brochures', starting_price: 799, price_label: 'onwards', delivery_days: 4, category_name: 'Brochure', is_featured: false },
];

const FALLBACK_PORTFOLIO = [
  { id: 1, title: 'Luxury Tech Brand Logo', category_name: 'Logo Design', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'Gold Embossed Business Card', category_name: 'Visiting Card', image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: '3D Corporate Metallic Logo', category_name: '3D Logo', image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Restaurant Food Menu Card', category_name: 'Menu Design', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: 'Instagram Product Campaign', category_name: 'Social Media', image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: 'Festival Grand Hoarding Banner', category_name: 'Flex Banner', image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80' },
];
