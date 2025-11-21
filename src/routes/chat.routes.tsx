import { RouteObject } from 'react-router-dom';
import ChatPage from '@/pages/chat';

export const chatRoutes: RouteObject[] = [
  { path: 'chat', element: <ChatPage /> },
  { path: 'chat/:chatId', element: <ChatPage /> },
];
