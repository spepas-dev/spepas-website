import { Chat, Message, User } from './types';

export const ME: User = {
  id: 'me',
  name: 'You',
  avatar: 'https://i.pravatar.cc/100?img=68',
  isOnline: true,
};

export const USERS: Record<string, User> = {
  me: ME,
  u1: { id: 'u1', name: 'Kwabena', avatar: 'https://i.pravatar.cc/100?img=12', isOnline: true, org: 'Ghana Spare Parts LTD.' },
  u2: { id: 'u2', name: 'Kwaku', avatar: 'https://i.pravatar.cc/100?img=25', isOnline: false },
  u3: { id: 'u3', name: 'Nuella', avatar: 'https://i.pravatar.cc/100?img=32', isOnline: true },
};

export const CHATS: Chat[] = [
  { id: 'c1', title: 'Kwabena', isGroup: false, participants: ['me','u1'], pinned: true, unread: 2, lastMessageAt: Date.now() - 1000 * 60 * 2 },
  { id: 'c2', title: 'Kwaku',   isGroup: false, participants: ['me','u2'], unread: 0, lastMessageAt: Date.now() - 1000 * 60 * 120 },
  { id: 'c3', title: 'Nuella',  isGroup: false, participants: ['me','u3'], unread: 0, lastMessageAt: Date.now() - 1000 * 60 * 60 * 24 },
];

const base = Date.now() - 1000 * 60 * 60;
export const MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', chatId: 'c1', senderId: 'u1', text: 'Where are you right now?', createdAt: base + 1000 * 60 * 5, status: 'read' },
    { id: 'm2', chatId: 'c1', senderId: 'me', text: 'Hello, good morning', createdAt: base + 1000 * 60 * 6, status: 'read' },
    { id: 'm3', chatId: 'c1', senderId: 'u1', text: 'I am outside', createdAt: base + 1000 * 60 * 7, status: 'delivered' },
  ],
  c2: [
    { id: 'm4', chatId: 'c2', senderId: 'u2', text: 'Package ready ✅', createdAt: base - 1000 * 60 * 50, status: 'read' },
  ],
  c3: [
    { id: 'm5', chatId: 'c3', senderId: 'u3', text: 'Is this product still available and…', createdAt: base - 1000 * 60 * 1300, status: 'read' },
  ],
};
