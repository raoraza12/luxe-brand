import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiSearch, FiUser, FiMenu, FiX, FiLogOut, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const categories = [
  { label: 'Men', path: '/shop?category=Men', subs: ['Suits', 'Shirts', 'Blazers', 'Trousers', 'Knitwear'] },
  { label: 'Women', path: '/shop?category=Women', subs: ['Dresses', 'Tops', 'Suits', 'Gowns', 'Skirts'] },
  { label: 'Kids', path: '/shop?category=Kids', subs: ['Sets', 'Dresses', 'Jackets', 'Tops'] },
  { label: 'Accessories', path: '/shop?category=Accessories', subs: ['Bags', 'Scarves', 'Belts', 'Jewellery'] },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { count, setIsOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery.trim()}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled || location.pathname !== '/' ? 'scrolled' : ''}`}>
        <div className="navbar-inner container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">LUXE</span>
            <span className="logo-tagline">Haute Couture</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            {categories.map(cat => (
              <div key={cat.label} className="nav-item" onMouseEnter={() => setMegaMenu(cat.label)} onMouseLeave={() => setMegaMenu(null)}>
                <Link to={cat.path} className="nav-link">{cat.label}</Link>
                {megaMenu === cat.label && (
                  <div className="mega-menu">
                    <div className="mega-menu-inner">
                      <div className="mega-col">
                        <span className="mega-heading">Browse {cat.label}</span>
                        {cat.subs.map(sub => (
                          <Link key={sub} to={`/shop?category=${cat.label}&subcategory=${sub}`} className="mega-link" onClick={() => setMegaMenu(null)}>
                            {sub}
                          </Link>
                        ))}
                      </div>
                      <div className="mega-col">
                        <Link to={`/shop?category=${cat.label}&featured=true`} className="mega-feature-card" onClick={() => setMegaMenu(null)}>
                          <span className="mega-feature-tag">Featured</span>
                          <span className="mega-feature-title">Top {cat.label}'s Picks</span>
                          <span className="mega-feature-cta">Explore →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link to="/shop" className="nav-link">New Arrivals</Link>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} title="Search"><FiSearch size={20} /></button>
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist"><FiHeart size={20} /></Link>
            <button className="nav-icon-btn cart-btn" onClick={() => setIsOpen(true)}>
              <FiShoppingBag size={20} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
            <div className="user-menu-wrap">
              {user ? (
                <button className="nav-icon-btn" onClick={() => setUserMenu(!userMenu)}>
                  <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                </button>
              ) : (
                <Link to="/login" className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>Sign In</Link>
              )}
              {userMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                  <Link to="/profile" className="user-dropdown-item" onClick={() => setUserMenu(false)}><FiUser size={14} />Profile</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="user-dropdown-item admin-link" onClick={() => setUserMenu(false)} style={{ color: '#c9a84c' }}>
                      <FiPackage size={14} />Admin Dashboard
                    </Link>
                  )}
                  <Link to="/orders" className="user-dropdown-item" onClick={() => setUserMenu(false)}><FiPackage size={14} />My Orders</Link>
                  <Link to="/wishlist" className="user-dropdown-item" onClick={() => setUserMenu(false)}><FiHeart size={14} />Wishlist</Link>
                  <button className="user-dropdown-item logout" onClick={() => { logout(); setUserMenu(false); }}><FiLogOut size={14} />Logout</button>
                </div>
              )}
            </div>
            <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      {searchOpen && (
        <>
          <div className="overlay" onClick={() => setSearchOpen(false)} />
          <div className="search-modal">
            <form onSubmit={handleSearch} className="search-form">
              <FiSearch size={20} className="search-icon" />
              <input className="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search for styles, collections..." autoFocus />
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}><FiX size={20} /></button>
            </form>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div className="overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu-logo">LUXE</div>
            {categories.map(cat => (
              <div key={cat.label} className="mobile-cat">
                <Link to={cat.path} className="mobile-cat-title">{cat.label}</Link>
                <div className="mobile-subs">
                  {cat.subs.map(sub => (
                    <Link key={sub} to={`/shop?category=${cat.label}&subcategory=${sub}`} className="mobile-sub">{sub}</Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/shop" className="mobile-cat-title">New Arrivals</Link>
            {user ? (
              <>
                <Link to="/profile" className="mobile-cat-title">Profile</Link>
                <Link to="/orders" className="mobile-cat-title">Orders</Link>
                <button onClick={logout} className="mobile-cat-title" style={{ background: 'none', color: 'var(--red)', textAlign: 'left', width: '100%', padding: '14px 0', borderTop: '1px solid var(--border-light)', cursor:'pointer' }}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn-primary" style={{ margin: '20px 0', display: 'block', textAlign: 'center' }}>Sign In</Link>
            )}
          </div>
        </>
      )}
    </>
  );
}
