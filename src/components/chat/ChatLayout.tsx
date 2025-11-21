import React, { useMemo, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatThread from './ChatThread';
import MessageInput from './MessageInput';
import { Attachment, Chat, Message, User } from './types';
import { CHATS, ME, MESSAGES, USERS } from './mockData';

const ChatLayout: React.FC<{ initialChatId?: string }> = ({ initialChatId }) => {
  const [me] = useState<User>(ME);
  const [usersById] = useState<Record<string, User>>(USERS);
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({ ...MESSAGES });
  const [selectedChatId, setSelectedChatId] = useState<string>(initialChatId || chats[0]?.id);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editing, setEditing] = useState<Message | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState<boolean>(false);

  const selectedChat = chats.find(c => c.id === selectedChatId)!;
  const otherId = selectedChat.participants.find(id => id !== me.id)!;
  const other = usersById[otherId];
  const messages = messagesByChat[selectedChatId] || [];

  const lastByChat = useMemo(() => {
    const res: Record<string, Message | undefined> = {};
    chats.forEach(c => { res[c.id] = (messagesByChat[c.id] || []).slice(-1)[0]; });
    return res;
  }, [messagesByChat, chats]);

  const selectChat = (id: string) => {
    setSelectedChatId(id);
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setReplyingTo(null); setEditing(null);
    setMobileListOpen(false);
  };

  const togglePin  = (id: string) => setChats(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  const toggleMute = (id: string) => setChats(prev => prev.map(c => c.id === id ? { ...c, muted: !c.muted } : c));
  const markAllRead = () => setChats(prev => prev.map(c => ({ ...c, unread: 0 })));

  const pushMessage = (chatId: string, partial: { text?: string; attachments?: Attachment[]; replyToId?: string }) => {
    const m: Message = {
      id: String(Date.now()),
      chatId,
      senderId: me.id,
      text: partial.text,
      attachments: partial.attachments,
      createdAt: Date.now(),
      status: 'sent',
      replyToId: partial.replyToId,
      reactions: {}
    };
    setMessagesByChat(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), m] }));
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMessageAt: m.createdAt } : c));
    setReplyingTo(null);
    setTimeout(() => setMessagesByChat(prev => ({ ...prev, [chatId]: prev[chatId].map(x => x.id === m.id ? { ...x, status: 'delivered' } : x) })), 400);
    setTimeout(() => setMessagesByChat(prev => ({ ...prev, [chatId]: prev[chatId].map(x => x.id === m.id ? { ...x, status: 'read' } : x) })), 1200);
  };

  const del = (msg: Message) => setMessagesByChat(prev => ({ ...prev, [msg.chatId]: prev[msg.chatId].filter(m => m.id !== msg.id) }));
  const edit = (msg: Message) => setEditing(msg);
  const saveEdit = (id: string, text: string) =>
    (setMessagesByChat(p => ({ ...p, [selectedChatId]: p[selectedChatId].map(m => m.id === id ? { ...m, text, editedAt: Date.now() } : m) })), setEditing(null));
  const react = (msg: Message, e: string) =>
    setMessagesByChat(p => ({ ...p, [msg.chatId]: p[msg.chatId].map(m => m.id !== msg.id ? m : { ...m, reactions: { ...(m.reactions || {}), [e]: [me.id] } }) }));

  return (
    <div className="w-full md:h-[calc(100vh-140px)] min-h-[70vh] bg-white rounded-2xl shadow-lg overflow-hidden flex">

      {/* Desktop split */}
      <div className="hidden md:flex w-full">
        <ChatSidebar
          me={me}
          chats={chats}
          usersById={usersById}
          lastByChat={lastByChat}
          selectedChatId={selectedChatId}
          onSelect={selectChat}
          onMarkAllRead={markAllRead}
          onTogglePin={togglePin}
          onToggleMute={toggleMute}
        />
        <div className="flex-1 flex flex-col">
          <ChatThread
            me={me}
            chat={selectedChat}
            other={other}
            messages={messages}
            onReply={(m) => setReplyingTo(m)}
            onEdit={edit}
            onDelete={del}
            onReact={react}
            onOpenList={() => setMobileListOpen(true)} // harmless on desktop
          />
          <div className="bg-white pt-2">
            <MessageInput
              onSend={(p) => pushMessage(selectedChatId, p)}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              editing={editing || undefined}
              onCancelEdit={() => setEditing(null)}
              onSaveEdit={saveEdit}
            />
          </div>
        </div>
      </div>

      {/* Mobile single-pane */}
      <div className="flex md:hidden w-full h-[calc(100svh-120px)]">
        {mobileListOpen ? (
          <div className="relative flex-1">
            <div className="absolute inset-0 overflow-hidden">
              <ChatSidebar
                me={me}
                chats={chats}
                usersById={usersById}
                lastByChat={lastByChat}
                selectedChatId={selectedChatId}
                onSelect={selectChat}
                onMarkAllRead={markAllRead}
                onTogglePin={togglePin}
                onToggleMute={toggleMute}
              />
            </div>
            <button
              className="absolute top-3 right-3 z-10 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-sm shadow"
              onClick={() => setMobileListOpen(false)}
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <ChatThread
              me={me}
              chat={selectedChat}
              other={other}
              messages={messages}
              onReply={(m) => setReplyingTo(m)}
              onEdit={edit}
              onDelete={del}
              onReact={react}
              onOpenList={() => setMobileListOpen(true)}
            />
            <div
              className="bg-white pt-2 sticky bottom-0"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <MessageInput
                onSend={(p) => pushMessage(selectedChatId, p)}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
                editing={editing || undefined}
                onCancelEdit={() => setEditing(null)}
                onSaveEdit={saveEdit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
