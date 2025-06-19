const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Poll = require('./models/Poll');

let currentPoll = null;
let answers = {};
let submitted = new Set(); // ⛔ Track who already submitted
let students = {};

// 🔴 Poll History API
app.get('/api/polls', async (req, res) => {
  try {
    const polls = await Poll.find({}).sort({ createdAt: -1 }).limit(10);
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
});

// 🔌 Socket Events
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

 socket.on('create_poll', async ({ question, options }) => {
  if (currentPoll && currentPoll.isActive) {
    socket.emit('error_message', 'A poll is already active. Wait for it to finish.');
    return;
  }

  currentPoll = new Poll({ question, options, isActive: true });
  answers = {};
  await currentPoll.save();

  io.emit('new_poll', currentPoll);

  setTimeout(() => {
   currentPoll.isActive = false;
currentPoll.responses = answers;
currentPoll.save();

io.emit('poll_result', answers);
currentPoll = null;
  }, 60000);
});


socket.on('submit_answer', ({ option }) => {
  if (!currentPoll || !currentPoll.isActive) return;
  if (submitted.has(socket.id)) return; // Prevent multiple votes

  submitted.add(socket.id);
  answers[option] = (answers[option] || 0) + 1;
  io.emit('poll_result', answers);
});

  socket.on('chat_message', ({ user, msg }) => {
  io.emit('chat_message', { user, msg });
});

socket.on('request_result', () => {
  if (!currentPoll || !currentPoll.responses) return;
  socket.emit('poll_result', currentPoll.responses);
});


  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
  socket.on('student_join', (name) => {
  students[socket.id] = name;
  io.emit('student_list', Object.entries(students).map(([id, name]) => ({ id, name })));
});
socket.on('kick_student', (id) => {
  io.to(id).emit('kicked');
  delete students[id];
  io.emit('student_list', Object.entries(students).map(([id, name]) => ({ id, name })));
});
socket.on('disconnect', () => {
  delete students[socket.id];
  io.emit('student_list', Object.entries(students).map(([id, name]) => ({ id, name })));
});





});


server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
