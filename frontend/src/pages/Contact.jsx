import { useEffect } from 'react';
import { MessageCircle, Phone, Mail, MapPin, Clock, Navigation } from 'lucide-react';
import { openWhatsApp } from '../utils/helpers';
import EnquiryForm from '../components/common/EnquiryForm';
import SocialShareIcons from '../components/common/SocialShareIcons';

/**
 * Contact Page Component
 * Renders contact details and integrated inline enquiry form.
 * Full support for both light and dark themes using CSS design tokens.
 */
export default function Contact() {
  useEffect(() => {
    document.title = 'Contact Us — Aarav Enterprises';
  }, []);

  const contactDetails = [
    {
      icon: MessageCircle,
      color: '#25D366',
      label: 'WhatsApp Line',
      value: '+91 9763530208',
      action: () => openWhatsApp('Hi! I need help with graphic design or signage requirements.')
    },
    {
      icon: Phone,
      color: 'var(--brand-violet)',
      label: 'Phone Call',
      value: '+91 9763530208',
      link: 'tel:+919763530208'
    },
    {
      icon: Mail,
      color: 'var(--brand-pink)',
      label: 'Email Address',
      value: 'info@aaraventerprises.com',
      link: 'mailto:info@aaraventerprises.com'
    },
    {
      icon: MapPin,
      color: 'var(--brand-amber)',
      label: 'Our Location',
      value: 'Survey No 659/16, Beside Jagtap Dairy, Bibwewadi, Pune 411037',
      directions: 'https://maps.google.com/?q=Survey+No+659%2F16%2C+Beside+Jagtap+Dairy%2C+Bibwewadi%2C+Pune+411037'
    },
    {
      icon: Clock,
      color: 'var(--brand-emerald)',
      label: 'Business Hours',
      value: 'Monday – Saturday: 10 AM – 7 PM'
    }
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Header Banner */}
      <div 
        style={{ 
          padding: '4.5rem 1.5rem', 
          background: 'var(--bg-surface)', 
          textAlign: 'center',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div className="container">
          <h1 className="section-title">Get in <span className="gradient-text">Touch</span></h1>
          <p className="section-subtitle">
            Have a project in mind? Submit an enquiry or chat with us on WhatsApp. Our AI assistant responds 24/7.
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="container section">
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left Column: Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-outfit" style={{ color: 'var(--text-main)' }}>
              Contact <span className="gradient-text">Information</span>
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Aarav Enterprises provides professional acrylic sign boards, LED letters, UV printing, and custom graphic design solutions in Pune and surrounding regions.
            </p>

            <div className="flex flex-col gap-4">
              {contactDetails.map((detail, index) => {
                const Icon = detail.icon;
                const isClickable = detail.action || detail.link || detail.directions;
                
                // Wrap click handlers
                const handleClick = () => {
                  if (detail.action) detail.action();
                  else if (detail.link) window.location.href = detail.link;
                  else if (detail.directions) window.open(detail.directions, '_blank');
                };

                return (
                  <div 
                    key={index} 
                    className={`glass-card p-4 flex gap-4 items-start ${isClickable ? 'cursor-pointer hover:border-glow transition-all duration-300' : ''}`}
                    onClick={isClickable ? handleClick : undefined}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
                  >
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${detail.color}22` }}
                    >
                      <Icon size={20} style={{ color: detail.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                        {detail.label}
                      </div>
                      <div className="font-semibold text-sm mt-0.5 break-words" style={{ color: 'var(--text-main)' }}>
                        {detail.value}
                      </div>
                      {detail.directions && (
                        <button
                          className="mt-2 text-xs flex items-center gap-1 font-bold transition-all duration-200"
                          style={{ color: 'var(--brand-violet)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(detail.directions, '_blank');
                          }}
                        >
                          <Navigation size={12} /> Get Directions
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Share Buttons */}
            <div className="pt-2">
              <SocialShareIcons />
            </div>
          </div>

          {/* Right Column: Inline Enquiry Form */}
          <div>
            <EnquiryForm inline={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
