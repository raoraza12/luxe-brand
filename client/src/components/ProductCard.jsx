import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const size = product.sizes?.[0] || '';
    const color = product.colors?.[0] || null;
    addToCart(product, size, color, 1);
  };

  return (
    <Link to={`/shop/${product.slug}`} className="product-card">
      <div className="product-card-img-wrap">
        <img src={product.images?.[0]} alt={product.name} className="product-main-img" loading="lazy" />
        {product.images?.[1] && (
          <img src={product.images[1]} alt={product.name} className="product-hover-img" loading="lazy" />
        )}
        <div className="product-badges">
          {product.newArrival && <span className="badge-new">New</span>}
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
          {product.bestseller && <span className="badge-best">Bestseller</span>}
        </div>
        <button
          className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product._id, product.name); }}
          title="Save to Wishlist"
        >
          <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <div className="quick-add-overlay">
          <button className="quick-add-btn" onClick={handleQuickAdd}>
            <FiShoppingBag size={14} /> Quick Add
          </button>
        </div>
      </div>
      <div className="product-card-info">
        <p className="product-category">{product.subcategory || product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={12} fill={i < Math.round(product.rating) ? '#c9a84c' : 'none'} color={i < Math.round(product.rating) ? '#c9a84c' : '#5a5468'} />
            ))}
          </div>
          <span className="rating-count">({product.numReviews})</span>
        </div>
        <div className="product-pricing">
          <span className="product-price">Rs. {product.price.toLocaleString()}</span>
          {product.comparePrice > 0 && (
            <span className="product-compare">Rs. {product.comparePrice.toLocaleString()}</span>
          )}
        </div>
        <div className="product-sizes">
          {product.sizes?.slice(0, 5).map(s => (
            <span key={s} className="size-dot">{s}</span>
          ))}
          {product.sizes?.length > 5 && <span className="size-dot more">+{product.sizes.length - 5}</span>}
        </div>
      </div>
    </Link>
  );
}
