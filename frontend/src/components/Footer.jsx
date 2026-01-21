import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="footer-section footer-logo">
        <img 
          style={{ width: '70px', height: '70px' }} 
          src="image/Gemini_Generated_Image_12h9zs12h9zs12h9.png" 
          alt="Icon" 
        />
        <div>
          <h3>Adey restaurant</h3>
          <br />
          <p>Serving authentic Ethiopian cuisine in Addis Ababa since 2010.</p>
        </div>
      </div>

      <div className="section2">
        <div className="footer-section">
          <h3>Get in touch</h3>
          <p>
            📍 Semit, Addis Ababa <br />
            📞 +251 91 234 5678<br />
            📧 info@adeyrestaurant.et
          </p>
        </div>

        <div className="footer-section">
          <h3>Connect with us</h3>
          <div className="social">
            <p>
              <img src="https://www.pngkey.com/png/detail/285-2850733_instagram-logo-instagram-icon-small-png.png" alt="Instagram" /> 
              Instagram: @adeyRestaurant
            </p>
            <p>
              <img src="https://static.vecteezy.com/system/resources/previews/006/693/634/original/tik-tok-flat-icon-template-black-color-editable-tik-tok-flat-icon-symbol-flat-illustration-for-graphic-and-web-design-free-vector.jpg" alt="Tiktok" />
              TikTok: @adey_addis
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Pages</h3>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/about">About</Link>
            <Link to="/testimonials">Testimonials</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        ©2025 AdeyRestaurant. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;