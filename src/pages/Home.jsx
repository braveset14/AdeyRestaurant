import React from 'react';
import { Link } from 'react-router-dom';
import homeImg from '../assets/Injera_with_eight_kinds_of_stew.jpg';
import doroWot from '../assets/download.webp'
function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Experience the Taste of <span className="orange-text">Ethiopia</span></h1>
          <p>Authentic flavors, traditional spices, and the warmth of Addis Ababa, served right at your table.</p>
          <div className="hero-buttons">
            <Link to="/menu" className="primary-btn">View Menu</Link>
            <Link to="/reservation" className="secondary-btn">Book a Table</Link>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="orange-title">Chef's Specials</div>
        <div className="featured-grid">
          <div className="featured-item">
            <img src={doroWot} alt="HomeImg" />
            <h3>Doro Wat</h3>
            <p>The king of Ethiopian stews, slow-cooked to perfection.</p>
          </div>
          <div className="featured-item">
            <img src={homeImg} alt="Beyaynetu" />
            <h3>Beyaynetu</h3>
            <p>A colorful variety of vegan-friendly traditional dishes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;