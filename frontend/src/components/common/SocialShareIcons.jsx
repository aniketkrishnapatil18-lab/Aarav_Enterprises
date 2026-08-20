import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';

// Custom Inline SVG Brand Icons (compliant with theme stroke/fill settings)
const FacebookIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/**
 * SocialShareIcons Component
 * Renders horizontal share icons linking to intent share URLs.
 */
export default function SocialShareIcons() {
  const [shareUrl, setShareUrl] = useState('');
  const [title, setTitle] = useState('Aarav Enterprises — Premium Signage & Printing Services in Pune');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
      setTitle(document.title);
    }
  }, []);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'X (Twitter)',
      icon: TwitterIcon,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: Share2,
      color: '#25D366',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ': ' + shareUrl)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>
        Share Aarav Enterprises
      </div>
      <div className="flex gap-3">
        {shareLinks.map(({ name, icon: Icon, color, url }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${name}`}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border"
            style={{
              background: 'var(--bg-subtle)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = color;
              e.currentTarget.style.color = color;
              e.currentTarget.style.boxShadow = `0 0 10px ${color}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
  );
}
