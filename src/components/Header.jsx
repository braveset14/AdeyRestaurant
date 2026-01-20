import { Link } from "react-router-dom";

function Header(){
    return(
        <header className="header">
      <nav className="nav">
        {/* Replace your local image path with an imported one later if needed */}
        <img 
          src="image/Gemini_Generated_Image_12h9zs12h9zs12h9.png" 
          alt="Adey Logo" 
        />
        
        <div className="links">
          {/* We use Link instead of <a href> to keep it a Single Page App */}
          <Link to="/" className="nav-button">Home</Link>
          <Link to="/menu" className="nav-button">Menu</Link>
          <Link to="/about" className="nav-button">About</Link>
          <Link to="/testimonials" className="nav-button">Testimonials</Link>
          <Link to="/contact" className="nav-button">Contact</Link>
          <Link to="/reservation" className="nav-button">Reservation</Link>
        </div>
      </nav>
    </header>
    )
}

export default Header;