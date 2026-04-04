import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit3, FiTrash2 } from 'react-icons/fi';
import './Admin.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      // Backend returns { products, total, page, pages }
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-gold">Loading products...</div>;

  return (
    <div className="product-manager-wrapper">
      <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 className="section-title" style={{ fontSize: '1.5rem' }}>Management: Products</h2>
        <Link to="/admin/products/new" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.75rem' }}>
          <FiPlus /> Add New Product
        </Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagery</th>
              <th>Product Name</th>
              <th>Base Price</th>
              <th>Variations</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <img src={product.images[0] || 'https://via.placeholder.com/50'} alt="" style={{ width: '45px', height: '45px', objectCover: 'cover', borderRadius: '8px' }} />
                </td>
                <td style={{ fontWeight: '600' }}>{product.name}</td>
                <td style={{ color: 'var(--gold)' }}>${product.price}</td>
                <td>
                  <div className="color-swatch-list">
                    {product.colors?.map((c, i) => (
                      <div key={i} className="color-swatch" style={{ backgroundColor: c.hex }} title={c.name} />
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${product.stock > 0 ? 'status-delivered' : 'status-cancelled'}`}>
                     {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to={`/admin/products/edit/${product._id}`} className="text-gold"><FiEdit3 size={18} /></Link>
                    <button onClick={() => handleDelete(product._id)} style={{ background: 'none', color: 'var(--red)' }}><FiTrash2 size={18} /></button>
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

export default ProductManager;
