import React, { useEffect, useState } from 'react';
const API_URL="https://adeyrestaurant.onrender.com/";
function AdminDashboard() {
    const [messages,setMessages]=useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [adminForm, setAdminForm] = useState({
        name: '', email: '', guests: 1, date: '', time: ''
    });
    const hasPrompted = React.useRef(false);
    useEffect(() => {
        if (!hasPrompted.current) {
            const password = prompt("Enter Admin Password:");
            if (password !== "Adey123") {
                window.location.href = "/";
            }
            hasPrompted.current = true; // Mark as done
        }
    }, []);
    useEffect(() => {
        fetch(`${API_URL}api/admin/reservations`)
            .then(res => res.json())
            .then(data => {
                setReservations(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);
    useEffect(() => {
        fetch(`${API_URL}api/admin/messages`)
            .then(res => res.json())
            .then(data => setMessages(data));
    }, []);

    if (loading) return <div className="admin-container"><h1>Loading Reservations...</h1></div>;
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this reservation?")) {
            try {
                const response = await fetch(`${API_URL}api/admin/reservations/${id}`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    setReservations(reservations.filter(res => res._id !== id));
                    alert("Deleted successfully");
                } else {
                    alert("Failed to delete.");
                }
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };
    
    const handleAdminSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response = await fetch(`${API_URL}api/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adminForm),
            });
            const data = await response.json();
    
            if (response.ok) {
                alert("Reservation added manually!");
                const resUpdate = await fetch(`${API_URL}api/admin/reservations`);
                const updatedData = await resUpdate.json();
                setReservations(updatedData);
                setShowForm(false);
            } else {
                alert(data.error);
            }
        } catch(err){
            console.error("Admin post error:", err);
        }
    }
    const totalSeatsBooked = reservations.reduce((sum, res) => sum + Number(res.guests), 0);
    return (
        <div className='admin-bg'>
        <div className="admin-container" style={{ padding: '40px', color: 'white' }}>
            <h1>Admin Dashboard - All Bookings</h1>
            <button onClick={() => setShowForm(!showForm)}>
                     {showForm ? "Close Form" : "+ Add Manual Booking"}
            </button>
            {showForm && (
            <div style={{ background: '#222', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                 <h3>Add Manual Reservation</h3>
                 <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <input type="text" placeholder="Name" required 
                        onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} />
                    <input type="email" placeholder="Email" required 
                        onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} />
                    <input type="number" placeholder="Guests" min="1" required 
                        onChange={(e) => setAdminForm({...adminForm, guests: e.target.value})} />
                    <input type="date" required 
                        onChange={(e) => setAdminForm({...adminForm, date: e.target.value})} />
                    <select required onChange={(e) => setAdminForm({...adminForm, time: e.target.value})}>
                        <option value="">Time</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="20:00">08:00 PM</option>
                    </select>
                    <button type="submit" style={{ background: 'gold', color: 'black', fontWeight: 'bold' }}>
                        Add Booking
                    </button>
                </form>
            </div>)}
            <div style={{ 
                display: 'flex', 
                gap: '20px', 
                marginBottom: '30px', 
                background: '#333', 
                padding: '20px', 
                borderRadius: '10px',
                borderLeft: '5px solid gold' 
            }}>
        <div>
        <h2 style={{ margin: 0, color: 'gold' }}>{totalSeatsBooked}</h2>
        <p style={{ margin: 0 }}>Total Seats Booked</p>
         </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <h2 style={{ margin: 0, color: '#4caf50' }}>{reservations.length}</h2>
        <p style={{ margin: 0 }}>Total Parties/Groups</p>
         </div>
        </div>
        <div style={{ background: '#d32f2f', padding: '10px', borderRadius: '5px' }}>
          <h3 style={{ margin: 0 }}>{messages.length} New Messages</h3>
        </div>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse',background:'#dfbe85'}}>
                <thead>
                    <tr style={{ borderBottom: '2px solid gold', textAlign: 'left', color:'black'}}>
                        <th>Name</th>
                        <th>Email</th>
                        <th style={{color:'black'}}>Date</th>
                        <th>Time</th>
                        <th>Guests</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(res => (
                        <tr key={res._id} style={{ borderBottom: '1px solid #444' }}>
                            <td style={{color:'black'}}>{res.name}</td>
                            <td style={{color:'black'}}>{res.email}</td>
                            <td style={{color:'black'}}>{res.date}</td>
                            <td style={{color:'black'}}>{res.time}</td>
                            <td style={{color:'black'}}>{res.guests}</td>
                            <td>
                                   <button 
                                       onClick={() => handleDelete(res._id)} 
                                       style={{ 
                                            backgroundColor: 'grey', 
                                             color: 'white', 
                                             border: 'none', 
                                             padding: '5px 10px', 
                                             borderRadius: '4px', 
                                             cursor: 'pointer' 
                                        }}> Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div></div>
    );
}

export default AdminDashboard;
