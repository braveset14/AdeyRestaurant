import React,{useState} from 'react';
import '../pages/styles/Contact.css'

function Contact(){
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
      });

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
const handleSubmit=async(e)=>{
  e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending your message...');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
          setStatus('Message sent successfully! We will get back to you soon.');
          setFormData({ name: '', email: '', message: '' });
      } else {
          setStatus('Something went wrong. Please try again.');
      }
  } catch (error) {
      setStatus('Error connecting to the server.');
  } finally {
      setIsSubmitting(false);
  }
 };
 return (
    <div className="contact-bg">
      <div className="contact-container">
        <div className="contact-title">
          <h1 className="orange-title">Contact Adey</h1>
        </div>

        <div className="info-contact">
          {/* Business Info Section */}
          <div className="tabs">
            <p>📍 Location</p>
            <ul><li>Semit, Addis Ababa (Near the Roundabout)</li></ul>
            <br />
            <p>📞 Phone</p>
            <ul><li>+251 91 234 5678</li></ul>
            <br />
            <p>📧 Email</p>
            <ul><li>hello@adeyrestaurant.et</li></ul>
          </div>

          {/* Form Section */}
          <div className="contact-form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" id="name" placeholder="Your Name" 
                  value={formData.name} onChange={handleChange} required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" id="email" placeholder="Your Email" 
                  value={formData.email} onChange={handleChange} required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  id="message" placeholder="How can we help you?" rows="5"
                  value={formData.message} onChange={handleChange} required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
            
            {status && (
              <div id="formSuccess" style={{ marginTop: '20px' }}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;