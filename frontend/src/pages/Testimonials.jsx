import React,{useState,useEffect,useRef} from 'react';
import '../pages/styles/Testimonials.css';

const testimonialData = [
    {
      id: 1,
      name: "Abebe ",
      text: "The Doro Wat reminds me of my grandmother's cooking. Truly authentic!",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      id: 2,
      name: "Sara Jenkins",
      text: "Best Beyaynetu in Addis! The service is fast and the atmosphere is lovely.",
      rating: "⭐⭐⭐⭐⭐"
    },
    {
      id: 3,
      name: "Daniel Yohannes",
      text: "Great place for a business lunch. The coffee ceremony is a must-see.",
      rating: "⭐⭐⭐⭐"
    }
  ];

  function Testimonials(){
    const [currentIndex,setCurrentIndex]=useState(0);
    const timeoutRef=useRef(null);

    function resetTimeout(){
        if(timeoutRef.current){
            clearTimeout(timeoutRef.current);
        }
    };
    const nextSlide=()=>{
        setCurrentIndex((prevIndex)=> prevIndex === testimonialData.length-1 ? 0: prevIndex+1);
    };

    const prevSlide=()=>{
        setCurrentIndex((prevIndex)=> prevIndex === 0 ? testimonialData.length -1 : prevIndex-1);
    };
    useEffect(()=>{
        resetTimeout();
        timeoutRef.current=setTimeout(()=> nextSlide(),3000);

        return()=>{
            resetTimeout();
        }
    },[currentIndex]);
    return(
        <div className="testimonial-container testimonial-bg">
      <h1 className="testimonial-title">What Our Guests Say</h1>
      
      <div className="slider-wrapper">
        <button className="prev-btn" onClick={prevSlide}>❮</button>
        
        <div className="testimonials-slider">
          <div className="testimonial-card active">
            <p className="testimonial-text">"{testimonialData[currentIndex].text}"</p>
            <h3 className="testimonial-name">- {testimonialData[currentIndex].name}</h3>
            <div className="rating">{testimonialData[currentIndex].rating}</div>
          </div>
        </div>

        <button className="next-btn" onClick={nextSlide}>❯</button>
      </div>

      {/* Navigation Dots */}
      <div className="dots-container">
        {testimonialData.map((_, index) => (
          <span 
            key={index}
            className={index === currentIndex ? "dot active-dot" : "dot"}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
    );
  }

  export default Testimonials;