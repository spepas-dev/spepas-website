import React from 'react';
import { Message, User } from './types';

const fmtTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const MessageBubble: React.FC<{
  meId: string;
  message: Message;
  sender: User;
  replyTo?: Message;
  showTail?: boolean;
  onReply?: (msg: Message) => void;
  onEdit?: (msg: Message) => void;
  onDelete?: (msg: Message) => void;
  onReact?: (msg: Message, emoji: string) => void;
  onOpenImage?: (src: string) => void;
}> = ({
  meId,
  message,
  sender,
  replyTo,
  showTail,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onOpenImage,
}) => {
  const mine = message.senderId === meId;

  return (
    <div className={`relative flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          // Narrower on 320px, normal on ≥375. Small text on xs only.
          'min-w-0 max-w-[78%] sm:max-w-[78%] md:max-w-[76%] rounded-2xl px-3 py-2 text-[14px] sm:text-[15px] leading-snug',
          mine
            ? 'bg-indigo-600 text-white shadow-[0_2px_10px_rgba(51,65,85,0.18)] rounded-br-sm'
            : 'bg-gray-100 text-gray-900 shadow-[0_1px_6px_rgba(15,23,42,0.06)] rounded-bl-sm',
          // Tiny side margin so avatar/tail never clips viewport at 320px
          mine ? 'mr-2' : 'ml-2',
        ].join(' ')}
      >
        {replyTo && (
          <div
            className={`mb-1 border-l-2 pl-2 text-[12px] ${
              mine ? 'border-white/70 text-white/80' : 'border-gray-400 text-gray-600'
            }`}
          >
            {replyTo.text ?? 'Quoted message'}
          </div>
        )}

        {message.text && (
          // Force wrap of long words/URLs so nothing overflows on tiny screens
          <div className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {message.text}
          </div>
        )}

        {!!message.attachments?.length && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {message.attachments.map((att) => (
              <div key={att.id} className="overflow-hidden rounded-xl">
                {att.type === 'image' ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-full h-auto max-h-40 object-cover block"
                    onClick={() => onOpenImage?.(att.url)}
                  />
                ) : (
                  <a
                    className="block p-3 bg-white/10 rounded hover:underline"
                    href={att.url}
                    download
                  >
                    {att.name || 'file'}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* meta */}
        <div className={`mt-1 flex items-center gap-2 ${mine ? 'text-white/80' : 'text-gray-500'}`}>
          <span className="text-[11px]">{fmtTime(message.createdAt)}</span>
          {mine && (
            <span className="text-[11px]">
              {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
            </span>
          )}
        </div>

        {/* subtle actions (desktop only) */}
        <div
          className={`mt-1 hidden md:flex gap-3 text-[12px] ${
            mine ? 'text-white/80' : 'text-gray-500'
          }`}
        >
          <button onClick={() => onReply?.(message)} className="hover:underline">
            Reply
          </button>
          {mine && (
            <button onClick={() => onEdit?.(message)} className="hover:underline">
              Edit
            </button>
          )}
          {mine && (
            <button onClick={() => onDelete?.(message)} className="hover:underline">
              Delete
            </button>
          )}
          <button onClick={() => onReact?.(message, '👍')} className="hover:underline">
            React
          </button>
        </div>
      </div>

      {/* tiny avatar tail on last-in-group */}
      {showTail && (
        <img
          src={sender.avatar}
          alt={sender.name}
          className={`w-6 h-6 rounded-full object-cover self-end mt-1 ${
            mine ? 'ml-2' : 'mr-2'
          }`}
        />
      )}
    </div>
  );
};

export default MessageBubble;
