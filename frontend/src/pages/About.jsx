import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { openWhatsApp } from '../utils/helpers';
import { MessageCircle, Award, Users, Zap, Heart, CheckCircle2, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => {
    document.title = 'About Us — Aarav Enterprises';
  }, []);

  const stats = [
    { icon: Award, label: '500+', sub: 'Projects Completed', color: 'var(--brand-violet)' },
    { icon: Users, label: '100+', sub: 'Happy Clients', color: 'var(--brand-pink)' },
    { icon: Zap, label: '5+ Years', sub: 'Of Experience', color: 'var(--brand-amber)' },
    { icon: Heart, label: '100%', sub: 'Satisfaction Rate', color: 'var(--brand-emerald)' },
  ];

  const values = [
    { title: 'Premium Quality', desc: 'We use premium acrylic, ACP panels, and long-lasting LEDs to construct boards that look pristine and survive weather variations.' },
    { title: 'Fast Turnaround', desc: 'No weeks-long delays. We design, print, assemble, and deliver products within 1 to 5 business days.' },
    { title: 'End-to-End Execution', desc: 'From initial design consultation to manufacturing and final installation in Pune, we manage everything under one roof.' },
  ];

  const offerings = [
    'LED Acrylic Letters', 'UV Flatbed Printing', 'ACP Cladding Signage', 'Glow Sign Boards',
    '3D Logo Fabrication', 'Flex Banner Prints', 'Roll-up Standees', 'Visiting & Menu Cards'
  ];

  return (
    <div style={{ paddingTop: 90, background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container">

        {/* ── INTRO SECTION ── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', margin: '2rem 0 4rem' }}>
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--badge-bg-purple)',
              color: 'var(--badge-text-purple)',
              border: '1px solid var(--badge-border-purple)',
              borderRadius: 999,
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.35rem 0.95rem',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ✨ Pune's Premier Signage Partner
            </span>
            <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              We Bring Your <span className="gradient-text">Brand to Life</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              Aarav Enterprises is a professional signage, LED board fabrication, and custom digital printing company based in Pune, Maharashtra. We design high-impact visual solutions that help businesses capture customer attention.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              Our expert fabrication unit produces stunning premium 3D acrylic letters, weatherproof frontlit & backlit boards, roll-up banner prints, and promotional graphics with high fidelity, leveraging state-of-the-art UV flatbed print technology.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => openWhatsApp('Hi! I want to inquire about custom signage/printing.')}
                className="btn-whatsapp"
                style={{ padding: '0.85rem 1.6rem', fontSize: '0.92rem' }}
              >
                <MessageCircle size={17} /> Talk to our AI Assistant
              </button>
              <Link
                to="/services"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.85rem 1.6rem', fontSize: '0.92rem' }}
              >
                Browse Catalog <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Right Image / Mockup Card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.sub}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="glass-card"
                style={{
                  padding: '1.75rem 1.25rem',
                  textAlign: 'center',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}35`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <stat.icon size={22} color={stat.color} />
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', lineHeight: 1.1 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.4rem', fontWeight: 500 }}>
                  {stat.sub}
                </div>
              </motion.div>
            ))}
          </div>

        </section>

        {/* ── CORE VALUES ── */}
        <section style={{ margin: '4rem 0 5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)' }}>
              Why Choose <span className="gradient-text">Aarav Enterprises?</span>
            </h2>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              We combine robust fabrication materials with design excellence
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {values.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card glass-card-hover"
                style={{
                  padding: '2rem 1.75rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <CheckCircle2 size={20} color="var(--brand-violet)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{v.title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CORE SERVICES LISTING ── */}
        <section style={{ margin: '4rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)' }}>
              What We <span className="gradient-text">Fabricate & Design</span>
            </h2>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.92rem' }}>Our broad range of custom signage services</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.1rem' }}>
            {offerings.map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--grad-primary)', flexShrink: 0
                }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── LOCATION / CTA BANNER ── */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: '5rem',
            padding: '3rem 2rem',
            background: 'var(--grad-hero)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="orb orb-pink" style={{ opacity: 0.2 }} />
          <h2 style={{ fontSize: '1.85rem', fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Visit Our <span className="gradient-text">Pune Workshop</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Located conveniently in Bibwewadi, Pune. Drop by to discuss your branding materials or check out ACP board and acrylic board samples in person.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <MapPin size={16} color="var(--brand-pink)" />
              <span>Bibwewadi, Pune 411037</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Phone size={16} color="var(--brand-violet)" />
              <span>+91 9763530208</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => openWhatsApp('Hi! I would like to get directions/visit your workshop.')}
              className="btn-whatsapp"
              style={{ fontSize: '0.95rem', padding: '0.85rem 1.75rem' }}
            >
              <MessageCircle size={17} /> Schedule Workshop Visit
            </button>
            <a
              href="https://maps.google.com/?q=Survey+No+659%2F16%2C+Beside+Jagtap+Dairy%2C+Bibwewadi%2C+Pune+411037"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', padding: '0.85rem 1.75rem' }}
            >
              View on Google Maps <ArrowRight size={15} />
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
