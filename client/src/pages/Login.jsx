import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! ✨');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80)' }} />
      <div className="auth-overlay" />
      <div className="auth-card">
        <div className="auth-brand">LUXE</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to your account to continue</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            <FiLogIn size={18} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register" className="auth-link">Create one →</Link>
        </p>
        <div className="auth-demo">
          <p className="auth-demo-title">Demo Credentials</p>
          <button className="auth-demo-btn" onClick={() => setForm({ email: 'test@luxe.com', password: 'test1234' })}>User: test@luxe.com / test1234</button>
          <button className="auth-demo-btn" onClick={() => setForm({ email: 'admin@luxe.com', password: 'admin123' })}>Admin: admin@luxe.com / admin123</button>
        </div>
      </div>
    </div>
  );
}
