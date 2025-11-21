import React, { useMemo, useState } from 'react';
import { Chat, Message, User } from './types';

const rel = (ts: number) => {
  const d = new Date(ts), n = new Date();
  return d.toDateString() === n.toDateString()
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString();
};

const Row: React.FC<{
  chat: Chat;
  other: User;
  last?: Message;
  selected: boolean;
  onClick: () => void;
  onPin: () => void;
  onMute: () => void;
}> = ({ chat, other, last, selected, onClick, onPin, onMute }) => (
  // ⬇ Wrapper is a div with role="button" to avoid nested button errors
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
    className={`w-full flex items-center gap-3 px-4 py-3 md:py-3 rounded-2xl
      ${selected ? 'bg-white shadow-sm' : 'bg-white/70 hover:shadow-sm transition-shadow'}`}
  >
    <div className="relative">
      <img src={other.avatar} className="w-11 h-11 rounded-full object-cover" />
      {other.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />}
    </div>

    <div className="flex-1 min-w-0 text-left">
      <div className="flex items-center justify-between">
        <div className="font-medium truncate">{other.name}</div>
        <div className="text-[11px] text-gray-400">{rel(chat.lastMessageAt)}</div>
      </div>
      <div className="text-[12px] text-gray-500 truncate">
        {last?.text || (last?.attachments?.length ? '📷 Image' : 'No messages yet')}
      </div>

      {/* Child buttons: stop propagation to avoid triggering row click */}
      <div className="mt-1 text-[11px] text-gray-400 flex gap-3">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPin(); }}
          className="hover:text-gray-700"
        >
          Pin
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMute(); }}
          className="hover:text-gray-700"
        >
          Mute
        </button>
      </div>
    </div>

    {chat.unread ? (
      <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[11px] rounded-full bg-indigo-600 text-white px-1">
        {chat.unread}
      </span>
    ) : null}
  </div>
);

const ChatSidebar: React.FC<{
  me: User;
  chats: Chat[];
  usersById: Record<string, User>;
  lastByChat: Record<string, Message | undefined>;
  selectedChatId?: string;
  onSelect: (id: string) => void;
  onMarkAllRead: () => void;
  onTogglePin: (id: string) => void;
  onToggleMute: (id: string) => void;
}> = ({
  me, chats, usersById, lastByChat, selectedChatId,
  onSelect, onMarkAllRead, onTogglePin, onToggleMute
}) => {
  const [q, setQ] = useState('');

  const filtered = useMemo(() =>
    chats
      .filter(c => {
        const other = usersById[c.participants.find(id => id !== me.id)!];
        const hay = `${c.title} ${other?.name} ${(lastByChat[c.id]?.text || '')}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      })
      .sort((a,b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.lastMessageAt - a.lastMessageAt)
  , [q, chats, lastByChat, me.id, usersById]);

  return (
    <aside className="h-full w-full sm:w-[360px] bg-gray-50">
      <div className="px-4 md:px-5 py-3 md:py-4 bg-white/80 backdrop-blur flex items-center justify-between">
        <div className="text-[18px] font-semibold text-slate-800">Chats</div>
        <button className="text-indigo-600 text-sm hover:underline" onClick={onMarkAllRead}>Mark all as read</button>
      </div>

      <div className="p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search friends…"
          className="w-full rounded-full border px-4 py-2 text-sm bg-white shadow-inner focus:outline-none"
        />
      </div>

      <div className="overflow-y-auto h-[calc(100%-116px)] px-4 pb-4 space-y-3">
        {filtered.map(c => {
          const other = usersById[c.participants.find(id => id !== me.id)!];
          return (
            <Row
              key={c.id}
              chat={c}
              other={other}
              last={lastByChat[c.id]}
              selected={selectedChatId === c.id}
              onClick={() => onSelect(c.id)}
              onPin={() => onTogglePin(c.id)}
              onMute={() => onToggleMute(c.id)}
            />
          );
        })}
        {!filtered.length && <div className="px-2 py-10 text-sm text-gray-500">No chats found.</div>}
      </div>
    </aside>
  );
};

export default ChatSidebar;
