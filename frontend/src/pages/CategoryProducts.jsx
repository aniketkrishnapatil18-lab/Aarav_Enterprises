import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Palette, CreditCard, BookOpen, UtensilsCrossed, Box, 
  Layout, Printer, Megaphone, Share2, FileText, Layers, AlertCircle, ArrowLeft
} from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';

const ICON_MAP = {
  Palette,
  CreditCard,
  BookOpen,
  UtensilsCrossed,
  Box,
  Layout,
  Printer,
  Megaphone,
  Share2,
  FileText
};

export default function CategoryProducts() {
  const { category: categoryParam } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedSlug, setHighlightedSlug] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [categoryParam]);

  async function loadData() {
    try {
      setLoading(true);
      // Fetch all active categories first to find our target category by slug
      const catRes = await categoryAPI.list({ active: true });
      const categories = catRes.data.data || [];
      const foundCat = categories.find(c => c.slug === categoryParam);

      if (foundCat) {
        setCategory(foundCat);
        
        // Update document metadata for SEO
        document.title = `${foundCat.name} Services | Aarav Enterprises`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', foundCat.description || `High-quality ${foundCat.name} services in Pune by Aarav Enterprises.`);
        }

        // Fetch products in this category
        const prodRes = await productAPI.list({ category: foundCat.id, active: true });
        setProducts(prodRes.data.data || []);
      } else {
        // Try fallback
        handleFallbackData();
      }
    } catch (err) {
      console.error('Error loading category products, using fallbacks:', err);
      handleFallbackData();
    } finally {
      setLoading(false);
    }
  }

  function handleFallbackData() {
    const foundCat = FALLBACK_CATEGORIES.find(c => c.slug === categoryParam);
    if (foundCat) {
      setCategory(foundCat);
      document.title = `${foundCat.name} Services | Aarav Enterprises (Demo)`;
      const filteredProds = FALLBACK_PRODUCTS.filter(p => p.category_slug === foundCat.slug);
      setProducts(filteredProds);
    } else {
      setCategory(null);
      setProducts([]);
    }
  }

  // Handle Hash Scroll and Highlight
  useEffect(() => {
    if (!loading && products.length > 0) {
      const hash = window.location.hash;
      if (hash) {
        const slug = hash.replace('#', '');
        const element = document.getElementById(slug);
        if (element) {
          setHighlightedSlug(slug);
          
          const scrollTimer = setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 200);

          const highlightTimer = setTimeout(() => {
            setHighlightedSlug(null);
          }, 3500);

          return () => {
            clearTimeout(scrollTimer);
            clearTimeout(highlightTimer);
          };
        }
      }
    }
  }, [loading, products]);

  if (loading) {
    return (
      <div style={{ paddingTop: 100, minHeight: '80vh' }}>
        <div className="container">
          <div className="skeleton" style={{ height: 260, marginBottom: '2.5rem', borderRadius: 'var(--radius-xl)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 420 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <AlertCircle size={64} color="var(--brand-pink)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Category Not Found</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 450, marginBottom: '2rem', lineHeight: 1.6 }}>
          We could not find the category you are looking for. It may have been renamed or moved.
        </p>
        <Link to="/services" className="btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
          <ArrowLeft size={16} /> Browse All Services
        </Link>
      </div>
    );
  }

  const HeaderIcon = ICON_MAP[category.icon] || Layers;

  return (
    <div style={{ paddingTop: 80, minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Category Hero Block */}
      <div 
        style={{ 
          background: 'var(--grad-hero)', 
          borderBottom: '1px solid var(--border-light)',
          padding: '3.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="orb orb-purple" style={{ top: '-10%', right: '-5%', opacity: 0.15 }} />
        <div className="orb orb-pink" style={{ bottom: '-10%', left: '-5%', opacity: 0.15 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Home', path: '/' },
              { label: 'Products', path: '/services' },
              { label: category.name }
            ]}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div 
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: 'var(--grad-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                color: 'white'
              }}
            >
              <HeaderIcon size={30} />
            </div>
            <div>
              <h1 
                style={{ 
                  fontFamily: 'Outfit', 
                  fontWeight: 900, 
                  fontSize: 'clamp(2rem, 5vw, 3rem)', 
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  margin: 0
                }}
              >
                Our Premium <span className="gradient-text">{category.name}</span>
              </h1>
              <p 
                style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--brand-violet)', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em',
                  margin: '0.35rem 0 0 0'
                }}
              >
                {products.length} {products.length === 1 ? 'Service' : 'Services'} Available
              </p>
            </div>
          </div>

          <p 
            style={{ 
              color: 'var(--text-muted)', 
              fontSize: '1.05rem', 
              lineHeight: 1.6, 
              maxWidth: 750, 
              margin: '0.5rem 0 0 0' 
            }}
          >
            {category.description || `Professional signage, board layouts, and print-ready designs for ${category.name}.`}
          </p>
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="container section" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {products.length === 0 ? (
          <div 
            style={{ 
              textAlign: 'center', 
              padding: '6rem 2rem', 
              background: 'var(--bg-surface)', 
              borderRadius: 'var(--radius-xl)', 
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Layers size={48} style={{ color: 'var(--text-subtle)', marginBottom: '1.25rem', opacity: 0.5 }} />
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Services Listed</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 2rem' }}>
              We are currently updating our catalog for {category.name}. Check back shortly or query us directly on WhatsApp!
            </p>
            <a 
              href="https://wa.me/15551960714?text=Hi!%20I'm%20inquiring%20about%20your%20services." 
              className="btn-whatsapp" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'inline-flex', padding: '0.8rem 1.75rem' }}
            >
              Enquire on WhatsApp
            </a>
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}
          >
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isHighlighted={product.slug === highlightedSlug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Complete local offline dataset matching seeded database categories and products
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Logo Design', slug: 'logo-design', description: 'Professional logo and brand identity design services tailored to your industry.', icon: 'Palette' },
  { id: 2, name: 'Visiting Card', slug: 'visiting-card', description: 'Premium business card layouts and corporate visiting card print designs.', icon: 'CreditCard' },
  { id: 3, name: 'Brochure Design', slug: 'brochure-design', description: 'Creative corporate brochures, flyers, and marketing catalog designs.', icon: 'BookOpen' },
  { id: 4, name: 'Menu Card Design', slug: 'menu-card-design', description: 'Restaurant, cafe, hotel, and diner menu card layout layouts.', icon: 'UtensilsCrossed' },
  { id: 5, name: '3D Logo Design', slug: '3d-logo-design', description: 'Three-dimensional embossed logo symbols and realistic mockup designs.', icon: 'Box' },
  { id: 6, name: 'Banner Design', slug: 'banner-design', description: 'Digital web banners, storefront hoardings, and promo display designs.', icon: 'Layout' },
  { id: 7, name: 'Flex & Printing', slug: 'flex-printing', description: 'Outdoor large format flex signs, vinyl boards, and print services.', icon: 'Printer' },
  { id: 8, name: 'Advertisement', slug: 'advertisement', description: 'Newspaper ads, print banner materials, and marketing layouts.', icon: 'Megaphone' },
  { id: 9, name: 'Social Media Design', slug: 'social-media-design', description: 'High-converting Instagram, Facebook, and WhatsApp creative post designs.', icon: 'Share2' },
  { id: 10, name: 'Pamphlet & Flyer', slug: 'pamphlet-flyer', description: 'Eye-catching pamphlets, handbills, and flyer distribution designs.', icon: 'FileText' }
];

const FALLBACK_PRODUCTS = [
  { id: 1, category_id: 1, name: 'Logo Design', slug: 'logo-design-service', short_desc: 'Professional logo for your business or brand. Clean, scalable, vector layouts.', starting_price: 999.00, price_label: 'onwards', delivery_days: 3, revisions: 3, file_formats: 'AI, EPS, PDF, PNG, JPG', category_name: 'Logo Design', category_slug: 'logo-design', is_featured: 1 },
  { id: 2, category_id: 2, name: 'Visiting Card Design', slug: 'visiting-card-design', short_desc: 'Stunning and professional visiting card designs that make a great first impression.', starting_price: 299.00, price_label: 'onwards', delivery_days: 2, revisions: 2, file_formats: 'PDF, PNG, JPG, PSD', category_name: 'Visiting Card', category_slug: 'visiting-card', is_featured: 1 },
  { id: 3, category_id: 3, name: 'Brochure Design', slug: 'brochure-design-service', short_desc: 'Business and promotional brochure designs. Bi-fold, tri-fold, and catalog formats.', starting_price: 799.00, price_label: 'onwards', delivery_days: 4, revisions: 2, file_formats: 'PDF, AI, InDesign, PNG', category_name: 'Brochure Design', category_slug: 'brochure-design', is_featured: 0 },
  { id: 4, category_id: 4, name: 'Menu Card Design', slug: 'menu-card-design-service', short_desc: 'Beautiful menu card designs with premium category listings and pricing structures.', starting_price: 599.00, price_label: 'onwards', delivery_days: 3, revisions: 2, file_formats: 'PDF, PNG, Print-ready', category_name: 'Menu Card Design', category_slug: 'menu-card-design', is_featured: 0 },
  { id: 5, category_id: 5, name: '3D Logo Design', slug: '3d-logo-design-service', short_desc: 'Premium 3D logo concepts featuring high-quality metallic and glass renders.', starting_price: 1499.00, price_label: 'onwards', delivery_days: 5, revisions: 2, file_formats: 'PNG, JPG, MP4', category_name: '3D Logo Design', category_slug: '3d-logo-design', is_featured: 1 },
  { id: 6, category_id: 6, name: 'Banner Design', slug: 'banner-design-service', short_desc: 'Promotional, exhibition, and business banners designed to grab immediate attention.', starting_price: 499.00, price_label: 'onwards', delivery_days: 2, revisions: 2, file_formats: 'PDF, PNG, JPG, Print-ready', category_name: 'Banner Design', category_slug: 'banner-design', is_featured: 0 },
  { id: 7, category_id: 7, name: 'Flex Design & Printing', slug: 'flex-design-printing', short_desc: 'Complete outdoor flex banner printing and design services. Durable weather-proof materials.', starting_price: 0.00, price_label: 'configurable', delivery_days: 3, revisions: 1, file_formats: 'PDF, PNG, Print-ready', category_name: 'Flex & Printing', category_slug: 'flex-printing', is_featured: 0 },
  { id: 8, category_id: 8, name: 'Advertisement Banner', slug: 'advertisement-banner', short_desc: 'High-impact newspaper and web advertisement creatives to boost campaigns.', starting_price: 699.00, price_label: 'onwards', delivery_days: 2, revisions: 2, file_formats: 'PDF, PNG, JPG, PSD', category_name: 'Advertisement', category_slug: 'advertisement', is_featured: 0 },
  { id: 9, category_id: 9, name: 'Social Media Post Design', slug: 'social-media-post-design', short_desc: 'Stunning post templates and stories for Instagram, Facebook, and LinkedIn channels.', starting_price: 299.00, price_label: 'onwards', delivery_days: 1, revisions: 2, file_formats: 'PNG, JPG, MP4', category_name: 'Social Media Design', category_slug: 'social-media-design', is_featured: 1 },
  { id: 10, category_id: 10, name: 'Pamphlet & Flyer Design', slug: 'pamphlet-flyer-design', short_desc: 'Professional marketing pamphlets and handouts for local distribution and promos.', starting_price: 499.00, price_label: 'onwards', delivery_days: 2, revisions: 2, file_formats: 'PDF, PNG, JPG, Print-ready', category_name: 'Pamphlet & Flyer', category_slug: 'pamphlet-flyer', is_featured: 0 }
];
