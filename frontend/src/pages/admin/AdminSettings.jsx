import { useState, useEffect } from 'react';
import { settingsAPI, authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Settings, Key, Lock, Save } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [pwForm,   setPwForm]   = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    document.title = 'Settings — Admin';
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await settingsAPI.getAdmin();
      setSettings(res.data.data || []);
    } catch { toast.error('Failed to load settings.'); }
    finally { setLoading(false); }
  }

  function handleChange(key_name, val) {
    setSettings(list => list.map(s => s.key_name === key_name ? { ...s, value: val } : s));
  }

  async function handleSaveSettings() {
    setSaving(true);
    try {
      await settingsAPI.update(settings);
      toast.success('Settings saved!');
      load();
    } catch { toast.error('Failed to save settings.'); }
    finally { setSaving(false); }
  }

  async function handleChangePw(e) {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error('Fill in all fields.'); return; }
    try {
      await authAPI.changePassword(pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password.'); }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>System Settings</h1>

      {/* Business & System Settings */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} color="#A78BFA" /> General Configuration
          </h3>
          <button onClick={handleSaveSettings} disabled={saving} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Save size={15} /> Save
          </button>
        </div>

        {loading ? <div className="skeleton" style={{ height: 200 }} /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {settings.map(s => (
              <div key={s.key_name}>
                <label className="form-label">{s.label || s.key_name}</label>
                <input
                  type={s.type === 'secret' ? 'password' : 'text'}
                  className="form-input"
                  value={s.value || ''}
                  placeholder={s.type === 'secret' ? 'Enter secret key' : ''}
                  onChange={e => handleChange(s.key_name, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Admin Password */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={18} color="#EC4899" /> Change Password
        </h3>
        <form onSubmit={handleChangePw}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Current Password</label>
            <input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">New Password (min 8 chars)</label>
            <input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary" style={{ fontSize: '0.875rem' }}>Change Password</button>
        </form>
      </div>
    </div>
  );
}
