const express=require('express');
const mongoose = require('mongoose');
const cors=require('cors');
require('dotenv').config();

const PORT=process.env.PORT || 5000;
const Reservation=require('./models/Reservation');

const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
      .then(()=>console.log("Connected to Adey's Database!"))
      .catch(err=> console.error("Database connection error:", err));

app.post('/api/reservations',async(req,res)=>{
    try{
        const { name, guests, date, time } = req.body;
    const newReservation = new Reservation({ name, guests, date, time });
    await newReservation.save();
    res.status(201).json({ message: "Reservation saved successfully!" });
    } catch(error){
        res.status(500).json({ error: "Failed to save reservation." });
    }
})
app.get('/',(req,res)=>{
    res.send("Adey restaurant backend is running ...");
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`);
});