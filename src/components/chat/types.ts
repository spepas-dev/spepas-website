//src/components/chat/types.ts
export type User = {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
    org?: string;
  };
  
  export type Attachment = {
    id: string;
    type: 'image' | 'file';
    url: string;
    name?: string;
    size?: number;
  };
  
  export type Message = {
    id: string;
    chatId: string;
    senderId: string;
    text?: string;
    attachments?: Attachment[];
    createdAt: number; // epoch ms
    status: 'sent' | 'delivered' | 'read';
    replyToId?: string;
    reactions?: Record<string, string[]>; // emoji -> [userId]
    editedAt?: number;
  };
  
  export type Chat = {
    id: string;
    title: string;
    isGroup: boolean;
    participants: string[]; // userIds
    pinned?: boolean;
    muted?: boolean;
    unread?: number;
    lastMessageAt: number;
  };
  