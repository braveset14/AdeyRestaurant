import React from 'react';

function About() {
  return (
    <div className="about-bg">
      <div className="about-container">
        <h1 className="about-title">About Adey</h1>
        
        <div className="infor">
          <p>
            Established in 2010, <strong>Adey Restaurant</strong> has been a cornerstone 
            of authentic Ethiopian cuisine in the heart of Addis Ababa. 
            Named after the "Adey Abeba" flower that carpets Ethiopia in gold 
            every September, we represent new beginnings and the warmth of 
            traditional hospitality.
          </p>
          <br />
          <p>
            Our chefs use only the finest hand-picked spices from local markets 
            and follow recipes passed down through generations. From the perfect 
            fermentation of our Injera to the slow-simmered depth of our Doro Wat, 
            every dish is a labor of love.
          </p>
        </div>

        <div className="open">
          <div className="open-title">Opening Hours</div>
          <div className="days">
            <p><strong>Monday - Friday:</strong> 11:00 AM - 10:00 PM</p>
            <p><strong>Saturday - Sunday:</strong> 10:00 AM - 11:00 PM</p>
            <hr style={{ margin: '15px 0', border: '0.5px solid purple' }} />
            <p style={{ fontStyle: 'italic' }}>Join us for our traditional Coffee Ceremony every afternoon at 4:00 PM!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;