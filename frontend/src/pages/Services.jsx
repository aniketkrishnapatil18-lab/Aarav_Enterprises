import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Palette } from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductCard from '../components/common/ProductCard';

function findCategoryMatch(query, catState, catList) {
  if (!catList || catList.length === 0) return null;

  // 1. Explicit activeCategory match (if not 'all')
  if (catState && catState !== 'all') {
    const byCat = catList.find(
      c => c.slug === catState || c.id?.toString() === catState || c.name.toLowerCase() === catState.toLowerCase()
    );
    if (byCat) return byCat;
  }

  // 2. Search query match
  if (query && query.trim()) {
    const qLower = query.trim().toLowerCase();
    const qSlug = qLower.replace(/[^a-z0-9]/g, '');

    // Exact slug or ID match
    let match = catList.find(c => c.slug === qLower || c.id?.toString() === qLower);
    if (match) return match;

    // Exact name match
    match = catList.find(c => c.name.toLowerCase() === qLower);
    if (match) return match;

    // Normalized slug/name match (e.g. "banner design" vs "banner-design")
    match = catList.find(
      c => c.slug.replace(/-/g, '') === qSlug || c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === qSlug
    );
    if (match) return match;

    // Substring match
    match = catList.find(
      c => c.name.toLowerCase().includes(qLower) || qLower.includes(c.name.toLowerCase())
    );
    if (match) return match;
  }

  return null;
}

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
        const catData = cRes.data.data || [];
        const prodData = pRes.data.data || [];
        setProducts(prodData.length ? prodData : FALLBACK_SERVICES);
        setCategories(catData.length ? catData : FALLBACK_CATS);
      } catch {
        setProducts(FALLBACK_SERVICES);
        setCategories(FALLBACK_CATS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const catParam = searchParams.get('category');
    const qParam = searchParams.get('q');

    if (qParam) {
      setSearch(qParam);
      const match = findCategoryMatch(qParam, 'all', categories);
      if (match) {
        setActiveCategory(match.slug || match.id?.toString());
      }
    } else if (catParam) {
      setActiveCategory(catParam);
      const match = categories.find(c => c.slug === catParam || c.id?.toString() === catParam);
      if (match) {
        setSearch(match.name);
      }
    }
  }, [searchParams, categories]);

  const matchedCategory = findCategoryMatch(search, activeCategory, categories);

  const activeCategoryName = matchedCategory?.name || (
    categories.find(c => c.slug === activeCategory || c.id?.toString() === activeCategory)?.name
  );

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' }
  ];
  if (activeCategoryName && activeCategory !== 'all') {
    breadcrumbItems.push({ label: activeCategoryName });
  }

  const handleSelectCategory = (catObj) => {
    if (!catObj || catObj === 'all') {
      setActiveCategory('all');
      setSearch('');
    } else {
      const slugOrId = catObj.slug || catObj.id?.toString();
      setActiveCategory(slugOrId);
      setSearch(catObj.name);
    }
  };

  const filtered = products.filter(p => {
    // 1. Category match
    const matchCat =
      activeCategory === 'all' ||
      !activeCategory ||
      p.category_slug === activeCategory ||
      p.category_id?.toString() === activeCategory ||
      p.category_name?.toLowerCase() === activeCategory.toLowerCase() ||
      (matchedCategory && (
        p.category_slug === matchedCategory.slug ||
        p.category_id?.toString() === matchedCategory.id?.toString() ||
        p.category_name?.toLowerCase() === matchedCategory.name.toLowerCase()
      ));

    // 2. Search match
    if (!search || !search.trim()) return matchCat;

    const q = search.trim().toLowerCase();
    const matchSearch =
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.short_desc && p.short_desc.toLowerCase().includes(q)) ||
      (p.category_name && p.category_name.toLowerCase().includes(q)) ||
      (p.category_slug && p.category_slug.toLowerCase().includes(q)) ||
      (matchedCategory && (
        p.category_slug === matchedCategory.slug ||
        p.category_id?.toString() === matchedCategory.id?.toString()
      ));

    return matchCat && matchSearch;
  });

  const isAllActive = !matchedCategory && (activeCategory === 'all' || !activeCategory);

  return (
    <div style={{ paddingTop: 90 }}>
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
              onChange={e => {
                const val = e.target.value;
                setSearch(val);
                const match = findCategoryMatch(val, activeCategory, categories);
                if (match) {
                  setActiveCategory(match.slug || match.id?.toString());
                } else if (!val.trim()) {
                  setActiveCategory('all');
                }
              }}
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSelectCategory('all')}
              style={{
                padding: '0.55rem 1.25rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700,
                border: '1px solid',
                borderColor: isAllActive ? 'var(--brand-violet)' : 'var(--border-light)',
                background: isAllActive ? 'var(--badge-bg-purple)' : 'var(--bg-card)',
                color: isAllActive ? 'var(--brand-violet)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.25s ease',
              }}
            >All</button>
            {categories.map(cat => {
              const isSelected = matchedCategory
                ? (cat.id === matchedCategory.id || cat.slug === matchedCategory.slug)
                : (activeCategory === cat.slug || activeCategory === cat.id?.toString());

              return (
                <button key={cat.id || cat.slug}
                  onClick={() => handleSelectCategory(cat)}
                  style={{
                    padding: '0.55rem 1.25rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700,
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--brand-violet)' : 'var(--border-light)',
                    background: isSelected ? 'var(--badge-bg-purple)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--brand-violet)' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                  }}
                >{cat.name}</button>
              );
            })}
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
  { id: 1, name: 'Logo Design', slug: 'logo-design-service', short_desc: 'Professional logo design for businesses', starting_price: 999, price_label: 'onwards', delivery_days: 3, category_name: 'Logo Design', category_slug: 'logo-design', is_featured: true, thumbnail_url: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, name: 'Visiting Card Design', slug: 'visiting-card-design', short_desc: 'Stunning business card designs', starting_price: 299, price_label: 'onwards', delivery_days: 2, category_name: 'Visiting Card', category_slug: 'visiting-card', is_featured: true, thumbnail_url: 'https://images.pexels.com/photos/6804104/pexels-photo-6804104.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, name: 'Brochure Design', slug: 'brochure-design-service', short_desc: 'Eye-catching brochures for your business', starting_price: 799, price_label: 'onwards', delivery_days: 4, category_name: 'Brochure Design', category_slug: 'brochure-design', is_featured: false, thumbnail_url: 'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, name: 'Menu Card Design', slug: 'menu-card-design-service', short_desc: 'Beautiful menu cards for restaurants', starting_price: 599, price_label: 'onwards', delivery_days: 3, category_name: 'Menu Card Design', category_slug: 'menu-card-design', is_featured: false, thumbnail_url: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 5, name: '3D Logo Design', slug: '3d-logo-design-service', short_desc: 'Premium 3D logo designs', starting_price: 1499, price_label: 'onwards', delivery_days: 5, category_name: '3D Logo Design', category_slug: '3d-logo-design', is_featured: true, thumbnail_url: 'https://images.pexels.com/photos/5926389/pexels-photo-5926389.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 6, name: 'Banner Design', slug: 'banner-design-service', short_desc: 'Promotional and event banners', starting_price: 499, price_label: 'onwards', delivery_days: 2, category_name: 'Banner Design', category_slug: 'banner-design', is_featured: false, thumbnail_url: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const FALLBACK_CATS = [
  { id: 1, name: 'Logo Design', slug: 'logo-design' },
  { id: 2, name: 'Visiting Card', slug: 'visiting-card' },
  { id: 3, name: 'Brochure Design', slug: 'brochure-design' },
  { id: 4, name: 'Menu Card Design', slug: 'menu-card-design' },
  { id: 5, name: '3D Logo Design', slug: '3d-logo-design' },
  { id: 6, name: 'Banner Design', slug: 'banner-design' },
  { id: 7, name: 'Flex & Printing', slug: 'flex-printing' },
  { id: 8, name: 'Advertisement', slug: 'advertisement' },
  { id: 9, name: 'Social Media Design', slug: 'social-media-design' },
  { id: 10, name: 'Pamphlet & Flyer', slug: 'pamphlet-flyer' },
  { id: 11, name: 'LED Sign Board', slug: 'led-sign-board' },
];

