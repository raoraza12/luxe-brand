import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeFromCart, total } = useCart();

  const fmt = (n) => `Rs. ${n.toLocaleString()}`;

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => setIsOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>
            <p className="cart-count">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="cart-close" onClick={() => setIsOpen(false)}><FiX size={22} /></button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <FiShoppingBag size={48} />
              <p>Your cart is empty</p>
              <Link to="/shop" className="btn-primary" onClick={() => setIsOpen(false)}>Browse Collection</Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.product.images?.[0]} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <Link to={`/shop/${item.product.slug}`} className="cart-item-name" onClick={() => setIsOpen(false)}>
                      {item.product.name}
                    </Link>
                    <button className="cart-remove" onClick={() => removeFromCart(item.key)}><FiTrash2 size={14} /></button>
                  </div>
                  <div className="cart-item-meta">
                    {item.size && <span className="meta-tag">Size: {item.size}</span>}
                    {item.color && <span className="meta-tag">{item.color.name}</span>}
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.key, item.quantity - 1)}><FiMinus size={12} /></button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.key, item.quantity + 1)}><FiPlus size={12} /></button>
                    </div>
                    <span className="cart-item-price">{fmt(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>{fmt(total)}</span>
            </div>
            <p className="cart-shipping-note">Shipping calculated at checkout</p>
            <Link to="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
              Proceed to Checkout
            </Link>
            <Link to="/cart" className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} onClick={() => setIsOpen(false)}>
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
