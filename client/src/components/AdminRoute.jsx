import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-[#c9a84c]">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />; // Redirect non-admins to home

  return <Outlet />;
};

export default AdminRoute;
