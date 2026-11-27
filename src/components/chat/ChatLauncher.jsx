import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { useChatSession } from './useChatSession';
import { useAuth } from '../../hooks/useAuth';
import './chat.css';

/** Floating bottom-right button that toggles the compact chat window. */
export function ChatLauncher() {
  const { user } = useAuth();
  // Keyed by user: a different signed-in user never sees the previous user's chat.
  return <ChatLauncherInner key={user?.id ?? 'anonymous'} />;
}

function ChatLauncherInner() {
  const [open, setOpen] = useState(false);
  const chat = useChatSession();

  return (
    <>
      {open && (
        <ChatWindow
          id="chat-window"
          onClose={() => setOpen(false)}
          messages={chat.messages}
          sending={chat.sending}
          onSend={chat.send}
          connected={chat.connected}
        />
      )}
      <button
        type="button"
        className={`chat-launcher${open ? ' chat-launcher--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={open}
        aria-controls="chat-window"
      >
        <span aria-hidden="true">{open ? '✕' : '💬'}</span>
      </button>
    </>
  );
}
