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

// ── Service Card Component ───────────────────────────────────
function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="img-container">
        {service.thumbnail_url ? (
          <img src={service.thumbnail_url} alt={service.name} loading="lazy" />
        ) : (
          <div style={{
            height: '100%', background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(219,39,119,0.08) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Palette size={48} color="var(--brand-violet)" style={{ opacity: 0.7 }} />
          </div>
        )}
        <div style={{
          position: 'absolute', top: 12, left: 12, right: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{
            background: 'var(--bg-card)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-light)', padding: '0.2rem 0.65rem',
            borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-violet)',
            textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: 'var(--shadow-sm)',
          }}>
            {service.category_name || 'Design'}
          </span>
          {service.is_featured && (
            <span style={{
              background: 'linear-gradient(135deg, #D97706, #DB2777)',
              padding: '0.2rem 0.65rem', borderRadius: 999,
              fontSize: '0.7rem', fontWeight: 800, color: 'white',
              boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
            }}>⭐ Popular</span>
          )}
        </div>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{service.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
          {service.short_desc}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1rem', background: 'var(--bg-subtle)',
          borderRadius: '0.75rem', border: '1px solid var(--border-light)',
          marginBottom: '1.25rem',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Starting From</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
              {service.starting_price > 0
                ? `₹${parseInt(service.starting_price).toLocaleString('en-IN')}`
                : 'Configurable'}
              {service.price_label && <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 500, marginLeft: 4 }}>{service.price_label}</span>}
            </div>
          </div>
          {service.delivery_days && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Turnaround</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>⚡ {service.delivery_days} Days</div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          <Link to={`/services/${service.slug || service.id}`}
            style={{
              textAlign: 'center', padding: '0.65rem', borderRadius: '0.6rem',
              background: 'var(--badge-bg-purple)', color: 'var(--brand-violet)',
              textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
              border: '1px solid var(--badge-border-purple)', transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
            }}
          >
            <Eye size={15} /> Details
          </Link>
          <button
            onClick={() => openWhatsApp(`Hi! I'm interested in your ${service.name} service.`, service.name)}
            className="btn-whatsapp"
            style={{ padding: '0.65rem', fontSize: '0.85rem', borderRadius: '0.6rem', justifyContent: 'center' }}
          >
            <MessageCircle size={15} /> Enquire
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Portfolio Thumb ──────────────────────────────────────────
function PortfolioThumb({ item }) {
  return (
    <div className="portfolio-card">
      <img
        src={item.image_url}
        alt={item.title}
        loading="lazy"
        onError={e => { e.target.src = `https://placehold.co/500x380/160C33/A78BFA?text=${encodeURIComponent(item.category_name || 'Design')}`; }}
      />
      <div className="overlay">
        <div>
          <div style={{
            display: 'inline-block', background: 'rgba(124, 58, 237, 0.3)',
            border: '1px solid rgba(124, 58, 237, 0.5)', padding: '0.2rem 0.6rem',
            borderRadius: 999, fontSize: '0.7rem', color: '#A78BFA', fontWeight: 700,
            marginBottom: '0.4rem', textTransform: 'uppercase',
          }}>
            {item.category_name}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'Outfit' }}>
            {item.title}
          </div>
        </div>
      </div>
    </div>
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

// ── Hero Carousel ────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 'led',
    badge: 'New Collection',
    title: 'Light Up',
    titleAccent: 'Your Brand.',
    subtitle: 'LED Sign Boards',
    desc: 'Transform your storefront with vibrant, energy-efficient LED sign boards. Custom sizes, full color, built to last.',
    cta1: { label: 'Order Now', action: () => openWhatsApp('Hi! I need LED Sign Boards for my business.', 'LED Sign Boards'), type: 'whatsapp' },
    cta2: { label: 'View Details', to: '/services/led-sign-boards', type: 'primary' },
    stat: { label: 'Starting From', value: '₹2,500', sub: 'per sq.ft' },
    Icon: Lightbulb,
    visual: {
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
      tag: 'LED Sign Board',
    },
  },
  {
    id: 'uv',
    badge: 'Premium Quality',
    title: 'Vivid Prints',
    titleAccent: 'That Last.',
    subtitle: 'UV Printing Services',
    desc: 'High-definition UV flatbed printing on any surface. Sun boards, acrylics, metals — sharp & weather-proof.',
    cta1: { label: 'Order Now', action: () => openWhatsApp('Hi! I want a quote for UV Printing.', 'UV Printing'), type: 'whatsapp' },
    cta2: { label: 'View Details', to: '/services/uv-printing', type: 'primary' },
    stat: { label: 'Turnaround', value: '2–3 Days', sub: 'express available' },
    Icon: Printer,
    visual: {
      img: 'https://images.unsplash.com/photo-1636633762833-5d1658f1e29b?auto=format&fit=crop&w=600&q=80',
      tag: 'UV Print',
    },
  },
  {
    id: 'acrylic',
    badge: 'Premium 3D',
    title: '3D Presence,',
    titleAccent: 'Premium Look.',
    subtitle: 'Acrylic Sign Boards',
    desc: 'Elegant backlit acrylic letters and sign boards for offices, showrooms & retail stores. Premium finish guaranteed.',
    cta1: { label: 'Order Now', action: () => openWhatsApp('Hi! I need Acrylic Sign Boards.', 'Acrylic Sign Boards'), type: 'whatsapp' },
    cta2: { label: 'View Details', to: '/services/acrylic-sign-boards', type: 'primary' },
    stat: { label: 'Starting From', value: '₹3,500', sub: 'custom shapes' },
    Icon: Box,
    visual: {
      img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=600&q=80',
      tag: 'Acrylic Board',
    },
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const timerRef = useRef(null);

  const goTo = useCallback((idx, dir = 'next') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 380);
  }, [animating]);

  const prev = () => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, 'prev');
  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length, 'next'), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const slide = HERO_SLIDES[current];
  const SlideIcon = slide.Icon;

  return (
    <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '4.5rem' }}>
      <style>{heroGridStyle}</style>
      {/* Ambient orbs */}
      <div className="orb orb-purple" />
      <div className="orb orb-pink" />

      {/* Carousel wrapper */}
      <div style={{
        background: 'var(--bg-main)',
        transition: 'background 0.6s ease',
        position: 'relative',
      }}>
        {/* Dynamic bg gradient per slide */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--grad-hero)',
          transition: 'background 0.6s ease',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
            minHeight: '88vh',
            padding: '4rem 0 3rem',
          }}
          className="hero-carousel-grid"
          >
            {/* ── LEFT: Text Content ── */}
            <div style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === 'next' ? '-40px' : '40px'})`
                : 'translateX(0)',
              transition: 'opacity 0.38s ease, transform 0.38s ease',
            }}>
              {/* Gradient pill badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--badge-bg-purple)',
                padding: '0.35rem 1rem', borderRadius: 999,
                fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-violet)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                marginBottom: '1.5rem',
                border: '1px solid var(--badge-border-purple)',
                boxShadow: `var(--shadow-sm)`,
              }}>
                <Sparkles size={14} color="var(--brand-violet)" />
                {slide.badge}
              </div>

              {/* Subtitle */}
              <p style={{
                fontSize: '0.95rem', fontWeight: 700,
                color: 'var(--brand-violet)',
                marginBottom: '0.6rem',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {slide.subtitle}
              </p>

              {/* Main headline */}
              <h1 style={{
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                fontWeight: 900, lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
                marginBottom: '0.25rem',
              }}>
                {slide.title}
              </h1>
              <h1 
                className="gradient-text"
                style={{
                  fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                  fontWeight: 900, lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.5rem',
                  backgroundImage: 'var(--grad-primary)',
                }}
              >
                {slide.titleAccent}
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '1.1rem', color: 'var(--text-muted)',
                lineHeight: 1.75, maxWidth: 480,
                marginBottom: '2.25rem',
              }}>
                {slide.desc}
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <button
                  onClick={slide.cta1.action}
                  className="btn-whatsapp"
                  style={{ padding: '0.95rem 2rem', fontSize: '0.95rem' }}
                >
                  <MessageCircle size={18} /> {slide.cta1.label}
                </button>
                <Link
                  to={slide.cta2.to}
                  className="btn-secondary"
                  style={{ padding: '0.95rem 2rem', fontSize: '0.95rem' }}
                >
                  <Eye size={18} /> {slide.cta2.label}
                </Link>
              </div>

              {/* Happy Customers Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex' }}>
                  {['#7C3AED', '#DB2777', '#D97706', '#059669'].map((c, i) => (
                    <div key={i} style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${c} 0%, ${c}99 100%)`,
                      border: '2px solid var(--bg-main)',
                      marginLeft: i > 0 ? -10 : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', color: 'white', fontWeight: 800,
                    }}>
                      {['A', 'R', 'S', 'M'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    500+ Happy Customers
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Across Pune & Maharashtra
                  </div>
                </div>

                {/* Price stat pill */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.6rem 1rem',
                  boxShadow: 'var(--shadow-md)',
                  marginLeft: 'auto',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    {slide.stat.label}
                  </div>
                  <div 
                    className="gradient-text"
                    style={{
                      fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Outfit',
                      backgroundImage: 'var(--grad-primary)',
                      lineHeight: 1.1,
                    }}
                  >
                    {slide.stat.value}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                    {slide.stat.sub}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Visual Panel ── */}
            <div style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === 'next' ? '40px' : '-40px'}) scale(0.96)`
                : 'translateX(0) scale(1)',
              transition: 'opacity 0.38s ease, transform 0.42s cubic-bezier(0.4,0,0.2,1)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: 520,
                borderRadius: '2rem',
                overflow: 'hidden',
                background: `linear-gradient(135deg, var(--bg-card) 0%, var(--bg-subtle) 100%)`,
                border: '1px solid var(--border-light)',
                boxShadow: `0 30px 80px -10px rgba(0,0,0,0.2), 0 0 0 1px var(--border-light)`,
                aspectRatio: '4/3',
              }}>
                {/* Soft gradient overlay on image */}
                <img
                  src={slide.visual.img}
                  alt={slide.subtitle}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
                {/* Gradient tint overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(135deg, rgba(124,58,237,0.1) 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }} />

                {/* Service tag chip */}
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 999,
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {slide.visual.tag}
                </div>

                {/* Floating icon badge */}
                <div style={{
                  position: 'absolute', bottom: 16, right: 16,
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `var(--shadow-md)`,
                  border: '2px solid rgba(255,255,255,0.25)',
                }}>
                  <SlideIcon size={26} color="white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Prev/Next Arrows ── */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          style={{
            position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)',
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-main)', zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-violet)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--brand-violet)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          style={{
            position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-main)', zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-violet)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--brand-violet)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
        >
          <ChevronRight size={22} />
        </button>

        {/* ── Dot Navigation ── */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '0.6rem', zIndex: 10,
        }}>
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > current ? 'next' : 'prev')}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? 28 : 10,
                height: 10,
                borderRadius: 999,
                border: 'none', cursor: 'pointer',
                background: i === current ? 'var(--brand-violet)' : 'var(--border-light)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                opacity: i === current ? 1 : 0.5,
                padding: 0,
              }}
            />
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
      {/* ── HERO CAROUSEL ──────────────────────────────────── */}
      <HeroCarousel />

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

      {/* ── FEATURED SERVICES ──────────────────────────────── */}
      <section className="section" id="services">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block', background: 'var(--badge-bg-purple)',
              color: 'var(--brand-violet)', padding: '0.35rem 1rem', borderRadius: 999,
              fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: '0.75rem',
            }}>What We Offer</div>
            <h2 className="section-title">Our Premier <span className="gradient-text">Design Services</span></h2>
            <p className="section-subtitle">High-quality graphic design, branding, and printing solutions crafted specifically for your business growth.</p>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 420 }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {displayServices.map(s => <ServiceCard key={s.id || s.name} service={s} />)}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/services" className="btn-primary" style={{ padding: '0.9rem 2.25rem' }}>
              View All Services Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO SHOWCASE ───────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(219, 39, 119, 0.12)',
              color: 'var(--brand-pink)', padding: '0.35rem 1rem', borderRadius: 999,
              fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.06em', marginBottom: '0.75rem',
            }}>Creative Work</div>
            <h2 className="section-title">Design <span className="gradient-text-sec">Portfolio</span></h2>
            <p className="section-subtitle">Take a look at some of our recent logo, business card, brochure, and menu card design samples.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {displayPortfolio.map((item, i) => <PortfolioThumb key={item.id || i} item={item} />)}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/portfolio" className="btn-secondary" style={{ padding: '0.9rem 2.25rem' }}>
              Explore Full Portfolio Gallery <ArrowRight size={18} />
            </Link>
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
