import { useState, useEffect } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { inquiryAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * EnquiryForm Component
 * A reusable form for submitting signage/printing quotes and inquiries.
 * Can be rendered inline (e.g. on Contact page) or inside a modal.
 * 
 * @param {Object} props
 * @param {Object} props.productContext - Active product/service context { id, name }.
 * @param {Function} props.onSuccess - Callback triggered on successful submission.
 * @param {boolean} props.inline - If true, styles form for integration in page columns.
 */
export default function EnquiryForm({ productContext = null, onSuccess = null, inline = false }) {
  const [salutation, setSalutation] = useState('Mr');
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [errors, setErrors] = useState({});

  // Update initial requirements if product context changes
  useEffect(() => {
    if (productContext) {
      setRequirements(`Hi, I am interested in your "${productContext.name}" service. Please share details and pricing.`);
    } else {
      setRequirements('');
    }
  }, [productContext]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'Mobile number is required.';
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      newErrors.whatsappNumber = 'Please enter a valid 10-15 digit mobile number.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!requirements.trim()) {
      newErrors.requirements = 'Requirements description is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    
    try {
      const payload = {
        salutation,
        name,
        whatsapp_number: whatsappNumber.replace(/\D/g, ''),
        email,
        requirements,
        product_id: productContext?.id || null,
        service_name: productContext?.name || null
      };

      await inquiryAPI.submitPublic(payload);
      setSuccess(true);
      toast.success('Quote request submitted successfully!');
      
      // Reset fields
      setName('');
      setWhatsappNumber('');
      setEmail('');
      setRequirements('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to submit enquiry. Please try again.';
      toast.error(errMsg);
      setErrors({ api: errMsg });
    } finally {
      setLoading(false);
    }
  };

  if (success && inline) {
    return (
      <div 
        className="glass-card text-center py-10 px-6 flex flex-col items-center justify-center h-full transition-all duration-300"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(5, 150, 105, 0.1)' }}
        >
          <CheckCircle2 size={36} color="var(--brand-emerald)" />
        </div>
        <h3 className="text-xl font-bold font-outfit mb-2" style={{ color: 'var(--text-main)' }}>
          Enquiry Submitted!
        </h3>
        <p className="text-sm max-w-sm" style={{ color: 'var(--text-muted)' }}>
          Thank you for choosing Aarav Enterprises. Our team will review your requirements and reach out to you on WhatsApp.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 btn-secondary text-xs py-2 px-4"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div 
      className={inline ? "glass-card p-6" : ""} 
      style={inline ? { background: 'var(--bg-card)', border: '1px solid var(--border-light)' } : {}}
    >
      {inline && (
        <div className="mb-6">
          <h3 className="text-lg font-bold font-outfit mb-1" style={{ color: 'var(--text-main)' }}>
            Send an Online Enquiry
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>
            Fill in your layout specifications below to receive an instant callback and design quotation.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Salutation selection */}
        <div>
          <label className="form-label">Salutation</label>
          <div className="flex gap-4 mt-1.5">
            {['Mr', 'Ms', 'Mrs', 'Dr'].map((sal) => (
              <label key={sal} className="inline-flex items-center gap-1.5 cursor-pointer text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                <input
                  type="radio"
                  name={`salutation-${inline ? 'inline' : 'modal'}`}
                  value={sal}
                  checked={salutation === sal}
                  onChange={(e) => setSalutation(e.target.value)}
                  className="accent-[var(--brand-violet)] cursor-pointer"
                />
                <span>{sal}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor={`name-${inline ? 'inline' : 'modal'}`} className="form-label">Full Name</label>
          <input
            id={`name-${inline ? 'inline' : 'modal'}`}
            type="text"
            className="form-input"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ borderColor: errors.name ? 'var(--brand-pink)' : '' }}
          />
          {errors.name && <p className="text-xs mt-1" style={{ color: 'var(--brand-pink)' }}>{errors.name}</p>}
        </div>

        {/* WhatsApp Mobile Number */}
        <div>
          <label htmlFor={`phone-${inline ? 'inline' : 'modal'}`} className="form-label">WhatsApp Number</label>
          <input
            id={`phone-${inline ? 'inline' : 'modal'}`}
            type="tel"
            className="form-input"
            placeholder="e.g. 9763530208"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            style={{ borderColor: errors.whatsappNumber ? 'var(--brand-pink)' : '' }}
          />
          {errors.whatsappNumber && <p className="text-xs mt-1" style={{ color: 'var(--brand-pink)' }}>{errors.whatsappNumber}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor={`email-${inline ? 'inline' : 'modal'}`} className="form-label">Email Address</label>
          <input
            id={`email-${inline ? 'inline' : 'modal'}`}
            type="email"
            className="form-input"
            placeholder="e.g. name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderColor: errors.email ? 'var(--brand-pink)' : '' }}
          />
          {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--brand-pink)' }}>{errors.email}</p>}
        </div>

        {/* Requirements */}
        <div>
          <label htmlFor={`req-${inline ? 'inline' : 'modal'}`} className="form-label">Requirements</label>
          <textarea
            id={`req-${inline ? 'inline' : 'modal'}`}
            rows={inline ? 5 : 4}
            className="form-input"
            placeholder="Describe your design specifications, dimensions, quantity, or timelines..."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            style={{ 
              borderColor: errors.requirements ? 'var(--brand-pink)' : '',
              resize: 'none'
            }}
          />
          {errors.requirements && <p className="text-xs mt-1" style={{ color: 'var(--brand-pink)' }}>{errors.requirements}</p>}
        </div>

        {/* Error State */}
        {errors.api && (
          <p className="text-sm p-3 rounded-lg text-center" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            {errors.api}
          </p>
        )}

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 mt-2"
          style={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send size={16} /> Submit Request
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
