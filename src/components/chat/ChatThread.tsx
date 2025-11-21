import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chat, Message, User } from './types';
import MessageBubble from './MessageBubble';
import Lightbox from './Lightbox';

const Day = ({ label }: { label: string }) => (
  <div className="my-5 flex justify-center">
    <span className="bg-gray-200/70 text-gray-700 text-[12px] px-3 py-0.5 rounded-full">
      {label}
    </span>
  </div>
);

// Header accepts optional onOpenList for mobile back
const Header: React.FC<{ other: User; chat: Chat; onOpenList?: () => void }> = ({
  other,
  onOpenList,
}) => (
  <div className="px-5 py-3 bg-white/80 backdrop-blur flex items-center gap-3">
    <button
      className="md:hidden -ml-2 mr-1 rounded-full p-2 hover:bg-gray-100"
      onClick={onOpenList}
      aria-label="Back to chats"
      title="Back"
    >
      ←
    </button>
    <img src={other.avatar} className="w-10 h-10 rounded-full object-cover" />
    <div className="leading-tight">
      <div className="font-semibold text-[15px]">{other.name}</div>
      <div className="text-[12px] text-gray-500">
        {other.org || (other.isOnline ? 'Online' : 'Offline')}
      </div>
    </div>
    <div className="ml-auto hidden md:flex gap-2">
      <button title="Search" className="p-2 rounded hover:bg-gray-100">
        🔍
      </button>
      <button title="More" className="p-2 rounded hover:bg-gray-100">
        ⋯
      </button>
    </div>
  </div>
);

function group(messages: Message[]) {
  const byDay = new Map<string, Message[]>();
  messages.forEach((m) => {
    const key = new Date(m.createdAt).toDateString();
    (byDay.get(key) || byDay.set(key, []).get(key)!).push(m);
  });
  return Array.from(byDay.entries());
}

const ChatThread: React.FC<{
  me: User;
  chat: Chat;
  other: User;
  messages: Message[];
  onReply: (m: Message) => void;
  onEdit: (m: Message) => void;
  onDelete: (m: Message) => void;
  onReact: (m: Message, e: string) => void;
  onOpenList?: () => void;
}> = ({ me, chat, other, messages, onReply, onEdit, onDelete, onReact, onOpenList }) => {
  const scRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    scRef.current && (scRef.current.scrollTop = scRef.current.scrollHeight);
  }, [messages.length]);

  const byId = useMemo(
    () => Object.fromEntries(messages.map((m) => [m.id, m])),
    [messages]
  );
  const days = useMemo(() => group(messages), [messages]);

  return (
    <section className="flex-1 flex flex-col bg-gray-50">
      <Header other={other} chat={chat} onOpenList={onOpenList} />

      {/* Slightly smaller horizontal padding on xs for more bubble room */}
      <div ref={scRef} className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-8 py-4">
        {days.map(([day, msgs]) => (
          <div key={day}>
            <Day label={day} />
            <div className="space-y-2">
              {msgs.map((m, i) => {
                const next = msgs[i + 1];
                const isLastOfSender = !next || next.senderId !== m.senderId;
                return (
                  <MessageBubble
                    key={m.id}
                    meId={me.id}
                    message={m}
                    sender={m.senderId === me.id ? me : other}
                    replyTo={m.replyToId ? byId[m.replyToId] : undefined}
                    showTail={isLastOfSender}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReact={onReact}
                    onOpenImage={(src) => setLightbox(src)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
};

export default ChatThread;
