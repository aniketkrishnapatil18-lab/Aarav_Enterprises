import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageCircle, Star, Zap, RefreshCw, FileText } from 'lucide-react';
import { useEnquiryModal } from '../../context/EnquiryModalContext';

/**
 * ProductCard Component
 * Displays service thumbnail, title, price, specifications, details, and enquiry button.
 * Uses CSS variables from design system for dual-theme capability.
 * 
 * @param {Object} props
 * @param {Object} props.product - The product/service data object.
 */
export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Specifications/bullets list: up to 3 items
  const specs = [];
  if (product.delivery_days) {
    specs.push({
      icon: Zap,
      label: `Turnaround: ${product.delivery_days} Days`,
      color: 'var(--brand-amber)'
    });
  }
  if (product.revisions) {
    specs.push({
      icon: RefreshCw,
      label: `Revisions: ${product.revisions} Revisions`,
      color: 'var(--brand-violet)'
    });
  }
  if (product.file_formats) {
    specs.push({
      icon: FileText,
      label: `Formats: ${product.file_formats}`,
      color: 'var(--brand-pink)'
    });
  }

  const { openModal } = useEnquiryModal();

  const handleGetQuote = () => {
    openModal({ id: product.id, name: product.name });
  };

  const startingPrice = parseFloat(product.starting_price);

  return (
    <div className="service-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Image Container */}
      <div 
        className="img-container" 
        style={{ 
          position: 'relative', 
          height: 230, 
          overflow: 'hidden', 
          background: 'var(--bg-subtle)' 
        }}
      >
        {/* Skeleton Shimmer while loading */}
        {!imageLoaded && !imageError && (
          <div className="skeleton" style={{ position: 'absolute', inset: 0, height: '100%', borderRadius: 0 }} />
        )}

        {/* Product Image */}
        {!imageError && product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease, transform 0.5s ease',
            }}
          />
        ) : (
          <div 
            style={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(219,39,119,0.08) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={48} color="var(--brand-violet)" style={{ opacity: 0.6 }} />
          </div>
        )}

        {/* Badges Overlay */}
        <div 
          style={{
            position: 'absolute', 
            top: 12, 
            left: 12, 
            right: 12,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pointerEvents: 'none'
          }}
        >
          <span 
            style={{
              background: 'var(--bg-card)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-light)', 
              padding: '0.25rem 0.65rem',
              borderRadius: 999, 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              color: 'var(--brand-violet)',
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              boxShadow: 'var(--shadow-sm)',
              pointerEvents: 'auto'
            }}
          >
            {product.category_name || 'Design'}
          </span>
          {product.is_featured === 1 && (
            <span 
              style={{
                background: 'linear-gradient(135deg, #D97706, #DB2777)',
                padding: '0.25rem 0.65rem', 
                borderRadius: 999,
                fontSize: '0.7rem', 
                fontWeight: 800, 
                color: 'white',
                boxShadow: '0 4px 12px rgba(217,119,6,0.3)',
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.2rem'
              }}
            >
              <Star size={10} fill="white" stroke="none" /> Popular
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 
          style={{ 
            fontSize: '1.15rem', 
            marginBottom: '0.5rem', 
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '2.8rem',
            lineHeight: '1.4'
          }}
        >
          {product.name}
        </h3>

        {/* Short Description */}
        <p 
          style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.85rem', 
            lineHeight: 1.6, 
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '2.7rem'
          }}
        >
          {product.short_desc}
        </p>

        {/* Pricing block */}
        <div 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0.75rem 1rem', 
            background: 'var(--bg-subtle)',
            borderRadius: '0.75rem', 
            border: '1px solid var(--border-light)',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Starting From</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--brand-violet)', fontFamily: 'Outfit' }}>
              {startingPrice > 0
                ? `₹${parseInt(startingPrice).toLocaleString('en-IN')}`
                : 'Configurable'}
              {product.price_label && startingPrice > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 500, marginLeft: 4 }}>
                  {product.price_label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Specifications/Bullets list */}
        {specs.length > 0 && (
          <ul 
            style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: '0 0 1.25rem 0', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.4rem', 
              flex: 1 
            }}
          >
            {specs.map((spec, index) => {
              const IconComponent = spec.icon;
              return (
                <li 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontSize: '0.8rem', 
                    color: 'var(--text-muted)' 
                  }}
                >
                  <IconComponent size={14} style={{ color: spec.color }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spec.label}</span>
                </li>
              );
            })}
          </ul>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: 'auto' }}>
          <Link 
            to={`/services/${product.slug || product.id}`}
            style={{
              textAlign: 'center', 
              padding: '0.65rem', 
              borderRadius: '0.6rem',
              background: 'var(--badge-bg-purple)', 
              color: 'var(--brand-violet)',
              textDecoration: 'none', 
              fontSize: '0.85rem', 
              fontWeight: 700,
              border: '1px solid var(--badge-border-purple)', 
              transition: 'all 0.25s ease',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.35rem',
            }}
          >
            <Eye size={15} /> Details
          </Link>
          <button
            onClick={handleGetQuote}
            className="btn-whatsapp"
            style={{ 
              padding: '0.65rem', 
              fontSize: '0.85rem', 
              borderRadius: '0.6rem', 
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <MessageCircle size={15} /> Enquire
          </button>
        </div>
      </div>
    </div>
  );
}
