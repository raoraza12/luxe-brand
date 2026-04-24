import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';
import './Footer.css';

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">{settings.siteName || 'LUXE'}</span>
            <p className="footer-tagline">Haute Couture</p>
            <p className="footer-desc">
              Elevating everyday style through meticulously crafted garments. Where luxury meets wearability.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" title="Instagram"><FiInstagram size={18} /></a>
              <a href="#" className="social-link" title="Twitter"><FiTwitter size={18} /></a>
              <a href="#" className="social-link" title="Facebook"><FiFacebook size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Collections</h4>
            <Link to="/shop?category=Men" className="footer-link">Men's Collection</Link>
            <Link to="/shop?category=Women" className="footer-link">Women's Collection</Link>
            <Link to="/shop?category=Kids" className="footer-link">Kids' Collection</Link>
            <Link to="/shop?category=Accessories" className="footer-link">Accessories</Link>
            <Link to="/shop?newArrival=true" className="footer-link">New Arrivals</Link>
            <Link to="/shop?bestseller=true" className="footer-link">Bestsellers</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <a href="#" className="footer-link">Our Story</a>
            <a href="#" className="footer-link">Craftsmanship</a>
            <a href="#" className="footer-link">Sustainability</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Press</a>
            <a href="#" className="footer-link">Stockists</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <a href="#" className="footer-link">Size Guide</a>
            <a href="#" className="footer-link">Shipping Policy</a>
            <a href="#" className="footer-link">Returns & Exchanges</a>
            <a href="#" className="footer-link">Track Your Order</a>
            <a href="#" className="footer-link">Care Instructions</a>
            <a href="#" className="footer-link">Contact Us</a>
          </div>

          <div className="footer-col footer-contact">
            <h4 className="footer-col-title">Get In Touch</h4>
            <div className="contact-item"><FiMail size={14} /><span>{settings.contactEmail || 'hello@luxebrand.com'}</span></div>
            <div className="contact-item"><FiPhone size={14} /><span>{settings.contactPhone || '+92 300 1234567'}</span></div>
            <div className="contact-item"><FiMapPin size={14} /><span>Lahore, Pakistan</span></div>

            <div className="newsletter">
              <p className="newsletter-title">Join the Inner Circle</p>
              <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                <input type="email" className="newsletter-input" placeholder="Your email address" />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 {settings.siteName || 'LUXE'} Haute Couture. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Terms of Service</a>
            <a href="#" className="footer-bottom-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
