import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '../src/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../src/services/aiService';

export default function Assistant() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    // Load conversation history from localStorage
    const savedMessages = localStorage.getItem('assistant-conversation');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    }
    
    // Default welcome message
    return [
      {
        id: 1,
        type: 'bot',
        content: "Hello! I'm Artie, your AI-powered Local Artisans Assistant! 🎨 I'm passionate about connecting you with amazing handcrafted treasures and the talented artisans who create them. I can help you discover unique pieces, learn about traditional techniques, get personalized recommendations, and find exactly what you're looking for. What would you like to explore today?",
        timestamp: new Date()
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Redirect to login if not authenticated (but wait for loading to complete)
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 1) { // Don't save just the initial message
      localStorage.setItem('assistant-conversation', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Use AI service for intelligent responses with conversation context
      const botResponse = await aiService.generateChatbotResponse(currentInput, messages);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback to basic response if AI fails
      const fallbackResponse = generateBotResponse(currentInput);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: fallbackResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('pottery') || input.includes('ceramic')) {
      return "I'd be happy to help you find pottery and ceramics! We have amazing artisans specializing in hand-thrown pottery, glazed ceramics, and traditional techniques. Would you like me to show you some specific pieces or help you find artisans in a particular region?";
    } else if (input.includes('jewelry') || input.includes('accessories')) {
      return "Our jewelry collection features unique handcrafted pieces from talented artisans worldwide. From delicate wire work to bold statement pieces, we have something for every style. Are you looking for a specific type of jewelry or material?";
    } else if (input.includes('woodwork') || input.includes('wood')) {
      return "Woodworking is one of our most popular categories! Our artisans create everything from furniture to decorative carvings using traditional techniques. What type of woodwork are you interested in?";
    } else if (input.includes('price') || input.includes('cost')) {
      return "Our artisans set their own prices based on materials, time, and craftsmanship. Prices typically range from $25 to $500+ depending on the item's complexity and materials. Would you like me to help you find items within a specific price range?";
    } else if (input.includes('shipping') || input.includes('delivery')) {
      return "Most of our artisans offer worldwide shipping! Shipping costs and delivery times vary by artisan and location. Many offer free shipping on orders over a certain amount. Would you like me to check shipping options for a specific item?";
    } else if (input.includes('artisan') || input.includes('maker')) {
      return "Our artisans are carefully selected for their skill, authenticity, and commitment to traditional craftsmanship. Each has a unique story and specializes in different techniques. Would you like to learn about artisans in a specific craft or region?";
    } else if (input.includes('help') || input.includes('support')) {
      return "I'm here to help! I can assist you with finding products, learning about artisans, understanding pricing, shipping information, or any other marketplace questions. What would you like to know?";
    } else {
      return "That's an interesting question! While I don't have specific information about that, I can help you explore our marketplace, find specific types of handcrafted items, or connect you with artisans who might be able to help. What else can I assist you with?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    const newMessages = [
      {
        id: 1,
        type: 'bot',
        content: "Hello! I'm Artie, your AI-powered Local Artisans Assistant! 🎨 I'm passionate about connecting you with amazing handcrafted treasures and the talented artisans who create them. I can help you discover unique pieces, learn about traditional techniques, get personalized recommendations, and find exactly what you're looking for. What would you like to explore today?",
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
    localStorage.removeItem('assistant-conversation');
  };

  // Show loading if user is not loaded yet
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const quickQuestions = [
    "Show me unique pottery pieces",
    "What jewelry styles do you have?",
    "Tell me about woodworking techniques",
    "How do I care for handcrafted items?",
    "What makes your artisans special?",
    "Can I get custom orders?",
    "What's your shipping policy?",
    "Show me beginner-friendly crafts"
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Artisan <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Assistant</span>
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized help finding the perfect handcrafted items and connecting with talented artisans.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Artie - Artisan Assistant</h2>
                  <p className="text-orange-100">Online now • AI-powered</p>
                </div>
              </div>
              <button
                onClick={clearConversation}
                className="text-orange-100 hover:text-white transition-colors text-sm px-3 py-1 rounded-full hover:bg-white/10"
                title="Clear conversation"
              >
                Clear Chat
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="p-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about our artisans and products..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
