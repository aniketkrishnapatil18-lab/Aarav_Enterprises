import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MessageCircle, User, CheckCircle2, Clock, AlertCircle,
  FileText, Sparkles, Layers, Image as ImageIcon, Send, Upload,
  Printer, Check, ArrowRight, RefreshCw, XCircle, Phone, Calendar,
  Palette, IndianRupee, ShieldCheck, ChevronRight, Zap
} from 'lucide-react';
import { inquiryAPI } from '../../services/api';
import { getStatusConfig, formatDate, timeAgo, getLanguageLabel, openWhatsApp } from '../../utils/helpers';
import toast from 'react-hot-toast';

// 5-Stage Core Sequential Workflow
const WORKFLOW_STAGES = [
  {
    key: 'ADMIN_REVIEW',
    label: 'Admin Review',
    shortLabel: 'Review',
    desc: 'Requirements under review',
    color: '#F59E0B',
    next: 'ACCEPTED',
    nextLabel: 'Accept & Approve Quote',
  },
  {
    key: 'ACCEPTED',
    label: 'Quote Accepted',
    shortLabel: 'Accepted',
    desc: 'Job confirmed with client',
    color: '#3B82F6',
    next: 'IN_PROGRESS',
    nextLabel: 'Start Production / Design',
  },
  {
    key: 'IN_PROGRESS',
    label: 'In Production',
    shortLabel: 'In Progress',
    desc: 'Design & fabrication active',
    color: '#8B5CF6',
    next: 'DESIGN_READY',
    nextLabel: 'Mark Design Proof Ready',
  },
  {
    key: 'DESIGN_READY',
    label: 'Proof Ready',
    shortLabel: 'Proof Ready',
    desc: 'Sent for client sign-off',
    color: '#06B6D4',
    next: 'COMPLETED',
    nextLabel: 'Complete & Mark Delivered',
  },
  {
    key: 'COMPLETED',
    label: 'Fulfilled & Delivered',
    shortLabel: 'Completed',
    desc: 'Order dispatched to client',
    color: '#10B981',
    next: null,
    nextLabel: null,
  },
];

// Helper to find stage index
function getStageIndex(status) {
  if (status === 'NEW') return 0;
  if (status === 'CUSTOMER_REVIEW' || status === 'REVISION') return 3;
  const idx = WORKFLOW_STAGES.findIndex(s => s.key === status);
  return idx >= 0 ? idx : 0;
}

export default function AdminInquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    document.title = 'Inquiry & Order Details — Admin';
    load();
  }, [id]);

  async function load() {
    try {
      const res = await inquiryAPI.detail(id);
      setInquiry(res.data.data);
    } catch {
      toast.error('Failed to load inquiry details.');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus) {
    setUpdating(true);
    try {
      await inquiryAPI.updateStatus(id, { status: newStatus, note: note || null });
      toast.success(`Workflow advanced to: ${newStatus.replace(/_/g, ' ')}`);
      setNote('');
      setShowStatusDropdown(false);
      await load();
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  }

  async function addNote() {
    if (!note.trim()) {
      toast.error('Please write a note message first.');
      return;
    }
    setUpdating(true);
    try {
      await inquiryAPI.addNote(id, { message: note });
      toast.success('Activity note logged.');
      setNote('');
      load();
    } catch {
      toast.error('Failed to add note.');
    } finally {
      setUpdating(false);
    }
  }

  async function uploadFinalDesign() {
    if (!designFile) return;
    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append('image', designFile);
      await inquiryAPI.uploadDesign(id, fd);
      toast.success('Final design proof attached successfully!');
      setDesignFile(null);
      setDesignPreview(null);
      load();
    } catch {
      toast.error('Failed to upload design');
    } finally {
      setUpdating(false);
    }
  }

  async function publishToPortfolio() {
    setUpdating(true);
    try {
      await inquiryAPI.publish(id);
      toast.success('🚀 Published to Public Portfolio Showcase!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="skeleton" style={{ height: 40, width: 280, borderRadius: 8, marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
          <div className="skeleton" style={{ height: 450, borderRadius: '1rem' }} />
          <div className="skeleton" style={{ height: 450, borderRadius: '1rem' }} />
        </div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertCircle size={40} color="#EF4444" style={{ marginBottom: '1rem' }} />
        <h2>Inquiry Not Found</h2>
        <p style={{ color: 'var(--text-subtle)', marginBottom: '1.5rem' }}>The requested inquiry does not exist or was removed.</p>
        <button onClick={() => navigate('/admin/inquiries')} className="btn-primary">Back to Inquiries</button>
      </div>
    );
  }

  const currentStatus = inquiry.status;
  const isCancelled = currentStatus === 'CANCELLED';
  const stageIdx = getStageIndex(currentStatus);
  const currentStage = WORKFLOW_STAGES[stageIdx];
  const nextStageKey = currentStage?.next;
  const nextStageObj = WORKFLOW_STAGES.find(s => s.key === nextStageKey);

  const st = getStatusConfig(currentStatus);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: '4rem' }}>
      {/* ── Top Navigation Bar ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/admin/inquiries')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 8,
              fontWeight: 600,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ArrowLeft size={16} /> Inquiries
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', letterSpacing: '-0.02em', margin: 0 }}>
                {inquiry.inquiry_number}
              </h1>
              <span className={`badge ${st.className}`} style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                {st.label}
              </span>
              {inquiry.priority === 'URGENT' && (
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: 999, background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  URGENT
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: 2 }}>
              Submitted {timeAgo(inquiry.created_at)} · {inquiry.customer_name || 'Client'}
            </div>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => openWhatsApp(`Hello ${inquiry.customer_name || ''}, regarding your ${inquiry.service_name || 'signage/design'} order (${inquiry.inquiry_number}).`, null)}
            className="btn-whatsapp"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
          >
            <MessageCircle size={16} /> WhatsApp Customer
          </button>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
            title="Print Job Specification Sheet"
          >
            <Printer size={15} /> Job Sheet
          </button>
        </div>
      </div>

      {/* ── 1. Animated Workflow Pipeline Card ── */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isCancelled ? '#EF4444' : currentStage?.color || 'var(--brand-violet)', boxShadow: `0 0 10px ${currentStage?.color}` }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit', margin: 0 }}>
                Order Workflow Pipeline
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: 2 }}>
              {isCancelled ? 'This order was cancelled.' : currentStage?.desc}
            </p>
          </div>

          {/* Advance Step / Next Action Button */}
          {!isCancelled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {nextStageObj ? (
                <button
                  onClick={() => updateStatus(nextStageKey)}
                  disabled={updating}
                  className="btn-primary"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.55rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--grad-primary)',
                    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)',
                    cursor: 'pointer',
                  }}
                >
                  <Zap size={15} />
                  {updating ? 'Updating...' : currentStage?.nextLabel || `Advance to ${nextStageObj.shortLabel}`}
                  <ArrowRight size={15} />
                </button>
              ) : (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 1rem',
                  borderRadius: 999,
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}>
                  <CheckCircle2 size={16} /> Order Completed & Fulfilled
                </div>
              )}

              {/* Stage selector dropdown button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.55rem 0.85rem' }}
                >
                  Change Stage ▾
                </button>

                {showStatusDropdown && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 10,
                    padding: '0.5rem',
                    minWidth: 200,
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}>
                    {WORKFLOW_STAGES.map(stg => (
                      <button
                        key={stg.key}
                        onClick={() => updateStatus(stg.key)}
                        disabled={updating || currentStatus === stg.key}
                        style={{
                          border: 'none',
                          background: currentStatus === stg.key ? 'var(--bg-subtle)' : 'transparent',
                          color: currentStatus === stg.key ? stg.color : 'var(--text-main)',
                          fontWeight: currentStatus === stg.key ? 700 : 500,
                          fontSize: '0.8rem',
                          padding: '0.45rem 0.75rem',
                          borderRadius: 6,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        className="table-row-hover"
                      >
                        {stg.label}
                        {currentStatus === stg.key && <Check size={14} color={stg.color} />}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-light)', margin: '0.25rem 0' }} />
                    <button
                      onClick={() => updateStatus('REVISION')}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#F87171',
                        fontSize: '0.8rem',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 6,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      className="table-row-hover"
                    >
                      Request Revision
                    </button>
                    <button
                      onClick={() => updateStatus('CANCELLED')}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#9CA3AF',
                        fontSize: '0.8rem',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 6,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      className="table-row-hover"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Progress Track */}
        <div style={{ position: 'relative', padding: '1rem 0 0.5rem' }}>
          {/* Track Bar Background */}
          <div style={{
            position: 'absolute',
            top: 28,
            left: '5%',
            right: '5%',
            height: 4,
            background: 'var(--border-light)',
            borderRadius: 999,
            zIndex: 1,
          }}>
            {/* Animated Filled Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stageIdx / (WORKFLOW_STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 50%, #10B981 100%)',
                borderRadius: 999,
                boxShadow: '0 0 10px rgba(124, 58, 237, 0.4)',
              }}
            />
          </div>

          {/* Stepper Nodes */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 2,
          }}>
            {WORKFLOW_STAGES.map((stage, idx) => {
              const isPast = idx < stageIdx;
              const isCurrent = idx === stageIdx && !isCancelled;
              const isFuture = idx > stageIdx;

              return (
                <div
                  key={stage.key}
                  onClick={() => !updating && updateStatus(stage.key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: 80,
                    textAlign: 'center',
                  }}
                >
                  {/* Step Circle Node */}
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={isCurrent ? { repeat: Infinity, duration: 2.5 } : {}}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: isPast
                        ? '#10B981'
                        : isCurrent
                        ? stage.color
                        : 'var(--bg-surface)',
                      border: isPast || isCurrent ? `2px solid ${stage.color}` : '2px solid var(--border-light)',
                      color: isPast || isCurrent ? '#FFFFFF' : 'var(--text-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      boxShadow: isCurrent ? `0 0 16px ${stage.color}60` : isPast ? '0 0 8px rgba(16, 185, 129, 0.3)' : 'none',
                      transition: 'all 0.3s ease',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {isPast ? <Check size={18} /> : idx + 1}
                  </motion.div>

                  {/* Step Label */}
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: isCurrent ? 800 : isPast ? 700 : 500,
                    color: isCurrent ? stage.color : isPast ? 'var(--text-main)' : 'var(--text-subtle)',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                  }}>
                    {stage.shortLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2-Column Main Content & Side Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Job Specifications & Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Customer & Job Specifications */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <User size={18} color="var(--brand-violet)" /> Client & Job Specifications
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-subtle)', background: 'var(--bg-subtle)', padding: '0.2rem 0.6rem', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                Lang: {getLanguageLabel(inquiry.language)}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Client Name</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{inquiry.customer_name || '—'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>WhatsApp Contact</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-violet)' }}>{inquiry.whatsapp_number}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Requested Service</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{inquiry.service_name || inquiry.product_name || 'Signage / Design'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Budget / Estimated Cost</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10B981', fontFamily: 'Outfit' }}>{inquiry.budget || '₹14,500 onwards'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Business / Brand Name</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{inquiry.business_name || 'Individual / Retail'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Delivery Deadline</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{inquiry.deadline ? formatDate(inquiry.deadline) : 'Standard 3–5 Days'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Color / Material Preferences</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{inquiry.preferred_colors || 'Gold & Acrylic Blue'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>Dimensions & Quantity</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{inquiry.quantity ? `${inquiry.quantity} Units` : '4x3 ft illuminated letter board'}</div>
              </div>
            </div>

            {inquiry.requirements && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Full Customer Requirements & Details
                </div>
                <div style={{
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  color: 'var(--text-main)',
                  lineHeight: 1.6,
                  border: '1px solid var(--border-light)'
                }}>
                  {inquiry.requirements}
                </div>
              </div>
            )}
          </div>

          {/* AI Extraction & Conversation Summary */}
          {inquiry.ai_summary && (
            <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(124, 58, 237, 0.35)', background: 'rgba(124, 58, 237, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Sparkles size={18} color="var(--brand-violet)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-violet)', fontFamily: 'Outfit', margin: 0 }}>
                  AI Requirement Extraction
                </h3>
              </div>
              <p style={{ color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.875rem', margin: 0 }}>
                {inquiry.ai_summary}
              </p>
            </div>
          )}

          {/* Activity Ledger & Notes Timeline */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Activity History & Workshop Notes
            </h3>

            {(inquiry.messages || []).length === 0 ? (
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>
                No activity notes logged yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 280, overflowY: 'auto', marginBottom: '1.25rem' }}>
                {(inquiry.messages || []).map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-subtle)',
                      borderRadius: 8,
                      borderLeft: `3px solid ${msg.sender === 'admin' ? 'var(--brand-violet)' : msg.sender === 'system' ? '#3B82F6' : '#25D366'}`,
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'capitalize' }}>
                        {msg.sender === 'admin' ? (msg.admin_name || 'Admin Note') : msg.sender === 'ai' ? '🤖 Gemini AI Bot' : msg.sender}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Note Composer */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                className="form-input"
                placeholder="Log internal note (e.g. Sent proof on WhatsApp, Acrylic cut completed)..."
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
                style={{ flex: 1, fontSize: '0.85rem' }}
              />
              <button
                onClick={addNote}
                disabled={updating}
                className="btn-primary"
                style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Send size={14} /> Log Note
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Final Proof / Assets & Job Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Final Design Proof & Portfolio Showcase Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <ImageIcon size={18} color="var(--brand-violet)" /> Final Design Proof
              </h3>
              {inquiry.final_design_url && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '0.15rem 0.5rem', borderRadius: 999 }}>
                  Attached
                </span>
              )}
            </div>

            {inquiry.final_design_url ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <img
                    src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') + inquiry.final_design_url : `http://localhost:5000${inquiry.final_design_url}`}
                    alt="Final Design Proof"
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {inquiry.status === 'COMPLETED' ? (
                  inquiry.is_published ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem',
                      borderRadius: 8,
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      <CheckCircle2 size={16} /> Live on Public Portfolio
                    </div>
                  ) : (
                    <button
                      onClick={publishToPortfolio}
                      disabled={updating}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', padding: '0.65rem' }}
                    >
                      🚀 Showcase on Public Portfolio
                    </button>
                  )
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
                    Complete this order to publish it to your website portfolio.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{
                  border: '2px dashed var(--border-light)',
                  borderRadius: 10,
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  background: 'var(--bg-subtle)'
                }}>
                  <Upload size={24} color="var(--brand-violet)" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>
                    Upload High-Res Design / Photo
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '0.75rem' }}>
                    PNG, JPG, or PDF proof from workshop
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      setDesignFile(e.target.files[0]);
                      if (e.target.files[0]) {
                        setDesignPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    style={{ fontSize: '0.8rem', width: '100%' }}
                  />
                </div>

                {designFile && (
                  <button
                    onClick={uploadFinalDesign}
                    disabled={updating}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Save & Attach Proof
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Contact & Billing Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Order & Dispatch Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Invoice Number</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-violet)' }}>INV-2026-089</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Payment Status</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>Paid (₹14,500)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Created Date</span>
                <span style={{ color: 'var(--text-main)' }}>{formatDate(inquiry.created_at)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)' }}>Last Workflow Update</span>
                <span style={{ color: 'var(--text-main)' }}>{timeAgo(inquiry.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
