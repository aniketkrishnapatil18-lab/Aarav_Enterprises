import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { portfolioAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await portfolioAPI.detail(id);
        const data = res.data.data;
        setItem(data);
        document.title = `${data.title} — Recent Work | Aarav Enterprises`;
      } catch (err) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: 100, textAlign: 'center', minHeight: '60vh', padding: '8rem 1.5rem' }}>
        <div className="skeleton" style={{ height: 400, maxWidth: 800, margin: '0 auto', borderRadius: '1rem' }} />
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ paddingTop: 100, textAlign: 'center', minHeight: '60vh', padding: '8rem 1.5rem' }}>
        <h2>Portfolio item not found</h2>
        <Link to="/portfolio" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          <ArrowLeft size={18} /> Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <div className="container section">
        <Link to="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-subtle)', textDecoration: 'none', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Gallery
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Left: Image */}
          <div style={{
            borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)', background: 'var(--bg-subtle)'
          }}>
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.title} 
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
              />
            ) : (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-subtle)' }}>
                <ImageIcon size={48} style={{ margin: '0 auto 1rem' }} />
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ 
                background: 'var(--brand-violet)', color: 'white', padding: '0.25rem 0.75rem', 
                borderRadius: 999, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase'
              }}>
                {item.category_name || 'Design'}
              </span>
              {item.is_featured === 1 && (
                <span style={{ 
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', padding: '0.25rem 0.75rem', 
                  borderRadius: 999, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase'
                }}>
                  Featured
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>
              {item.title}
            </h1>

            {item.description && (
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {item.description}
              </p>
            )}

            {item.client_name && (
              <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>Delivered To</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.client_name}</div>
              </div>
            )}

            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Interested in similar work?</h3>
              <p style={{ color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>
                We can design and build something similar for your business. Contact us to get started.
              </p>
              <button 
                onClick={() => openWhatsApp(`Hi! I'm interested in getting something similar to your recent work: "${item.title}". Can we discuss the details?`, item.title)}
                className="btn-whatsapp"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                Enquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
