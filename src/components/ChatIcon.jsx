import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

const ChatIcon = () => {
  const { getTotalUnreadCount } = useChat();
  const unreadCount = getTotalUnreadCount();

  return (
    <Link
      to="/chat"
      className="relative flex items-center justify-center p-2 text-gray-600 hover:text-orange-500 transition-colors"
      title="Chat with Artisans"
    >
      <MessageCircle className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatIcon;

