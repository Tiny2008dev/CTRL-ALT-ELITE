const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// Increase payload limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/alumniDB')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// --- SCHEMAS ---

// 1. USER SCHEMA
const UserSchema = new mongoose.Schema({
  username: String, 
  email: String, 
  password: { type: String },
  userType: String, // 'Student' or 'Alumni'
  year: Number, 
  department: String, 
  collegeName: String,
  profilePic: { type: String, default: '' },
  
  // PROFILE FIELDS
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  
  // JOB ROLE (For Alumni)
  currentJobRole: { type: String, default: '' } 
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

// 4. OPPORTUNITY SCHEMA (Mentorship/Jobs)
const OpportunitySchema = new mongoose.Schema({
  title: String,
  type: String, // 'Mentorship', 'Internship', 'Job'
  domain: String, 
  location: String, 
  duration: String,
  stipend: String,
  description: String,
  posterName: String,
  posterRole: String,
  posterPic: String,
  tags: [String],
  timestamp: { type: Date, default: Date.now }
});
const Opportunity = mongoose.model('Opportunity', OpportunitySchema);

// 5. NOTIFICATION SCHEMA (Updated)
const NotificationSchema = new mongoose.Schema({
  recipient: String, // Mentor username
  sender: String,    // Student username
  message: String,
  type: String,      // 'mentorship_request'
  status: { type: String, default: 'pending' }, // <--- NEW: pending, accepted, rejected
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});
const Notification = mongoose.model('Notification', NotificationSchema);


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
app.get('/api/users/suggested', async (req, res) => { try { res.json(await User.find().select('username userType profilePic').limit(3)); } catch (e) { res.status(500).json({ error: e.message }); } });
app.get('/api/users/all', async (req, res) => { try { res.json(await User.find().select('-password')); } catch (e) { res.status(500).json({ error: e.message }); } });

// POSTS & SOCIAL
app.get('/api/posts', async (req, res) => { try { res.json(await Post.find().sort({ _id: -1 })); } catch (e) { res.status(500).json({ error: e.message }); } });

app.post('/api/posts', async (req, res) => {
  try {
    const authorUser = await User.findOne({ username: req.body.author });
    const newPost = new Post({ 
      ...req.body, 
      authorPic: authorUser ? authorUser.profilePic : '', 
      timestamp: "Just now", 
      likes: 0, 
      comments: [] 
    });
    await newPost.save();
    res.json(newPost);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1; 
    await post.save();
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { author, text } = req.body;
    post.comments.push({ author, text, timestamp: "Just now" });
    await post.save();
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/seed-posts', async (req, res) => {
  await Post.deleteMany({});
  await Post.insertMany([{ author: "Alex Johnson", role: "Alumni", content: "Excited to share my research!", timestamp: "2h ago", likes: 12, comments: [] }]);
  res.json({ message: "Seeded" });
});
// [EXISTING CODE] ...

// --- NEW ROUTE: GET POSTS BY SPECIFIC USER ---
app.get('/api/posts/user/:username', async (req, res) => {
  try {
    // Find posts where author matches the username, newest first
    const posts = await Post.find({ author: req.params.username }).sort({ _id: -1 });
    res.json(posts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
// [EXISTING CODE] ...

// --- NEW ROUTE: LEADERBOARD (Top 10 Posts) ---
app.get('/api/posts/leaderboard', async (req, res) => {
  try {
    // Fetch all posts (For a hackathon, sorting in JS is fine. For prod, use .aggregate)
    const posts = await Post.find();
    
    // Sort by Engagement (Likes + Comments)
    const sortedPosts = posts.sort((a, b) => {
      const scoreA = (a.likes || 0) + (a.comments ? a.comments.length : 0);
      const scoreB = (b.likes || 0) + (b.comments ? b.comments.length : 0);
      return scoreB - scoreA; // Descending order
    });

    // Return top 10
    res.json(sortedPosts.slice(0, 10));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// [EXISTING CODE] ...

// EVENTS
app.get('/api/events', async (req, res) => { try { res.json(await Event.find(req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {})); } catch (err) { res.status(500).json({ message: "Error" }); } });
app.post('/api/events', async (req, res) => { try { await new Event(req.body).save(); res.status(201).json({ message: "Created" }); } catch (err) { res.status(400).json({ message: "Error" }); } });
app.post('/api/seed-events', async (req, res) => { await Event.deleteMany({}); await Event.insertMany([{ title: "Network Mixer", date: "2024-03-15", location: "Main Campus", fee: "Free", category: "Networking" }]); res.json({ message: "Seeded" }); });

// MENTORSHIP & OPPORTUNITIES
app.get('/api/opportunities', async (req, res) => {
  try { res.json(await Opportunity.find().sort({ _id: -1 })); } 
  catch(e) { res.status(500).json({error: e.message}); }
});

app.post('/api/opportunities', async (req, res) => {
  try { await new Opportunity(req.body).save(); res.json({message: "Posted!"}); } 
  catch(e) { res.status(500).json({error: e.message}); }
});

app.post('/api/mentorship/request', async (req, res) => {
  try {
    const { mentorName, studentName, message } = req.body;
    await new Notification({
      recipient: mentorName,
      sender: studentName,
      message: message,
      type: 'mentorship_request'
    }).save();
    res.json({message: "Request sent!"});
  } 
  catch(e) { res.status(500).json({error: e.message}); }
});

// NOTIFICATIONS (Updated Routes)

// Get all notifications for user
app.get('/api/notifications/:recipient', async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.params.recipient 
    }).sort({ timestamp: -1 });
    
    // Count pending only
    const count = notifications.filter(n => n.status === 'pending').length;
    res.json({ count, notifications });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Respond to notification (Accept/Reject)
app.put('/api/notifications/:id/respond', async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    await Notification.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Request ${status}` });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Seed Opportunities
app.post('/api/seed-opportunities', async (req, res) => {
  await Opportunity.deleteMany({});
  await Opportunity.insertMany([
    {
      title: "Summer Software Engineering Internship",
      type: "Internship",
      domain: "Tech",
      location: "Remote",
      duration: "3 Months",
      stipend: "Paid",
      description: "Seeking a motivated student for a 3-month paid internship. Python/JS preferred.",
      posterName: "Sarah Lee",
      posterRole: "CEO & Founder",
      tags: ["Internship", "Paid", "Remote"]
    }
  ]);
  res.json({ message: "Opps Seeded" });
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));