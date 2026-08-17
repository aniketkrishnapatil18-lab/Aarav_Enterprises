import { useEffect } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { openWhatsApp } from '../utils/helpers';

export default function Contact() {
  useEffect(() => { document.title = 'Contact — Aarav Enterprises'; }, []);
  return (
    <div style={{ paddingTop: 70 }}>
      <div style={{ padding: '4rem 1.5rem', background: 'var(--brand-surface)', textAlign: 'center' }}>
        <div className="container">
          <h1 className="section-title">Get In <span className="gradient-text">Touch</span></h1>
          <p className="section-subtitle">We're available on WhatsApp, phone, and email. Our AI assistant responds 24/7.</p>
        </div>
      </div>
      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Contact <span className="gradient-text">Information</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { icon: MessageCircle, color: '#25D366', label: 'WhatsApp AI Line', value: '+1 (555) 196-0714', action: () => openWhatsApp() },
                { icon: Phone, color: '#A78BFA', label: 'Phone', value: '+91 9763530208' },
                { icon: Mail, color: '#A78BFA', label: 'Email', value: 'info@aaraventerprises.com' },
                { icon: MapPin, color: '#A78BFA', label: 'Location', value: 'Pune, Maharashtra, India' },
                { icon: Clock, color: '#A78BFA', label: 'Business Hours', value: 'Monday – Saturday: 10 AM – 7 PM' },
              ].map(({ icon: Icon, color, label, value, action }) => (
                <div key={label} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: action ? 'pointer' : 'default' }} onClick={action}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Chat on <span className="gradient-text">WhatsApp</span></h3>
            <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
              The fastest way to reach us! Our AI assistant understands English, Hindi, and Marathi. Send us your requirements and we'll get back to you quickly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: '🎨 Logo Design Enquiry',          msg: "Hi! I need a logo design for my business." },
                { label: '📇 Visiting Card Enquiry',        msg: "Hi! I need visiting card designs." },
                { label: '📋 Brochure / Banner Enquiry',    msg: "Hi! I need brochure or banner designs." },
                { label: '📱 Social Media Designs',         msg: "Hi! I need social media post designs." },
                { label: '💬 General Enquiry',              msg: "Hi! I need help with a graphic design." },
              ].map(({ label, msg }) => (
                <button key={label} onClick={() => openWhatsApp(msg)} className="btn-whatsapp" style={{ justifyContent: 'flex-start', fontSize: '0.875rem' }}>
                  <MessageCircle size={15} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
