const express=require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const nodemailer=require('nodemailer');
const Message=require('./models/Message');
require('dotenv').config();

const PORT=process.env.PORT || 5000;
const Reservation=require('./models/Reservation');

const app=express();
app.use(cors({
  origin:'https://adey-restaurant-nine.vercel.app',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
      .then(()=>console.log("Connected to Adey's Database!"))
      .catch(err=> console.error("Database connection error:", err));

app.post('/api/reservations',async(req,res)=>{
    try{
      const { name,email, guests, date, time } = req.body;
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
      const newReservation = new Reservation({ name,email, guests, date, time });
      await newReservation.save();
      res.status(201).json({ message: "Reservation confirmed!" });
    } catch(error){
        console.error("Aggregation Error:", error);
        res.status(500).json({ error: "Server error while checking capacity." });
    }
});
app.get('/api/admin/messages', async (req, res) => {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.json(msgs);
});

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
app.post('/api/contact',async (req,res)=>{
    try {
        const { name, email, message } = req.body;
        await Message.create({ name, email, message });
        res.status(200).json({ message: "Message sent successfully!" });
        try{
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            replyTo: email,      
            subject: `New Message from ${name} (Adey Contact Form)`,
            text: `You have received a new message from your website contact form:\n\n` +
                  `Name: ${name}\n` +
                  `Email: ${email}\n` +
                  `Message: ${message}`
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      }catch(mailError){
        console.error("Failed at connection");
      }
       
    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).json({ error: "Failed to send message." });
    }
});
app.get('/',(req,res)=>{
    res.send("Adey restaurant backend is running ...");
});
app.get('/api/admin/reservations',async (req,res)=>{
    try {
        console.log("Admin is requesting all reservations...");
        const allReservations = await Reservation.find().sort({ date: -1 });
        res.json(allReservations);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch reservations for admin." });
      }
});
app.delete('/api/admin/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReservation = await Reservation.findByIdAndDelete(id);

        if (!deletedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json({ message: "Reservation deleted successfully!" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Failed to delete reservation." });
    }
});


app.post('/api/reservations/forgot-info', async (req, res) => {
  try {
      const { email } = req.body;
      const reservations = await Reservation.find({ email: email.toLowerCase().trim() });

      if (!reservations || reservations.length === 0) {
          return res.status(404).json({ message: "No reservations found for this email." });
      }

      // 1. Respond to user IMMEDIATELY (No loading spinning forever)
      res.status(200).json({ message: "Success! Check your inbox." });

      // 2. Format the email
      const bookingList = reservations.map(r => 
          `• ${r.date} at ${r.time} (${r.guests} guests)`
      ).join('\n');

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email, // This will now work for ANY email address
          subject: 'Your Adey Restaurant Bookings',
          text: `Hello! Here are your reservation details:\n\n${bookingList}\n\nSee you soon!`
      };

      // 3. Send in background (No 'await' here)
      transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.log("Background Email Error:", err.message);
          } else {
              console.log("Email sent successfully to:", email);
          }
      });

  } catch (error) {
      console.error("Server Error:", error);
      if (!res.headersSent) {
          res.status(500).json({ error: "Internal server error" });
      }
  }
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}.`);
});
