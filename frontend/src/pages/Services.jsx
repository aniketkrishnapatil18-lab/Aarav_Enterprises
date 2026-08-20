import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowRight, MessageCircle, Palette, Eye } from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import { openWhatsApp } from '../utils/helpers';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductCard from '../components/common/ProductCard';

export default function Services() {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search,      setSearch]      = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = 'Services Catalog — Aarav Enterprises';
    async function load() {
      try {
        const [pRes, cRes] = await Promise.all([
          productAPI.list({ active: true }),
          categoryAPI.list({ active: true }),
        ]);
        setProducts(pRes.data.data || []);
        setCategories(cRes.data.data || []);
      } catch {
        setProducts(FALLBACK_SERVICES);
        setCategories(FALLBACK_CATS);
      } finally {
        setLoading(false);
      }
    }
    load();
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const activeCategoryName = categories.find(
    c => c.slug === activeCategory || c.id?.toString() === activeCategory
  )?.name;

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' }
  ];
  if (activeCategoryName && activeCategory !== 'all') {
    breadcrumbItems.push({ label: activeCategoryName });
  }

  const filtered = products.filter(p => {
    const matchCat    = activeCategory === 'all' || p.category_slug === activeCategory || p.category_id?.toString() === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ paddingTop: 90 }}>
      {/* Header */}
      <div style={{ padding: '4rem 1.5rem', background: 'var(--bg-surface)', textAlign: 'center', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <h1 className="section-title">Our <span className="gradient-text">Design Services</span></h1>
          <p className="section-subtitle">Professional graphic design, branding, and printing solutions for every business requirement.</p>
        </div>
      </div>

      <div className="container section" style={{ paddingTop: '2.5rem' }}>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.55rem 1.25rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700,
                border: '1px solid',
                borderColor: activeCategory === 'all' ? 'var(--brand-violet)' : 'var(--border-light)',
                background: activeCategory === 'all' ? 'var(--badge-bg-purple)' : 'var(--bg-card)',
                color: activeCategory === 'all' ? 'var(--brand-violet)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >All</button>
            {categories.map(cat => (
              <button key={cat.id || cat.slug}
                onClick={() => setActiveCategory(cat.slug || cat.id?.toString())}
                style={{
                  padding: '0.55rem 1.25rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700,
                  border: '1px solid',
                  borderColor: (activeCategory === cat.slug || activeCategory === cat.id?.toString()) ? 'var(--brand-violet)' : 'var(--border-light)',
                  background: (activeCategory === cat.slug || activeCategory === cat.id?.toString()) ? 'var(--badge-bg-purple)' : 'var(--bg-card)',
                  color: (activeCategory === cat.slug || activeCategory === cat.id?.toString()) ? 'var(--brand-violet)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                }}
              >{cat.name}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 420 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-subtle)' }}>
            <Palette size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ fontSize: '1.1rem' }}>No services match your criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {filtered.map(s => (
              <ProductCard key={s.id} product={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const FALLBACK_SERVICES = [
  { id: 1, name: 'Logo Design', slug: 'logo-design-service', short_desc: 'Professional logo design for businesses', starting_price: 999, price_label: 'onwards', delivery_days: 3, category_name: 'Logo Design', category_slug: 'logo-design', is_featured: true },
  { id: 2, name: 'Visiting Card Design', slug: 'visiting-card-design', short_desc: 'Stunning business card designs', starting_price: 299, price_label: 'onwards', delivery_days: 2, category_name: 'Visiting Card', category_slug: 'visiting-card', is_featured: true },
  { id: 3, name: 'Brochure Design', slug: 'brochure-design-service', short_desc: 'Eye-catching brochures for your business', starting_price: 799, price_label: 'onwards', delivery_days: 4, category_name: 'Brochure Design', category_slug: 'brochure-design', is_featured: false },
  { id: 4, name: 'Menu Card Design', slug: 'menu-card-design-service', short_desc: 'Beautiful menu cards for restaurants', starting_price: 599, price_label: 'onwards', delivery_days: 3, category_name: 'Menu Card Design', category_slug: 'menu-card-design', is_featured: false },
  { id: 5, name: '3D Logo Design', slug: '3d-logo-design-service', short_desc: 'Premium 3D logo designs', starting_price: 1499, price_label: 'onwards', delivery_days: 5, category_name: '3D Logo Design', category_slug: '3d-logo-design', is_featured: true },
  { id: 6, name: 'Banner Design', slug: 'banner-design-service', short_desc: 'Promotional and event banners', starting_price: 499, price_label: 'onwards', delivery_days: 2, category_name: 'Banner Design', category_slug: 'banner-design', is_featured: false },
];

const FALLBACK_CATS = [
  { id: 1, name: 'Logo Design', slug: 'logo-design' },
  { id: 2, name: 'Visiting Card', slug: 'visiting-card' },
  { id: 3, name: 'Brochure Design', slug: 'brochure-design' },
];
