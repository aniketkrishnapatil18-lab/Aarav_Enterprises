import { useState, useEffect } from 'react';
import { videoAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Video } from 'lucide-react';

function defaultForm() {
    return { title: '', description: '', thumbnail_url: '', video_url: '', active: true };
}

export default function AdminVideos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editVideo, setEditVideo] = useState(null);
    const [form, setForm] = useState(defaultForm());

    useEffect(() => {
        document.title = 'Product Videos — Admin';
        load();
    }, []);

    // Lock background page scroll while the form modal is open.
    useEffect(() => {
        document.body.style.overflow = showForm ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showForm]);

    async function load() {
        try {
            const res = await videoAPI.list({});
            setVideos(res.data.data || []);
        } catch {
            toast.error('Failed to load videos.');
        } finally {
            setLoading(false);
        }
    }

    function openEdit(video) {
        setEditVideo(video);
        setForm({
            title: video.title,
            description: video.description || '',
            thumbnail_url: video.thumbnail_url || '',
            video_url: video.video_url || '',
            active: !!video.active,
        });
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('active', form.active ? 1 : 0);
        if (form.thumbnail_url) fd.append('thumbnail_url', form.thumbnail_url);
        if (form.video_url) fd.append('video_url', form.video_url);

        const thumbFile = document.getElementById('thumbnail_file')?.files?.[0];
        if (thumbFile) fd.append('thumbnail', thumbFile);

        const videoFile = document.getElementById('video_file')?.files?.[0];
        if (videoFile) fd.append('video', videoFile);

        if (!editVideo && !thumbFile && !form.thumbnail_url) {
            toast.error('Thumbnail file or URL is required.'); return;
        }
        if (!editVideo && !videoFile && !form.video_url) {
            toast.error('Video file or URL is required.'); return;
        }

        try {
            if (editVideo) {
                await videoAPI.update(editVideo.id, fd);
                toast.success('Video updated!');
            } else {
                await videoAPI.create(fd);
                toast.success('Video added!');
            }
            setShowForm(false);
            setEditVideo(null);
            setForm(defaultForm());
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving video.');
        }
    }

    async function handleToggle(id, currentActive) {
        try {
            await videoAPI.update(id, { active: currentActive ? 0 : 1 });
            load();
        } catch {
            toast.error('Failed to toggle status.');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this video?')) return;
        try {
            await videoAPI.remove(id);
            toast.success('Video deleted.');
            load();
        } catch {
            toast.error('Failed to delete.');
        }
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Product Videos</h1>
                    <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Manage the video gallery shown on the public Portfolio page</p>
                </div>
                <button
                    onClick={() => { setEditVideo(null); setForm(defaultForm()); setShowForm(true); }}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
                >
                    <Plus size={16} /> Add Video
                </button>
            </div>

            {/* Inline Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'hidden', padding: 0 }}>
                    <div style={{ maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{editVideo ? 'Edit Video' : 'Add Video'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Title *</label>
                                <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. UV Printing Demo" />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of the video..." style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ marginBottom: '1rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem' }}>
                                <label className="form-label" style={{ marginBottom: '0.75rem' }}>Thumbnail Image {editVideo ? '(Upload to replace)' : '*'}</label>
                                <input id="thumbnail_file" type="file" accept="image/*" className="form-input" style={{ marginBottom: '0.5rem', background: 'var(--bg-card)' }} />
                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.5rem 0', textAlign: 'center', fontWeight: 600 }}>OR PROVIDE LINK</div>
                                <input className="form-input" type="url" value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://..." style={{ background: 'var(--bg-card)' }} />
                            </div>
                            <div style={{ marginBottom: '1rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '0.5rem' }}>
                                <label className="form-label" style={{ marginBottom: '0.75rem' }}>Video File {editVideo ? '(Upload to replace)' : '*'}</label>
                                <input id="video_file" type="file" accept="video/*" className="form-input" style={{ marginBottom: '0.5rem', background: 'var(--bg-card)' }} />
                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.5rem 0', textAlign: 'center', fontWeight: 600 }}>OR PROVIDE LINK</div>
                                <input className="form-input" type="url" value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://..." style={{ background: 'var(--bg-card)' }} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8' }}>
                                    <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                                    Show Publicly (Active)
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Save Video</button>
                            </div>
                        </form>
                    </div>
                    </div>
                </div>
            )}

            {/* Video Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {loading ? (
                    [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: '1rem' }} />)
                ) : videos.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#64748B' }}>
                        <Video size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                        <p>No videos added yet. Click "Add Video" to get started.</p>
                    </div>
                ) : (
                    videos.map(video => (
                        <div key={video.id} className="glass-card" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                            {/* Thumbnail */}
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                                <img
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                                    onError={e => { e.target.src = 'https://placehold.co/320x180/160C33/A78BFA?text=No+Thumbnail'; }}
                                />
                            </div>

                            {/* Info */}
                            <div style={{ padding: '1.25rem' }}>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-violet)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {video.active ? '● Active' : '○ Hidden'}
                                </p>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {video.title}
                                </h4>
                                {video.description && (
                                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {video.description}
                                    </p>
                                )}

                                {/* Actions */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                                    <span style={{ color: video.active ? '#4ADE80' : '#EF4444', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {video.active ? 'Visible' : 'Hidden'}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                        <button onClick={() => openEdit(video)} style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer' }} title="Edit">
                                            <Edit2 size={15} />
                                        </button>
                                        <button onClick={() => handleToggle(video.id, video.active)} style={{ background: 'none', border: 'none', color: video.active ? '#4ADE80' : '#64748B', cursor: 'pointer' }} title="Toggle visibility">
                                            {video.active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                                        </button>
                                        <button onClick={() => handleDelete(video.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
