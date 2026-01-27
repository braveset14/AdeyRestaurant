const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { google } = require('googleapis');
const Message = require('./models/Message');
const Reservation = require('./models/Reservation');
require('dotenv').config();

const app = express();
const OAuth2 = google.auth.OAuth2;

const createGmailService = async () => {
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({ 
    refresh_token: process.env.OAUTH_REFRESH_TOKEN 
  });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const sendGmail = async (to, subject, text) => {
  try {
    const gmail = await createGmailService();
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: Adey Restaurant <${process.env.EMAIL_USER}>`,
      `To: ${to}`,
      `Content-Type: text/plain; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      text,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error("Gmail API Send Error:", error.message);
    throw error;
  }
};


app.use(cors({
  origin: 'https://adey-restaurant-nine.vercel.app',
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Adey's Database!"))
  .catch(err => console.error("Database connection error:", err));


app.post('/api/reservations', async (req, res) => {
  try {
    const { name, email, guests, date, time } = req.body;
    const MAX_SEATS = 80;
    const requestedSeats = Number(guests);

    const result = await Reservation.aggregate([
      { $match: { date: date, time: time } },
      { $group: { _id: null, totalBookedSeats: { $sum: "$guests" } } }
    ]);

    const currentBookedSeats = (result && result.length > 0) ? result[0].totalBookedSeats : 0;

    if (currentBookedSeats + requestedSeats > MAX_SEATS) {
      const available = MAX_SEATS - currentBookedSeats;
      return res.status(400).json({ error: `Only ${available} seats left for this time.` });
    }

    const newReservation = new Reservation({ name, email, guests, date, time });
    await newReservation.save();
    res.status(201).json({ message: "Reservation confirmed!" });
  } catch (error) {
    console.error("Reservation Error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    
    res.status(200).json({ message: "Message sent successfully!" });
    const emailBody = `New website message:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    sendGmail(process.env.EMAIL_USER, `New Message from ${name}`, emailBody)
      .catch(err => console.error("Background Contact Email Error:", err));

  } catch (error) {
    console.error("Contact Form Error:", error);
    if (!res.headersSent) res.status(500).json({ error: "Failed to send message." });
  }
});


app.post('/api/reservations/forgot-info', async (req, res) => {
  try {
    const { email } = req.body;
    const reservations = await Reservation.find({ email: email.toLowerCase().trim() });

    if (!reservations || reservations.length === 0) {

      return res.status(200).json({ success: false, message: "No reservations found for this email." });
    }

    res.status(200).json({ success: true, message: "Check your inbox!" });

    const bookingList = reservations.map(r => `• ${r.date} at ${r.time} (${r.guests} guests)`).join('\n');
    const emailText = `Hello!\n\nHere are your reservation details for Adey Restaurant:\n\n${bookingList}\n\nSee you soon!`;
    
    sendGmail(email, 'Your Adey Restaurant Bookings', emailText)
      .catch(err => console.error("Background Forgot-Info Email Error:", err));

  } catch (error) {
    console.error("Forgot Info Error:", error);
  }
});


app.get('/api/admin/messages', async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs);
});


app.get('/api/admin/reservations', async (req, res) => {
  try {
    const allReservations = await Reservation.find().sort({ date: -1 });
    res.json(allReservations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reservations." });
  }
});


app.delete('/api/admin/reservations/:id', async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed." });
  }
});


app.get('/', (req, res) => res.send("Adey restaurant backend is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));