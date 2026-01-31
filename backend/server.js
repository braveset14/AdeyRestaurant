const http=require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { google } = require('googleapis');
const Message = require('./models/Message');
const Reservation = require('./models/Reservation');
require('dotenv').config();


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


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Adey's Database!"))
  .catch(err => console.error("Database connection error:", err));


const server=http.createServer((req,res)=>{
  
  res.setHeader('Access-Control-Allow-Origin', 'https://adey-restaurant-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if(req.method==='OPTIONS'){
    res.writeHead(204);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const { method, url } = req;
    let data = {};
    if (body) {
      try { data = JSON.parse(body); } catch (e) { console.log("JSON Parse Error"); }
    }

    if (url === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("Adey Restaurant Backend");
    }

    else if (url === '/api/reservations' && method === 'POST') {
      try {
        const { name, email, guests, date, time } = data;
        const requestedSeats = Number(guests);

        const result = await Reservation.aggregate([
          { $match: { date, time } },
          { $group: { _id: null, totalBookedSeats: { $sum: "$guests" } } }
        ]);

        const currentBookedSeats = (result && result.length > 0) ? result[0].totalBookedSeats : 0;

        if (currentBookedSeats + requestedSeats > 80) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: `Only ${80 - currentBookedSeats} seats left.` }));
        }

        const newRes = new Reservation({ name, email, guests, date, time });
        await newRes.save();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Reservation confirmed!" }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    }

    else if (url === '/api/contact' && method === 'POST') {
      try {
        const { name, email, message } = data;
        await Message.create({ name, email, message });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Message sent!" }));

        sendGmail(process.env.EMAIL_USER, `New Message from ${name}`, message).catch(e => console.log(e));
      } catch (err) {
        res.writeHead(500); res.end();
      }
    }

    else if (url === '/api/admin/reservations' && method === 'GET') {
      const all = await Reservation.find().sort({ date: -1 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(all));
    }

    else if (url.startsWith('/api/admin/reservations/') && method === 'DELETE') {
      const id = url.split('/').pop(); // Extracting ID from /api/admin/reservations/123
      await Reservation.findByIdAndDelete(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "Deleted" }));
    }


    else if (url === '/api/admin/messages' && method === 'GET') {
      const msgs = await Message.find().sort({ createdAt: -1 });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(msgs));
    }

    else if (url === '/api/reservations/forgot-info' && method === 'POST') {
      const reservations = await Reservation.find({ email: data.email?.toLowerCase().trim() });
      if (!reservations || reservations.length === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

      const list = reservations.map(r => `• ${r.date} at ${r.time}`).join('\n');
      sendGmail(data.email, 'Your Bookings', `Here are your bookings:\n\n${list}`).catch(e => console.log(e));
    }

    else {
      res.writeHead(404);
      res.end("Route not found");
    }
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));