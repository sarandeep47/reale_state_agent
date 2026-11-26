/** from: 'user' | 'assistant' | 'system'. Text is rendered as plain text (no HTML). */
export function ChatMessage({ from, text }) {
  return (
    <div className={`chat-message chat-message--${from}`}>
      <div className="chat-message__bubble">{text}</div>
    </div>
  );
}
