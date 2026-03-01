const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
require('dotenv').config()

const User = require("./models/User");
const Exercise = require("./models/Exercise");

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);


// =============================
// 1. CREATE USER
// =============================
app.post("/api/users", async (req, res) => {
  const { username } = req.body;

  const user = new User({ username });
  await user.save();

  res.json({
    username: user.username,
    _id: user._id
  });
});


// =============================
// 2. GET ALL USERS
// =============================
app.get("/api/users", async (req, res) => {
  const users = await User.find();

  const formatted = users.map(user => ({
    username: user.username,
    _id: user._id
  }));

  res.json(formatted);
});


// =============================
// 3. ADD EXERCISE
// =============================
app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;

  const user = await User.findById(_id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const exercise = new Exercise({
    userId: _id,
    description,
    duration: Number(duration),
    date: date ? new Date(date) : new Date()
  });

  await exercise.save();

  res.json({
    _id: user._id,
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString()
  });
});


// =============================
// 4. GET USER LOGS
// =============================
app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const user = await User.findById(_id);
  if (!user) return res.status(404).json({ error: "User not found" });

  let filter = { userId: _id };

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  let query = Exercise.find(filter);

  if (limit) {
    query = query.limit(Number(limit));
  }

  const exercises = await query;

  const log = exercises.map(ex => ({
    description: ex.description,
    duration: ex.duration,
    date: ex.date.toDateString()
  }));

  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log
  });
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
