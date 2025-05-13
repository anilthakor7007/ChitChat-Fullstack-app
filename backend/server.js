const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Store usernames and their socket IDs
const users = new Map(); // { socketId: username }
const messages = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle username registration
  socket.on('setUsername', (username) => {
    users.set(socket.id, username || `User_${socket.id.slice(0, 4)}`);
    console.log('Username set:', users.get(socket.id));
    // Broadcast updated user list
    io.emit('users', Array.from(users.entries()));
  });

  // Handle joining a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`${users.get(socket.id)} joined room: ${room}`);
    socket.emit('joinedRoom', room); // Confirm to user
  });

  // Handle room messages
  socket.on('roomMessage', ({ room, message }) => {
    const username = users.get(socket.id) || 'Anonymous';
    const messageId = `${socket.id}-${Date.now()}`;
    console.log(`${username} in ${room}: ${message}`);
    messages.set(messageId, { from: username, toRoom: room, message, status: 'sent' });
// Emit to room (including sender)
io.to(room).emit('roomMessage', { id: messageId, from: username, message, room, status: 'sent' });

// Simulate "delivered" after a delay (replace with real logic if needed)
setTimeout(() => {
  messages.set(messageId, { ...messages.get(messageId), status: 'delivered' });
  io.to(room).emit('messageStatus', { id: messageId, status: 'delivered' });
}, 1000);
  });

  socket.on('messageRead', (messageId) => {
    if (messages.has(messageId)) {
      messages.set(messageId, { ...messages.get(messageId), status: 'read' });
      io.to(messages.get(messageId).toRoom).emit('messageStatus', { id: messageId, status: 'read' });
    }
  });

  socket.on('typing', (room) => {
    const username = users.get(socket.id) || 'Anonymous';
    socket.to(room).emit('typing', { username, room }); // Exclude sender
  });

  socket.on('stopTyping', (room) => {
    const username = users.get(socket.id) || 'Anonymous';
    socket.to(room).emit('stopTyping', { username, room });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    users.delete(socket.id);
    io.emit('users', Array.from(users.entries()));
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});