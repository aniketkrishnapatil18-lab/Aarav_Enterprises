import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

/**
 * ProductCarouselRow Component
 * Renders a horizontally scrollable list of ProductCards.
 * Uses native touch scroll for mobile/tablet with snapping, and arrows for desktop.
 * 
 * @param {Object} props
 * @param {Object[]} props.products - Array of product objects.
 */
export default function ProductCarouselRow({ products }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Update arrow visibility based on scroll position
  const checkScrollLimits = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeftArrow(el.scrollLeft > 5);
    // Allow a small tolerance for fractional scroll widths
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    setShowRightArrow(!isAtEnd);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollLimits);
      // Run once on load to establish correct state
      checkScrollLimits();
      
      // Recheck when window size changes
      window.addEventListener('resize', checkScrollLimits);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollLimits);
      }
      window.removeEventListener('resize', checkScrollLimits);
    };
  }, [products]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll by roughly 1 card width + gap
    const scrollAmount = direction === 'left' ? -300 : 300;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <div style={{ position: 'relative', width: '100%' }} className="group">
      {/* Left Navigation Arrow (Desktop Only) */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          style={{
            position: 'absolute',
            left: '-18px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          className="hidden lg:flex hover:scale-110 hover:border-glow"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{
          gap: '1.25rem',
          paddingBottom: '1rem',
          paddingTop: '0.5rem',
          paddingLeft: '0.25rem',
          paddingRight: '0.25rem',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              width: '80vw', // Mobile: 1.2 cards visible (80vw width + gap leaves ~20vw space)
              maxWidth: '300px', // Fallback constraint
            }}
            // Responsive widths using Tailwind classes
            className="snap-start shrink-0 w-[80vw] sm:w-[45vw] md:w-[32vw] lg:w-[280px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Right Navigation Arrow (Desktop Only) */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          style={{
            position: 'absolute',
            right: '-18px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          className="hidden lg:flex hover:scale-110 hover:border-glow"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
