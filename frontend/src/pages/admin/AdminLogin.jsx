import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please enter email and password.'); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      localStorage.setItem('ae_token', res.data.token);
      localStorage.setItem('ae_admin', JSON.stringify(res.data.admin));
      toast.success('Welcome back!');
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--brand-dark)', padding: '2rem',
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
      </div>
      <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '2.5rem', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: 'white' }}>A</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Admin Login</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Aarav Enterprises Management Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="email"
                className="form-input"
                placeholder="admin@aaraventerprises.com"
                style={{ paddingLeft: '2.5rem' }}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.9rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          Default: admin@aaraventerprises.com / Admin@123
        </p>
      </div>
    </div>
  );
}
