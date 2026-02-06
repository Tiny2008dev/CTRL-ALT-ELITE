const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// PASTE IT HERE:
mongoose.connect('mongodb://localhost:27017/alumniDB') 
  .then(() => console.log("CONNECTED TO COMPASS"))
  .catch(err => console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: { type: String }, 
  userType: String,
  year: Number,
  department: String
}));

app.post('/api/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json({ message: "User Saved" });
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username, password: req.body.password });
  if (user) res.json({ token: 'success-token', userType: user.userType });
  else res.status(401).json({ message: "Invalid credentials" });
});

app.listen(5000, () => console.log("Server running on 5000"));