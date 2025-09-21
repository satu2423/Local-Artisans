import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRouter from './auth.js';
import googleAuthRouter from './googleAuth.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/google', googleAuthRouter);
app.use('/api/auth/google', googleAuthRouter); // Add this route for compatibility

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a chat room
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Leave a chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}`);
  });

  // Handle sending messages
  socket.on('send-message', (data) => {
    const { chatId, message, senderId, senderName, senderType } = data;
    
    // Broadcast message to all users in the chat room
    socket.to(chatId).emit('receive-message', {
      id: Date.now().toString(),
      chatId,
      senderId,
      senderName,
      senderType,
      content: message.content,
      timestamp: new Date(),
      isRead: false
    });

    // Send confirmation back to sender
    socket.emit('message-sent', {
      id: Date.now().toString(),
      chatId,
      senderId,
      senderName,
      senderType,
      content: message.content,
      timestamp: new Date(),
      isRead: true
    });

    console.log(`Message sent in chat ${chatId} by ${senderName}`);
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(data.chatId).emit('user-typing', {
      chatId: data.chatId,
      userId: data.userId,
      userName: data.userName,
      isTyping: true
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(data.chatId).emit('user-typing', {
      chatId: data.chatId,
      userId: data.userId,
      userName: data.userName,
      isTyping: false
    });
  });

  // Handle user online status
  socket.on('user-online', (data) => {
    socket.broadcast.emit('user-status', {
      userId: data.userId,
      userName: data.userName,
      isOnline: true
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Socket.io support`);
});