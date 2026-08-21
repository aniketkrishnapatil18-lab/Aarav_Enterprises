import { useState, useEffect } from 'react';
import { clientAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Users as UsersIcon } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [form, setForm] = useState(defaultForm());

  function defaultForm() {
    return { name: '', service_provided: '', sort_order: 0, is_active: true };
  }

  useEffect(() => {
    document.title = 'Clients — Admin';
    load();
  }, []);

  async function load() {
    try {
      const res = await clientAPI.list({});
      setClients(res.data.data || []);
    } catch {
      toast.error('Failed to load clients.');
    } finally {
      setLoading(false);
    }
  }

  function openEdit(client) {
    setEditClient(client);
    setForm({
      name: client.name,
      service_provided: client.service_provided || '',
      sort_order: client.sort_order || 0,
      is_active: !!client.is_active,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    
    const fileInput = document.getElementById('client_logo_file');
    if (fileInput?.files?.[0]) {
      fd.append('logo', fileInput.files[0]);
    }

    try {
      if (editClient) {
        await clientAPI.update(editClient.id, fd);
        toast.success('Client updated!');
      } else {
        await clientAPI.create(fd);
        toast.success('Client created!');
      }
      setShowForm(false); 
      setEditClient(null); 
      setForm(defaultForm()); 
      load();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error saving client.'); 
    }
  }

  async function handleToggle(id) {
    try { 
      await clientAPI.toggle(id); 
      load(); 
    } catch { 
      toast.error('Failed to toggle active status.'); 
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this client?')) return;
    try { 
      await clientAPI.remove(id); 
      toast.success('Client deleted.'); 
      load(); 
    } catch { 
      toast.error('Failed to delete.'); 
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Client Management</h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Manage the clients displayed on the public Portfolio page</p>
        </div>
        <button onClick={() => { setEditClient(null); setForm(defaultForm()); setShowForm(true); }} className="btn-primary" style={{ fontSize: '0.875rem' }}>
          <Plus size={16} /> Add Client
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 520, padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{editClient ? 'Edit Client' : 'Add Client'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Client / Company Name *</label>
                <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. TechNova Solutions" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Service Provided</label>
                <input className="form-input" value={form.service_provided} onChange={e => setForm(f => ({ ...f, service_provided: e.target.value }))} placeholder="e.g. Logo & Branding" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Logo Image {editClient ? '(Optional to replace)' : '(Optional - Generates avatar if empty)'}</label>
                <input type="file" id="client_logo_file" accept="image/*" className="form-input" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Sort Order (Lower appears first)</label>
                <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /> Show Publicly (Active)
                </label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          [...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: '1rem' }} />)
        ) : clients.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#64748B' }}>
            <UsersIcon size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No clients added yet.</p>
          </div>
        ) : (
          clients.map(client => (
            <div key={client.id} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', position: 'relative' }}>
              <div style={{ 
                  width: 64, height: 64, margin: '0 auto 1rem auto', borderRadius: '50%', overflow: 'hidden', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)' 
              }}>
                <img
                  src={client.logo_url ? (client.logo_url.startsWith('http') ? client.logo_url : `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : ''}${client.logo_url}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random&color=fff&size=64&bold=true`}
                  alt={client.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{client.name}</h4>
              {client.service_provided && <p style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600 }}>{client.service_provided}</p>}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                <span style={{ color: client.is_active ? '#4ADE80' : '#EF4444', fontSize: '0.75rem', fontWeight: 600 }}>
                  {client.is_active ? 'Active' : 'Hidden'}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button onClick={() => openEdit(client)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer' }}><Edit2 size={15} /></button>
                  <button onClick={() => handleToggle(client.id)} style={{ background: 'none', border: 'none', color: client.is_active ? '#4ADE80' : '#64748B', cursor: 'pointer' }}>
                    {client.is_active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                  </button>
                  <button onClick={() => handleDelete(client.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
