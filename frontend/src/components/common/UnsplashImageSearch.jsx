import { useState, useEffect, useRef } from 'react';
import { unsplashAPI } from '../../services/api';
import { Search, Loader2, Image as ImageIcon, ExternalLink, CheckCircle } from 'lucide-react';

export default function UnsplashImageSearch({ initialQuery = '', onSelect, onClose }) {
  const [query, setQuery] = useState(initialQuery);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Debounce ref
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery, 1);
    }
    return () => clearTimeout(timeoutRef.current);
  }, []); // eslint-disable-line

  useEffect(() => {
    // Debounce auto-search
    if (query && query !== initialQuery) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        handleSearch(query, 1);
      }, 700);
    }
  }, [query]);

  const handleSearch = async (searchQuery, targetPage = 1) => {
    if (!searchQuery.trim()) return;
    
    if (targetPage === 1) {
      setLoading(true);
      setImages([]);
    } else {
      setLoadingMore(true);
    }
    
    setError(null);

    try {
      const res = await unsplashAPI.search({ query: searchQuery, page: targetPage, per_page: 20 });
      const newImages = res.data.data;
      
      if (targetPage === 1) {
        setImages(newImages);
      } else {
        setImages(prev => [...prev, ...newImages]);
      }
      
      setHasMore(targetPage < res.data.totalPages);
      setPage(targetPage);
    } catch (err) {
      console.error('Unsplash error:', err);
      setError(err.response?.data?.message || 'Unable to load images right now. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      handleSearch(query, page + 1);
    }
  };

  const handleSelect = (img) => {
    setSelectedId(img.id);
    if (onSelect) onSelect(img);
  };

  return (
    <div className="unsplash-search-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 400 }}>
      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search images (e.g. 'professional modern office')" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query, 1)}
          />
        </div>
        <button className="btn-primary" onClick={() => handleSearch(query, 1)} disabled={loading}>
          {loading ? <Loader2 size={18} className="spin" /> : 'Search'}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, color: '#A78BFA' }}>
          <Loader2 size={32} className="spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && images.length === 0 && query && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#64748B' }}>
          <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>No results found for "{query}"</p>
        </div>
      )}

      {!loading && !error && images.length === 0 && !query && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#64748B' }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p>Type to search Unsplash images...</p>
        </div>
      )}

      {/* Grid */}
      {!loading && images.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {images.map(img => (
              <div 
                key={img.id} 
                onClick={() => handleSelect(img)}
                style={{ 
                  borderRadius: '0.75rem', 
                  overflow: 'hidden', 
                  cursor: 'pointer', 
                  border: selectedId === img.id ? '2px solid #A78BFA' : '2px solid transparent',
                  position: 'relative',
                  backgroundColor: '#1A1033',
                  aspectRatio: '4/3'
                }}
              >
                <img 
                  src={img.thumbnailUrl} 
                  alt={img.alt} 
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selectedId === img.id ? 0.8 : 1 }} 
                />
                
                {/* Checkmark overlay for selection */}
                {selectedId === img.id && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(167, 139, 250, 0.2)' }}>
                    <CheckCircle size={32} color="#A78BFA" />
                  </div>
                )}

                {/* Attribution Overlay */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    bottom: 0, left: 0, right: 0, 
                    padding: '0.5rem', 
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    fontSize: '0.7rem',
                    color: '#FFF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onClick={e => e.stopPropagation()} // Prevent selecting when clicking attribution
                >
                  <a 
                    href={img.photographerUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#E2E8F0', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}
                  >
                    {img.photographerName}
                  </a>
                  <a href={img.unsplashUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8', display: 'flex' }} title="View on Unsplash">
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0 1rem 0' }}>
              <button className="btn-secondary" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? <Loader2 size={16} className="spin" /> : 'Load More'}
              </button>
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#64748B' }}>
            Photos provided by <a href="https://unsplash.com/?utm_source=aarav_enterprises&utm_medium=referral" target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}>Unsplash</a>
          </div>
        </div>
      )}
    </div>
  );
}
