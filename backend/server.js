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
      const MAX_SEATS=80;
      const requestedSeats=Number(guests);


      const result=await Reservation.aggregate([
        { 
          $match: { date: date, time: time } 
        },
        { 
          $group: { 
            _id: null, 
            totalBookedSeats: { $sum: "$guests" } 
          } 
        }
      ]);

      const currentBookedSeats=(result && result.length > 0) 
      ? result[0].totalBookedSeats 
      : 0;

      console.log(`Current seats for ${date} at ${time}: ${currentBookedSeats}`)
      
      if(currentBookedSeats + requestedSeats > MAX_SEATS){
        const available = MAX_SEATS - currentBookedSeats;
        return res.status(400).json({error: `Sorry, we only have ${available} seats left for this time. Please try a smaller group or a different time.` 
      });
      }
      const newReservation = new Reservation({ name, guests, date, time });
      await newReservation.save();
      res.status(201).json({ message: "Reservation confirmed!" });
    } catch(error){
        console.error("Aggregation Error:", error);
        res.status(500).json({ error: "Server error while checking capacity." });
    }
})
app.get('/',(req,res)=>{
    res.send("Adey restaurant backend is running ...");
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`);
});