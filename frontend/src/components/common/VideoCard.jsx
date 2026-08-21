import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

export default function VideoCard({ video, onOpen }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="glass-card"
            style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail Container */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#000',
                    cursor: 'pointer',
                    overflow: 'hidden'
                }}
                onClick={() => onOpen(video)}
            >
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                    }}
                />
                {/* Play Icon Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isHovered ? 1 : 0.7,
                    transition: 'all 0.2s ease',
                }}>
                    <PlayCircle
                        size={48}
                        color="#fff"
                        style={{
                            transition: 'transform 0.2s ease',
                            transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.1rem',
                    color: 'var(--text-main)',
                    fontFamily: 'Outfit',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {video.title}
                </h3>

                {video.description && (
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {video.description}
                    </p>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <button
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen(video);
                        }}
                    >
                        Watch Video
                    </button>
                </div>
            </div>
        </div>
    );
}
