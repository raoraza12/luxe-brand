import { useState, useEffect } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { FiEye, FiX } from 'react-icons/fi';
import './Admin.css';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/admin/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      await API.put(`/admin/orders/${id}`, {
        [field]: value
      });
      toast.success('Order status updated! ✨');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, [field]: value });
      }
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  if (loading) return <div className="text-gold">Loading shipments...</div>;

  return (
    <div className="order-manager-wrapper">
      <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Logistics: Orders</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.5 }}>{order._id.slice(-6)}</td>
                <td>
                  <div style={{ fontWeight: '600' }}>{order.user?.name || 'Guest'}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.4 }}>{order.user?.email}</div>
                </td>
                <td style={{ color: 'var(--gold)', fontWeight: '700' }}>${order.total}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{order.paymentStatus}</span>
                </td>
                <td>
                  <button onClick={() => setSelectedOrder(order)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    <FiEye /> View Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedOrder(null)} className="admin-modal-close">
              <FiX size={24} />
            </button>
            <div style={{ padding: '40px' }}>
              <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Order Archive: {selectedOrder._id}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <span className="gold-label">Consignee Address</span>
                  <p style={{ fontWeight: '600', marginBottom: '5px' }}>{selectedOrder.shippingAddress.name}</p>
                  <p style={{ opacity: 0.6 }}>{selectedOrder.shippingAddress.street}</p>
                  <p style={{ opacity: 0.6 }}>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p style={{ opacity: 0.8, marginTop: '10px' }}>{selectedOrder.shippingAddress.phone}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <div>
                    <span className="gold-label">Modify Logistics</span>
                    <select 
                      value={selectedOrder.status} 
                      onChange={(e) => handleUpdate(selectedOrder._id, 'status', e.target.value)}
                      className="form-input"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                   </div>
                   <div>
                    <span className="gold-label">Adjust Payment</span>
                    <select 
                      value={selectedOrder.paymentStatus} 
                      onChange={(e) => handleUpdate(selectedOrder._id, 'paymentStatus', e.target.value)}
                      className="form-input"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                   </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '30px' }}>
                <span className="gold-label" style={{ marginBottom: '20px' }}>Manifest Items</span>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: '500' }}>{item.name}</p>
                        <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>Qty: {item.quantity} | Size: {item.size}</p>
                      </div>
                    </div>
                    <p style={{ color: 'var(--gold)', fontWeight: '600' }}>${item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--gold)' }}>
                <div>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Method: {selectedOrder.paymentMethod}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '5px' }}>Total Settlement</p>
                   <p style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--gold)' }}>${selectedOrder.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
