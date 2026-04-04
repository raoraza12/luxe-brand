import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUser, FiSave } from 'react-icons/fi';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', avatar: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) { setForm({ name: user.name || '', phone: user.phone || '', avatar: user.avatar || '' }); }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/users/profile', form);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    setLoading(false);
  };

  if (!user) return (
    <div className="page-wrapper empty-page">
      <FiUser size={56} color="var(--text-muted)" />
      <p>Please login to view profile</p>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600, paddingTop: 40, paddingBottom: 80 }}>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'2rem', color:'var(--cream)', marginBottom: 32 }}>My Profile</h1>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-light)', borderRadius:'var(--radius-lg)', padding: 32 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom:'1px solid var(--border-light)' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', fontWeight:700, color:'#1a1000' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontFamily:'Playfair Display,serif', fontSize:'1.3rem', color:'var(--cream)', fontWeight:600 }}>{user.name}</p>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginTop:4 }}>{user.email}</p>
              <span style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--gold)', fontWeight:700 }}>{user.role}</span>
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} placeholder="0300-1234567" />
            </div>
            <div className="form-group">
              <label className="form-label">Email (read only)</label>
              <input className="form-input" value={user.email} readOnly style={{ opacity:0.5 }} />
            </div>
            <div style={{ display:'flex', gap:12, marginTop: 8 }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                <FiSave size={16} />{loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn-outline" onClick={logout}>Logout</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
