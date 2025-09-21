import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { socketService } from '../services/socketService';

// Chat Context
const ChatContext = createContext();

// Chat Actions
const CHAT_ACTIONS = {
  START_CHAT: 'START_CHAT',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  LOAD_CHATS: 'LOAD_CHATS',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  MARK_AS_READ: 'MARK_AS_READ',
  SET_TYPING: 'SET_TYPING',
  SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
  CLEAR_ALL_CHATS: 'CLEAR_ALL_CHATS'
};

// Chat Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case CHAT_ACTIONS.START_CHAT:
      const newChat = {
        id: action.payload.chatId,
        artisanId: action.payload.artisanId,
        artisanName: action.payload.artisanName,
        artisanImage: action.payload.artisanImage,
        productId: action.payload.productId,
        productName: action.payload.productName,
        productDescription: action.payload.productDescription,
        productCategory: action.payload.productCategory,
        productPrice: action.payload.productPrice,
        productMaterials: action.payload.productMaterials,
        productDimensions: action.payload.productDimensions,
        productLocation: action.payload.productLocation,
        productImage: action.payload.productImage,
        messages: [],
        lastMessage: null,
        lastMessageTime: new Date(),
        unreadCount: 0,
        isActive: false
      };
      
      return {
        ...state,
        chats: [newChat, ...state.chats],
        activeChatId: newChat.id
      };

    case CHAT_ACTIONS.SEND_MESSAGE:
      console.log('SEND_MESSAGE action:', action.payload);
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.id === action.payload.chatId) {
            const newMessage = {
              id: Date.now().toString(),
              senderId: action.payload.senderId,
              senderName: action.payload.senderName,
              content: action.payload.content,
              timestamp: new Date(),
              isRead: false
            };
            
            console.log('Adding message to chat:', chat.id, newMessage);
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage.content,
              lastMessageTime: newMessage.timestamp
            };
          }
          return chat;
        })
      };

    case CHAT_ACTIONS.RECEIVE_MESSAGE:
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.id === action.payload.chatId) {
            const newMessage = {
              id: action.payload.messageId,
              senderId: action.payload.senderId,
              senderName: action.payload.senderName,
              content: action.payload.content,
              timestamp: new Date(),
              isRead: false
            };
            
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage.content,
              lastMessageTime: newMessage.timestamp,
              unreadCount: chat.id === state.activeChatId ? chat.unreadCount : chat.unreadCount + 1
            };
          }
          return chat;
        })
      };

    case CHAT_ACTIONS.LOAD_CHATS:
      return {
        ...state,
        chats: action.payload
      };

    case CHAT_ACTIONS.SET_ACTIVE_CHAT:
      return {
        ...state,
        activeChatId: action.payload,
        chats: state.chats.map(chat => ({
          ...chat,
          isActive: chat.id === action.payload
        }))
      };

    case CHAT_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.id === action.payload) {
            return {
              ...chat,
              unreadCount: 0,
              messages: chat.messages.map(msg => ({ ...msg, isRead: true }))
            };
          }
          return chat;
        })
      };

    case CHAT_ACTIONS.SET_TYPING:
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.id === action.payload.chatId) {
            return {
              ...chat,
              isTyping: action.payload.isTyping,
              typingUser: action.payload.typingUser
            };
          }
          return chat;
        })
      };

    case CHAT_ACTIONS.SET_ONLINE_STATUS:
      return {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.artisanId === action.payload.userId) {
            return {
              ...chat,
              artisanOnline: action.payload.isOnline
            };
          }
          return chat;
        })
      };

    case CHAT_ACTIONS.CLEAR_ALL_CHATS:
      return {
        ...state,
        chats: [],
        activeChatId: null
      };

    default:
      return state;
  }
};

// Initial Chat State
const initialChatState = {
  chats: [],
  activeChatId: null,
  isConnected: false
};

// Chat Provider Component
export const ChatProvider = ({ children }) => {
  const [chatState, dispatch] = useReducer(chatReducer, initialChatState);
  const { user } = useAuth();

  // Initialize socket connection when user is available
  useEffect(() => {
    if (user?.uid) {
      socketService.connect(user.uid, user.name || user.displayName);
      
      // Set up socket event listeners
      socketService.onReceiveMessage((message) => {
        dispatch({
          type: CHAT_ACTIONS.RECEIVE_MESSAGE,
          payload: {
            chatId: message.chatId,
            messageId: message.id,
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            timestamp: message.timestamp
          }
        });
      });

      socketService.onUserTyping((data) => {
        dispatch({
          type: CHAT_ACTIONS.SET_TYPING,
          payload: {
            chatId: data.chatId,
            isTyping: data.isTyping,
            typingUser: data.userName
          }
        });
      });

      socketService.onUserStatus((data) => {
        dispatch({
          type: CHAT_ACTIONS.SET_ONLINE_STATUS,
          payload: {
            userId: data.userId,
            isOnline: data.isOnline
          }
        });
      });
    }

    return () => {
      if (user?.uid) {
        socketService.disconnect();
      }
    };
  }, [user?.uid, user?.name, user?.displayName]);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('artisanChats');
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        dispatch({ type: CHAT_ACTIONS.LOAD_CHATS, payload: parsedChats });
      } catch (error) {
        console.error('Error loading chats from localStorage:', error);
      }
    }
  }, []);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('artisanChats', JSON.stringify(chatState.chats));
  }, [chatState.chats]);

  // Chat Actions
  const startChat = useCallback((artisanData, productData) => {
    if (!user?.uid) {
      console.error('Cannot start chat: User not authenticated');
      return null;
    }
    
    const chatId = `${user.uid}_${artisanData.artisanId}_${productData.id}`;
    
    // Check if chat already exists
    const existingChat = chatState.chats.find(chat => chat.id === chatId);
    if (existingChat) {
      dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: chatId });
      return chatId;
    }

    dispatch({
      type: CHAT_ACTIONS.START_CHAT,
      payload: {
        chatId,
        artisanId: artisanData.artisanId,
        artisanName: artisanData.artisanName,
        artisanImage: artisanData.artisanImage,
        productId: productData.id,
        productName: productData.name,
        productDescription: productData.description,
        productCategory: productData.category,
        productPrice: productData.price,
        productMaterials: productData.materials,
        productDimensions: productData.dimensions,
        productLocation: productData.location,
        productImage: productData.images?.[0]?.url
      }
    });

    return chatId;
  }, [user?.uid, chatState.chats]);

  const sendMessage = useCallback((chatId, content) => {
    if (!user?.uid) {
      console.error('Cannot send message: User not authenticated');
      return;
    }
    
    // Send message via socket
    socketService.sendMessage(
      chatId,
      content,
      user.uid,
      user.name || user.displayName,
      'user'
    );

    // Add message to local state immediately for optimistic UI
    console.log('Sending message:', { chatId, content, senderId: user.uid });
    dispatch({
      type: CHAT_ACTIONS.SEND_MESSAGE,
      payload: {
        chatId,
        senderId: user.uid,
        senderName: user.name || user.displayName,
        content
      }
    });

    // Simulate artisan response (in a real app, this would be handled by the artisan's client)
    setTimeout(() => {
      simulateArtisanResponse(chatId);
    }, 1000 + Math.random() * 2000);
  }, [user?.uid, user?.name, user?.displayName]);

  const simulateArtisanResponse = async (chatId) => {
    try {
      // Get the active chat to access product and artisan information
      const activeChat = chatState.chats.find(chat => chat.id === chatId);
      if (!activeChat) {
        console.log('No active chat found for ID:', chatId);
        return;
      }

      // Get the last user message for context
      const lastUserMessage = activeChat.messages
        .filter(msg => msg.senderId !== 'artisan')
        .slice(-1)[0];

      console.log('Active chat messages:', activeChat.messages);
      console.log('Last user message:', lastUserMessage);

      if (!lastUserMessage) {
        console.log('No user message found for AI response');
        return;
      }

      // Import AI service dynamically
      const { aiService } = await import('../services/aiService');
      
      // Create artisan-specific prompt with detailed product context
      const artisanPrompt = `You are a skilled artisan responding to a customer inquiry about your handcrafted product. 

ARTISAN CONTEXT:
- Artisan Name: ${activeChat.artisanName}
- Product: ${activeChat.productName}
- Product Description: ${activeChat.productDescription || 'Handcrafted item'}
- Category: ${activeChat.productCategory || 'Artisan Craft'}
- Price: ₹${activeChat.productPrice || 'Contact for pricing'}
- Materials: ${activeChat.productMaterials || 'High-quality materials'}
- Dimensions: ${activeChat.productDimensions || 'Various sizes available'}
- Location: ${activeChat.productLocation || 'Local artisan'}

CUSTOMER MESSAGE: "${lastUserMessage.content}"

RESPONSE GUIDELINES:
1. Respond as the actual artisan who created this specific product
2. Use the product details above to provide accurate, specific information
3. Be knowledgeable about your craft, materials, and techniques
4. Be warm, professional, and passionate about your work
5. Answer questions about materials, techniques, care instructions, customization, or pricing
6. Keep responses conversational but informative (2-3 sentences)
7. If asked about pricing, reference the actual price (₹${activeChat.productPrice || 'contact for pricing'})
8. If asked about materials, mention the specific materials used
9. If asked about shipping, mention careful packaging and delivery times
10. Encourage further questions and engagement

Respond as the artisan would, with expertise and enthusiasm about this specific piece.`;

      // Generate AI response
      const aiResponse = await aiService.generateArtisanResponse(artisanPrompt);
      
      dispatch({
        type: CHAT_ACTIONS.RECEIVE_MESSAGE,
        payload: {
          chatId,
          messageId: Date.now().toString(),
          senderId: 'artisan',
          senderName: activeChat.artisanName,
          content: aiResponse
        }
      });
    } catch (error) {
      console.error('Error generating artisan AI response:', error);
      
      // Fallback to intelligent responses based on user input
      const fallbackResponse = getIntelligentArtisanResponse(lastUserMessage?.content || '');
      
      dispatch({
        type: CHAT_ACTIONS.RECEIVE_MESSAGE,
        payload: {
          chatId,
          messageId: Date.now().toString(),
          senderId: 'artisan',
          senderName: 'Artisan',
          content: fallbackResponse
        }
      });
    }
  };

  // Intelligent fallback responses for artisan chat
  const getIntelligentArtisanResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return "Thank you for your interest! The price reflects the quality of materials and the time invested in creating this piece. Each item is handcrafted with attention to detail. Would you like to know more about the materials or techniques used?";
    }
    
    if (message.includes('material') || message.includes('what is it made of')) {
      return "I use high-quality, carefully selected materials for all my pieces. The specific materials depend on the item, but I always prioritize durability and beauty. I'd be happy to share more details about the materials used in this particular piece!";
    }
    
    if (message.includes('shipping') || message.includes('delivery') || message.includes('ship')) {
      return "I take great care in packaging each piece to ensure it arrives safely. Shipping typically takes 5-14 business days, and I use protective materials to prevent any damage during transit. Would you like to know more about the shipping process?";
    }
    
    if (message.includes('custom') || message.includes('personalize') || message.includes('special order')) {
      return "I love creating custom pieces! I can often accommodate special requests, different colors, sizes, or personal touches. Each custom piece is unique and made just for you. What did you have in mind?";
    }
    
    if (message.includes('care') || message.includes('maintain') || message.includes('clean')) {
      return "Proper care will help your piece last for years to come! I'll provide specific care instructions based on the materials used. Generally, gentle cleaning and proper storage are key to maintaining the beauty of handcrafted items.";
    }
    
    if (message.includes('technique') || message.includes('how is it made') || message.includes('process')) {
      return "I use traditional techniques passed down through generations, combined with modern innovations. Each piece is carefully crafted by hand, which is why no two items are exactly alike. I'd be delighted to share more about my creative process!";
    }
    
    if (message.includes('time') || message.includes('how long') || message.includes('duration')) {
      return "Creating quality handcrafted pieces takes time and patience. The exact timeframe depends on the complexity of the item, but I never rush the process. Quality craftsmanship requires attention to detail at every step.";
    }
    
    // Default response
    return "Thank you for your message! I'm passionate about my craft and love sharing the story behind each piece. I'd be happy to answer any questions you have about my work, techniques, or this particular item. What would you like to know?";
  };

  const setActiveChat = useCallback((chatId) => {
    // Leave previous chat room if exists
    if (chatState.activeChatId && chatState.activeChatId !== chatId) {
      socketService.leaveChat(chatState.activeChatId);
    }
    
    // Join new chat room
    socketService.joinChat(chatId);
    
    dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: chatId });
    dispatch({ type: CHAT_ACTIONS.MARK_AS_READ, payload: chatId });
  }, [chatState.activeChatId]);

  const getActiveChat = () => {
    return chatState.chats.find(chat => chat.id === chatState.activeChatId);
  };

  const getTotalUnreadCount = useCallback(() => {
    return chatState.chats.reduce((total, chat) => total + chat.unreadCount, 0);
  }, [chatState.chats]);

  const clearAllChats = useCallback(() => {
    dispatch({ type: CHAT_ACTIONS.CLEAR_ALL_CHATS });
    localStorage.removeItem('artisanChats');
  }, []);

  const value = {
    chats: chatState.chats,
    activeChatId: chatState.activeChatId,
    activeChat: getActiveChat(),
    isConnected: socketService.getConnectionStatus(),
    startChat,
    sendMessage,
    setActiveChat,
    getTotalUnreadCount,
    clearAllChats
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;

