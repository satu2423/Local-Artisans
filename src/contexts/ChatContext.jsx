import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Chat Context
const ChatContext = createContext();

// Chat Actions
const CHAT_ACTIONS = {
  START_CHAT: 'START_CHAT',
  SEND_MESSAGE: 'SEND_MESSAGE',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  LOAD_CHATS: 'LOAD_CHATS',
  SET_ACTIVE_CHAT: 'SET_ACTIVE_CHAT',
  MARK_AS_READ: 'MARK_AS_READ'
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

    default:
      return state;
  }
};

// Initial Chat State
const initialChatState = {
  chats: [],
  activeChatId: null
};

// Chat Provider Component
export const ChatProvider = ({ children }) => {
  const [chatState, dispatch] = useReducer(chatReducer, initialChatState);
  const { user } = useAuth();

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
  const startChat = (artisanData, productData) => {
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
        productImage: productData.images?.[0]?.url
      }
    });

    return chatId;
  };

  const sendMessage = (chatId, content) => {
    dispatch({
      type: CHAT_ACTIONS.SEND_MESSAGE,
      payload: {
        chatId,
        senderId: user.uid,
        senderName: user.name || user.displayName,
        content
      }
    });

    // Simulate artisan response (in a real app, this would be handled by a backend)
    setTimeout(() => {
      simulateArtisanResponse(chatId);
    }, 1000 + Math.random() * 2000);
  };

  const simulateArtisanResponse = (chatId) => {
    const responses = [
      "Thank you for your interest in my work! I'd be happy to answer any questions you have.",
      "That's a great question! Let me provide you with more details about this piece.",
      "I'm glad you like this product! Would you like to know more about the materials used?",
      "Thank you for reaching out! This piece was crafted with traditional techniques.",
      "I appreciate your interest! This item is one of my favorites from my recent collection.",
      "Hello! I'm excited to tell you more about this handcrafted piece.",
      "Thank you for your message! I'd love to share the story behind this creation.",
      "I'm here to help! What would you like to know about this product?"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    dispatch({
      type: CHAT_ACTIONS.RECEIVE_MESSAGE,
      payload: {
        chatId,
        messageId: Date.now().toString(),
        senderId: 'artisan',
        senderName: 'Artisan',
        content: randomResponse
      }
    });
  };

  const setActiveChat = (chatId) => {
    dispatch({ type: CHAT_ACTIONS.SET_ACTIVE_CHAT, payload: chatId });
    dispatch({ type: CHAT_ACTIONS.MARK_AS_READ, payload: chatId });
  };

  const getActiveChat = () => {
    return chatState.chats.find(chat => chat.id === chatState.activeChatId);
  };

  const getTotalUnreadCount = () => {
    return chatState.chats.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  const value = {
    chats: chatState.chats,
    activeChatId: chatState.activeChatId,
    activeChat: getActiveChat(),
    startChat,
    sendMessage,
    setActiveChat,
    getTotalUnreadCount
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

