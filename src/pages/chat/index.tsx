//src/pages/chat/index.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatLayout from '@/components/chat/ChatLayout';

const ChatPage: React.FC = () => {
  const { chatId } = useParams();
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
      <ChatLayout initialChatId={chatId} />
    </div>
  );
};

export default ChatPage;
