import { useCallback, useEffect, useRef, useState } from 'react';
import { isChatConfigured, sendChatMessage } from '../../services/chatService';

let nextId = 1;
const makeMessage = (from, text) => ({ id: nextId++, from, text });

const WELCOME_TEXT = isChatConfigured
  ? "Hi! I'm the HomeFind assistant. How can I help you today?"
  : "Hi! I'm the HomeFind assistant. I'm not connected yet, so I can't answer questions at the moment.";

/**
 * Chat state for one signed-in user. Lives in the launcher (not the window), so closing and
 * reopening the chat keeps the messages and the conversation id for this session.
 * Mount it with key={userId} so a different user always starts with a fresh chat.
 */
export function useChatSession() {
  const [messages, setMessages] = useState(() => [makeMessage('assistant', WELCOME_TEXT)]);
  const [sending, setSending] = useState(false);
  const conversationIdRef = useRef(null);
  const sendingRef = useRef(false);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  const send = useCallback(async (text) => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    setMessages((m) => [...m, makeMessage('user', text)]);

    let result;
    try {
      result = await sendChatMessage(text, conversationIdRef.current);
    } catch {
      result = { status: 'error', reply: 'Something went wrong. Please try again.' };
    }
    if (!activeRef.current) return;

    if (result.status === 'ok') {
      if (result.conversationId) conversationIdRef.current = result.conversationId;
      setMessages((m) => [
        ...m,
        ...(result.conversationReset ? [makeMessage('system', 'Your previous conversation was not found, so a new one was started.')] : []),
        makeMessage('assistant', result.reply),
      ]);
    } else {
      setMessages((m) => [...m, makeMessage('system', result.reply)]);
    }
    sendingRef.current = false;
    setSending(false);
  }, []);

  return { messages, sending, send, connected: isChatConfigured };
}
