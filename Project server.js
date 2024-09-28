const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/progress_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password_hash: String,

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const progressRecordSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  date: Date,
  weight: Number,
  body_fat_percentage: Number,
  muscle_mass: Number,
  notes: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const metricSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  date: Date,
  metric_name: String,
  value: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const ProgressRecord = mongoose.model('ProgressRecord', progressRecordSchema);
const Metric = mongoose.model('Metric', metricSchema);

// API Endpoints

// Register a new user
app.post('/api/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).send(user);
});

// Login
app.post('/api/login', async (req, res) => {
  // Authentication logic here
});

// Add a new progress record
app.post('/api/users/:user_id/progress', async (req, res) => {
  const progressRecord = new ProgressRecord({ ...req.body, user_id: req.params.user_id });
  await progressRecord.save();

  res.status(201).send(progressRecord);
});

// Get all progress records for a user
app.get('/api/users/:user_id/progress', async (req, res) => {
  const progressRecords = await ProgressRecord.find({ user_id: req.params.user_id });
  res.status(200).send(progressRecords);
});

// Add a new metrics record
app.post('/api/users/:user_id/metrics', async (req, res) => {
  const metric = new Metric({ ...req.body, user_id: req.params.user_id });
  await metric.save();
  res.status(201).send(metric);
});

// Get all metrics records for a user
app.get('/api/users/:user_id/metrics', async (req, res) => {
  const metrics = await Metric.find({ user_id: req.params.user_id });
  res.status(200).send(metrics);
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
