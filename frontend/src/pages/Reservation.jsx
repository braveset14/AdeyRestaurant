import React, {use, useState} from 'react';
import '../pages/styles/Reservation.css';

function Reservation(){
    const[formData,setFormData]=useState({
        name: '',
        guests: 1,
        date: '',
        time: ''
    });

    const [status,setStatus]=useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        setStatus('Checking availaility for you ...');

        setTimeout(()=>{
            setStatus(`Success! Table for ${formData.guests} confirmed for ${formData.name}.`);
            setFormData({ name: '', guests: 1, date: '', time: '' });
        },2000);
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
                        type="number" id="guests" placeholder="Guests" min="1" max="10" 
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
        </div></div>
    );
}

export default Reservation;