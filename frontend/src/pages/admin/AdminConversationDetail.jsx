import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Send, User, Bot, CheckCircle, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { conversationAPI } from '../../services/api';
import { timeAgo, getLanguageLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminConversationDetail() {
  const { id } = useParams();
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [reply, setReply]           = useState('');
  const [sending, setSending]       = useState(false);

  useEffect(() => {
    document.title = `Conversation #${id} — Admin`;
    load();
  }, [id]);

  async function load() {
    try {
      const res = await conversationAPI.get(id);
      setData(res.data.data || res.data);
    } catch (err) {
      toast.error('Failed to load conversation details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      await conversationAPI.sendMessage(id, { content: reply });
      toast.success('Message sent via WhatsApp!');
      setReply('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send WhatsApp message');
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      await conversationAPI.updateStatus(id, { status: newStatus });
      toast.success(`Conversation updated to ${newStatus}`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  }

  if (loading) return (
    <div style={{ padding: '2rem' }}>
      <div className="skeleton" style={{ height: 40, width: 200, marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: 500, borderRadius: '1rem' }} />
    </div>
  );

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-subtle)' }}>
      <p>Conversation not found.</p>
      <Link to="/admin/conversations" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>Back to Conversations</Link>
    </div>
  );

  const conv     = data.conversation || data;
  const messages = data.messages || conv.messages || [];

  return (
    <div>
      {/* Header & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/admin/conversations" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '0.75rem', background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              {conv.customer_name || 'Customer'} <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', fontWeight: 500 }}>({conv.whatsapp_number})</span>
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              <span>Language: <strong>{getLanguageLabel(conv.language)}</strong></span>
              <span>•</span>
              <span>Updated {timeAgo(conv.last_message_at)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={load} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
            <RefreshCw size={15} /> Refresh
          </button>
          {conv.status === 'human_handoff' ? (
            <button onClick={() => handleStatusChange('active')} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', color: '#10B981', borderColor: 'rgba(16,185,129,0.3)' }}>
              <CheckCircle size={15} /> Return to AI
            </button>
          ) : (
            <button onClick={() => handleStatusChange('human_handoff')} className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}>
              <AlertTriangle size={15} /> Take Over (Human Handoff)
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '600px', overflow: 'hidden' }}>
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-card)' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-subtle)' }}>
              <p>No messages recorded yet.</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isCustomer = m.sender === 'customer';
              return (
                <div key={m.id || idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isCustomer ? 'flex-start' : 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {isCustomer ? <User size={13} /> : <Bot size={13} color="var(--brand-violet)" />}
                    <span>{isCustomer ? (conv.customer_name || 'Customer') : m.sender === 'admin' ? 'Admin (You)' : 'AI Assistant'}</span>
                    <span>•</span>
                    <span>{timeAgo(m.sent_at)}</span>
                  </div>
                  <div style={{
                    maxWidth: '75%',
                    padding: '0.85rem 1.15rem',
                    borderRadius: isCustomer ? '1.25rem 1.25rem 1.25rem 0.2rem' : '1.25rem 1.25rem 0.2rem 1.25rem',
                    background: isCustomer ? 'var(--bg-subtle)' : 'linear-gradient(135deg, var(--brand-violet), #6366F1)',
                    color: isCustomer ? 'var(--text-main)' : '#FFFFFF',
                    border: isCustomer ? '1px solid var(--border-light)' : 'none',
                    fontSize: '0.92rem',
                    lineHeight: 1.55,
                    boxShadow: isCustomer ? 'none' : '0 4px 15px rgba(124,58,237,0.3)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reply Send Form */}
        <form onSubmit={handleSendReply} style={{ padding: '1rem 1.5rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Type your WhatsApp message..."
            value={reply}
            onChange={e => setReply(e.target.value)}
            className="form-input"
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={sending} className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>
            <Send size={16} /> {sending ? 'Sending...' : 'Send WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
