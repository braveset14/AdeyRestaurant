import React, {use, useState} from 'react';
import '../pages/styles/Reservation.css';

function Reservation(){
    const[formData,setFormData]=useState({
        name: '',
        email:'',
        guests: 1,
        date: '',
        time: ''
    });

    const [status,setStatus]=useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };
    const handleSubmit=async (e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('Checking availaility for you ...');
        try{
            const response=await fetch('http://localhost:5000/api/reservations',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data= await response.json();

            if (response.ok) {
                setStatus(`Success! Table for ${formData.guests} confirmed for ${formData.name}.`);
                // Clear the form
                setFormData({ name: '',email:'', guests: 1, date: '', time: '' });
            } else {
                setStatus(data.error || 'Something went wrong. Please try again.');
            }

        }catch(error){
            console.error('Error:', error);
            setStatus('Server error. Please check if your backend is running on port 5000.');
        }finally {
            setIsSubmitting(false);
        }
    };

    const [checkEmail, setCheckEmail] = useState('');
    const [checkStatus, setCheckStatus] = useState('');

    const handleCheckReservation = async () => {
        setCheckStatus('Searching...');
        try {
            const response = await fetch('http://localhost:5000/api/reservations/forgot-info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: checkEmail }),
            });
            const data = await response.json();
            setCheckStatus(data.message || data.error);
        } catch (err) {
            setCheckStatus('Error connecting to server.');
        }
    };
    return(
        <div className="reservation-bg">
        <div className="reservation-container ">
            <h1 className="reservation-title">Book a Table</h1>
            
            <form id="reservationForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" id="name" placeholder="Full Name" 
                        value={formData.name} onChange={handleChange} required 
                    />
                </div>
                <div className="form-group">
                    <input 
                       type="email" 
                       id="email" 
                       placeholder="Email Address" 
                       value={formData.email} 
                       onChange={handleChange} 
                       required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="number" id="guests" placeholder="Guests" min="1" max="80" 
                        value={formData.guests} onChange={handleChange} required 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="date" id="date" 
                        min={new Date().toISOString().split('T')[0]} 
                        value={formData.date} onChange={handleChange} required 
                    />
                </div>
                <div className="form-group">
                    <select id="time" value={formData.time} onChange={handleChange} required>
                        <option value="" disabled>Select Time</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="20:00">08:00 PM</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">Confirm Reservation</button>
            </form>

            {status && <div id="resMessage" style={{marginTop: '20px', color: '#fff'}}>{status}</div>}
            <div className="check-reservation-box" style={{marginTop: '50px', padding: '20px', background: '#222', borderRadius: '8px'}}>
    <h3>Forgot your booking details?</h3>
    <input 
        type="email" 
        placeholder="Enter your email" 
        value={checkEmail} 
        onChange={(e) => setCheckEmail(e.target.value)} 
    />
    <button onClick={handleCheckReservation} className="submit-btn">Email Me My Details</button>
    {checkStatus && <p style={{color: '#ffeb3b', marginTop: '10px'}}>{checkStatus}</p>}
</div>
        </div></div>
    );
}

export default Reservation;