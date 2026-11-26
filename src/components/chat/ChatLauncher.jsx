import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import './chat.css';

/** Floating bottom-right button that toggles the compact chat window. */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatWindow id="chat-window" onClose={() => setOpen(false)} />}
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
