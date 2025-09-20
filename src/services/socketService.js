import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
  }

  connect(userId, userName) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io('http://localhost:5000', {
      auth: {
        userId,
        userName
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.isConnected = true;
      
      // Notify server that user is online
      this.socket.emit('user-online', {
        userId,
        userName
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-chat', chatId);
    }
  }

  leaveChat(chatId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-chat', chatId);
    }
  }

  sendMessage(chatId, message, senderId, senderName, senderType = 'user') {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', {
        chatId,
        message: { content: message },
        senderId,
        senderName,
        senderType
      });
    }
  }

  startTyping(chatId, userId, userName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-start', {
        chatId,
        userId,
        userName
      });
    }
  }

  stopTyping(chatId, userId, userName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing-stop', {
        chatId,
        userId,
        userName
      });
    }
  }

  // Event listeners
  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive-message', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message-sent', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  onUserStatus(callback) {
    if (this.socket) {
      this.socket.on('user-status', callback);
    }
  }

  // Remove event listeners
  offReceiveMessage(callback) {
    if (this.socket) {
      this.socket.off('receive-message', callback);
    }
  }

  offMessageSent(callback) {
    if (this.socket) {
      this.socket.off('message-sent', callback);
    }
  }

  offUserTyping(callback) {
    if (this.socket) {
      this.socket.off('user-typing', callback);
    }
  }

  offUserStatus(callback) {
    if (this.socket) {
      this.socket.off('user-status', callback);
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();

