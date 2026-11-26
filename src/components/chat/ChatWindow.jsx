import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { sendChatMessage } from '../../services/chatService';

const MAX_LENGTH = 1000;
let nextId = 1;
const makeMessage = (from, text) => ({ id: nextId++, from, text });

const WELCOME = makeMessage(
  'assistant',
  "Hi! I'm the HomeFind assistant. I'm not connected yet, so I can't answer questions at the moment.",
);

/** Compact chat window. Messages live only in component state (not stored or sent). */
export function ChatWindow({ id, onClose }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
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
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    setDraft('');
    setSending(true);
    setMessages((m) => [...m, makeMessage('user', text)]);
    try {
      const result = await sendChatMessage(text);
      setMessages((m) => [...m, makeMessage('system', result.reply)]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div id={id} className="chat-window" role="dialog" aria-label="Chat assistant">
      <header className="chat-window__header">
        <div>
          <div className="chat-window__title">HomeFind Assistant</div>
          <div className="chat-window__status">
            <span className="chat-window__dot" aria-hidden="true" /> Not connected
          </div>
        </div>
        <button type="button" className="chat-window__close" onClick={onClose} aria-label="Close chat">
          ✕
        </button>
      </header>

      <div className="chat-window__messages" ref={listRef} aria-live="polite">
        {messages.map((m) => (
          <ChatMessage key={m.id} from={m.from} text={m.text} />
        ))}
      </div>

      <form className="chat-window__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="chat-window__input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Type a message..."
          aria-label="Message"
          autoComplete="off"
        />
        <button type="submit" className="chat-window__send" disabled={!draft.trim() || sending}>
          Send
        </button>
      </form>
    </div>
  );
}
