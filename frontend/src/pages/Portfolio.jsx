import { useState, useEffect } from 'react';
import { portfolioAPI, categoryAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';

export default function Portfolio() {
  const [items,      setItems]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [active,     setActive]     = useState('all');
  const [selected,   setSelected]   = useState(null);

  useEffect(() => {
    document.title = 'Portfolio — Aarav Enterprises';
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([
          portfolioAPI.list({ active: true }),
          categoryAPI.list({ active: true }),
        ]);
        setItems(pRes.data.data || []);
        setCategories(cRes.data.data || []);
      } catch {
        setItems(FALLBACK_PORTFOLIO);
        setCategories(FALLBACK_CATS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = active === 'all' ? items : items.filter(i => i.category_slug === active || i.category_id?.toString() === active);

  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ padding: '4rem 1.5rem', background: 'var(--brand-surface)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">Our <span className="gradient-text">Portfolio</span></h1>
          <p className="section-subtitle">Showcasing our best design work across all categories</p>
        </div>
      </div>

      <div className="container section">
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
          <FilterBtn label="All" value="all" active={active} onClick={setActive} />
          {categories.map(cat => (
            <FilterBtn key={cat.id} label={cat.name} value={cat.slug || cat.id?.toString()} active={active} onClick={setActive} />
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {[...Array(9)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: '1rem' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748B', padding: '4rem' }}>No portfolio items in this category yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {filtered.map((item, i) => (
              <div key={item.id || i} className="portfolio-card" onClick={() => setSelected(item)}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  onError={e => { e.target.src = `https://placehold.co/400x300/231845/A78BFA?text=${encodeURIComponent(item.category_name || 'Design')}`; }}
                />
                <div className="overlay">
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#A78BFA', marginBottom: 4 }}>{item.category_name}</div>
                    <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{item.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 700, width: '100%', background: 'var(--brand-surface)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--brand-border)' }}>
            <img src={selected.image_url} alt={selected.title} style={{ width: '100%', objectFit: 'cover', maxHeight: 450 }}
              onError={e => { e.target.src = `https://placehold.co/700x450/231845/A78BFA?text=${encodeURIComponent(selected.title)}`; }}
            />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#A78BFA', marginBottom: '0.4rem' }}>{selected.category_name}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{selected.title}</h3>
              {selected.description && <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.description}</p>}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
                <button onClick={() => openWhatsApp('', selected.category_name)} className="btn-whatsapp" style={{ flex: 1, justifyContent: 'center' }}>
                  Enquire for Similar Design
                </button>
                <button onClick={() => setSelected(null)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBtn({ label, value, active, onClick }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        padding: '0.5rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600,
        border: `1px solid ${isActive ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
        background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
        color: isActive ? '#A78BFA' : '#94A3B8',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >{label}</button>
  );
}

const FALLBACK_PORTFOLIO = [
  { id: 1, title: 'Modern Tech Logo', category_name: 'Logo Design', category_slug: 'logo-design', image_url: 'https://placehold.co/400x300/1A1033/A78BFA?text=Logo+Design' },
  { id: 2, title: 'Premium Business Card', category_name: 'Visiting Card', category_slug: 'visiting-card', image_url: 'https://placehold.co/400x300/231845/EC4899?text=Business+Card' },
  { id: 3, title: '3D Corporate Brand', category_name: '3D Logo', category_slug: '3d-logo-design', image_url: 'https://placehold.co/400x300/1A1033/7C3AED?text=3D+Logo' },
  { id: 4, title: 'Instagram Post', category_name: 'Social Media', category_slug: 'social-media-design', image_url: 'https://placehold.co/400x300/231845/A78BFA?text=Social+Media' },
  { id: 5, title: 'Restaurant Menu', category_name: 'Menu Card', category_slug: 'menu-card-design', image_url: 'https://placehold.co/400x300/1A1033/EC4899?text=Menu+Card' },
  { id: 6, title: 'Festival Banner', category_name: 'Banner Design', category_slug: 'banner-design', image_url: 'https://placehold.co/400x300/231845/7C3AED?text=Banner' },
  { id: 7, title: 'Business Brochure', category_name: 'Brochure', category_slug: 'brochure-design', image_url: 'https://placehold.co/400x300/1A1033/A78BFA?text=Brochure' },
  { id: 8, title: 'Event Flyer', category_name: 'Pamphlet/Flyer', category_slug: 'pamphlet-flyer', image_url: 'https://placehold.co/400x300/231845/EC4899?text=Flyer' },
  { id: 9, title: 'Advertisement Creative', category_name: 'Advertisement', category_slug: 'advertisement', image_url: 'https://placehold.co/400x300/1A1033/7C3AED?text=Advertisement' },
];
const FALLBACK_CATS = [
  { id: 1, name: 'Logo Design', slug: 'logo-design' },
  { id: 2, name: 'Visiting Card', slug: 'visiting-card' },
  { id: 9, name: 'Social Media', slug: 'social-media-design' },
];
