import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock, RefreshCw, FileType, CheckCircle } from 'lucide-react';
import { productAPI, portfolioAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await productAPI.detail(id);
        const s   = res.data.data;
        setService(s);
        document.title = `${s.name} — Aarav Enterprises`;
        // Load portfolio for same category
        const pRes = await portfolioAPI.list({ category: s.category_id, active: true });
        setPortfolio((pRes.data.data || []).slice(0, 4));
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 100, textAlign: 'center', color: '#64748B', minHeight: '50vh' }}>
      <div className="skeleton" style={{ height: 400, marginBottom: '1rem', borderRadius: '1rem' }} />
    </div>
  );

  if (!service) return (
    <div style={{ paddingTop: 100, textAlign: 'center', minHeight: '50vh', padding: '8rem 1.5rem' }}>
      <h2>Service not found</h2>
      <Link to="/services" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
        <ArrowLeft size={18} /> Back to Services
      </Link>
    </div>
  );

  return (
    <div style={{ paddingTop: 70 }}>
      <div className="container section">
        <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Services
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Image */}
          <div>
            <div style={{
              borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--brand-border)',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(236,72,153,0.08))',
              aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {service.thumbnail_url ? (
                <img src={service.thumbnail_url} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#64748B' }}>
                  <div style={{ fontSize: '4rem' }}>🎨</div>
                  <p>Design Preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <div style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {service.category_name}
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>{service.name}</h1>

            <div style={{
              fontSize: '2rem', fontWeight: 800, color: '#A78BFA',
              marginBottom: '1.5rem', fontFamily: 'Outfit',
            }}>
              {service.starting_price > 0
                ? `₹${parseInt(service.starting_price).toLocaleString('en-IN')} ${service.price_label || 'onwards'}`
                : 'Price on Request'}
            </div>

            <p style={{ color: '#94A3B8', lineHeight: 1.8, marginBottom: '2rem' }}>
              {service.description || service.short_desc}
            </p>

            {/* Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {service.delivery_days && (
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <Clock size={20} color="#A78BFA" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Delivery Time</div>
                  <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{service.delivery_days} Days</div>
                </div>
              )}
              {service.revisions && (
                <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <RefreshCw size={20} color="#A78BFA" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Revisions</div>
                  <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{service.revisions} Free</div>
                </div>
              )}
            </div>

            {service.file_formats && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>File Formats</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {service.file_formats.split(',').map(f => (
                    <span key={f} style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', padding: '0.25rem 0.65rem', borderRadius: 6, fontSize: '0.8rem', border: '1px solid rgba(124,58,237,0.3)' }}>
                      {f.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => openWhatsApp(`I'm interested in your ${service.name} service. Please help me.`, service.name)}
                className="btn-whatsapp"
                style={{ flex: 1, justifyContent: 'center', fontSize: '1rem', padding: '0.85rem 1.5rem' }}
              >
                <MessageCircle size={20} /> Get This Design
              </button>
              <button
                onClick={() => openWhatsApp('', service.name)}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Get a Quote
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio samples */}
        {portfolio.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Sample <span className="gradient-text">Portfolio</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {portfolio.map(item => (
                <div key={item.id} className="portfolio-card">
                  <img src={item.image_url} alt={item.title}
                    onError={e => { e.target.src = `https://placehold.co/400x300/231845/A78BFA?text=${encodeURIComponent(item.title)}`; }}
                    loading="lazy"
                  />
                  <div className="overlay"><div style={{ color: '#F8FAFC', fontWeight: 700 }}>{item.title}</div></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`@media (max-width: 768px) { .service-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
