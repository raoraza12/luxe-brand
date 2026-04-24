import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';
import API from '../api';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const CATEGORIES = ['Men', 'Women', 'Kids', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState(params.get('search') || '');
  const [filters, setFilters] = useState({
    category: params.get('category') || '',
    size: params.get('size') || '',
    sort: params.get('sort') || 'newest',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    featured: params.get('featured') || '',
    newArrival: params.get('newArrival') || '',
    bestseller: params.get('bestseller') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && q.set(k, v));
      if (search) q.set('search', search);
      q.set('limit', '20');
      const { data } = await API.get(`/products?${q}`);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [filters, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
  const clearFilters = () => setFilters({ category: '', size: '', sort: 'newest', minPrice: '', maxPrice: '', featured: '', newArrival: '', bestseller: '' });

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v && k !== 'sort').length + (search ? 1 : 0);

  return (
    <div className="page-wrapper shop-page">
      {/* Header */}
      <div className="shop-header">
        <div className="container shop-header-inner">
          <div>
            <h1 className="section-title">
              {filters.category || 'All Collections'}
              {filters.newArrival && ' — New Arrivals'}
              {filters.bestseller && ' — Bestsellers'}
            </h1>
            <p className="section-subtitle">{total} products found</p>
          </div>
          <div className="shop-controls">
            <div className="search-bar-shop">
              <FiSearch size={16} className="search-icon-shop" />
              <input
                className="search-input-shop"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                onKeyDown={e => e.key === 'Enter' && fetchProducts()}
              />
            </div>
            <div className="sort-select-wrap">
              <FiChevronDown size={14} className="sort-icon" />
              <select className="sort-select" value={filters.sort} onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button className="filter-toggle-btn" onClick={() => setFilterOpen(!filterOpen)}>
              <FiFilter size={16} />
              Filters
              {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="container shop-body">
        {/* Sidebar */}
        <aside className={`filter-sidebar ${filterOpen ? 'open' : ''}`}>
          <div className="filter-sidebar-header">
            <span className="filter-sidebar-title">Filters</span>
            {activeFilterCount > 0 && <button className="clear-filters" onClick={clearFilters}>Clear All</button>}
            <button className="filter-close-btn" onClick={() => setFilterOpen(false)}><FiX size={18} /></button>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Category</h4>
            {CATEGORIES.map(cat => (
              <label key={cat} className="filter-checkbox">
                <input type="checkbox" checked={filters.category === cat} onChange={() => setFilter('category', cat)} />
                <span className="filter-checkbox-label">{cat}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Collections</h4>
            <label className="filter-checkbox">
              <input type="checkbox" checked={filters.newArrival === 'true'} onChange={() => setFilter('newArrival', 'true')} />
              <span className="filter-checkbox-label">New Arrivals</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" checked={filters.featured === 'true'} onChange={() => setFilter('featured', 'true')} />
              <span className="filter-checkbox-label">Featured</span>
            </label>
            <label className="filter-checkbox">
              <input type="checkbox" checked={filters.bestseller === 'true'} onChange={() => setFilter('bestseller', 'true')} />
              <span className="filter-checkbox-label">Bestsellers</span>
            </label>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Size</h4>
            <div className="size-filter-grid">
              {SIZES.map(s => (
                <button key={s} className={`size-filter-btn ${filters.size === s ? 'active' : ''}`} onClick={() => setFilter('size', s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Price Range</h4>
            <div className="price-range">
              <input type="number" className="form-input" placeholder="Min (Rs.)" value={filters.minPrice} onChange={e => setFilters(p => ({ ...p, minPrice: e.target.value }))} />
              <span>—</span>
              <input type="number" className="form-input" placeholder="Max (Rs.)" value={filters.maxPrice} onChange={e => setFilters(p => ({ ...p, maxPrice: e.target.value }))} />
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Tags</h4>
            <div className="tag-filters">
              {['Premium', 'Luxury', 'Summer', 'Winter', 'Formal', 'Casual'].map(t => (
                <button 
                  key={t} 
                  className={`tag-filter-btn ${filters.tag === t ? 'active' : ''}`} 
                  onClick={() => setFilters(p => ({ ...p, tag: p.tag === t ? '' : t }))}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </aside>


        {/* Products */}
        <div className="shop-products">
          {loading ? (
            <div className="shop-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="shop-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
