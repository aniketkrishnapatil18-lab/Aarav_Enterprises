import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, CheckCircle, ChevronDown, ChevronUp,
  Ruler, Printer, Lightbulb, Tag, Zap, ArrowRight
} from 'lucide-react';
import { openWhatsApp } from '../utils/helpers';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const DESIGN_SERVICES = [
  { name: 'Logo Design', slug: 'logo-design', price: 999, label: 'onwards', delivery: '3 Days', revisions: 3, featured: false, features: ['Multiple Concepts', 'AI + PDF + PNG', 'Color Variations', 'Revision Support'] },
  { name: '3D Logo Design', slug: '3d-logo-design', price: 1499, label: 'onwards', delivery: '5 Days', revisions: 2, featured: true, features: ['3D Render', 'Multiple Angles', 'HD PNG Export', 'Animation Optional'] },
  { name: 'Visiting Card Design', slug: 'visiting-card', price: 299, label: 'onwards', delivery: '2 Days', revisions: 2, featured: false, features: ['Front & Back Design', 'Print-ready PDF', 'Color Variations', 'Fast Delivery'] },
  { name: 'Social Media Post', slug: 'social-media', price: 299, label: 'onwards', delivery: '1 Day', revisions: 2, featured: false, features: ['Instagram / Facebook', 'Story Format', 'Brand Colors', 'PNG + JPG'] },
  { name: 'Brochure Design', slug: 'brochure', price: 799, label: 'onwards', delivery: '4 Days', revisions: 2, featured: false, features: ['Bi-fold / Tri-fold', 'Print-ready Files', 'Custom Layout', 'Content Placement'] },
  { name: 'Pamphlet / Flyer', slug: 'pamphlet', price: 499, label: 'onwards', delivery: '2 Days', revisions: 2, featured: false, features: ['Print-ready Format', 'Both Sides', 'Custom Size', 'Quick Turnaround'] },
  { name: 'Menu Card Design', slug: 'menu-card', price: 599, label: 'onwards', delivery: '3 Days', revisions: 2, featured: false, features: ['Multi-page Support', 'Print-ready Format', 'Custom Theme', 'Category Sections'] },
  { name: 'Advertisement Banner', slug: 'ad-banner', price: 699, label: 'onwards', delivery: '2 Days', revisions: 2, featured: false, features: ['Digital + Print', 'Multiple Sizes', 'Brand Identity', 'Custom Layout'] },
];

const SQFT_CATEGORIES = [
  { id: 'flex-banner', icon: Printer, name: 'Flex Banner / Hoarding', color: 'var(--brand-violet)', desc: 'Outdoor flex banners, hoardings, and large-format prints. Price per sq.ft.', note: 'Minimum order: 4 sq.ft', tiers: [{ size: '1 sq.ft', price: 45, label: 'per sq.ft' }, { size: '4-10 sq.ft', price: 40, label: 'per sq.ft' }, { size: '11-30 sq.ft', price: 35, label: 'per sq.ft' }, { size: '31-100 sq.ft', price: 30, label: 'per sq.ft' }, { size: '100+ sq.ft', price: null, label: 'Contact for bulk rate' }], includes: ['High-res 720 / 1440 DPI print', 'Backlit & Frontlit options', 'Delivery available in Pune', 'Design charges extra if needed'] },
  { id: 'poster', icon: Printer, name: 'Poster / Sticker Print', color: '#D97706', desc: 'A4 to A0 size posters, self-adhesive stickers, and short-run prints.', note: 'Minimum 10 copies for print runs', tiers: [{ size: 'A4 (10 pcs)', price: 15, label: 'per sheet' }, { size: 'A3 (10 pcs)', price: 25, label: 'per sheet' }, { size: 'A2 (10 pcs)', price: 60, label: 'per sheet' }, { size: 'A1 (10 pcs)', price: 120, label: 'per sheet' }, { size: 'A0 (custom)', price: null, label: 'Contact for quote' }], includes: ['Gloss / Matte finish', 'UV protective lamination', 'CMYK full-color print', 'Pickup or courier available'] },
  { id: 'led-board', icon: Lightbulb, name: 'LED Sign Board', color: '#059669', desc: 'Illuminated acrylic LED sign boards — backlit, channel letters & display boards.', note: 'Price varies by thickness & LED type', tiers: [{ size: 'Upto 1 sq.ft', price: 600, label: 'per sq.ft' }, { size: '1-4 sq.ft', price: 550, label: 'per sq.ft' }, { size: '4-10 sq.ft', price: 500, label: 'per sq.ft' }, { size: '10-25 sq.ft', price: 450, label: 'per sq.ft' }, { size: '25+ sq.ft', price: null, label: 'Contact for site estimate' }], includes: ['Acrylic / ACP base material', 'SMD LED strip lighting', 'IP65 waterproof rated', 'Installation available in Pune'] },
  { id: 'glow-sign', icon: Lightbulb, name: 'Glow Sign Board', color: '#EC4899', desc: 'PVC or acrylic backlit glow sign boards for shops, offices, and showrooms.', note: 'Includes design + printing. Fitting extra.', tiers: [{ size: 'Upto 2 sq.ft', price: 450, label: 'per sq.ft' }, { size: '2-6 sq.ft', price: 400, label: 'per sq.ft' }, { size: '6-15 sq.ft', price: 350, label: 'per sq.ft' }, { size: '15-30 sq.ft', price: 300, label: 'per sq.ft' }, { size: '30+ sq.ft', price: null, label: 'Custom quote required' }], includes: ['PVC / Acrylic panel', 'CFL or LED backlit options', 'Single or double face', 'Frame & casing included'] },
  { id: 'acrylic-board', icon: Tag, name: 'Acrylic Sign Board', color: '#7C3AED', desc: 'Frosted, colored, or transparent acrylic boards with UV-printed graphics.', note: 'Thickness: 3mm / 5mm / 8mm', tiers: [{ size: '3mm - 1 sq.ft', price: 500, label: 'per sq.ft' }, { size: '3mm - 4 sq.ft', price: 450, label: 'per sq.ft' }, { size: '5mm - any', price: 650, label: 'per sq.ft' }, { size: '8mm - any', price: 900, label: 'per sq.ft' }, { size: 'Bulk (25+ sqft)', price: null, label: 'Negotiable rate' }], includes: ['UV flatbed printing', 'Frosted / colored / clear', 'Pre-drilled mounting holes', 'Laser-cut shape option'] },
  { id: 'roll-up-standee', icon: Ruler, name: 'Roll-Up Standee', color: '#D97706', desc: 'Retractable pull-up banners for events, exhibitions, and shop displays.', note: 'Frame included. Single or double sided.', tiers: [{ size: '1ft x 5ft (Small)', price: 999, label: 'per piece' }, { size: '2ft x 5ft (Standard)', price: 1499, label: 'per piece' }, { size: '2ft x 6ft (Large)', price: 1799, label: 'per piece' }, { size: '3ft x 6ft (XL)', price: 2499, label: 'per piece' }, { size: '5+ pieces', price: null, label: 'Bulk discount available' }], includes: ['Aluminum retractable base', '180gsm frontlit print', 'Carry bag included', 'Design charges extra'] },
];

const TABS = [
  { id: 'sqft', label: 'Signage & Print (Sq.Ft)', icon: Ruler },
  { id: 'design', label: 'Design Services', icon: Zap },
];

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN CARD
// ─────────────────────────────────────────────────────────────────────────────
function DesignCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(124,58,237,0.18)' }}
      style={{ background: 'var(--bg-card)', border: '1px solid ' + (item.featured ? 'var(--brand-violet)' : 'var(--border-light)'), borderRadius: 'var(--radius-xl)', padding: '1.75rem', display: 'flex', flexDirection: 'column', boxShadow: item.featured ? 'var(--shadow-lg)' : 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}
    >
      {item.featured && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--grad-primary)', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.35rem 0.9rem', borderBottomLeftRadius: 'var(--radius-md)' }}>
          ⭐ Most Popular
        </div>
      )}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>{item.name}</h3>
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--brand-violet)' }}>
          {item.price > 0 ? '₹' + item.price.toLocaleString('en-IN') : 'Custom'}
        </span>
        <span style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', marginLeft: '0.4rem' }}>
          {item.price > 0 ? item.label : '— contact for quote'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Delivery</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.delivery}</div>
        </div>
        <div style={{ width: 1, background: 'var(--border-light)' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Revisions</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.revisions} Free</div>
        </div>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', flex: 1 }}>
        {item.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
            <CheckCircle size={14} color="var(--brand-emerald)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{f}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => openWhatsApp("Hi, I am interested in " + item.name + ". Please share details.", item.name)} className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}>
        <MessageCircle size={15} /> Enquire Now
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SQFT CARD
// ─────────────────────────────────────────────────────────────────────────────
function SqftCard({ cat, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Header */}
      <div style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: cat.color + '18', border: '1px solid ' + cat.color + '40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <cat.icon size={22} color={cat.color} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', marginBottom: '0.2rem' }}>{cat.name}</h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-subtle)', margin: 0 }}>{cat.desc}</p>
        </div>
      </div>

      {/* Pricing table */}
      <div style={{ padding: '1.25rem 1.75rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', paddingBottom: '0.6rem', fontWeight: 600 }}>Size / Qty</th>
              <th style={{ textAlign: 'right', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', paddingBottom: '0.6rem', fontWeight: 600 }}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {cat.tiers.map((tier, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--border-light)' }}>
                <td style={{ padding: '0.6rem 0', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 500 }}>{tier.size}</td>
                <td style={{ padding: '0.6rem 0', textAlign: 'right' }}>
                  {tier.price !== null ? (
                    <span>
                      <strong style={{ fontSize: '1rem', color: cat.color, fontFamily: 'Outfit' }}>₹{tier.price}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginLeft: '0.3rem' }}>{tier.label}</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>{tier.label}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Note */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: cat.color + '10', border: '1px solid ' + cat.color + '30', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cat.color, flexShrink: 0 }}>ⓘ</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cat.note}</span>
        </div>

        {/* Toggle includes */}
        <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.83rem', color: cat.color, fontWeight: 600, marginBottom: open ? '0.75rem' : '1rem' }}>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          {open ? "Hide" : "See"} what's included
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', overflow: 'hidden' }}>
              {cat.includes.map((inc) => (
                <li key={inc} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle size={13} color="var(--brand-emerald)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{inc}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <button
          onClick={() => openWhatsApp("Hi, I need pricing for " + cat.name + ". Please share details.", cat.name)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', width: '100%', padding: '0.7rem 1rem', background: cat.color + '15', border: '1px solid ' + cat.color + '50', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', color: cat.color, transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = cat.color; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = cat.color + '15'; e.currentTarget.style.color = cat.color; }}
        >
          <MessageCircle size={15} /> Get Quote on WhatsApp
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [activeTab, setActiveTab] = useState('sqft');

  if (typeof document !== 'undefined') {
    document.title = 'Transparent Pricing — Aarav Enterprises';
  }

  return (
    <div style={{ paddingTop: 90, background: 'var(--bg-main)', minHeight: '100vh' }}>

      {/* STICKY TABS */}
      <div style={{ position: 'sticky', top: 65, zIndex: 50, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--brand-violet)' : '2px solid transparent', color: activeTab === tab.id ? 'var(--brand-violet)' : 'var(--text-muted)', fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '0.92rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container section">
        <AnimatePresence mode="wait">

          {activeTab === 'sqft' && (
            <motion.div key="sqft" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
                {SQFT_CATEGORIES.map((cat, i) => <SqftCard key={cat.id} cat={cat} index={i} />)}
              </div>
            </motion.div>
          )}

          {activeTab === 'design' && (
            <motion.div key="design" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {DESIGN_SERVICES.map((item, i) => <DesignCard key={item.slug} item={item} index={i} />)}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CUSTOM QUOTE BANNER */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--grad-hero)', border: '1px solid var(--border-glow)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--badge-bg-purple)', color: 'var(--badge-text-purple)', border: '1px solid var(--badge-border-purple)', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.9rem', marginBottom: '1.25rem' }}>
                <MessageCircle size={13} /> Custom Requirements?
              </span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem', fontFamily: 'Outfit' }}>
                Need a <span className="gradient-text">Personalised Quote?</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 540, margin: '0 auto 2rem', lineHeight: 1.7 }}>
                For bulk orders, special sizes, custom site installations, or anything outside our standard catalog — message us on WhatsApp and we will get back within minutes.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => openWhatsApp("Hi, I need a custom quote for my project. Please share details.")} className="btn-whatsapp" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                  <MessageCircle size={18} /> Chat on WhatsApp
                </button>
                <a href="/contact" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.9rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  Contact Us <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
