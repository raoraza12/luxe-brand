import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiRefreshCw, FiShield, FiAward } from 'react-icons/fi';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { useSettings } from '../context/SettingsContext';
import './Home.css';

const heroSlides = [
  {
    tag: 'New Collection 2026',
    title: 'THE ART OF\nELITE TAILORING',
    subtitle: "Experience the pinnacle of luxury with our meticulously crafted garments, designed for those who command excellence.",
    cta: 'Explore Collection',
    ctaLink: '/shop',
    bg: 'https://images.unsplash.com/photo-1594932224491-ca2e36509f6e?w=1400&q=80',
  },
  {
    tag: 'Women\'s Edit',
    title: 'GRACE IN\nEVERY MOTION',
    subtitle: "Curated pieces for the modern woman who values timeless elegance and effortless sophistication.",
    cta: 'Shop Women',
    ctaLink: '/shop?category=Women',
    bg: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=80',
  },
  {
    tag: 'Men\'s Essentials',
    title: 'DEFINING\nMODERN LUXE',
    subtitle: "Precision tailoring meets organic textures. Every stitch is a statement of refined taste.",
    cta: 'Shop Men',
    ctaLink: '/shop?category=Men',
    bg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
  },
];

const categories = [
  { label: 'Men', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', link: '/shop?category=Men' },
  { label: 'Women', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80', link: '/shop?category=Women' },
  { label: 'Kids', image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80', link: '/shop?category=Kids' },
  { label: 'Accessories', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', link: '/shop?category=Accessories' },
];

const testimonials = [
  { name: 'Ayesha Khan', role: 'Fashion Blogger', text: 'LUXE has completely transformed my wardrobe. The quality is unmatched and every piece feels like it was made just for me.', rating: 5 },
  { name: 'Omar Farooq', role: 'CEO, TechCorp', text: "I wore the Obsidian Slim Suit to my board meeting and the compliments didn't stop. Truly premium craftsmanship.", rating: 5 },
  { name: 'Fatima Malik', role: 'Stylist', text: 'As a professional stylist I recommend LUXE to all my clients. The fabric quality and stitching detail is exceptional.', rating: 5 },
];

export default function Home() {
  const { settings } = useSettings();
  const [slide, setSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      API.get('/products?featured=true&limit=4'),
      API.get('/products?newArrival=true&limit=4'),
      API.get('/products?bestseller=true&limit=4'),
    ]).then(([f, n, b]) => {
      setFeatured(f.data.products);
      setNewArrivals(n.data.products);
      setBestsellers(b.data.products);
    }).finally(() => setLoading(false));
  }, []);

  const current = heroSlides[slide];

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${current.bg})` }} />
        <div className="hero-overlay" />
        <div className="container hero-content" key={slide}>
          <span className="gold-label" style={{ animation: 'fadeUp 0.5s ease' }}>{current.tag}</span>
          <h1 className="hero-title" style={{ animation: 'fadeUp 0.6s ease 0.1s both' }}>
            {(slide === 0 && settings.homeHeroTitle) ? settings.homeHeroTitle : current.title}
          </h1>
          <p className="hero-subtitle" style={{ animation: 'fadeUp 0.6s ease 0.2s both' }}>
            {(slide === 0 && settings.homeHeroSub) ? settings.homeHeroSub : current.subtitle}
          </p>
          <div className="hero-actions" style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}>
            <Link to={current.ctaLink} className="btn-primary hero-cta">{current.cta} <FiArrowRight /></Link>
            <Link to="/shop" className="btn-outline">View All</Link>
          </div>
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`hero-dot ${slide === i ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-line" /><span>Scroll</span>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container stats-inner">
          <div className="stat-item"><FiTruck size={20} /><span><strong>Free Shipping</strong> Over Rs. 5,000</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><FiRefreshCw size={20} /><span><strong>Easy Returns</strong> 30 Days</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><FiShield size={20} /><span><strong>Secure</strong> Payments</span></div>
          <div className="stat-divider" />
          <div className="stat-item"><FiAward size={20} /><span><strong>Premium</strong> Quality</span></div>
        </div>
      </div>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="gold-label">Shop By</span>
            <h2 className="section-title">Collections</h2>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.label} to={cat.link} className="category-card">
                <div className="category-img-wrap">
                  <img src={cat.image} alt={cat.label} loading="lazy" />
                  <div className="category-overlay" />
                </div>
                <div className="category-label">
                  <span>{cat.label}</span>
                  <FiArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Featured */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <span className="gold-label">Handpicked For You</span>
            <h2 className="section-title">Featured Pieces</h2>
            <Link to="/shop?featured=true" className="section-cta">View All <FiArrowRight size={14} /></Link>
          </div>
          <div className="products-grid">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />)
              : featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="banner-cta">
        <div className="banner-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1400&q=80)' }} />
        <div className="banner-overlay" />
        <div className="container banner-content">
          <span className="gold-label">Limited Time</span>
          <h2 className="banner-title">Up to 30% Off<br />New Season Styles</h2>
          <p className="banner-sub">Exclusive pieces from our latest drop — now at exceptional value</p>
          <Link to="/shop?bestseller=true" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }}>Shop the Sale</Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <span className="gold-label">Just Landed</span>
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/shop?newArrival=true" className="section-cta">View All <FiArrowRight size={14} /></Link>
          </div>
          <div className="products-grid">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />)
              : newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-section">
        <div className="container">
          <div className="section-header centered">
            <span className="gold-label">What They Say</span>
            <h2 className="section-title">Client Stories</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} size={14} fill="#c9a84c" color="#c9a84c" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="products-section" style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div className="section-header">
            <span className="gold-label">Most Loved</span>
            <h2 className="section-title">Bestsellers</h2>
            <Link to="/shop?bestseller=true" className="section-cta">View All <FiArrowRight size={14} /></Link>
          </div>
          <div className="products-grid">
            {loading ? [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />)
              : bestsellers.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
