import { useState, useEffect, useRef } from 'react';
import { openWhatsApp, buildWhatsAppUrl, getLanguageLabel } from '../../utils/helpers';
import { MessageCircle, Sparkles, Send, X, Bot, User, Phone, CheckCircle, ExternalLink } from 'lucide-react';
import { conversationAPI } from '../../services/api';
import toast from 'react-hot-toast';

function extractCleanText(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    if (val.message) return extractCleanText(val.message);
    if (val.text) return extractCleanText(val.text);
    return '';
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('{') && (trimmed.endsWith('}') || trimmed.includes('"message"'))) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.message) return extractCleanText(parsed.message);
        if (parsed.text) return extractCleanText(parsed.text);
      } catch (e) {}
    }
    return val;
  }
  return String(val);
}

export default function WhatsAppFloat() {
  const [open, setOpen]               = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages]       = useState([
    { sender: 'ai', content: 'Hello! 👋 Welcome to Aarav Enterprises. How can I help you with your graphic design or printing requirements today?', time: 'Just now' }
  ]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [language, setLanguage]       = useState('en');
  const chatEndRef                    = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    const newMsg = { sender: 'customer', content: userText, time: 'Just now' };
    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      // Send message to public website AI endpoint
      const res = await fetch('/api/whatsapp/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '919763530208',
          name:  'Website Visitor',
          content: userText,
        }),
      });
      const data = await res.json();
      let rawVal = data.message || data.data?.aiMessage || data.data?.message;
      let aiReply = extractCleanText(rawVal);

      if (aiReply) {
        setMessages(prev => [...prev, { sender: 'ai', content: aiReply, time: 'Just now' }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', content: 'Thank you! How else can I help you today?', time: 'Just now' }]);
      }
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', content: 'Thank you for reaching out! You can also chat directly on WhatsApp.', time: 'Just now' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 25, right: 25, zIndex: 9999 }}>
      {/* Floating Chat Modal Popup */}
      {open && (
        <div style={{
          width: 360, height: 500, borderRadius: '1.25rem',
          background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', marginBottom: 15, animation: 'fadeInUp 0.3s ease',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            padding: '1rem 1.25rem', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Outfit' }}>Aarav Enterprises AI</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} /> 24/7 Multilingual AI
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', opacity: 0.8, padding: 4 }}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'var(--bg-card)' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'customer' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '0.75rem 1rem', borderRadius: m.sender === 'customer' ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                  background: m.sender === 'customer' ? 'var(--brand-violet)' : 'var(--bg-subtle)',
                  color: m.sender === 'customer' ? '#FFFFFF' : 'var(--text-main)',
                  fontSize: '0.875rem', lineHeight: 1.5, border: m.sender === 'customer' ? 'none' : '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)', whiteSpace: 'pre-wrap'
                }}>
                  {m.content}
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-subtle)', marginTop: 2 }}>{m.time}</span>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-subtle)', fontSize: '0.8rem', padding: '0.5rem' }}>
                <Bot size={15} color="var(--brand-violet)" /> AI is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Direct WhatsApp Launcher Button Bar */}
          <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Prefer WhatsApp App?</span>
            <button onClick={() => openWhatsApp()} style={{ background: 'transparent', border: 'none', color: '#25D366', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Open WhatsApp <ExternalLink size={12} />
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Ask prices, services..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem' }}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-whatsapp" style={{ padding: '0.55rem 0.85rem', borderRadius: '0.6rem' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="whatsapp-float-container" style={{ position: 'relative' }}>
        {showTooltip && !open && (
          <div className="whatsapp-tooltip" onClick={() => setOpen(true)}>
            <Sparkles size={14} color="#F59E0B" style={{ display: 'inline', marginRight: 4 }} />
            Chat with AI Assistant <strong>24/7</strong>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="whatsapp-float pulse-animation"
          title="Chat with AI Assistant"
          aria-label="Chat with AI Assistant"
          style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {open ? (
            <X size={26} color="#FFFFFF" />
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
