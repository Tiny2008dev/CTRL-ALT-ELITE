require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Increase payload limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// --- DATABASE CONNECTION (LOCAL COMPASS) ---
mongoose.connect('mongodb://127.0.0.1:27017/alumniDB')
  .then(() => console.log("✅ Local MongoDB Connected (Compass)"))
  .catch(err => console.error("❌ Mongo Error:", err));


// --- SCHEMAS ---

// 1. USER SCHEMA (Updated with Connections)
const UserSchema = new mongoose.Schema({
  username: String, 
  email: String, 
  password: { type: String },
  userType: String, // 'Student' or 'Alumni'
  year: Number, 
  department: String, 
  collegeName: String,
  profilePic: { type: String, default: '' },
  
  // Profile Fields
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  currentJobRole: { type: String, default: '' },

  // --- NEW CONNECTION FIELDS ---
  connections: [{ type: String }],       // Friends (Usernames)
  sentRequests: [{ type: String }],      // I sent request to...
  receivedRequests: [{ type: String }]   // They sent request to me...
});
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
});
const Post = mongoose.model('Post', PostSchema);

// 3. EVENT SCHEMA
const EventSchema = new mongoose.Schema({
  title: String, date: String, location: String, fee: String, category: String, description: String
});
const Event = mongoose.model('Event', EventSchema);

// 4. OPPORTUNITY SCHEMA
const OpportunitySchema = new mongoose.Schema({
  title: String, type: String, domain: String, location: String, duration: String, stipend: String, description: String, posterName: String, posterRole: String, posterPic: String, tags: [String], timestamp: { type: Date, default: Date.now }
});
const Opportunity = mongoose.model('Opportunity', OpportunitySchema);

// 5. NOTIFICATION SCHEMA (Handles Meetings & Connections)
const NotificationSchema = new mongoose.Schema({
  recipient: String, 
  sender: String,    
  message: String,
  type: String,      // 'mentorship_request', 'meet_request', 'connection_request', 'connection_accepted'
  slot: String,      // For meetings
  status: { type: String, default: 'pending' }, 
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
const Notification = mongoose.model('Notification', NotificationSchema);

// 6. MESSAGE SCHEMA (Chat)
const MessageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);


// --- ROUTES ---

// AUTH & USER
app.post('/api/register', async (req, res) => { try { await new User(req.body).save(); res.status(201).json({ message: "Registered" }); } catch (err) { res.status(400).json({ message: "Error" }); } });

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username, password: req.body.password });
  if (user) {
    res.json({ 
      token: 'mock', 
      userType: user.userType, 
      username: user.username, 
      profilePic: user.profilePic, 
      collegeName: user.collegeName, 
      department: user.department,
      currentJobRole: user.currentJobRole 
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.put('/api/user/:username/photo', async (req, res) => { try { await User.findOneAndUpdate({ username: req.params.username }, { profilePic: req.body.profilePic }); res.json({ message: "Updated" }); } catch (e) { res.status(500).json({ error: e.message }); } });
app.put('/api/user/:username', async (req, res) => { try { await User.findOneAndUpdate({ username: req.params.username }, req.body); res.json({ message: "Updated" }); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/user/:username', async (req, res) => { try { const user = await User.findOne({ username: req.params.username }); res.json(user || {}); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/users/all', async (req, res) => { try { res.json(await User.find().select('-password')); } catch (e) { res.status(500).json({ error: e.message }); } });

// POSTS
app.get('/api/posts', async (req, res) => { try { res.json(await Post.find().sort({ _id: -1 })); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post('/api/posts', async (req, res) => {
  try {
    const authorUser = await User.findOne({ username: req.body.author });
    const newPost = new Post({ ...req.body, authorPic: authorUser ? authorUser.profilePic : '', timestamp: "Just now", likes: 0, comments: [] });
    await newPost.save();
    res.json(newPost);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put('/api/posts/:id/like', async (req, res) => { try { const post = await Post.findById(req.params.id); post.likes += 1; await post.save(); res.json(post); } catch (e) { res.status(500).json({ error: e.message }); } });
app.post('/api/posts/:id/comment', async (req, res) => { try { const post = await Post.findById(req.params.id); post.comments.push({ author: req.body.author, text: req.body.text, timestamp: "Just now" }); await post.save(); res.json(post); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/posts/user/:username', async (req, res) => { try { const posts = await Post.find({ author: req.params.username }).sort({ _id: -1 }); res.json(posts); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/posts/leaderboard', async (req, res) => { try { const posts = await Post.find(); const sorted = posts.sort((a, b) => ((b.likes || 0) + (b.comments?.length || 0)) - ((a.likes || 0) + (a.comments?.length || 0))); res.json(sorted.slice(0, 10)); } catch (e) { res.status(500).json({ error: e.message }); } });

// CHAT ROUTES
app.post('/api/messages', async (req, res) => { try { const m = new Message(req.body); await m.save(); res.json(m); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/messages/:user1/:user2', async (req, res) => { try { const { user1, user2 } = req.params; const msgs = await Message.find({ $or: [{ sender: user1, recipient: user2 }, { sender: user2, recipient: user1 }] }).sort({ timestamp: 1 }); res.json(msgs); } catch (e) { res.status(500).json({ error: e.message }); } });


// --- CONNECTION ROUTES (NEW) ---

// 1. Send Request
app.post('/api/connect/request', async (req, res) => {
  try {
    const { sender, recipient } = req.body;
    // Update Users
    await User.findOneAndUpdate({ username: sender }, { $addToSet: { sentRequests: recipient } });
    await User.findOneAndUpdate({ username: recipient }, { $addToSet: { receivedRequests: sender } });
    
    // Notification
    await new Notification({ recipient, sender, message: `${sender} wants to connect with you.`, type: 'connection_request' }).save();
    res.json({ message: "Request Sent" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 2. Accept Request (Triggers "Connect")
app.post('/api/connect/accept', async (req, res) => {
  try {
    const { sender, recipient } = req.body; // 'sender' is the person who originally SENT the request
    
    // Add to connections array & remove from requests
    await User.findOneAndUpdate({ username: sender }, { $addToSet: { connections: recipient }, $pull: { sentRequests: recipient } });
    await User.findOneAndUpdate({ username: recipient }, { $addToSet: { connections: sender }, $pull: { receivedRequests: sender } });

    // Notify the original sender
    await new Notification({ recipient: sender, sender: recipient, message: `${recipient} accepted your connection request!`, type: 'connection_accepted' }).save();
    res.json({ message: "Connected" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// MEETING REQUESTS
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

// EVENTS & OPPORTUNITIES
app.get('/api/events', async (req, res) => { try { res.json(await Event.find(req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {})); } catch (err) { res.status(500).json({ message: "Error" }); } });
app.post('/api/events', async (req, res) => { try { await new Event(req.body).save(); res.status(201).json({ message: "Created" }); } catch (err) { res.status(400).json({ message: "Error" }); } });
app.get('/api/opportunities', async (req, res) => { try { res.json(await Opportunity.find().sort({ _id: -1 })); } catch(e) { res.status(500).json({error: e.message}); } });
app.post('/api/opportunities', async (req, res) => { try { await new Opportunity(req.body).save(); res.json({message: "Posted!"}); } catch(e) { res.status(500).json({error: e.message}); } });

// SEEDERS
app.post('/api/seed-posts', async (req, res) => { await Post.deleteMany({}); await Post.insertMany([{ author: "Alex Johnson", role: "Alumni", content: "Excited to share my research!", timestamp: "2h ago", likes: 12, comments: [] }]); res.json({ message: "Seeded" }); });

app.listen(5000, () => console.log("🚀 Server running on port 5000"));