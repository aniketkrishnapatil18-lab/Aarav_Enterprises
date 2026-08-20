import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCarouselRow from './ProductCarouselRow';

/**
 * CategoryBlock Component
 * Displays a category section with a linked title, description,
 * "View All" link, and a ProductCarouselRow scrollable product list.
 * 
 * @param {Object} props
 * @param {Object} props.category - The category object.
 * @param {Object[]} props.products - Products belonging to this category.
 */
export default function CategoryBlock({ category, products }) {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ marginBottom: '4.5rem', width: '100%' }}>
      {/* Category Header Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '1.75rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '250px' }}>
          <h2 
            style={{ 
              margin: 0, 
              fontSize: '1.65rem', 
              fontWeight: 800, 
              fontFamily: 'Outfit' 
            }}
          >
            <Link 
              to={`/services?category=${category.slug}`} 
              style={{ color: 'var(--text-main)', textDecoration: 'none' }}
              className="hover:text-[var(--brand-violet)] transition-colors"
            >
              {category.name}
            </Link>
          </h2>
          {category.description && (
            <p 
              style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.9rem', 
                margin: '0.35rem 0 0 0',
                lineHeight: 1.5
              }}
            >
              {category.description}
            </p>
          )}
        </div>

        <Link 
          to={`/services?category=${category.slug}`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            color: 'var(--brand-violet)', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            textDecoration: 'none',
            paddingBottom: '2px'
          }}
          className="underline-grow group"
        >
          <span>View All</span>
          <ArrowRight 
            size={16} 
            className="group-hover:translate-x-1 transition-transform" 
          />
        </Link>
      </div>

      {/* Products Carousel */}
      <ProductCarouselRow products={products} />
    </div>
  );
}
