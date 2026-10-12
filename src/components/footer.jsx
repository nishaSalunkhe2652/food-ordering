
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="ht-footer">
      <div className="ht-footer-main">

        {/* Brand Section */}
        <div className="ht-footer-brand">
          <Link to="/" className="ht-footer-logo">
            <span className="ht-logo-hungry">Hungry</span>{" "}
            <span className="ht-logo-town">Town</span>
          </Link>

          <p className="ht-footer-tagline">
            GOOD FOOD <span>•</span> HAPPY MOOD
          </p>

          <p className="ht-footer-description">
            Fresh, tasty and delicious food for everyone.
            <br />
            From our kitchen to your heart.
          </p>

          <div className="ht-social-links">
            <span>f</span>
            <span>◎</span>
            <span>𝕏</span>
            <span>▶</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="ht-footer-column">
          <h3>🍽️ Quick Links</h3>

          <Link to="/">› Home</Link>
          <Link to="/menu">› Menu</Link>
          <Link to="/cart">› Cart</Link>
          <Link to="/orders">› My Orders</Link>
        </div>

        {/* Categories */}
        <div className="ht-footer-column">
          <h3>🍴 Categories</h3>

          <span>› Veg Starters</span>
          <span>› Non-Veg Starters</span>
          <span>› Veg Main Course</span>
          <span>› Non-Veg Main Course</span>
          <span>› Rice & Biryani</span>
          <span>› Roti Naan Chapati</span>
          <span>› Snacks</span>
          <span>› Pizza & Pasta</span>
        </div>

        {/* Contact */}
        <div className="ht-footer-column ht-contact-column">
          <h3>📞 Contact Us</h3>

          <p>📍Main Road</p>
          <p>Khanapur - 415307</p>
          <p>📞 +91 8766686061</p>
          <p>✉️ salunkhenisha8@gmail.com</p>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="ht-footer-bottom">
        <div className="ht-bottom-brand">
          <span className="ht-logo-hungry">Hungry</span>{" "}
          <span className="ht-logo-town">Town</span>
        </div>

        <p>© 2026 Hungry Town. All rights reserved.</p>

        <div className="ht-bottom-tagline">
          Good Food <span>Happy Mood</span> ♡
        </div>
      </div>
    </footer>
  );
}

export default Footer;