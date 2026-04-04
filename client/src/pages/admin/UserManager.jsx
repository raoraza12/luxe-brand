import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import './Admin.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete user? This cannot be undone.')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <div className="text-gold">Loading stakeholders...</div>;

  return (
    <div className="user-manager-wrapper">
      <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Management: Accounts</h2>
        <Link to="/admin/users/new" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.75rem' }}>
          <FiPlus /> New Stakeholder
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Email Credential</th>
              <th>Access Role</th>
              <th>Membership</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ fontWeight: '600' }}>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.role === 'admin' ? 'status-pending' : 'bg-gray-800 text-gray-400'}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to={`/admin/users/edit/${user._id}`} className="text-gold" title="Edit Role">
                      <FiEdit2 size={18} />
                    </Link>
                    <button onClick={() => handleDelete(user._id)} style={{ background: 'none', color: 'var(--red)' }} title="Delete User">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
