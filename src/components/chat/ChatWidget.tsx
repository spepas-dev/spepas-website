import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ChatLayout from '@/components/chat/ChatLayout';
import { CHATS, MESSAGES } from '@/components/chat/mockData';

type Props = {
  initialOpen?: boolean;
  initialChatId?: string;
  position?: 'bottom-right' | 'bottom-left';
  zIndex?: number;
};

const ChatWidget: React.FC<Props> = ({
  initialOpen = false,
  initialChatId,
  position = 'bottom-right',
  zIndex = 60,
}) => {
  const [open, setOpen] = useState(initialOpen);
  const [unread, setUnread] = useState(() => {
    // derive from mock chats; when you wire APIs, feed real unread
    const total = CHATS.reduce((sum, c) => sum + (c.unread || 0), 0);
    return total;
  });

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // When opened, consider all read (demo)
  useEffect(() => { if (open) setUnread(0); }, [open]);

  // Portal root
  const portalEl = useMemo(() => {
    let el = document.getElementById('chat-widget-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'chat-widget-portal';
      document.body.appendChild(el);
    }
    return el;
  }, []);

  const posClass = position === 'bottom-right'
    ? 'right-4 md:right-6'
    : 'left-4 md:left-6';

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed ${posClass} bottom-4 md:bottom-6 w-14 h-14 rounded-full shadow-lg bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center`}
        style={{ zIndex }}
        aria-label="Open chat"
        title="Chat"
      >
        💬
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {/* Widget Panel (Portal) */}
      {open && portalEl &&
        createPortal(
          <div
            className="fixed inset-0"
            style={{ zIndex }}
            aria-modal
            role="dialog"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />

            {/* Panel */}
            <div className={`absolute ${posClass} bottom-24 md:bottom-24 w-[95vw] sm:w-[420px] md:w-[520px] h-[70vh] md:h-[72vh] bg-white rounded-2xl shadow-2xl border overflow-hidden`}>
              {/* Header bar for widget */}
              <div className="h-11 px-3 flex items-center justify-between border-b bg-white">
                <div className="font-medium">Chat</div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs text-gray-600 hover:text-gray-900"
                    onClick={() => setOpen(false)}
                    title="Minimize"
                  >
                    ⤵
                  </button>
                  <button
                    className="text-lg leading-none px-2 rounded hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    title="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content uses our full chat layout but constrained inside the panel */}
              <div className="h-[calc(100%-44px)]">
                {/* ChatLayout already includes sidebar + thread + composer */}
                <div className="h-full">
                  <ChatLayout initialChatId={initialChatId || CHATS[0]?.id} />
                </div>
              </div>
            </div>
          </div>,
          portalEl
        )
      }
    </>
  );
};

export default ChatWidget;
