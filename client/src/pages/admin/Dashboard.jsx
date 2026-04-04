import { useState, useEffect } from 'react';
import API from '../../api';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiClock, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const Dashboard = () => {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get('/admin/stats');
        setData(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard metrics. Re-trying...');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-gold animate-pulse">Initializing Luxury Command Center...</div>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="text-red-400">{error || 'Unable to retrieve data metrics.'}</div>
      <button onClick={() => window.location.reload()} className="btn-outline text-xs">Retry Connection</button>
    </div>
  );

  const stats = [
    { title: 'Total Revenue', value: `$${(data?.totalRevenue || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'var(--green)' },
    { title: 'Total Orders', value: data?.ordersCount || 0, icon: <FiShoppingBag />, color: 'var(--gold)' },
    { title: 'Active Stakeholders', value: data?.usersCount || 0, icon: <FiUsers />, color: 'var(--text-secondary)' },
    { title: 'Avg. Watchtime', value: `${data?.avgWatchTime || 0}m`, icon: <FiClock />, color: '#3b82f6' },
  ];

  return (
    <div className="dashboard-container anim-fadeIn">
      {/* Welcome Hero */}
      <div className="dashboard-hero">
        <span className="gold-label">Overseer View</span>
        <h2>Welcome back, {currentUser?.name?.split(' ')[0] || 'Admin'}</h2>
        <p>Your store is performing elegantly. Here is the latest intelligence.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
            <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-section">
        {/* Left Col: Order Archive */}
        <div className="recent-activity-card">
          <div className="activity-header">
            <h3>Archived Orders</h3>
            <Link to="/admin/orders" className="text-gold flex items-center gap-2 text-xs hover:underline">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="admin-table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data?.orders?.map(order => (
                  <tr key={order._id}>
                    <td>
                      <div className="text-white text-xs font-medium">{order.user?.name || 'Guest'}</div>
                      <div className="text-[10px] opacity-40">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <span className={`status-badge status-${order.status}`} style={{ fontSize: '9px' }}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-gold font-bold text-xs">${order.total}</td>
                  </tr>
                )) || (
                  <tr><td colSpan="3" className="text-center py-4 opacity-30">No orders archived yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Alerts & Inventory */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="low-stock-card">
            <div className="flex items-center gap-2 text-red-500 mb-4 font-bold text-sm">
              <FiAlertTriangle /> Inventory Alerts
            </div>
            <div className="space-y-4">
              {(!data?.lowStockProducts || data.lowStockProducts.length === 0) ? (
                <p className="text-xs opacity-50 italic">Inventory is at optimal levels.</p>
              ) : data.lowStockProducts.map(product => (
                <div key={product._id} className="low-stock-item">
                  <img src={product.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-xs font-medium truncate w-32">{product.name}</p>
                    <p className="text-red-400 text-[10px]">{product.stock} units remaining</p>
                  </div>
                  <Link to={`/admin/products/edit/${product._id}`} className="text-gold"><FiArrowRight size={14} /></Link>
                </div>
              ))}
            </div>
          </div>

          {/* Business Insights Card */}
          <div className="bg-elevated p-6 rounded-2xl border border-border-light">
             <span className="gold-label" style={{ fontSize: '10px' }}>Market Sentiment</span>
             <p className="text-xs opacity-60">Revenue is up <span className="text-green-500">+12%</span> this week. High engagement detected in <span className="text-gold">Suits</span> category.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
