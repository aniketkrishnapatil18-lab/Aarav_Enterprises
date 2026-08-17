import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';
import { MessageCircle, CheckCircle } from 'lucide-react';

const PRICING_DATA = [
  { name: 'Logo Design',           price: 999,  label: 'onwards', delivery: '3 days', revisions: 3, features: ['Multiple Concepts', 'AI + PDF + PNG', 'Color Variations', 'Revision Support'] },
  { name: 'Visiting Card Design',  price: 299,  label: 'onwards', delivery: '2 days', revisions: 2, features: ['Front & Back Design', 'Print-ready PDF', 'Color Variations', 'Fast Delivery'] },
  { name: 'Brochure Design',       price: 799,  label: 'onwards', delivery: '4 days', revisions: 2, features: ['Bi-fold / Tri-fold', 'Print-ready Files', 'Custom Layout', 'Content Placement'] },
  { name: 'Menu Card Design',      price: 599,  label: 'onwards', delivery: '3 days', revisions: 2, features: ['Multi-page Support', 'Print-ready Format', 'Custom Theme', 'Category Sections'] },
  { name: '3D Logo Design',        price: 1499, label: 'onwards', delivery: '5 days', revisions: 2, features: ['3D Render', 'Multiple Angles', 'HD PNG Export', 'Animation Optional'], featured: true },
  { name: 'Banner Design',         price: 499,  label: 'onwards', delivery: '2 days', revisions: 2, features: ['Print-ready Format', 'Custom Sizes', 'Vibrant Design', 'Fast Turnaround'] },
  { name: 'Social Media Post',     price: 299,  label: 'onwards', delivery: '1 day',  revisions: 2, features: ['Instagram / Facebook', 'Story Format', 'Brand Colors', 'PNG + JPG'] },
  { name: 'Pamphlet/Flyer Design', price: 499,  label: 'onwards', delivery: '2 days', revisions: 2, features: ['Print-ready Format', 'Both Sides', 'Custom Size', 'Quick Turnaround'] },
  { name: 'Advertisement Banner',  price: 699,  label: 'onwards', delivery: '2 days', revisions: 2, features: ['Digital + Print', 'Multiple Sizes', 'Brand Identity', 'Custom Layout'] },
  { name: 'Flex Design & Printing', price: 0, label: 'configurable', delivery: 'On Request', revisions: 1, features: ['Custom Size', 'High-res Print', 'Design + Print', 'Delivery Available'] },
];

export default function Pricing() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    document.title = 'Pricing — Aarav Enterprises';
    productAPI.list({ active: true })
      .then(res => setServices(res.data.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const displayData = services.length > 0
    ? services.map(s => ({
        name: s.name,
        price: s.starting_price,
        label: s.price_label || 'onwards',
        delivery: s.delivery_days ? `${s.delivery_days} days` : 'On Request',
        revisions: s.revisions || 2,
        featured: !!s.is_featured,
        features: [],
      }))
    : PRICING_DATA;

  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ padding: '4rem 1.5rem', background: 'var(--brand-surface)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">Transparent <span className="gradient-text">Pricing</span></h1>
          <p className="section-subtitle">Affordable professional design services. All prices are starting prices — final price depends on your requirements.</p>
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[...Array(9)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {displayData.map((item, i) => (
              <div key={i} className={`pricing-card ${item.featured ? 'featured' : ''}`}>
                {item.featured && (
                  <div style={{
                    display: 'inline-block', background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    padding: '0.2rem 0.75rem', borderRadius: 999, fontSize: '0.75rem',
                    fontWeight: 700, color: 'white', marginBottom: '1rem',
                  }}>⭐ Most Popular</div>
                )}
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: '#F8FAFC' }}>{item.name}</h3>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#A78BFA', fontFamily: 'Outfit', marginBottom: '0.25rem' }}>
                  {item.price > 0 ? `₹${parseInt(item.price).toLocaleString('en-IN')}` : 'Custom'}
                </div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  {item.price > 0 ? item.label : 'Contact for quote'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Delivery</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#CBD5E1' }}>{item.delivery}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Revisions</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#CBD5E1' }}>{item.revisions} Free</div>
                  </div>
                </div>
                {item.features.length > 0 && (
                  <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    {item.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <CheckCircle size={14} color="#4ADE80" />
                        <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => openWhatsApp(`I'm interested in ${item.name}`, item.name)}
                  className="btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
                >
                  <MessageCircle size={15} /> Enquire Now
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', background: 'rgba(124,58,237,0.08)', borderRadius: '1rem', border: '1px solid rgba(124,58,237,0.2)' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Need a Custom Quote?</h3>
          <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            For bulk orders, special requirements, or custom projects — chat with us on WhatsApp. Our team will provide a personalized quotation.
          </p>
          <button onClick={() => openWhatsApp('I need a custom quote for a bulk order.')} className="btn-whatsapp" style={{ fontSize: '1rem' }}>
            <MessageCircle size={18} /> Get Custom Quote
          </button>
        </div>
      </div>
    </div>
  );
}
