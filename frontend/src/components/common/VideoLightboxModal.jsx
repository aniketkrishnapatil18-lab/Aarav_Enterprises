import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function VideoLightboxModal({ video, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        // Trigger entrance animation
        const raf = requestAnimationFrame(() => setIsOpen(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    useEffect(() => {
        // Focus trap and escape key handler
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') handleClose();

            if (e.key === 'Tab') {
                const focusableElements = modalRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video'
                );
                if (focusableElements && focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Prevent scrolling on background
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => onClose(), 200); // Wait for transition to finish
    };

    return (
        <div
            className="video-lightbox-backdrop"
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(5px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.2s ease-out'
            }}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
        >
            <div
                ref={modalRef}
                style={{
                    width: '100%',
                    maxWidth: '900px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 'var(--shadow-xl)',
                    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
                    opacity: isOpen ? 1 : 0,
                    transition: 'all 0.2s ease-out',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid var(--border-light)',
                    background: 'var(--bg-surface)'
                }}>
                    <h3 id="video-modal-title" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>
                        {video?.title}
                    </h3>
                    <button
                        autoFocus
                        onClick={handleClose}
                        className="video-modal-close-btn"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ backgroundColor: '#000', width: '100%', aspectRatio: '16/9', display: 'flex' }}>
                    {video && (
                        <video
                            src={video.videoUrl}
                            controls
                            autoPlay
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            poster={video.thumbnailUrl}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .video-modal-close-btn:hover { background: rgba(255,255,255,0.2) !important; color: var(--error) !important; }
      `}} />
        </div>
    );
}
