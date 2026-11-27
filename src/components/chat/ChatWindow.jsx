import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { MAX_MESSAGE_LENGTH } from '../../services/chatService';

/**
 * Compact chat window. Messages and sending state come from the launcher (useChatSession),
 * so they survive closing and reopening the window.
 */
export function ChatWindow({ id, onClose, messages, sending, onSend, connected }) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setDraft('');
    onSend(text);
    inputRef.current?.focus();
  };

  return (
    <div id={id} className="chat-window" role="dialog" aria-label="Chat assistant">
      <header className="chat-window__header">
        <div>
          <div className="chat-window__title">HomeFind Assistant</div>
          <div className="chat-window__status">
            <span className={`chat-window__dot${connected ? ' chat-window__dot--online' : ''}`} aria-hidden="true" />{' '}
            {connected ? 'Online' : 'Not connected'}
          </div>
        </div>
        <button type="button" className="chat-window__close" onClick={onClose} aria-label="Close chat">
          ✕
        </button>
      </header>

      <div className="chat-window__messages" ref={listRef} aria-live="polite" aria-busy={sending}>
        {messages.map((m) => (
          <ChatMessage key={m.id} from={m.from} text={m.text} />
        ))}
        {sending && <ChatMessage from="system" text="Assistant is typing…" />}
      </div>

      <form className="chat-window__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="chat-window__input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Type a message..."
          aria-label="Message"
          autoComplete="off"
        />
        <button type="submit" className="chat-window__send" disabled={!draft.trim() || sending}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
