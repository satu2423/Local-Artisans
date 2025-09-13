import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Send, MessageCircle, User, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat } from '../src/contexts/ChatContext';
import { useAuth } from '../src/contexts/AuthContext';
import { getImageDisplayUrl } from '../src/services/imageService';

export default function Chat() {
  const { chatId } = useParams();
  const { chats, activeChat, setActiveChat, sendMessage } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Set active chat when component mounts or chatId changes
  useEffect(() => {
    if (chatId && chats.find(chat => chat.id === chatId)) {
      setActiveChat(chatId);
    }
  }, [chatId, chats, setActiveChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      sendMessage(activeChat.id, message.trim());
      setMessage('');
      setIsTyping(true);
      
      // Stop typing indicator after a delay
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!activeChat) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <Link
                to="/marketplace"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Marketplace
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Chat with <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Artisans</span>
            </h1>
          </motion.div>

          {/* Chat List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {chats.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <MessageCircle className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No conversations yet</h2>
                <p className="text-gray-600 mb-8">Start a conversation with an artisan by clicking "Contact Artisan" on any product page</p>
                <Link to="/marketplace">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Conversations</h2>
                {chats.map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
                        chat.id === activeChat?.id ? 'ring-2 ring-orange-500' : 'hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Artisan Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={chat.artisanImage || 'https://via.placeholder.com/48'}
                            alt={chat.artisanName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Chat Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {chat.artisanName}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {formatTime(chat.lastMessageTime)}
                              </span>
                              {chat.unreadCount > 0 && (
                                <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            About: {chat.productName}
                          </p>
                          {chat.lastMessage && (
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {chat.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/chat"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={activeChat.artisanImage || 'https://via.placeholder.com/40'}
                    alt={activeChat.artisanName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {activeChat.artisanName}
                  </h1>
                  <p className="text-sm text-gray-500">Artisan</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Package className="h-4 w-4" />
              <span>About: {activeChat.productName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg h-96 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {activeChat.messages.map((msg, index) => {
                const isUser = msg.senderId === user.uid;
                const showDate = index === 0 || 
                  formatDate(msg.timestamp) !== formatDate(activeChat.messages[index - 1].timestamp);

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        {formatDate(msg.timestamp)}
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isUser 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isUser ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Artisan is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={!activeChat}
              />
              <Button
                type="submit"
                disabled={!message.trim() || !activeChat}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
              <img
                src={getImageDisplayUrl({ url: activeChat.productImage }, activeChat.productName)}
                alt={activeChat.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = getImageDisplayUrl(null, activeChat.productName);
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {activeChat.productName}
              </h3>
              <p className="text-sm text-gray-600">
                Discussing this product with {activeChat.artisanName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

