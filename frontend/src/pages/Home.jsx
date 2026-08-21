import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, MessageCircle, Star, Palette, Layers, Zap, Shield,
  CheckCircle2, Sparkles, Globe, Award, Eye
} from 'lucide-react';
import { productAPI, portfolioAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';
import { CompanyStatsGrid } from '../components/common/CompanyStats';

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

// ── Main Home Component ──────────────────────────────────────
export default function Home() {
  const [services,  setServices]  = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    document.title = 'Aarav Enterprises — Graphic Design, Multimedia & Branding';
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
      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden', padding: '8rem 0 5rem',
        background: 'var(--grad-hero)',
      }}>
        <div className="orb orb-purple" />
        <div className="orb orb-pink" />
        <div className="orb orb-amber" />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
            {/* AI Pill Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'var(--badge-bg-purple)', border: '1px solid var(--badge-border-purple)',
              padding: '0.5rem 1.25rem', borderRadius: 999, fontSize: '0.85rem',
              color: 'var(--brand-violet)', fontWeight: 700, marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Sparkles size={16} color="#D97706" />
              <span>AI-Powered WhatsApp Communication System · 24/7 Response</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(2.75rem, 6vw, 4.5rem)', fontWeight: 900,
              lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em',
              color: 'var(--text-main)',
            }}>
              Creative Graphic Designs.{' '}
              <span className="gradient-text">Stunning Branding.</span>{' '}
              Printing Solutions.
            </h1>

            <p style={{
              fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.8,
              maxWidth: 680, margin: '0 auto 2.5rem', fontWeight: 500,
            }}>
              Transform your business identity with professional logos, visiting cards, banners, brochures, and multimedia assets. Chat directly on WhatsApp with our AI assistant in **English, Hindi, or Marathi**.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
              <Link to="/services" className="btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
                Explore All Services <ArrowRight size={20} />
              </Link>
              <button onClick={() => openWhatsApp()} className="btn-whatsapp" style={{ padding: '1rem 2.25rem', fontSize: '1rem' }}>
                <MessageCircle size={20} /> Chat on WhatsApp Now
              </button>
            </div>

            {/* Multi-language ticker pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              padding: '0.65rem 1.5rem', borderRadius: 999, fontSize: '0.85rem', color: 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Globe size={16} color="var(--brand-violet)" />
              <span>Multi-Language AI Support: 🇬🇧 English · 🇮🇳 हिंदी · मराठी · Mixed Hinglish</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem', marginTop: '4.5rem',
          }}>
            {[
              { val: '500+', label: 'Successful Design Projects', sub: 'Logos, Cards, Banners' },
              { val: '100+', label: 'Happy Business Clients', sub: 'Across Pune & Maharashtra' },
              { val: '24/7',  label: 'Automated AI Response', sub: 'Instant WhatsApp Replies' },
              { val: '4.9★', label: 'Client Satisfaction Rating', sub: 'Top Quality Guaranteed' },
            ].map((s, i) => (
              <div key={i} className="glass-card glass-card-hover" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit', lineHeight: 1 }} className="gradient-text">
                  {s.val}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>{s.sub}</div>
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

      {/* ── COMPANY STATS / INFO ─────────────────────────────── */}
      <CompanyStatsGrid />

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
