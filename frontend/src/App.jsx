import { BrowserRouter as  Router, Routes,Route } from "react-router-dom"
import Header from './components/Header';
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Testimonials from "./pages/Testimonials";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";
import About from "./pages/About";
function App() {
  
  return (
    <Router>
      <Header />
      <div className="content-area">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
       </Routes>
       </div>
       <Footer />
    </Router>
  )
}

export default App
