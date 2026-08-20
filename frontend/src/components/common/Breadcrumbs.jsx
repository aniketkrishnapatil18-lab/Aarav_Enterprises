import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumbs Component
 * Renders page navigation breadcrumbs using theme variables.
 * 
 * @param {Object[]} items - Array of breadcrumbs.
 * @param {string} items[].label - Visual text for the breadcrumb.
 * @param {string} [items[].path] - URL target for React Router Link.
 */
export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.4rem', 
        fontSize: '0.85rem',
        margin: '1.25rem 0',
        flexWrap: 'wrap'
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {index > 0 && (
              <ChevronRight 
                size={14} 
                style={{ color: 'var(--text-subtle)', opacity: 0.7 }} 
              />
            )}
            {isLast || !item.path ? (
              <span 
                style={{ 
                  color: isLast ? 'var(--brand-violet)' : 'var(--text-main)', 
                  fontWeight: isLast ? 700 : 500 
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path} 
                style={{ 
                  color: 'var(--text-subtle)', 
                  textDecoration: 'none', 
                  transition: 'color 0.2s', 
                  fontWeight: 500 
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text-main)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-subtle)'}
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
