import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X, CheckCircle2 } from 'lucide-react';
import { useEnquiryModal } from '../../context/EnquiryModalContext';
import EnquiryForm from './EnquiryForm';
import { useState, useEffect } from 'react';

/**
 * EnquiryFormModal Component
 * Accessible overlay container modal triggered site-wide for quotes.
 * Focus traps using Headless UI Dialog and auto-closes on successful form sends.
 */
export default function EnquiryFormModal() {
  const { isOpen, closeModal, productContext } = useEnquiryModal();
  const [success, setSuccess] = useState(false);

  // Reset success state when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSuccess = () => {
    setSuccess(true);
    // Auto-close modal after 2.5 seconds
    setTimeout(() => {
      closeModal();
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-[9999]">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300" 
        aria-hidden="true" 
      />

      {/* Center content container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel 
          className="mx-auto max-w-md w-full rounded-2xl p-6 shadow-2xl transition-all duration-300 transform scale-100"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {success ? (
            <div className="text-center py-8">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(5, 150, 105, 0.1)' }}
              >
                <CheckCircle2 size={36} color="var(--brand-emerald)" />
              </div>
              <DialogTitle className="text-2xl font-bold font-outfit" style={{ color: 'var(--text-main)' }}>
                Thank You!
              </DialogTitle>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                Your quote request was submitted. We will contact you directly on WhatsApp to finalize your designs.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-0 right-0 p-1.5 rounded-lg border border-transparent transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                style={{ color: 'var(--text-subtle)' }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <DialogTitle className="text-xl font-bold font-outfit mb-1" style={{ color: 'var(--text-main)' }}>
                {productContext ? `Quote for ${productContext.name}` : 'Request a Design Quote'}
              </DialogTitle>
              <p className="text-xs mb-5" style={{ color: 'var(--text-subtle)' }}>
                Fill out the form details below to start your project.
              </p>

              {/* Render the reusable EnquiryForm */}
              <EnquiryForm 
                productContext={productContext} 
                onSuccess={handleSuccess} 
                inline={false} 
              />
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
