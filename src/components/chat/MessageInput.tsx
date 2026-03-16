import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Attachment, Message } from './types';

type Props = {
  onSend: (payload: { text?: string; attachments?: Attachment[]; replyToId?: string }) => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
  editing?: Message | null;
  onCancelEdit?: () => void;
  onSaveEdit?: (msgId: string, newText: string) => void;
};

const MessageInput: React.FC<Props> = ({ onSend, replyingTo, onCancelReply, onTyping, editing, onCancelEdit, onSaveEdit }) => {
  const [text, setText] = useState(editing?.text || '');
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { setText(editing?.text || ''); }, [editing?.id]);
  useEffect(() => {
    const el = taRef.current; if (!el) return;
    el.style.height = '0px'; el.style.height = Math.min(160, el.scrollHeight) + 'px';
  }, [text]);

  const addFiles = (list: FileList | File[]) => {
    const files = Array.from(list);
    const newAtts: Attachment[] = files.slice(0, 10).map((f, idx) => ({
      id: `${Date.now()}_${idx}`,
      type: f.type.startsWith('image') ? 'image' : 'file',
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));
    setAttachments(prev => [...prev, ...newAtts]);
  };

  const send = () => {
    const payload = { text: text.trim() || undefined, attachments: attachments.length ? attachments : undefined, replyToId: replyingTo?.id };
    if (!payload.text && !payload.attachments?.length) return;
    if (editing) onSaveEdit?.(editing.id, text.trim()); else onSend(payload);
    setText(''); setAttachments([]); setShowEmoji(false);
  };

  return (
    <div className="w-full">
      {replyingTo && (
        <div className="mb-2 mx-2 px-3 py-2 bg-gray-100 rounded-xl text-[12px] text-gray-600 flex items-center justify-between">
          <div className="truncate">Replying to: <span className="font-medium">{replyingTo.text || 'message'}</span></div>
          <button onClick={onCancelReply} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
      )}
      {editing && (
        <div className="mb-2 mx-2 px-3 py-2 bg-amber-50 rounded-xl text-[12px] text-amber-700 flex items-center justify-between">
          <div>Editing your message…</div>
          <button onClick={onCancelEdit} className="hover:underline">Cancel</button>
        </div>
      )}

      {!!attachments.length && (
        <div className="mb-2 mx-2 grid grid-cols-3 sm:grid-cols-6 gap-2">
          {attachments.map(a => (
            <div key={a.id} className="relative">
              {a.type === 'image' ? <img src={a.url} className="h-20 w-full object-cover rounded-lg" /> :
                <div className="h-20 w-full rounded-lg bg-gray-100 flex items-center justify-center text-xs">{a.name}</div>}
              <button className="absolute -top-2 -right-2 bg-white border rounded-full w-6 h-6 text-xs"
                onClick={() => setAttachments(prev => prev.filter(x => x.id !== a.id))}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="px-2 pb-3">
        <div className="flex items-center gap-1 md:gap-2 rounded-full bg-white shadow px-2 md:px-3 py-2 ring-1 ring-gray-200 w-full">
          <button
            className="p-2 md:p-2.5 rounded-full hover:bg-gray-100"
            title="Emoji"
            onClick={() => setShowEmoji(s => !s)}
          >😊</button>

          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => { setText(e.target.value); onTyping?.(!!e.target.value); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Write Something"
            className="flex-1 max-h-40 min-h-[36px] resize-none outline-none text-[15px] px-1"
          />

          <label className="p-2 md:p-2.5 rounded-full hover:bg-gray-100 cursor-pointer" title="Attach">📎
            <input type="file" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
          </label>

          <button onClick={send} className="p-2.5 md:p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700" title="Send">➤</button>
        </div>
      </div>

      {showEmoji && (
        <div className="px-2 pb-2">
          <EmojiPicker onEmojiClick={(e: EmojiClickData) => setText(t => t + e.emoji)} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
