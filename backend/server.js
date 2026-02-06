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
  userType: String, 
  year: Number, 
  department: String, 
  collegeName: String,
  profilePic: { type: String, default: '' },
  // PROFILE FIELDS
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' }
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
      department: user.department 
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

// Like Post
app.put('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1; 
    await post.save();
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Comment on Post
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

// EVENTS
app.get('/api/events', async (req, res) => { try { res.json(await Event.find(req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {})); } catch (err) { res.status(500).json({ message: "Error" }); } });
app.post('/api/events', async (req, res) => { try { await new Event(req.body).save(); res.status(201).json({ message: "Created" }); } catch (err) { res.status(400).json({ message: "Error" }); } });
app.post('/api/seed-events', async (req, res) => { await Event.deleteMany({}); await Event.insertMany([{ title: "Network Mixer", date: "2024-03-15", location: "Main Campus", fee: "Free", category: "Networking" }]); res.json({ message: "Seeded" }); });

app.listen(5000, () => console.log("🚀 Server running on port 5000"));