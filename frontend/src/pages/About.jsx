import { useEffect } from 'react';
import { openWhatsApp } from '../utils/helpers';
import { MessageCircle, Award, Users, Zap, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => { document.title = 'About Us — Aarav Enterprises'; }, []);
  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ padding: '4rem 1.5rem 5rem', background: 'var(--brand-surface)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">About <span className="gradient-text">Aarav Enterprises</span></h1>
          <p className="section-subtitle">Creative Designs. Professional Branding. Powerful Visuals.</p>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1.5rem' }}>
              Your Trusted <span className="gradient-text">Design Partner</span>
            </h2>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              Aarav Enterprises is a professional graphic design, multimedia, branding, and printing services company based in Pune, Maharashtra. We serve businesses of all sizes — from startups to established enterprises.
            </p>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, marginBottom: '2rem' }}>
              Our mission is to help businesses communicate their brand identity effectively through compelling visual designs. We combine creativity with technology — including AI-powered customer support — to make professional design accessible to everyone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => openWhatsApp()} className="btn-whatsapp"><MessageCircle size={18} /> Chat on WhatsApp</button>
              <Link to="/services" className="btn-primary">Our Services</Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { icon: Award,  label: '500+',   sub: 'Projects Completed' },
              { icon: Users,  label: '100+',   sub: 'Happy Clients' },
              { icon: Zap,    label: '5 Years', sub: 'Of Experience' },
              { icon: Heart,  label: '100%',   sub: 'Satisfaction Rate' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={sub} className="glass-card glass-card-hover" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <Icon size={28} color="#A78BFA" style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Outfit', color: '#F8FAFC', lineHeight: 1 }}>{label}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.4rem' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Services offered */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>What We <span className="gradient-text">Offer</span></h2>
          <p style={{ color: '#64748B' }}>Comprehensive design solutions for every business need</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {['Logo Design', 'Visiting Card Design', 'Brochure Design', 'Menu Card Design', '3D Logo Design', 'Banner Design', 'Flex & Printing', 'Advertisement Creatives', 'Social Media Design', 'Pamphlet & Flyer Design'].map(s => (
            <div key={s} className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: '#CBD5E1' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
