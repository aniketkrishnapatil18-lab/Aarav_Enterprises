import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { inquiryAPI } from '../../services/api';
import { getStatusConfig, formatDate, getLanguageLabel, openWhatsApp } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_ACTIONS = [
  { status: 'ADMIN_REVIEW',  label: 'Move to Admin Review', color: '#FBBF24' },
  { status: 'ACCEPTED',      label: 'Accept Inquiry',        color: '#4ADE80' },
  { status: 'IN_PROGRESS',   label: 'Mark In Progress',      color: '#818CF8' },
  { status: 'DESIGN_READY',  label: 'Mark Design Ready',     color: '#2DD4BF' },
  { status: 'CUSTOMER_REVIEW', label: 'Customer Review',     color: '#FBBF24' },
  { status: 'REVISION',      label: 'Request Revision',      color: '#F87171' },
  { status: 'COMPLETED',     label: '✅ Mark Completed',     color: '#22C55E' },
  { status: 'CANCELLED',     label: 'Cancel Inquiry',        color: '#9CA3AF' },
];

export default function AdminInquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry,  setInquiry]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [note,     setNote]     = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = 'Inquiry Detail — Admin';
    load();
  }, [id]);

  async function load() {
    try {
      const res = await inquiryAPI.detail(id);
      setInquiry(res.data.data);
    } catch { toast.error('Failed to load inquiry.'); }
    finally { setLoading(false); }
  }

  async function updateStatus(status) {
    setUpdating(true);
    try {
      await inquiryAPI.updateStatus(id, { status, note: note || null });
      toast.success(`Status updated to ${status}`);
      setNote('');
      load();
    } catch { toast.error('Failed to update status.'); }
    finally { setUpdating(false); }
  }

  async function addNote() {
    if (!note.trim()) { toast.error('Note cannot be empty.'); return; }
    setUpdating(true);
    try {
      await inquiryAPI.addNote(id, { message: note });
      toast.success('Note added.');
      setNote('');
      load();
    } catch { toast.error('Failed to add note.'); }
    finally { setUpdating(false); }
  }

  if (loading) return <div className="skeleton" style={{ height: 600, borderRadius: '1rem' }} />;
  if (!inquiry) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-subtle)' }}>Inquiry not found.</div>;

  const st = getStatusConfig(inquiry.status);
  const cd = inquiry.collected_data ? (typeof inquiry.collected_data === 'string' ? JSON.parse(inquiry.collected_data) : inquiry.collected_data) : {};

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ fontSize: '1.25rem', flex: 1 }}>{inquiry.inquiry_number}</h1>
        <span className={`badge ${st.className}`} style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>{st.label}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Customer Info */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--brand-violet)" /> Customer Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Name',          value: inquiry.customer_name || '—' },
                { label: 'WhatsApp',      value: inquiry.whatsapp_number },
                { label: 'Language',      value: getLanguageLabel(inquiry.language) },
                { label: 'Service',       value: inquiry.service_name || inquiry.product_name || '—' },
                { label: 'Business',      value: inquiry.business_name || '—' },
                { label: 'Budget',        value: inquiry.budget || '—' },
                { label: 'Deadline',      value: inquiry.deadline ? formatDate(inquiry.deadline) : '—' },
                { label: 'Colors',        value: inquiry.preferred_colors || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            {inquiry.requirements && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>Requirements</div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>{inquiry.requirements}</p>
              </div>
            )}
          </div>

          {/* AI Summary */}
          {inquiry.ai_summary && (
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(124,58,237,0.3)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--brand-violet)' }}>🤖 AI Summary</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{inquiry.ai_summary}</p>
            </div>
          )}

          {/* Conversation Messages */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Activity & Notes</h3>
            {(inquiry.messages || []).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No messages yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 300, overflowY: 'auto' }}>
                {(inquiry.messages || []).map(msg => (
                  <div key={msg.id} style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 8, borderLeft: `3px solid ${msg.sender === 'admin' ? 'var(--brand-violet)' : msg.sender === 'system' ? 'var(--text-subtle)' : '#25D366'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', textTransform: 'capitalize' }}>{msg.sender === 'admin' ? (msg.admin_name || 'Admin') : msg.sender}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(msg.created_at)}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <input
                className="form-input"
                placeholder="Add a note..."
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={addNote} disabled={updating} className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
                Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Actions */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Update Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {STATUS_ACTIONS.map(action => (
                <button
                  key={action.status}
                  onClick={() => updateStatus(action.status)}
                  disabled={updating || inquiry.status === action.status}
                  style={{
                    padding: '0.6rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
                    border: `1px solid ${action.color}33`, background: `${action.color}11`,
                    color: action.color, cursor: 'pointer', transition: 'all 0.2s',
                    opacity: inquiry.status === action.status ? 0.4 : 1,
                  }}
                >{action.label}</button>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Contact Customer</h3>
            <button
              onClick={() => openWhatsApp(`Hello, regarding your ${inquiry.service_name || 'design'} inquiry (${inquiry.inquiry_number}).`, null)}
              className="btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}
            >
              <MessageCircle size={16} /> WhatsApp Customer
            </button>
          </div>

          {/* Meta */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Details</h3>
            {[
              { label: 'Created', value: formatDate(inquiry.created_at) },
              { label: 'Updated', value: formatDate(inquiry.updated_at) },
              { label: 'Priority', value: inquiry.priority || 'NORMAL' },
              { label: 'Human Handoff', value: inquiry.human_handoff ? '⚠️ Yes' : 'No' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
