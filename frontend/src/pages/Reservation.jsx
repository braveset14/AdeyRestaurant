import React, {use, useState} from 'react';

function Reservation(){
    const[formData,setFormData]=useState({
        name: '',
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
                setFormData({ name: '', guests: 1, date: '', time: '' });
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
        </div></div>
    );
}

export default Reservation;