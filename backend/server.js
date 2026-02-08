require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); // <--- REQUIRED for Google Login

const app = express();

// Increase payload limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// --- DATABASE CONNECTION (LOCAL COMPASS) ---
mongoose.connect('mongodb://127.0.0.1:27017/alumniDB')
  .then(async () => {
    console.log("✅ Local MongoDB Connected (Compass)");
    
    // --- AUTO-CREATE ADMIN USER ---
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await new User({
        username: 'admin',
        password: 'admin123', // Default Password
        userType: 'Admin',
        fullName: 'System Administrator',
        email: 'admin@alumniconnect.com',
        profilePic: '',
        currentJobRole: 'Administrator'
      }).save();
      console.log("👑 Admin Account Created -> Username: admin | Password: admin123");
    }
  })
  .catch(err => console.error("❌ Mongo Connection Error:", err));


// --- SCHEMAS (UPDATED WITH TIMESTAMPS FOR ANALYTICS) ---

// 1. USER SCHEMA
const UserSchema = new mongoose.Schema({
  username: String, 
  email: String, 
  password: { type: String },
  userType: String, // 'Student', 'Alumni', 'Admin'
  year: Number, 
  department: String, 
  collegeName: String,
  profilePic: { type: String, default: '' },
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  currentJobRole: { type: String, default: '' },
  connections: [{ type: String }],       
  sentRequests: [{ type: String }],      
  receivedRequests: [{ type: String }]   
}, { timestamps: true }); // <--- Added Timestamps
const User = mongoose.model('User', UserSchema);

// 2. POST SCHEMA
const PostSchema = new mongoose.Schema({
  author: String, 
  authorPic: { type: String, default: '' }, 
  role: String,
  content: String, 
  image: { type: String, default: '' }, 
  timestamp: String, 
  likes: { type: Number, default: 0 },
  comments: [{ author: String, text: String, timestamp: String }] 
}, { timestamps: true }); // <--- Added Timestamps
const Post = mongoose.model('Post', PostSchema);

// 3. EVENT SCHEMA
const EventSchema = new mongoose.Schema({
  title: String, date: String, location: String, fee: String, category: String, description: String
}, { timestamps: true });
const Event = mongoose.model('Event', EventSchema);

// 4. OPPORTUNITY SCHEMA
const OpportunitySchema = new mongoose.Schema({
  title: String, type: String, domain: String, location: String, duration: String, stipend: String, description: String, posterName: String, posterRole: String, posterPic: String, tags: [String], timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
const Opportunity = mongoose.model('Opportunity', OpportunitySchema);

// 5. NOTIFICATION SCHEMA
const NotificationSchema = new mongoose.Schema({
  recipient: String, 
  sender: String,    
  message: String,
  type: String,      // 'mentorship_request', 'meet_request', 'connection_request', 'connection_accepted'
  slot: String,      
  status: { type: String, default: 'pending' }, 
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
const Notification = mongoose.model('Notification', NotificationSchema);

// 6. MESSAGE SCHEMA
const MessageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);


// --- ROUTES ---

// AUTH & USER
app.post('/api/register', async (req, res) => { 
  try { 
    await new User(req.body).save(); 
    console.log("User registered:", req.body.username);
    res.status(201).json({ message: "Registered" }); 
  } catch (err) { res.status(400).json({ message: "Error" }); } 
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) {
      res.json({ 
        token: 'mock', 
        userType: user.userType, // This will be 'Admin' if admin logs in
        username: user.username, 
        profilePic: user.profilePic, 
        collegeName: user.collegeName, 
        department: user.department,
        currentJobRole: user.currentJobRole 
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// --- GOOGLE OAUTH CONFIG & ROUTE ---
const GOOGLE_CLIENT_ID = '852267957215-2e9l35kb9hfk7rvsio8gf34ehl94vt7k.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'http://localhost:5000/api/auth/google/callback';

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // 1. Exchange Code for Access Token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_REDIRECT_URI,
    });

    const accessToken = tokenResponse.data.access_token;

    // 2. Fetch User Profile from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const googleUser = userResponse.data;

    // 3. Find or Create User in DB
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        username: googleUser.given_name + Math.floor(Math.random() * 1000), 
        email: googleUser.email,
        fullName: googleUser.name,
        profilePic: googleUser.picture,
        userType: 'Student', 
        currentJobRole: 'Student',
        password: '', // No password needed for Google users
      });
      await user.save();
    }

    // 4. Redirect to Frontend Success Page
    const frontendURL = `http://localhost:3000/google-success?token=mock-google-token&username=${user.username}&role=${user.userType}&pic=${encodeURIComponent(user.profilePic)}`;
    
    res.redirect(frontendURL);

  } catch (error) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res.status(500).send("Authentication failed");
  }
});


// USER ROUTES
app.get('/api/user/:username', async (req, res) => { 
  try { const user = await User.findOne({ username: req.params.username }); res.json(user || {}); } catch (e) { res.status(500).json({ error: e.message }); } 
});
app.get('/api/users/all', async (req, res) => { 
  try { res.json(await User.find().select('-password')); } catch (e) { res.status(500).json({ error: e.message }); } 
});
app.put('/api/user/:username', async (req, res) => { 
  try { await User.findOneAndUpdate({ username: req.params.username }, req.body); res.json({ message: "Updated" }); } catch (e) { res.status(500).json({ error: e.message }); } 
});
app.put('/api/user/:username/photo', async (req, res) => { 
  try { await User.findOneAndUpdate({ username: req.params.username }, { profilePic: req.body.profilePic }); res.json({ message: "Updated" }); } catch (e) { res.status(500).json({ error: e.message }); } 
});

// POSTS
app.get('/api/posts', async (req, res) => { try { res.json(await Post.find().sort({ _id: -1 })); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post('/api/posts', async (req, res) => { try { const authorUser = await User.findOne({ username: req.body.author }); const newPost = new Post({ ...req.body, authorPic: authorUser ? authorUser.profilePic : '', timestamp: "Just now", likes: 0, comments: [] }); await newPost.save(); res.json(newPost); } catch (e) { res.status(500).json({ error: e.message }); } });
app.put('/api/posts/:id/like', async (req, res) => { try { const post = await Post.findById(req.params.id); post.likes += 1; await post.save(); res.json(post); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post('/api/posts/:id/comment', async (req, res) => { try { const post = await Post.findById(req.params.id); post.comments.push({ author: req.body.author, text: req.body.text, timestamp: "Just now" }); await post.save(); res.json(post); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/posts/user/:username', async (req, res) => { try { const posts = await Post.find({ author: req.params.username }).sort({ _id: -1 }); res.json(posts); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/posts/leaderboard', async (req, res) => { try { const posts = await Post.find(); const sorted = posts.sort((a, b) => ((b.likes || 0) + (b.comments?.length || 0)) - ((a.likes || 0) + (a.comments?.length || 0))); res.json(sorted.slice(0, 10)); } catch (e) { res.status(500).json({ error: e.message }); } });

// CHAT ROUTES
app.post('/api/messages', async (req, res) => { try { const m = new Message(req.body); await m.save(); res.json(m); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/messages/:user1/:user2', async (req, res) => { try { const { user1, user2 } = req.params; const msgs = await Message.find({ $or: [{ sender: user1, recipient: user2 }, { sender: user2, recipient: user1 }] }).sort({ timestamp: 1 }); res.json(msgs); } catch (e) { res.status(500).json({ error: e.message }); } });


// --- CONNECTIONS ---
app.post('/api/connect/request', async (req, res) => {
  try {
    const { sender, recipient } = req.body;
    await User.findOneAndUpdate({ username: sender }, { $addToSet: { sentRequests: recipient } });
    await User.findOneAndUpdate({ username: recipient }, { $addToSet: { receivedRequests: sender } });
    await new Notification({ recipient, sender, message: `${sender} wants to connect with you.`, type: 'connection_request' }).save();
    res.json({ message: "Request Sent" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/connect/accept', async (req, res) => {
  try {
    const { sender, recipient } = req.body;
    await User.findOneAndUpdate({ username: sender }, { $addToSet: { connections: recipient }, $pull: { sentRequests: recipient } });
    await User.findOneAndUpdate({ username: recipient }, { $addToSet: { connections: sender }, $pull: { receivedRequests: sender } });
    await new Notification({ recipient: sender, sender: recipient, message: `${recipient} accepted your connection request!`, type: 'connection_accepted' }).save();
    res.json({ message: "Connected" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// --- MENTORSHIP & MEETING REQUESTS ---

// 1. MENTORSHIP REQUEST
app.post('/api/mentorship/request', async (req, res) => {
  try {
    const { mentorName, studentName, message } = req.body;
    if(!mentorName || !studentName) return res.status(400).json({error: "Missing fields"});

    await new Notification({
      recipient: mentorName,
      sender: studentName,
      message: message || "I am interested in mentorship.",
      type: 'mentorship_request'
    }).save();
    
    res.json({ message: "Mentorship Requested!" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. MEETING REQUEST
app.post('/api/meet/request', async (req, res) => {
  try {
    const { mentorName, studentName, message, slot } = req.body;
    await new Notification({ recipient: mentorName, sender: studentName, message: message, slot: slot, type: 'meet_request' }).save();
    res.json({ message: "Meeting requested!" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// NOTIFICATIONS
app.get('/api/notifications/:recipient', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.params.recipient }).sort({ timestamp: -1 });
    const count = notifications.filter(n => n.status === 'pending').length;
    res.json({ count, notifications });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/notifications/:id/respond', async (req, res) => {
  try {
    const { status } = req.body; 
    await Notification.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Request ${status}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// --- 👑 ADMIN PANEL ROUTES (UPDATED FOR ANALYTICS) ---

// 1. Get Stats (Added User/Content Distribution Logic)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const users = await User.countDocuments();
    const posts = await Post.countDocuments();
    const events = await Event.countDocuments();
    const opportunities = await Opportunity.countDocuments();

    // 1. User Distribution (Student vs Alumni)
    const userDistribution = await User.aggregate([
      { $group: { _id: "$userType", count: { $sum: 1 } } }
    ]);

    // 2. Content Distribution (Posts vs Events vs Opportunities)
    const contentData = [
      { name: 'Posts', value: posts },
      { name: 'Events', value: events },
      { name: 'Jobs', value: opportunities }
    ];

    res.json({ users, posts, events, opportunities, userDistribution, contentData });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. Delete User
app.delete('/api/admin/user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 3. Delete Post
app.delete('/api/admin/post/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// EVENTS & OPPORTUNITIES
app.get('/api/events', async (req, res) => { try { res.json(await Event.find(req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {})); } catch (err) { res.status(500).json({ message: "Error" }); } });
app.post('/api/events', async (req, res) => { try { await new Event(req.body).save(); res.status(201).json({ message: "Created" }); } catch (err) { res.status(400).json({ message: "Error" }); } });
app.get('/api/opportunities', async (req, res) => { try { res.json(await Opportunity.find().sort({ _id: -1 })); } catch(e) { res.status(500).json({error: e.message}); } });
app.post('/api/opportunities', async (req, res) => { try { await new Opportunity(req.body).save(); res.json({message: "Posted!"}); } catch(e) { res.status(500).json({error: e.message}); } });
app.post('/api/seed-posts', async (req, res) => { await Post.deleteMany({}); await Post.insertMany([{ author: "Alex Johnson", role: "Alumni", content: "Excited to share my research!", timestamp: "2h ago", likes: 12, comments: [] }]); res.json({ message: "Seeded" }); });

app.listen(5000, () => console.log("🚀 Server running on port 5000"));